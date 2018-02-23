import fire from "./fire";
import "firebase/firestore";

const db = fire.firestore();

export const poemsDb = db.collection("poems");
