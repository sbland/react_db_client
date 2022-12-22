import { Uid } from "./uid";

export interface ILabelled<IdType extends Uid = Uid> {
  uid: IdType;
  label: string;
}
