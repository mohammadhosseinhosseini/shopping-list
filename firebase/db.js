import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: 'AIzaSyCaWBOl0m0VOqX6NBVM1E-URFVicy1-D2Q',
    authDomain: 'shopping-list-12.firebaseapp.com',
    projectId: 'shopping-list-12',
    storageBucket: 'shopping-list-12.appspot.com',
    messagingSenderId: '855478380575',
    appId: '1:855478380575:web:43e5ae7252da63e60bcd2a',
    measurementId: 'G-NPSXGSSN0Z',
}

const app = initializeApp(firebaseConfig)

export const storage = getStorage(app)
export const db = getFirestore(app)
