import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList, type FlashListRef } from '@shopify/flash-list';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getChatMessages, sendChatMessage } from '@/domain/api/chatApi';
import type { ChatMessage } from '@/data/contract';
import { useSessionStore } from '@/stores/sessionStore';
import { useThemeColors, useIsDark } from '@/theme/useThemeColors';
import { radius, space, type as typeStyles } from '@/theme/tokens';

function MessageBubble({ message, isMine }: { message: ChatMessage; isMine: boolean }) {
  const c = useThemeColors();
  const time = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return (
    <View style={[styles.bubbleRow, isMine && styles.bubbleRowMine]}>
      <View
        style={[
          styles.bubble,
          isMine
            ? {
                backgroundColor: 'rgba(216,180,106,0.85)',
                borderColor: 'rgba(255,255,255,0.25)',
                borderWidth: 1,
                borderRadius: radius.card,
                padding: space.md,
                maxWidth: '78%',
              }
            : {
                backgroundColor: c.glass_surface,
                borderColor: c.glass_border,
                borderWidth: 1,
                borderRadius: radius.card,
                padding: space.md,
                maxWidth: '78%',
              },
        ]}
      >
        <Text
          style={[
            styles.bubbleText,
            { color: isMine ? '#000' : c.text_primary },
          ]}
        >
          {message.content}
        </Text>
        <Text
          style={[
            styles.bubbleTime,
            { color: isMine ? 'rgba(0,0,0,0.5)' : c.text_secondary },
          ]}
        >
          {time}
        </Text>
      </View>
    </View>
  );
}

export default function ChatThreadRoute() {
  const c = useThemeColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<FlashListRef<ChatMessage>>(null);
  const [inputText, setInputText] = useState('');
  const currentUserId = useSessionStore((s) => s.user?.id ?? 0);
  const qc = useQueryClient();
  

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['chat', 'messages', id],
    queryFn: () => getChatMessages(id ?? '0'),
    enabled: id != null,
  });

  const sendMutation = useMutation({
    mutationFn: (content: string) => sendChatMessage(id ?? '0', content),
    onSuccess: (newMsg) => {
      qc.setQueryData<ChatMessage[]>(['chat', 'messages', id], (old) => [...(old ?? []), newMsg]);
      setInputText('');
    },
  });

  const handleSend = useCallback(() => {
    const text = inputText.trim();
    if (!text) return;
    sendMutation.mutate(text);
    Keyboard.dismiss();
  }, [inputText, sendMutation]);

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: c.surface_secondary }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      {/* Glass Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + space.sm,
            backgroundColor: c.glass_surface,
            borderBottomColor: c.glass_border,
            // @ts-ignore – web-only
          WebkitBackdropFilter: `blur(${c.glass_blur_chrome}px)`,
          },
        ]}
      >
        <Pressable onPress={() => router.back()} style={styles.backBtn} accessibilityRole="button">
          <Ionicons name="arrow-back" size={22} color={c.text_primary} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[typeStyles.subtitle, { color: c.text_primary }]}>Conversation</Text>
          <Text style={{ color: c.text_secondary, fontSize: 12 }}>Thread #{id}</Text>
        </View>
        <Pressable
          onPress={() => router.push('/(tabs)/requests_posts_hub')}
          style={styles.iconBtn}
          accessibilityRole="button"
        >
          <Ionicons name="ellipsis-vertical" size={18} color={c.text_secondary} />
        </Pressable>
      </View>

      <View style={styles.messageList}>
        {isLoading ? (
          <View style={styles.centerState}>
            <Text style={{ color: c.text_secondary }}>Loading messages...</Text>
          </View>
        ) : messages.length === 0 ? (
          <View style={styles.centerState}>
            <Ionicons name="chatbubbles-outline" size={48} color={c.border_subtle} />
            <Text style={{ color: c.text_secondary, marginTop: space.md, textAlign: 'center' }}>
              No messages yet.{'\n'}Say hello to start the conversation.
            </Text>
          </View>
        ) : (
          <FlashList
            data={messages}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <MessageBubble message={item} isMine={item.sender_id === currentUserId} />
            )}
            contentContainerStyle={{ padding: space.md, gap: space.sm }}
            inverted={false}
          />
        )}
      </View>

      {/* Glass Input Bar */}
      <View
        style={[
          styles.inputBar,
          {
            backgroundColor: c.glass_surface,
            borderTopColor: c.glass_border,
            // @ts-ignore – web-only
          WebkitBackdropFilter: `blur(${c.glass_blur_chrome}px)`,
            paddingBottom: insets.bottom + space.md,
          },
        ]}
      >
        <View
          style={[
            styles.inputWrap,
            {
              backgroundColor: c.glass_surface,
              borderColor: c.glass_border,
              borderWidth: 1,
              borderRadius: radius.button,
            },
          ]}
        >
          <TextInput
            style={[styles.textInput, { color: c.text_primary }]}
            placeholder="Type a message..."
            placeholderTextColor={c.text_secondary}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={1000}
            onSubmitEditing={handleSend}
          />
        </View>
        <Pressable
          onPress={handleSend}
          disabled={!inputText.trim() || sendMutation.isPending}
          style={[
            styles.sendBtn,
            {
              backgroundColor: inputText.trim() ? c.accent_primary : c.text_secondary,
            },
          ]}
          accessibilityRole="button"
        >
          <Ionicons name="send" size={18} color="#FFF" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingHorizontal: space.md,
    paddingBottom: space.md,
    borderBottomWidth: 1,
  },
  backBtn: { padding: space.xs },
  iconBtn: { padding: space.xs },
  messageList: { flex: 1 },
  centerState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: space.xl },
  bubbleRow: { flexDirection: 'row', marginBottom: space.sm },
  bubbleRowMine: { justifyContent: 'flex-end' },
  bubble: {},
  bubbleText: { fontSize: 15, lineHeight: 20 },
  bubbleTime: { fontSize: 11, alignSelf: 'flex-end', marginTop: 4 },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: space.sm,
    paddingHorizontal: space.md,
    paddingTop: space.md,
    borderTopWidth: 1,
  },
  inputWrap: {
    flex: 1,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    maxHeight: 120,
  },
  textInput: { fontSize: 15, maxHeight: 100 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
