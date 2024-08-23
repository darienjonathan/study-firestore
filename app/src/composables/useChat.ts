import { computed, inject, onUnmounted, ref } from 'vue';
import { firebaseAppKey } from '../plugins/firebase';
import { FirebaseApp } from 'firebase/app';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

const CHAT_COLLECTION_NAME = 'chats';

export type Chat = {
  senderId: string;
  senderUsername: string;
  message: string;
  createdAt: number;
};

export const useChats = async () => {
  // firestore initialization
  const firebaseApp = inject<FirebaseApp>(firebaseAppKey)!; // TODO: !を削除
  const db = getFirestore(firebaseApp);

  // chat messages
  const chats = ref(new Map<string, Chat>());
  const chatEntries = computed(() => Array.from(chats.value.entries()));

  /**
   * query to fetch chat messages
   * other than orderBy, there are also filter, pagination, limit, etc.
   */
  const q = query(
    collection(db, CHAT_COLLECTION_NAME),
    orderBy('createdAt', 'asc'),
  );

  // fetch and subscribe to changes in chat messages
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const fetchedChatMap: Map<string, Chat> = new Map<string, Chat>();
    querySnapshot.forEach((doc) => {
      fetchedChatMap.set(doc.id, doc.data() as Chat);
    });
    chats.value = fetchedChatMap;
  });

  // unsubscribe to changes in chat messages when page is unmounted
  onUnmounted(unsubscribe);

  // create chat message
  const newChatMessage = ref<string>();
  const createNewChatMessage = async (
    senderId: string,
    senderUsername: string,
  ) => {
    await addDoc(collection(db, CHAT_COLLECTION_NAME), {
      senderId,
      senderUsername,
      message: newChatMessage.value,
      createdAt: serverTimestamp(),
    });
    newChatMessage.value = '';
  };

  // edit chat message
  const editChatMessage = (chatId: string, message: string) => {
    setDoc(doc(db, CHAT_COLLECTION_NAME, chatId), { message }, { merge: true });
  };

  // delete chat message
  const deleteChatMessage = (chatId: string) => {
    deleteDoc(doc(db, CHAT_COLLECTION_NAME, chatId));
  };

  return {
    chats,
    chatEntries,
    newChatMessage,
    createNewChatMessage,
    editChatMessage,
    deleteChatMessage,
  };
};
