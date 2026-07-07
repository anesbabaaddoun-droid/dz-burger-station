import { db } from "./firebase.js";
import { collection, addDoc } from "firebase/firestore";

async function testWrite() {
    try {
        const docRef = await addDoc(collection(db, "category"), {
            name: "تجربة تجريبية",
            status: "active"
        });
        console.log("تمت إضافة البيانات بنجاح، معرف المستند هو: ", docRef.id);
    } catch (e) {
        console.error("خطأ في إضافة البيانات: ", e);
    }
}

testWrite();