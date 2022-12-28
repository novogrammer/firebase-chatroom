import { Html, Head, Main, NextScript } from 'next/document'

function Header(){
  const user=null;
  return <div>
    {user?<div>TODO: サインアウト</div>:<div>TODO: サインイン</div>}
  </div>
}


export default function Document() {
  return (
    <Html lang="ja">
      <Head />
      <body>
        <Header />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
