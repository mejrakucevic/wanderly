import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

export type CurrentCountry = {
  countryCode: string | null;
  countryName: string | null;
  /** `location`: from GPS + reverse geocoding. `region`: guessed from the phone's language/region setting. */
  source: 'location' | 'region' | null;
  isLocating: boolean;
  /** True once the user allowed location access (also used to show the blue "you are here" dot). */
  hasPermission: boolean;
  /** False when the user denied access and the OS won't show the prompt again. */
  canAsk: boolean;
  error: string | null;
  /** Asks for permission (if needed) and looks up the current country. */
  locate: () => Promise<void>;
};

function regionFromDevice(): string | null {
  const locale = Intl.DateTimeFormat().resolvedOptions().locale; // e.g. "bs-BA", "en-US"
  return /[-_]([A-Z]{2})\b/.exec(locale)?.[1] ?? null;
}

export function useCurrentCountry(): CurrentCountry {
  const [countryCode, setCountryCode] = useState<string | null>(() => regionFromDevice());
  const [countryName, setCountryName] = useState<string | null>(null);
  const [source, setSource] = useState<CurrentCountry['source']>(() => (regionFromDevice() ? 'region' : null));
  const [isLocating, setIsLocating] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [canAsk, setCanAsk] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function lookUp() {
    setIsLocating(true);
    setError(null);
    try {
      const position = (await Location.getLastKnownPositionAsync({ maxAge: 60 * 60 * 1000 }))
        ?? (await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low }));
      const [address] = await Location.reverseGeocodeAsync(position.coords);
      if (address?.isoCountryCode) {
        setCountryCode(address.isoCountryCode.toUpperCase());
        setCountryName(address.country ?? null);
        setSource('location');
      } else {
        setError('We couldn’t tell which country you’re in.');
      }
    } catch {
      setError('We couldn’t get your location right now.');
    } finally {
      setIsLocating(false);
    }
  }

  async function locate() {
    if (Platform.OS === 'web') return; // reverse geocoding is iOS/Android only
    const permission = await Location.requestForegroundPermissionsAsync();
    setHasPermission(permission.granted);
    setCanAsk(permission.canAskAgain);
    if (permission.granted) await lookUp();
  }

  // Never prompt on open: only use location automatically if the user already allowed it.
  useEffect(() => {
    if (Platform.OS === 'web') return;
    let active = true;
    void Location.getForegroundPermissionsAsync().then((permission) => {
      if (!active) return;
      setHasPermission(permission.granted);
      setCanAsk(permission.canAskAgain);
      if (permission.granted) void lookUp();
    });
    return () => { active = false; };
  }, []);

  return { countryCode, countryName, source, isLocating, hasPermission, canAsk, error, locate };
}
