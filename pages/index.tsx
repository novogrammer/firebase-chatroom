import Head from 'next/head'
import Image from 'next/image'
import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from 'react';
import { Room } from '../libs/Room';
import styles from '../styles/Home.module.scss'

import {doc,getFirestore,setDoc,collection, onSnapshot, deleteDoc} from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../libs/firebase_constants';



export default function Home() {

  const [rooms,setRooms]=useState(new Map<string,Room>());
  const roomIdForCreate=useRef<HTMLInputElement>(null);
  const app=useMemo(()=>initializeApp(firebaseConfig),[]);
  const auth=useMemo(()=>getAuth(app),[app]);
  const db=useMemo(()=>getFirestore(app),[app]);

  const onClickCreate=(async (event:React.MouseEvent)=>{
    event.preventDefault();
    if(!roomIdForCreate.current){
      throw new Error("roomIdForCreate.current is null");
    }
    const roomId=roomIdForCreate.current.value;
    try{
      await setDoc(doc(db,"rooms",roomId),{
        // population:0,
      });
  
    }catch(error){
      // TODO: エラー表示
      console.error(error);
    }

  });
  const onClickDelete=(async (roomId:string,event:React.MouseEvent)=>{
    event.preventDefault();
    try{
      await deleteDoc(doc(db,"rooms",roomId));
    }catch(error){
      // TODO: エラー表示
      console.error(error);
    }
    // TODO: サブコレクションも削除する
  });

  useEffect(()=>{
    const collectionRefRoom=collection(db,"rooms");
    const unsubscribe=onSnapshot(collectionRefRoom,(querySnapshot)=>{
      console.log("onSnapshot",querySnapshot.size);
      
      const newRooms=new Map<string,Room>();

      querySnapshot.forEach((doc)=>{
        const id=doc.id;
        const data=doc.data() as Room;
        console.log(id,data);
        newRooms.set(id,data);
      });
      setRooms(newRooms);
    });

    return unsubscribe;
  },[]);


  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="description" content="this is home" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div>
          <input type="text" ref={roomIdForCreate}/><button onClick={onClickCreate}>Room作成</button>
        </div>
        <div>
          {
            Array.from(rooms.entries()).map(([roomId,room])=>{
              return <div key={roomId}>{roomId}&nbsp;<Link href={"/room?roomId="+roomId}>go</Link>&nbsp;<a onClick={onClickDelete.bind(null,roomId)}>delete</a></div>
            })
          }
        </div>
      </main>
    </>
  )
}
