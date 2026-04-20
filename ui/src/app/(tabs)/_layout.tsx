import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import type { ComponentProps, ComponentType } from 'react';
import { Platform, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppNav } from '@/components/side/AppNav';
import { shadow } from '@/theme/tokens';
import { useThemeColors } from '@/theme/useThemeColors';

const StyledTabs = Tabs as unknown as ComponentType<ComponentProps<typeof Tabs> & { sceneContainerStyle?: { backgroundColor: string } }>;

export default function TabsLayout() {
  const c = useThemeColors();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isDesktop = Platform.OS === 'web' && width >= 1024;
  const sceneBackground = c.background_alt;
  const tabBarBottomPadding = Math.max(insets.bottom, 12);

  return (
    <View className="flex-1" style={{ backgroundColor: sceneBackground }}>
      {isDesktop ? <AppNav /> : null}
      <StyledTabs
        sceneContainerStyle={{ backgroundColor: sceneBackground }}
        screenOptions={{
          headerShown: false,
          lazy: true,
          freezeOnBlur: true,
          sceneStyle: { backgroundColor: sceneBackground },
          tabBarActiveTintColor: c.accent_primary,
          tabBarInactiveTintColor: c.text_secondary,
          tabBarStyle: [
            {
              borderTopWidth: 1,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              marginHorizontal: 12,
              marginBottom: 0,
              bottom: 0,
              height: 64 + tabBarBottomPadding,
              position: 'absolute',
              left: 0,
              right: 0,
              overflow: 'visible',
              paddingTop: 6,
              paddingBottom: tabBarBottomPadding,
              elevation: 18,
            },
            Platform.OS === 'web'
              ? {
                  boxShadow: shadow.chrome.boxShadow,
                  WebkitBackdropFilter: `blur(${c.glass_blur_chrome}px) saturate(165%)`,
                  backdropFilter: `blur(${c.glass_blur_chrome}px) saturate(165%)`,
                }
              : {
                  shadowColor: '#000',
                  shadowOpacity: 0.24,
                  shadowRadius: 24,
                  shadowOffset: { width: 0, height: 12 },
                },
            isDesktop && { display: 'none' },
            {
              backgroundColor: c.glass_chrome,
              borderTopColor: c.border_glass,
            } as any,
          ],
          tabBarItemStyle: {
            paddingTop: 2,
            paddingBottom: 4,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            lineHeight: 14,
            fontWeight: '600',
          },
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
      </StyledTabs>
    </View>
  );
}
