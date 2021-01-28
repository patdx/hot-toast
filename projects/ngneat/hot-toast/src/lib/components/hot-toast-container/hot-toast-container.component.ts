import { ChangeDetectionStrategy, ChangeDetectorRef, Input, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { Component } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import {
  HotToastClose,
  Toast,
  ToastConfig,
  ToastPosition,
  UpdateToastOptions,
  AddToastRef,
  CreateHotToastRef,
} from '../../hot-toast.model';
import { HotToastRef } from '../../hot-toast-ref';
import { filter } from 'rxjs/operators';
import { Content } from '@ngneat/overview';
import { HotToastComponent } from '../hot-toast/hot-toast.component';

@Component({
  selector: 'hot-toast-container',
  templateUrl: './hot-toast-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotToastContainerComponent implements OnDestroy {
  @Input() defaultConfig: ToastConfig;

  @ViewChildren(HotToastComponent) hotToastComponentList: QueryList<HotToastComponent>;

  toasts: Toast[] = [];
  toastRefs: CreateHotToastRef[] = [];

  private readonly _offsetMargin = 8;

  private subscriptionList: Subscription[] = [];

  /** Subject for notifying the user that the toast has been closed. */
  private _onClosed = new Subject<HotToastClose>();

  private onClosed$ = this._onClosed.asObservable();

  constructor(private cdr: ChangeDetectorRef) {}

  trackById(index: number, toast: Toast) {
    return toast.id;
  }

  calculateOffset(toastId: string, position: ToastPosition) {
    const visibleToasts = this.toasts.filter((t) => t.visible && t.position === position);
    const index = visibleToasts.findIndex((toast) => toast.id === toastId);
    const offset =
      index !== -1
        ? visibleToasts
            .slice(...(this.defaultConfig.reverseOrder ? [index + 1] : [0, index]))
            .reduce((acc, t) => acc + (t.height || 0) + this._offsetMargin, 0)
        : 0;
    return offset;
  }

  updateHeight(height: number, toast: Toast) {
    toast.height = height;
  }

  addToast(ref: HotToastRef): AddToastRef {
    this.toastRefs.push(ref);

    const toast = ref.getToast();

    this.toasts.push(ref.getToast());

    this.cdr.detectChanges();

    return {
      dispose: () => {
        this.closeToast(toast.id);
      },
      updateMessage: (message: Content) => {
        toast.message = message;
        this.cdr.detectChanges();
      },
      updateToast: (options: UpdateToastOptions) => {
        this.updateToasts(toast, options);
        this.cdr.detectChanges();
      },
      afterClosed: this.getAfterClosed(toast),
    };
  }

  closeToast(id: string) {
    const comp = this.hotToastComponentList.find((item) => item.toast.id === id);
    if (comp) {
      comp.close();
    }
  }

  beforeClosed(toast: Toast) {
    toast.visible = false;
  }

  afterClosed(closeToast: HotToastClose) {
    const toastIndex = this.toasts.findIndex((t) => t.id === closeToast.id);
    if (toastIndex > -1) {
      this._onClosed.next(closeToast);
      this.toasts = this.toasts.filter((t) => t.id !== closeToast.id);
      this.toastRefs = this.toastRefs.filter((t) => t.getToast().id !== closeToast.id);
      this.cdr.detectChanges();
    }
  }

  hasToast(id: string) {
    return this.toasts.findIndex((t) => t.id === id) > -1;
  }

  ngOnDestroy() {
    this.subscriptionList.forEach((s) => s.unsubscribe());
  }

  private getAfterClosed(toast: Toast) {
    return this.onClosed$.pipe(filter((v) => v.id === toast.id));
  }

  private updateToasts(toast: Toast, options?: UpdateToastOptions) {
    this.toasts = this.toasts.map((t) => ({ ...t, ...(t.id === toast.id && { ...toast, ...options }) }));
  }
}
