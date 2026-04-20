import type { ReactNode } from 'react';
import { AccountLoginMask } from '@/features/marketplace/AccountLoginMask';
import { useSessionStore } from '@/stores/sessionStore';

type Props = { children: ReactNode };

export function GuestGate({ children }: Props) {
  const isGuest = useSessionStore((s) => s.isGuest());

  if (isGuest) {
    return <AccountLoginMask reason="Log in to keep messages, posts, notifications, and account changes synced." />;
  }

  return <>{children}</>;
}
