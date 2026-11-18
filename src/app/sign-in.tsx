import { useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View, type TextInputInstance } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ActionButton } from '@/components/ui/action-button';
import { AppIcon } from '@/components/ui/app-icon';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/providers/auth-provider';
import { signIn, signUp } from '@/services/auth';

export default function SignInScreen() {
  const theme = useTheme();
  const { isConfigured, error: sessionError } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const inFlight = useRef(false);
  const passwordInput = useRef<TextInputInstance>(null);
  const confirmationInput = useRef<TextInputInstance>(null);

  async function submit() {
    if (inFlight.current || !isConfigured) return;
    setError(null);
    setNotice(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Enter your password.');
      return;
    }
    if (isSignUp && password.length < 6) {
      setError('Choose a password with at least 6 characters.');
      return;
    }
    if (isSignUp && password !== confirmation) {
      setError('Your passwords don’t match.');
      return;
    }

    Keyboard.dismiss();
    inFlight.current = true;
    setIsSubmitting(true);
    try {
      if (isSignUp) {
        const data = await signUp(email, password);
        if (!data.session) {
          setIsSignUp(false);
          setPassword('');
          setConfirmation('');
          setShowPassword(false);
          setNotice('Check your email to confirm your account, then return here to log in. If you already have an account, log in with your password.');
        }
      } else {
        await signIn(email, password);
      }
      // The root's protected routes react to the Supabase session event.
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Something went wrong. Please try again.');
    } finally {
      inFlight.current = false;
      setIsSubmitting(false);
    }
  }

  function changeMode() {
    if (inFlight.current) return;
    setIsSignUp((value) => !value);
    setPassword('');
    setConfirmation('');
    setShowPassword(false);
    setError(null);
    setNotice(null);
  }

  const inputStyle = [styles.input, { color: theme.text, backgroundColor: theme.background, borderColor: theme.border }];

  return (
    <SafeAreaView style={[styles.page, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView style={styles.page} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={[styles.brand, { backgroundColor: theme.accent }]}>
                <AppIcon name="globe" color={theme.primary} size={40} />
              </View>
              <ThemedText type="smallBold" themeColor="primary" style={styles.wordmark}>WANDERLY</ThemedText>
              <ThemedText type="title" accessibilityRole="header">{isSignUp ? 'Your next chapter.' : 'Welcome back, explorer.'}</ThemedText>
              <ThemedText themeColor="textSecondary">{isSignUp ? 'Make room for new places and lasting memories.' : 'Your plans, places, and memories are waiting.'}</ThemedText>
            </View>

            <View style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
              <ThemedText style={styles.formTitle} accessibilityRole="header">{isSignUp ? 'Create your account' : 'Log in to Wanderly'}</ThemedText>
              <View style={styles.field}>
                <ThemedText type="smallBold" nativeID="email-label">Email address</ThemedText>
                <TextInput
                  accessibilityLabel="Email address"
                  accessibilityLabelledBy="email-label"
                  style={inputStyle}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  editable={!isSubmitting}
                  returnKeyType="next"
                  submitBehavior="submit"
                  onSubmitEditing={() => passwordInput.current?.focus()}
                />
              </View>
              <View style={styles.field}>
                <ThemedText type="smallBold" nativeID="password-label">Password</ThemedText>
                <TextInput
                  key={isSignUp ? 'new-password' : 'current-password'}
                  ref={passwordInput}
                  accessibilityLabel="Password"
                  accessibilityLabelledBy="password-label"
                  style={inputStyle}
                  value={password}
                  onChangeText={setPassword}
                  placeholder={isSignUp ? 'At least 6 characters' : 'Your password'}
                  placeholderTextColor={theme.textSecondary}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  secureTextEntry={!showPassword}
                  editable={!isSubmitting}
                  returnKeyType={isSignUp ? 'next' : 'go'}
                  submitBehavior="submit"
                  onSubmitEditing={() => isSignUp ? confirmationInput.current?.focus() : void submit()}
                />
              </View>
              {isSignUp ? (
                <View style={styles.field}>
                  <ThemedText type="smallBold" nativeID="confirmation-label">Confirm password</ThemedText>
                  <TextInput
                    ref={confirmationInput}
                    accessibilityLabel="Confirm password"
                    accessibilityLabelledBy="confirmation-label"
                    style={inputStyle}
                    value={confirmation}
                    onChangeText={setConfirmation}
                    placeholder="Enter your password again"
                    placeholderTextColor={theme.textSecondary}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="new-password"
                    secureTextEntry={!showPassword}
                    editable={!isSubmitting}
                    returnKeyType="go"
                    onSubmitEditing={() => void submit()}
                  />
                </View>
              ) : null}
              <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: showPassword, disabled: isSubmitting }} disabled={isSubmitting} onPress={() => setShowPassword((value) => !value)} style={styles.textButton}>
                <ThemedText type="small" themeColor="primary">{showPassword ? 'Hide password' : 'Show password'}</ThemedText>
              </Pressable>

              {!isConfigured ? <ThemedText accessibilityRole="alert" themeColor="textSecondary">Sign-in isn’t available yet. Please try again later.</ThemedText> : null}
              {sessionError && !error ? <ThemedText accessibilityRole="alert" themeColor="textSecondary">We couldn’t restore your session. Please log in again.</ThemedText> : null}
              {error ? <ThemedText accessibilityRole="alert" accessibilityLiveRegion="polite" themeColor="danger">{error}</ThemedText> : null}
              {notice ? <ThemedText accessibilityRole="alert" accessibilityLiveRegion="polite" themeColor="primary">{notice}</ThemedText> : null}

              <ActionButton label={isSubmitting ? (isSignUp ? 'Creating account…' : 'Logging in…') : (isSignUp ? 'Create account' : 'Log in')} loading={isSubmitting} disabled={!isConfigured} onPress={() => void submit()} />
              <ActionButton secondary label={isSignUp ? 'Already have an account? Log in' : 'New here? Create an account'} disabled={isSubmitting} onPress={changeMode} />
            </View>
            <ThemedText type="small" themeColor="textSecondary" style={styles.footer}>A little curiosity. A world of possibilities.</ThemedText>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.four },
  content: { width: '100%', maxWidth: 460, gap: Spacing.four },
  header: { gap: Spacing.two },
  brand: { width: 76, height: 76, borderRadius: 26, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.two },
  wordmark: { letterSpacing: 3 },
  card: { borderRadius: Radius.card, borderWidth: 1, padding: Spacing.four, gap: Spacing.three },
  formTitle: { fontSize: 22, lineHeight: 30, fontWeight: '700' },
  field: { gap: Spacing.two },
  input: { minHeight: 52, borderWidth: 1, borderRadius: Radius.small, paddingHorizontal: Spacing.three, paddingVertical: Spacing.three, fontSize: 16 },
  textButton: { minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start' },
  footer: { textAlign: 'center' },
});
