import { Toast } from '@ngneat/hot-toast';
import { HotToastContainerComponent } from './hot-toast-container/hot-toast-container.component';

export class ToastRef {
  private dispose: Function;

  constructor(private toast: Toast) {}

  getToast() {
    return this.toast;
  }

  appendTo(container: HotToastContainerComponent) {
    this.dispose = container.addToast(this);

    return this;
  }

  close() {
    this.dispose();
  }
}
