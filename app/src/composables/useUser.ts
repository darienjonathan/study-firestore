import { inject, ref } from 'vue';
import { firebaseAppKey } from '../plugins/firebase';
import { FirebaseApp } from 'firebase/app';
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  setDoc,
} from 'firebase/firestore';

type User = {
  username: string;
};

const USER_ID_STORAGE_KEY = 'firestore-study-user-id';
const USER_COLLECTION_NAME = 'users';

export const useUser = async () => {
  // firestore初期化
  const firebaseApp = inject<FirebaseApp>(firebaseAppKey)!; // TODO: !を削除
  const db = getFirestore(firebaseApp);

  // ユーザー名
  const userId =
    localStorage.getItem(USER_ID_STORAGE_KEY) ||
    doc(collection(db, USER_COLLECTION_NAME)).id;
  const username = ref<User['username']>();

  // TODO: hookを外す
  const docSnap = await getDoc(doc(db, USER_COLLECTION_NAME, userId));
  username.value = docSnap.exists() ? docSnap.data().name : '';

  // ユーザー名を保存
  const handleNameSubmission = async (inputtedName: string) => {
    username.value = inputtedName;
    await setDoc(doc(db, USER_COLLECTION_NAME, userId), {
      username: inputtedName,
    });
    localStorage.setItem(USER_ID_STORAGE_KEY, userId);
  };

  return {
    username,
    userId,
    handleNameSubmission,
  };
};
