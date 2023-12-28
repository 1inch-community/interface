import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'a[inch-link]',
  standalone: true,
  imports: [],
  templateUrl: './link.component.html',
  styleUrl: './link.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inch-link' }
})
export class LinkComponent {



}
