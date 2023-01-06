import Head from 'next/head'
import Image from 'next/image'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { AuthContext } from '../../libs/AuthContext'
import styles from '../../styles/Room.module.scss'
import {Room} from "../../libs/Room";
import { useRouter } from 'next/router'
import { setDoc, collection, deleteDoc, doc, getDoc, getFirestore, onSnapshot, addDoc, serverTimestamp, query, orderBy, limit } from 'firebase/firestore'
import { firebaseConfig } from '../../libs/firebase_constants'
import { initializeApp } from 'firebase/app'
import { User } from '../../libs/User'
import { Message } from '../../libs/Message'
import Link from 'next/link'


export default function RoomPage() {
  const router=useRouter();
  const context=useContext(AuthContext);
  const [errorMessage,setErrorMessage]=useState<string|null>(null);
  const [room,setRoom]=useState<Room|null>(null);
  const [members,setMembers]=useState<Map<string,User>|null>(null);
  const [messages,setMessages]=useState<Map<string,Message>|null>(null);
  const app=useMemo(()=>initializeApp(firebaseConfig),[]);
  const db=useMemo(()=>getFirestore(app),[app]);
  const inputMessageTextRef=useRef<HTMLInputElement>(null);

  const {roomId}=router.query;

  // may throw
  function validateParameters(){
    if(!roomId){
      throw new Error("roomId is null");
    }
    if(typeof roomId !="string"){
      throw new Error("roomId is not string");
    }
  }
  function setError(error:any){
    if(error instanceof Error){
      setErrorMessage(error.message);
      console.error(error.message);
    }else{
      setErrorMessage("エラーが発生しました。");
      console.error("エラーが発生しました。");
    }  
  }
  const onSubmitSend=async (event:React.FormEvent)=>{
    event.preventDefault();
    setErrorMessage(null);
    try{
      if(!context.user){
        throw new Error("no user");
      }
        validateParameters();
      if(!inputMessageTextRef.current){
        throw new Error("inputMessageRef.current is null");
      }
      addDoc(collection(db,"rooms",roomId as string,"messages"),{
        ...context.user,
        text:inputMessageTextRef.current.value,
        timestamp: serverTimestamp(),
      })
      
      inputMessageTextRef.current.value="";
    }catch(error){
      setError(error);
    }

  }

  
  useEffect(()=>{
    if(!router.isReady){
      return;
    }
    if(context.user===undefined){
      return;
    }
    setErrorMessage(null);
    try{
      if(!context.user){
        throw new Error("no user");
      }
        validateParameters();
    }catch(error){
      setError(error);
      return;
    }
    const memberRef=doc(db,"rooms",roomId as string,"members",(context.user as User).uid);
    
    setDoc(memberRef, context.user).catch((error)=>{
      setError(error);
    });

    return ()=>{
      deleteDoc(memberRef).catch((error)=>{
        setError(error);
      });
    };

  },[router.isReady,db,roomId,context.user])

  useEffect(()=>{
    if(!router.isReady){
      return;
    }
    if(context.user===undefined){
      return;
    }
    setErrorMessage(null);
    try{
      validateParameters();
    }catch(error){
      setError(error);
      return;
    }

    (async ()=>{
      try{
        
        const roomSnapshot=await getDoc(doc(db,"rooms",roomId as string));
        if(!roomSnapshot.exists()){
          throw new Error("room not exists");
        }
        const room=roomSnapshot.data() as Room;
        setRoom(room);

      }catch(error){
        setError(error);
      }
    })();

  },[router.isReady,db,roomId,context.user]);

  useEffect(()=>{
    if(!router.isReady){
      return;
    }
    if(context.user===undefined){
      return;
    }
    setErrorMessage(null);
    try{
      validateParameters();
    }catch(error){
      setError(error);
      return;
    }

    const unscribePromise=(async ():Promise<()=>void>=>{

      const collectionRefMember=collection(db,"rooms",roomId as string,"members");
      const unsubscribe=onSnapshot(collectionRefMember,(querySnapshot)=>{
        console.log("onSnapshot",querySnapshot.size);
        
        const newMembers=new Map<string,User>();
  
        querySnapshot.forEach((doc)=>{
          const id=doc.id;
          const data=doc.data() as User;
          console.log(id,data);
          newMembers.set(id,data);
        });
        setMembers(newMembers);
      });

      return unsubscribe;
    })();
    return ()=>{
      unscribePromise.then((unscribe)=>{
        unscribe();
      }).catch((error)=>{
        setError(error);
      });
    };
  },[router.isReady,db,roomId,context.user]);

  useEffect(()=>{
    if(!router.isReady){
      return;
    }
    if(context.user===undefined){
      return;
    }
    setErrorMessage(null);
    try{
      validateParameters();
    }catch(error){
      setError(error);
      return;
    }

    const unscribePromise=(async ():Promise<()=>void>=>{

      const collectionRefMessage=collection(db,"rooms",roomId as string,"messages");
      const messageQuery=query(collectionRefMessage,orderBy("timestamp","desc"),limit(10));
      const unsubscribe=onSnapshot(messageQuery,(querySnapshot)=>{
        console.log("onSnapshot",querySnapshot.size);
        
        const newMessages=new Map<string,Message>();
  
        querySnapshot.forEach((doc)=>{
          const id=doc.id;
          const data=doc.data() as Message;
          console.log(id,data);
          newMessages.set(id,data);
        });
        setMessages(newMessages);
      });

      return unsubscribe;
    })();
    return ()=>{
      unscribePromise.then((unscribe)=>{
        unscribe();
      }).catch((error)=>{
        setError(error);
      });
    };
  },[router.isReady,db,roomId,context.user]);

  return (
    <>
      <Head>
        <title>Room</title>
        <meta name="description" content="this is room" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        {
          errorMessage && <div className={styles.error}>{errorMessage}</div>
        }
        <h1 className={styles.title}>firebase-chatroom</h1>
        <p><Link href="/">ロビーへ</Link></p>
        <h2 className={styles.roomId}>{roomId}</h2>
        <form onSubmit={onSubmitSend}>
          <input ref={inputMessageTextRef}/><button type="submit">送信</button>
        </form>
        <h3 className={styles.subTitle}>members</h3>
        {
          !members ?
            <div>loading...</div> :
            <div>
              {
                Array.from(members.entries()).map(([memberId,member])=>{
                  return <div key={memberId}>{member.displayName}</div>
                })
              }
            </div>
        }
        <h3 className={styles.subTitle}>messages</h3>
        {
          !messages ?
            <div>loading...</div> :
            <div>
              {
                Array.from(messages.entries()).map(([messageId,message])=>{
                  return <div key={messageId}>{message.displayName}:&nbsp;{message.text}</div>
                })
              }
            </div>
        }
      </main>
    </>
  )
}
