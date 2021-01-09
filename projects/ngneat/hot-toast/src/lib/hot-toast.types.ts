import { Content } from '@ngneat/overview';
import { InjectionToken } from '@angular/core';

export type OnlyConfig = Omit<ToastConfig, 'message' | 'type'>;

type GlobalConfig = {
  reverseOrder: boolean;
} & {
  [key in ToastType]?: OnlyConfig;
};

export function getDefaults(): GlobalConfig & Partial<Toast> {
  const now = Date.now();

  return {
    id: now.toString(),
    createdAt: now,
    position: 'top-center',
    reverseOrder: false,
    ariaLive: 'polite',
    pauseDuration: 0,
    role: 'status',
    visible: true,
  };
}

export type ConfigProvider = GlobalConfig & ToastConfig;
export const HOT_TOAST_CONFIG = new InjectionToken<ConfigProvider>('HOT_TOAST_CONFIG', {
  factory() {
    return {} as ConfigProvider;
  },
});

export type ToastType = 'success' | 'error' | 'loading' | 'blank';
export type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

export interface IconTheme {
  primary: string;
  secondary: string;
}

export type ToastTheme = 'toast' | 'snackbar';

export interface ToastConfig {
  message: Content;
  type?: ToastType;
  icon?: Content;
  duration?: number;
  dismissible?: boolean;
  pauseDuration?: number;
  role?: 'status' | 'alert';
  ariaLive?: 'assertive' | 'off' | 'polite';
  style?: Record<string, string>;
  className?: string;
  iconTheme?: IconTheme;
  theme?: ToastTheme;
  height?: number;
  width?: number;
  position?: ToastPosition;
}

export interface Toast extends ToastConfig {
  id: string;
  createdAt: number;
  visible: boolean;
}
