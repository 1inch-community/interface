export type NullableValue<T> = {
  [P in keyof T]: T[P] | null;
};
