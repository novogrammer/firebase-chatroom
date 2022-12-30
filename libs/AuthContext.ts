import React from "react";
import { User } from "./User";

export type AuthContextValue={
  user:User|undefined;
  setUser:(user:User|undefined)=>void;
};
export const AuthContext = React.createContext<AuthContextValue>({user:undefined,setUser:(user)=>{}});