import { computed, inject, onUnmounted, ref } from 'vue';
import { firebaseAppKey } from '../plugins/firebase';
import { FirebaseApp } from 'firebase/app';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  FirestoreDataConverter,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

const CHAT_COLLECTION_NAME = 'chats';

export type Chat = {
  senderId: string;
  senderUsername: string;
  message: string;
  createdAt: number;
  editedAt?: number;
};

// define converter to make typescript work
const chatConverter: FirestoreDataConverter<Chat, Chat> = {
  toFirestore: (chat: Chat) => chat,
  fromFirestore: (snapshot: QueryDocumentSnapshot) => {
    const data = snapshot.data();
    return {
      senderId: data.senderId,
      senderUsername: data.senderUsername,
      message: data.message,
      createdAt: data.createdAt,
      editedAt: data.editedAt,
    };
  },
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
  ).withConverter(chatConverter);

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
    if (!newChatMessage.value) return;

    await addDoc(
      collection(db, CHAT_COLLECTION_NAME).withConverter(chatConverter),
      {
        senderId,
        senderUsername,
        message: newChatMessage.value,
        createdAt: serverTimestamp(),
      },
    );
    newChatMessage.value = '';
  };

  // edit chat message
  const editChatMessage = (chatId: string, message: string) => {
    setDoc(
      doc(db, CHAT_COLLECTION_NAME, chatId).withConverter(chatConverter),
      { message, editedAt: serverTimestamp() },
      { merge: true },
    );
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
