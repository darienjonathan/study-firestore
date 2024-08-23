// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from 'firebase/app';
import { App, InjectionKey } from 'vue';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBsDYs1k-IC0pgr4fbzfGOu_dP7CFRgYaw',
  authDomain: 'study-7a1b7.firebaseapp.com',
  projectId: 'study-7a1b7',
  storageBucket: 'study-7a1b7.appspot.com',
  messagingSenderId: '1045829361495',
  appId: '1:1045829361495:web:e74cb043c8fc5ed29ce812',
};

export const firebaseAppKey = Symbol() satisfies InjectionKey<FirebaseApp>;

export default {
  install: (app: App) => {
    const firebaseApp = initializeApp(firebaseConfig);
    app.provide(firebaseAppKey, firebaseApp);
  },
};
