import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { HOT_TOAST_CONFIG, ToastConfig } from './hot-toast.types';
import { HotToastService } from './hot-toast.service';
import { HotToastContainerComponent } from './hot-toast-container/hot-toast-container.component';
import { HotToastComponent } from './hot-toast/hot-toast.component';
import { AnimatedIconComponent } from './animated-icon/animated-icon.component';
import { IndicatorComponent } from './indicator/indicator.component';
import { CheckMarkComponent } from './indicator/icons/checkmark/checkmark.component';
import { ErrorComponent } from './indicator/icons/error/error.component';
import { LoaderComponent } from './indicator/icons/loader/loader.component';
import { DynamicContentModule } from '@ngneat/overview';

@NgModule({
  declarations: [
    HotToastContainerComponent,
    HotToastComponent,
    AnimatedIconComponent,
    IndicatorComponent,
    CheckMarkComponent,
    ErrorComponent,
    LoaderComponent,
  ],
  imports: [CommonModule, DynamicContentModule],
})
export class HotToastModule {
  static forRoot(config: Partial<ToastConfig> = {}): ModuleWithProviders<HotToastModule> {
    return {
      ngModule: HotToastModule,
      providers: [{ provide: HOT_TOAST_CONFIG, useValue: config }],
    };
  }

  constructor(service: HotToastService) {
    service.init();
  }
}
