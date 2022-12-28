import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Room.module.scss'


export default function Room() {
  return (
    <>
      <Head>
        <title>Room</title>
        <meta name="description" content="this is room" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        this is room.
      </main>
    </>
  )
}
