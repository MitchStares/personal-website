// src/services/blogService.ts
import { collection, getDocs, addDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

interface Blog {
  id: string;
  title: string;
  content: string;
  date: Date;
}

const blogCollectionRef = collection(db, 'blogs');

export const fetchBlogs = async (): Promise<Blog[]> => {
  const snapshot = await getDocs(blogCollectionRef);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    title: doc.data().title,
    content: doc.data().content,
    date: doc.data().date.toDate() // Ensure date is converted to Date object
  }));
};

export const fetchBlogById = async (id: string): Promise<Blog | null> => {
  const blogDoc = doc(db, 'blogs', id);
  const docSnap = await getDoc(blogDoc);
  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      title: docSnap.data().title,
      content: docSnap.data().content,
      date: docSnap.data().date.toDate()
    };
  } else {
    return null;
  }
};

export const createBlog = async (blog: { title: string; content: string; date: Date }) => {
  return await addDoc(blogCollectionRef, blog);
};

export const deleteBlog = async (id: string) => {
  const blogDoc = doc(db, 'blogs', id);
  return await deleteDoc(blogDoc);
};
