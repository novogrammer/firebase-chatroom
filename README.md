# firebase-chatroom
Firestoreでサーバレスなチャットサービスを実現する

demo https://novogrammer.github.io/firebase-chatroom/

## Firebase側の準備
+ Firebaseプロジェクトを作る
+ アプリを追加する（Web App）
+ アプリのSDKの設定からfirebaseConfigをコピーして、./libs/firebase_constants.tsを差し替える
+ Firestore Databaseを設定する（適切なルールを設定する）

## 準備

Node 16系をインストールしておく
```bash
npm install
```

## 開発

```bash
npm run dev
```

## localhost以外での動作

Firebase Authentication でドメインを許可する必要がある。

