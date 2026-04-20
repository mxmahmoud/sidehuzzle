import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { BottomActionBar } from '@/components/side/BottomActionBar';
import { Button } from '@/components/side/Button';
import { GlassSurface } from '@/components/side/GlassSurface';
import { ScreenShell } from '@/components/side/ScreenShell';
import { TextField } from '@/components/side/TextField';
import { Text } from '@/components/ui/text';

export default function SendHelpRequestRoute() {
  const router = useRouter();
  const [description, setDescription] = useState('');

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />
      <ScreenShell scroll keyboard maxWidth="md" contentClassName="gap-side-lg pb-28" withBackground>
        <GlassSurface variant="chrome" className="flex-row items-center gap-side-sm p-side-sm">
          <Button icon="arrow-back" variant="icon" accessibilityLabel="Back" onPress={() => router.back()} />
          <View className="min-w-0 flex-1">
            <Text className="text-[12px] font-extrabold uppercase leading-4 tracking-[0px] text-primary">Direct request</Text>
            <Text className="text-[17px] font-bold leading-6">Request worker</Text>
          </View>
        </GlassSurface>

        <GlassSurface variant="elevated" className="gap-side-sm p-side-lg">
          <Text className="text-[17px] font-bold leading-6">Alex, Handyman</Text>
          <Text className="text-[13px] font-medium leading-5 text-muted-foreground">
            High-rated pro, same-day availability, and repeat clients nearby.
          </Text>
        </GlassSurface>

        <GlassSurface variant="elevated" className="gap-side-lg p-side-xl">
          <View className="gap-side-sm">
            <Text className="text-[24px] font-bold leading-[30px]">Describe what you need</Text>
            <Text className="text-[14px] leading-[22px] text-muted-foreground">
              The worker will receive your request and can respond with availability and pricing.
            </Text>
          </View>

          <TextField
            label="What do you need help with?"
            placeholder="I need someone to help with..."
            multiline
            numberOfLines={5}
            value={description}
            onChangeText={setDescription}
          />

          <View className="gap-side-md">
            <GlassSurface pressable onPress={() => router.push('/help_request_form')} className="gap-side-xs p-side-lg">
              <Text className="text-[17px] font-bold leading-6">Create new job post</Text>
              <Text className="text-[13px] leading-[18px] text-muted-foreground">Post publicly and link this worker.</Text>
            </GlassSurface>
            <GlassSurface pressable onPress={() => router.push('/confirmation_customer_request_sent')} className="gap-side-xs p-side-lg">
              <Text className="text-[17px] font-bold leading-6">Send direct message</Text>
              <Text className="text-[13px] leading-[18px] text-muted-foreground">Private request to this worker only.</Text>
            </GlassSurface>
          </View>
        </GlassSurface>
      </ScreenShell>

      <BottomActionBar className="absolute bottom-0 left-0 right-0">
        <Button label="Send request" icon="send" variant="primary" className="flex-1" onPress={() => router.push('/confirmation_customer_request_sent')} />
      </BottomActionBar>
    </View>
  );
}
