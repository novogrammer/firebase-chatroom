export interface Member{
  uid:string;
  displayName:string;
}
export interface Message{
  uid:string;
  displayName:string;
  text:string;
}

export interface Room{
  members:Map<string,Member>;
  messages:Map<string,Message>;
  population:number;
}
