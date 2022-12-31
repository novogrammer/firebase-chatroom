import React from "react";
import { User } from "./User";

export type AuthContextValue={
  user:User|false|undefined;
  setUser:(user:User|false|undefined)=>void;
};
export const AuthContext = React.createContext<AuthContextValue>({user:undefined,setUser:(user)=>{}});