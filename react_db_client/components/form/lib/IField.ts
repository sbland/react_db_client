import { IHeading } from './IHeading';

export interface IFieldProps<T extends unknown> {
  heading: IHeading<T>;
  value: T;
  onChange: (v: T) => void;
  additionalData: any;
}

export interface IFieldComponentProps<T extends unknown>
  extends Omit<React.HTMLProps<HTMLInputElement>, 'defaultValue' | 'value' | 'onChange'> {
  uid: string;
  unit?: string;
  value: T;
  onChange: (v: T) => void;
  additionalData: any;
  inputTypeOverride?: '';
  useArea?: boolean;
  required?: boolean;
  disableAutofill?: boolean;
  defaultValue?: T;
}
