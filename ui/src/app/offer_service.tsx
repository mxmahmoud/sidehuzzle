import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { BottomActionBar } from '@/components/side/BottomActionBar';
import { Button } from '@/components/side/Button';
import { GlassSurface } from '@/components/side/GlassSurface';
import { ScreenShell } from '@/components/side/ScreenShell';
import { TextField } from '@/components/side/TextField';
import { Text } from '@/components/ui/text';

export default function OfferServiceRoute() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [rate, setRate] = useState('');

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />
      <ScreenShell scroll keyboard maxWidth="md" contentClassName="gap-side-lg pb-28" withBackground>
        <GlassSurface variant="chrome" className="flex-row items-center gap-side-sm p-side-sm">
          <Button icon="arrow-back" variant="icon" accessibilityLabel="Back" onPress={() => router.back()} />
          <View className="min-w-0 flex-1">
            <Text className="text-[12px] font-extrabold uppercase leading-4 tracking-[0px] text-primary">Apply to this job</Text>
            <Text className="text-[17px] font-bold leading-6">Send offer</Text>
          </View>
        </GlassSurface>

        <GlassSurface variant="elevated" className="gap-side-sm p-side-lg">
          <View className="self-start rounded-lg bg-destructive/15 px-side-sm py-[5px]">
            <Text className="text-[11px] font-extrabold leading-4 text-destructive">Job</Text>
          </View>
          <Text className="text-[17px] font-bold leading-6">Deep clean 2BR</Text>
          <Text className="text-[13px] font-medium leading-5 text-muted-foreground">
            Share a rate and short note so the customer can compare your offer with others.
          </Text>
        </GlassSurface>

        <GlassSurface variant="elevated" className="gap-side-lg p-side-xl">
          <View className="gap-side-sm">
            <Text className="text-[24px] font-bold leading-[30px]">Your offer</Text>
            <Text className="text-[14px] leading-[22px] text-muted-foreground">
              Describe your experience and availability. The customer will see your profile, rating, and this message.
            </Text>
          </View>

          <TextField label="Your rate" placeholder="45" keyboardType="numeric" value={rate} onChangeText={setRate} />
          <TextField
            label="Cover message"
            placeholder="I can help with this because..."
            multiline
            numberOfLines={5}
            value={message}
            onChangeText={setMessage}
          />

          <GlassSurface variant="surface" className="flex-row items-start gap-side-md p-side-lg">
            <Ionicons name="shield-checkmark-outline" size={20} color="#0E7A4F" />
            <Text className="min-w-0 flex-1 text-[13px] font-medium leading-5 text-muted-foreground">
              Your offer is non-binding until both parties agree on terms in the chat.
            </Text>
          </GlassSurface>
        </GlassSurface>
      </ScreenShell>

      <BottomActionBar className="absolute bottom-0 left-0 right-0">
        <Button label="Send offer" icon="send" variant="primary" className="flex-1" onPress={() => router.push('/confirmation_worker_offer_submitted')} />
      </BottomActionBar>
    </View>
  );
}
