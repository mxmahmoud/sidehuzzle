import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native';
import { WebTopNav } from '@/components/WebTopNav';
import { useThemeColors } from '@/theme/useThemeColors';

export default function TabsLayout() {
  const c = useThemeColors();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 1024;

  return (
    <View style={styles.root}>
      {isDesktop ? <WebTopNav /> : null}
      <Tabs
        screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.accent_primary,
        tabBarInactiveTintColor: c.text_secondary,
        tabBarStyle: [
          styles.tabBar,
          Platform.OS === 'web' && !isDesktop && styles.tabBarWeb,
          isDesktop && styles.tabBarHidden,
          {
            backgroundColor: c.surface_primary,
            borderTopColor: c.border_glass,
            // @ts-ignore – web-only
            WebkitBackdropFilter: 'blur(24px)',
            backdropFilter: 'blur(24px)',
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
          title: 'Notifications',
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
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  tabBar: {
    borderTopWidth: 1,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginHorizontal: 12,
    marginBottom: 2,
    height: 82,
    position: 'absolute',
    left: 0,
    right: 0,
    overflow: 'visible',
    paddingTop: 6,
    paddingBottom: 18,
    elevation: 18,
    // shadow* props are deprecated on web – use boxShadow via Platform.select
    ...Platform.select({
      web: {
        boxShadow: '0px 12px 48px rgba(0,0,0,0.24)',
      },
      default: {
        shadowColor: '#000',
        shadowOpacity: 0.24,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 12 },
      },
    }),
  },
  tabBarWeb: {
    marginBottom: 6,
  },
  tabBarHidden: {
    display: 'none',
  },
  tabItem: {
    paddingTop: 2,
    paddingBottom: 4,
  },
  tabLabel: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
  },
});
