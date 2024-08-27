import { inject, ref } from 'vue';
import { firebaseAppKey } from '../plugins/firebase';
import { FirebaseApp } from 'firebase/app';
import {
  collection,
  doc,
  FirestoreDataConverter,
  getDoc,
  getFirestore,
  QueryDocumentSnapshot,
  setDoc,
} from 'firebase/firestore';

type User = {
  username: string;
};

const USER_ID_STORAGE_KEY = 'firestore-study-user-id';
const USER_COLLECTION_NAME = 'users';

// define converter to make typescript work
const userConverter: FirestoreDataConverter<User, User> = {
  toFirestore: (user: User) => user,
  fromFirestore: (snapshot: QueryDocumentSnapshot) => {
    const user: User = {
      username: snapshot.data().username,
    };
    return user;
  },
};

export const useUser = async () => {
  // firestore initialization
  const firebaseApp = inject<FirebaseApp>(firebaseAppKey)!; // TODO: !を削除
  const db = getFirestore(firebaseApp);

  // username
  const username = ref<User['username']>();

  // fetch username
  const userId =
    localStorage.getItem(USER_ID_STORAGE_KEY) ||
    doc(collection(db, USER_COLLECTION_NAME)).id;
  const docSnap = await getDoc(doc(db, USER_COLLECTION_NAME, userId));
  username.value = docSnap.exists() ? docSnap.data().username : '';

  // save username
  const handleNameSubmission = async (inputtedName: string) => {
    username.value = inputtedName;
    await setDoc(
      doc(db, USER_COLLECTION_NAME, userId).withConverter(userConverter),
      {
        username: inputtedName,
      },
    );
    localStorage.setItem(USER_ID_STORAGE_KEY, userId);
  };

  return {
    username,
    userId,
    handleNameSubmission,
  };
};
