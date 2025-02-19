import {
    initializeApp
} from "firebase/app";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    setDoc,
    deleteField,
    updateDoc
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Firestore references
const queueRef = collection(db, "customerQueue");
const nowServingRef = doc(db, "system", "nowServing");

export const addCustomerToDB = async (name, reason, orderNumber = "", accountNumber = "", phoneNumber = "", unknownAccount = false) => {
    await addDoc(queueRef, {
        name,
        reason,
        orderNumber: (reason === "Pay for / Pick-Up Existing Order" || reason === "Return/Exchange") ? orderNumber : "",
        accountNumber: (reason !== "Pay for / Pick-Up Existing Order" && reason !== "Return/Exchange") ? accountNumber : "",
        phoneNumber: (reason !== "Pay for / Pick-Up Existing Order" && reason !== "Return/Exchange") ? phoneNumber : "",
        unknownAccount: (reason !== "Pay for / Pick-Up Existing Order" && reason !== "Return/Exchange") ? unknownAccount : false,
        timestamp: Date.now()
    });
};

export const getQueueFromDB = async () => {
    const snapshot = await getDocs(queueRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const removeFirstCustomer = async (id) => {
    await deleteDoc(doc(db, "customerQueue", id));
};

export const removeCustomer = async (id) => {
    await deleteDoc(doc(db, "customerQueue", id));
};

// Set the "Now Serving" Customer
export const setNowServingCustomer = async (customer) => {
    await setDoc(nowServingRef, customer);
};

// Listen for "Now Serving" Updates
export const listenToNowServing = (callback) => {
    return onSnapshot(nowServingRef, (doc) => {
        if (doc.exists()) {
            callback(doc.data());
        } else {
            callback(null);
        }
    });
};

// Listen for Queue Updates
export const listenToQueueUpdates = (callback) => {
    const q = query(queueRef, orderBy("timestamp", "asc"));
    return onSnapshot(q, (snapshot) => {
        const updatedQueue = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(updatedQueue);
    });
};

// Clear Entire Queue
export const clearQueue = async () => {
    const snapshot = await getDocs(queueRef);
    snapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
    });
    await updateDoc(nowServingRef, { name: deleteField(), reason: deleteField() });
};
