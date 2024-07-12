import { IApplicationContext } from '../application-context';

export interface InitializingEntity {
  init(context: IApplicationContext): Promise<void>
}
