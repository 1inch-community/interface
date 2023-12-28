import { ChangeDetectionStrategy, Component } from '@angular/core';
import {SwapInputComponent} from "../swap-input/swap-input.component";
import {SwapFormDataService} from "../../services/swap-form-data.service";

@Component({
  selector: 'inch-swap-form-pair',
  standalone: true,
  imports: [
    SwapInputComponent
  ],
  templateUrl: './swap-form-pair.component.html',
  styleUrl: './swap-form-pair.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SwapFormPairComponent {

  constructor(private readonly swapData: SwapFormDataService) {}

  protected async reverse() {
    await this.swapData.reversePair()
  }

}
