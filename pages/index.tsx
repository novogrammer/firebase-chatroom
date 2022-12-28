import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.scss'


export default function Home() {
  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="description" content="this is home" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        this is home.
      </main>
    </>
  )
}
