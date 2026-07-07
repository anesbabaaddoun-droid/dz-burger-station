import { db } from "./firebase.js"; // أضفنا .js هنا
import { collection, getDocs } from "firebase/firestore";

async function testConnection() {
    try {
        const querySnapshot = await getDocs(collection(db, "category"));
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
        });
        console.log("Data fetched successfully!");
    } catch (error) {
        console.error("Error fetching data: ", error);
    }
}

testConnection();