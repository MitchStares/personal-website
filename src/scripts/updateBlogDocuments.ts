// src/scripts/updateBlogDocuments.ts
//To run, install ts-node
    //npm install -g ts-node
//then run the script
    //ts-node src/scripts/updateBlogDocuments.ts


import { getDocs, collection, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const updateBlogDocuments = async () => {
  const blogCollectionRef = collection(db, 'blogs');
  const snapshot = await getDocs(blogCollectionRef);

  snapshot.forEach(async (docSnapshot) => {
    const blogDocRef = doc(db, 'blogs', docSnapshot.id);
    await updateDoc(blogDocRef, { imageUrl: docSnapshot.data().imageUrl || '' });
  });

  console.log('All blog documents updated with imageUrl field.');
};

updateBlogDocuments();
