import { InitializingEntity } from '../base';

export interface ISentryController extends InitializingEntity {
  error(error: unknown): void
}
