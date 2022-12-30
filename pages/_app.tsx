import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { Header } from '../components/Header'
import { AuthProvider } from '../components/AuthProvider'



export default function App({ Component, pageProps }: AppProps) {

  return(
    <AuthProvider>
      <Header/>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
