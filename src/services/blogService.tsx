// src/services/blogService.ts
import { collection, getDocs, addDoc, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

interface Blog {
  id: string;
  title: string;
  content: string;
  date: Date;
  imageUrl: string | null;
}

const blogCollectionRef = collection(db, 'blogs');

export const fetchBlogs = async (): Promise<Blog[]> => {
  const snapshot = await getDocs(blogCollectionRef);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    title: doc.data().title,
    content: doc.data().content,
    date: doc.data().date.toDate(),
    imageUrl: doc.data().imageUrl
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
      date: docSnap.data().date.toDate(),
      imageUrl: docSnap.data().imageUrl
    };
  } else {
    return null;
  }
};

export const createBlog = async (blog: { title: string; content: string; date: Date; imageUrl: string | null }) => {
  return await addDoc(blogCollectionRef, blog);
};

export const updateBlog = async (id: string, blog: { title: string; content: string; date: Date; imageUrl: string | null }) => {
  const blogDoc = doc(db, 'blogs', id);
  return await updateDoc(blogDoc, blog);
};

export const deleteBlog = async (id: string) => {
  const blogDoc = doc(db, 'blogs', id);
  return await deleteDoc(blogDoc);
};
