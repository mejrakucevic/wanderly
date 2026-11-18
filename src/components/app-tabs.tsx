import { Tabs } from 'expo-router';

import { AppIcon } from '@/components/ui/app-icon';
import { useTheme } from '@/hooks/use-theme';

export default function AppTabs() {
  const theme = useTheme();

  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: theme.primary,
      tabBarInactiveTintColor: theme.textSecondary,
      tabBarStyle: { backgroundColor: theme.backgroundElement, borderTopColor: theme.border },
      tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
      tabBarItemStyle: { paddingVertical: 4 },
    }}>
      <Tabs.Screen name="index" options={{ title: 'Map', tabBarIcon: ({ color }) => <AppIcon name="map" color={color} /> }} />
      <Tabs.Screen name="trips" options={{ title: 'Trips', tabBarIcon: ({ color }) => <AppIcon name="trips" color={color} /> }} />
      <Tabs.Screen name="diary" options={{ title: 'Diary', tabBarIcon: ({ color }) => <AppIcon name="diary" color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color }) => <AppIcon name="profile" color={color} /> }} />
    </Tabs>
  );
}
