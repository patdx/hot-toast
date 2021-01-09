import { Inject, Injectable } from '@angular/core';
import { HOT_TOAST_DEFAULT_TIMEOUTS } from './constants';
import { ConfigProvider, getDefaults, HOT_TOAST_CONFIG, OnlyConfig, Toast, ToastConfig } from './hot-toast.types';
import { Observable } from 'rxjs';
import { CompRef, Content, ViewService } from '@ngneat/overview';
import { HotToastContainerComponent } from './hot-toast-container/hot-toast-container.component';
import { ToastRef } from './toast-ref';

@Injectable({ providedIn: 'root' })
export class HotToastService {
  private viewRef: CompRef<HotToastContainerComponent>;

  constructor(private viewService: ViewService, @Inject(HOT_TOAST_CONFIG) private globalConfig: ConfigProvider) {}

  init() {
    this.viewRef = this.viewService.createComponent(HotToastContainerComponent, {});
    this.viewRef.setInput('reverseOrder', this.globalConfig.reverseOrder).appendTo(document.body);
  }

  private createToast(toastConfig: ToastConfig) {
    const toast: Toast = {
      ...getDefaults(),
      ...this.globalConfig,
      duration: toastConfig?.duration ?? HOT_TOAST_DEFAULT_TIMEOUTS[toastConfig.type],
      ...toastConfig,
    } as Toast;

    return new ToastRef(toast).appendTo(this.viewRef.ref.instance);
  }

  show(message: Content, config?: OnlyConfig) {
    return this.createToast({ message, type: 'blank', ...this.globalConfig['blank'], ...config });
  }

  error(message: Content, config?: OnlyConfig) {
    return this.createToast({ message: message, type: 'error', ...this.globalConfig['error'], ...config });
  }

  success(message: Content, config?: OnlyConfig) {
    return this.createToast({ message: message, type: 'success', ...this.globalConfig['success'], ...config });
  }

  loading(message: Content, config?: OnlyConfig) {
    return this.createToast({ message: message, type: 'loading', ...this.globalConfig['loading'], ...config });
  }

  observe<T>(observable: Observable<T>, messages: any, options?: any) {
    // let toastRef = this.createToast(
    //   {
    //     message: messages.loading || 'Loading...', type: 'loading', options: {
    //       ...options,
    //       ...this.defaultConfig.defaultToastOptions?.loading,
    //       ...options?.loading
    //     }, subscription: observable.subscribe(
    //       (v) => {
    //         toastRef.updateMessage(resolveValueOrFunction(messages.subscribe, v));
    //         toastRef.updateToast({
    //           type: 'success',
    //           duration: HOT_TOAST_DEFAULT_TIMEOUTS['success'],
    //           ...this.defaultConfig.defaultToastOptions?.success,
    //           ...options?.success
    //         });
    //       },
    //       (e) => {
    //         if (messages.error) {
    //           toastRef.updateMessage(resolveValueOrFunction(messages.error, e));
    //           toastRef.updateToast({
    //             type: 'error',
    //             duration: HOT_TOAST_DEFAULT_TIMEOUTS['error'],
    //             ...this.defaultConfig.defaultToastOptions?.error,
    //             ...options?.error
    //           });
    //         }
    //       },
    //       () => {
    //         if (messages.complete) {
    //           toastRef.updateMessage(resolveValueOrFunction(messages.complete, undefined));
    //           toastRef.updateToast({
    //             type: 'success',
    //             duration: HOT_TOAST_DEFAULT_TIMEOUTS['success'],
    //             ...this.defaultConfig.defaultToastOptions?.success,
    //             ...options?.success
    //           });
    //         }
    //       }
    //     )
    //   }
    // );

    return {};
  }
}
