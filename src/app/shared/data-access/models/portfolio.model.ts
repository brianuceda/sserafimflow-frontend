import { Document } from "./document.model";
import { StateEnum } from "./enums.model";

export interface Portfolio {
  id: number;
  name: string;
  state: StateEnum;
  documents: Document[];
}
