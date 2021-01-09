import { Component } from '@angular/core';
import { HotToastService, ToastConfig } from '@ngneat/hot-toast';
import { timer } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'toast';

  iconList = ['☝', '👇'];

  iconComponent = IconComponent;

  constructor(private toastService: HotToastService) {}

  blank(message: string, options?: ToastConfig) {
    const ref = this.toastService.show(message, options);
  }

  error() {
    this.toastService.error('Error');
  }

  success() {
    this.toastService.success('Success');
  }

  loading() {
    this.toastService.loading('Loading...');
  }

  observe() {
    const source = timer(3000);

    const toastRef = this.toastService.observe(
      source,
      {
        loading: 'Observable Loading...',
        next: (v: number) => v,
        error: 'Observable Error',
        complete: 'Observable Complete',
      },
      { success: { duration: 10000 } }
    );
  }
}

@Component({
  selector: 'app-icon',
  template: '✋',
})
export class IconComponent {}
