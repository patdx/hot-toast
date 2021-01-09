import { ChangeDetectionStrategy, ChangeDetectorRef, Component, QueryList, ViewChildren } from '@angular/core';
import { Toast, ToastPosition } from '@ngneat/hot-toast';
import { HotToastComponent } from '../hot-toast/hot-toast.component';
import { ToastRef } from '../toast-ref';

@Component({
  selector: 'hot-toast-container',
  templateUrl: './hot-toast-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotToastContainerComponent {
  toasts: Toast[] = [];
  position: ToastPosition = 'top-center';
  reverseOrder: boolean = false;
  pauseDivHeight: string | number = 0;
  pauseDivWidth: string | number = 0;

  private readonly offsetMargin = 8;

  @ViewChildren(HotToastComponent) hotToastList: QueryList<HotToastComponent>;
  pausedAt: number;
  diff: number;

  constructor(private cdr: ChangeDetectorRef) {}

  addToast(ref: ToastRef) {
    this.toasts = [...this.toasts, ref.getToast()];
    this.cdr.detectChanges();

    return () => {
      this.toasts = this.toasts.filter((current) => current !== ref.getToast());
    };
  }

  trackById(index: number, toast: Toast) {
    return toast.id;
  }

  calculateOffset(toastId: string) {
    const visibleToasts = this.toasts.filter((t) => t.visible);
    const index = visibleToasts.findIndex((toast) => toast.id === toastId);

    const offset =
      index !== -1
        ? visibleToasts
            .slice(...(this.reverseOrder ? [index + 1] : [0, index]))
            .reduce((acc, t) => acc + (t.height || 0) + this.offsetMargin, 0)
        : 0;

    return offset;
  }

  updateHeight() {
    this.pauseDivHeight =
      this.toasts
        .map((t, i) => (t.height || 0) + this.offsetMargin)
        .reduce((p, c) => {
          return p + c;
        }, 0) + 'px';
  }

  updateWidth() {
    this.pauseDivWidth = Math.max(...this.toasts.map((t) => t.width || 0)) + 'px';
  }

  startPause() {
    this.pausedAt = Date.now();
  }

  endPause() {
    this.diff = Date.now() - (this.pausedAt || 0);

    if (this.pausedAt) {
      this.pausedAt = undefined;
    }
  }

  removeToast(toast: Toast) {
    this.toasts = this.toasts.filter((current) => current !== toast);
  }
}
