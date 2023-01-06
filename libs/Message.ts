import { Timestamp } from "firebase/firestore";

export interface Message{
  timestamp:Timestamp,
  uid:string;
  displayName:string;
  text:string;
}
