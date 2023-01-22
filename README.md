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


## firestore.rules

TODO:今のままでは、ログインさえしていれば誰でも消せる。リソースごとに権限管理をするなどする
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if false;
      allow write: if false;
    }
    match /users/{userId}{
      allow read: if true;
    	allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /rooms/{roomId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if false;
      allow delete:if request.auth != null;
      match /members/{memberId}{
        allow read: if true;
        allow write: if request.auth != null;
      }
      match /messages/{messageId}{
        allow read: if true;
        allow create: if request.auth != null;
        allow update: if false;
        allow delete:if request.auth != null;
      }
    }
  }
}
```