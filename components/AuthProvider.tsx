import { useEffect, useState } from 'react';
import { AuthContext, AuthContextValue } from '../libs/AuthContext';
import { User } from '../libs/User';


export const AuthProvider:React.FC<{children?:React.ReactNode[]}> = ({ children })=>{
  const [user,setUser]=useState<User>();
  // useEffect(()=>{
  //   // setAuthContextValue({
  //   //   user:{
  //   //     displayName:"ディスプレイネーム",
  //   //     uid:"1234",
  //   //   }
  //   // });
  //   return ()=>{

  //   };
  // },[authContextValue]);

  return (
    <AuthContext.Provider value={{user,setUser}}>
      {children}
    </AuthContext.Provider>
  );


}