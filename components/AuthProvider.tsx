import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { AuthContext } from '../libs/AuthContext';
import { firebaseConfig } from '../libs/firebase_constants';
import { User } from '../libs/User';


export const AuthProvider:React.FC<{children?:React.ReactNode[]}> = ({ children })=>{
  const [user,setUser]=useState<User|false|undefined>();

  const app=useMemo(()=>initializeApp(firebaseConfig),[]);
  const auth=useMemo(()=>getAuth(app),[app]);
  const db=useMemo(()=>getFirestore(app),[app]);


  useEffect(()=>{
    const unscribe=onAuthStateChanged(auth,(newUser)=>{
      console.log("onAuthStateChanged",newUser,user);
      if(newUser){
        if(!user || user.uid != newUser.uid){
          const userValue={
            displayName:newUser.displayName??"NO NAME",
            uid:newUser.uid,
          };
          setUser(userValue);

          setDoc(doc(db,"users",newUser.uid),userValue)
          .catch((error)=>{
            console.error(error);
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