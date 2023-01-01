import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useMemo, useState } from 'react';
import { AuthContext } from '../libs/AuthContext';
import { firebaseConfig } from '../libs/firebase_constants';
import { User } from '../libs/User';


export const AuthProvider:React.FC<{children?:React.ReactNode[]}> = ({ children })=>{
  const [user,setUser]=useState<User|false|undefined>();
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

  const auth=useMemo(()=>getAuth(initializeApp(firebaseConfig)),[]);

  useEffect(()=>{
    const unscribe=onAuthStateChanged(auth,(newUser)=>{
      console.log("onAuthStateChanged",newUser,user);
      if(newUser){
        if(!user || user.uid != newUser.uid)
        {
          setUser({
            displayName:newUser.displayName??"NO NAME",
            uid:newUser.uid,
          });
        }
      }else{
        setUser(false);
      }
    });
    return unscribe;
  },[]);

  return (
    <AuthContext.Provider value={{user,setUser}}>
      {children}
    </AuthContext.Provider>
  );


}