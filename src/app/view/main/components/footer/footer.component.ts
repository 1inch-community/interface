import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'inch-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inch-footer' }
})
export class FooterComponent {

}
