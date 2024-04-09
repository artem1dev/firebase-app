import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import "firebase/firebase-functions";
import firebaseConfig from "../firebaseConfig.json";

firebase.initializeApp(firebaseConfig);
firebase.auth();
export const functions = firebase.functions();

export const storage = firebase.storage();
export const storageRef = storage.ref();
export const usersRef = storageRef.child("images/users");

const db = firebase.firestore();
export const firebaseTimestamp = firebase.firestore.FieldValue.serverTimestamp;

export const carsCollection = db.collection("cars");
export const usersCollection = db.collection("users");

export const employeeRef = db.collection("site").doc("employees").collection("admins");

export default firebase;