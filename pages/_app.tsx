import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { AuthProvider } from '../components/AuthProvider'
import { Header } from '../components/Header'



export default function App({ Component, pageProps }: AppProps) {

  return(
    <AuthProvider>
      <Header/>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
