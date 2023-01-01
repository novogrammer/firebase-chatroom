import { useContext,  useMemo } from 'react';
import { AuthContext } from '../libs/AuthContext';

import {initializeApp} from "firebase/app";
import {getAuth,GoogleAuthProvider, signInWithRedirect, signOut} from "firebase/auth";
import { firebaseConfig } from '../libs/firebase_constants';
export function AuthButton(){
  const authContext=useContext(AuthContext);
  const auth=useMemo(()=>getAuth(initializeApp(firebaseConfig)),[]);
  
  const onSignIn=(e:React.MouseEvent)=>{
    e.preventDefault();
    const googleAuthProvider=new GoogleAuthProvider();
    googleAuthProvider.addScope("profile");
    signInWithRedirect(auth,googleAuthProvider);

  };
  const onSignOut=(e:React.MouseEvent)=>{
    e.preventDefault();
    authContext.setUser(undefined);
    signOut(auth).then(()=>{
      // DO NOTHING
    }).catch((error)=>{
      console.error(error);
    });
  };

  return <>
    {
      (authContext.user===undefined)?
      (<div>Loading...</div>):
      authContext.user!==false?
        (<div><a onClick={onSignOut}>サインアウト</a> {authContext.user.displayName}</div>):
        (<div><a onClick={onSignIn}>サインイン</a></div>)
    }
  </>
}