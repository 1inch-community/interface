import {inject, Pipe, PipeTransform} from '@angular/core';
import {Address} from "viem";
import {SelectTokenViewState, TokenView} from "./select-token-view.state";
import {Observable} from "rxjs";

@Pipe({
  name: 'selectTokenById',
  standalone: true,
  pure: false
})
export class SelectTokenByIdPipe implements PipeTransform {

  private readonly view = inject(SelectTokenViewState)

  transform(id: string, wallet: Address | null | undefined): Observable<TokenView | null> {
    return this.view.get(id, wallet)
  }

}
