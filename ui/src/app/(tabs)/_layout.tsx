import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/theme/useThemeColors';

export default function TabsLayout() {
  const c = useThemeColors();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.accent_primary,
        tabBarInactiveTintColor: c.text_secondary,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: c.surface_elevated,
            borderTopColor: c.border_subtle,
          },
        ],
        tabBarItemStyle: styles.tabItem,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="landing_page"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="requests_posts_hub"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, size }) => <Ionicons name="chatbubbles-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="post_type_selector"
        options={{
          title: 'Post',
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="notifications_list"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ color, size }) => <Ionicons name="notifications-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="account_profile"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginHorizontal: 12,
    marginBottom: 10,
    height: 72,
    position: 'absolute',
    overflow: 'hidden',
    paddingTop: 8,
    paddingBottom: 10,
    elevation: 18,
    shadowColor: '#000',
    shadowOpacity: 0.24,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    backdropFilter: 'blur(18px)',
  },
  tabItem: {
    paddingTop: 6,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  hiddenWeb: {
    display: 'none',
  },
});
