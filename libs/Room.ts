import { Message } from "./Message";
import { User } from "./User";

export interface Room{
  roomId:string;
  population:number;
  members:Map<string,User>;
  messages:Map<string,Message>;
}
