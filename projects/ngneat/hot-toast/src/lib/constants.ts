import { ToastType } from './hot-toast.types';

export const HOT_TOAST_DEFAULT_TIMEOUTS: {
  [key in ToastType]: number;
} = {
  blank: 3000,
  error: 3000,
  success: 2000,
  loading: 30000,
};
