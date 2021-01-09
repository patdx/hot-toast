import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IconTheme } from '@ngneat/hot-toast';

@Component({
  selector: 'hot-toast-loader',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="hot-toast-loader-icon"
      [ngStyle]="{ 'border-color': theme?.primary || '#e0e0e0', 'border-right-color': theme?.secondary || '#616161' }"
    ></div>
  `,
  styles: [
    `
      @keyframes rotate {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      .hot-toast-loader-icon {
        width: 12px;
        height: 12px;
        box-sizing: border-box;
        border-radius: 100%;
        border: 2px solid #e0e0e0;
        border-right-color: #616161;
        animation: rotate 1s linear infinite;
      }
    `,
  ],
})
export class LoaderComponent {
  @Input() theme: IconTheme;
}
