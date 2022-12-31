import { useContext, useEffect, useMemo } from 'react';
import { AuthContext } from '../libs/AuthContext';

import {initializeApp} from "firebase/app";
import {getAuth,getRedirectResult,GoogleAuthProvider, onAuthStateChanged, signInWithRedirect, signOut, UserCredential} from "firebase/auth";
import { firebaseConfig } from '../libs/firebase_constants';
export function Header(){
  const authContext=useContext(AuthContext);
  const auth=useMemo(()=>getAuth(initializeApp(firebaseConfig)),[]);

  useEffect(()=>{
    
    // const redirectResult=getRedirectResult(auth);

    // redirectResult.then((userCredential:UserCredential|null)=>{
    //   if(!userCredential){
    //     throw new Error("userCredential is null");
    //   }
    //   const oAuthCredential=GoogleAuthProvider.credentialFromResult(userCredential);
    //   if(!oAuthCredential){
    //     throw new Error("oAuthCredential is null");
    //   }
    //   const {user}=userCredential;
    //   authContext.setUser({
    //     displayName:user.displayName??"NO NAME",
    //     uid:user.uid,
    //   })

    // }).catch((error)=>{
    //   console.error(error);
    // });


    return ()=>{
      console.log("unmount");
    };
  },[]);
  

  const onSignIn=(e:React.MouseEvent)=>{
    e.preventDefault();
    const googleAuthProvider=new GoogleAuthProvider();
    googleAuthProvider.addScope("profile");
    signInWithRedirect(auth,googleAuthProvider);

  };
  const onSignOut=(e:React.MouseEvent)=>{
    e.preventDefault();
    signOut(auth).then(()=>{
      authContext.setUser(undefined);
    }).catch((error)=>{
      console.error(error);
    });
  };

  return <div>
    {authContext.user?<div><a onClick={onSignOut}>サインアウト</a> {authContext.user.displayName}</div>:<div><a onClick={onSignIn}>サインイン</a></div>}
  </div>
}