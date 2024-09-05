import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: 'planned' | 'in-progress' | 'completed';
}

const roadmapCollectionRef = collection(db, 'roadmap');

export const fetchRoadmapItems = async (): Promise<RoadmapItem[]> => {
  const snapshot = await getDocs(roadmapCollectionRef);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as RoadmapItem));
};

export const addRoadmapItem = async (item: Omit<RoadmapItem, 'id'>): Promise<string> => {
  const docRef = await addDoc(roadmapCollectionRef, item);
  return docRef.id;
};

export const updateRoadmapItem = async (id: string, updates: Partial<RoadmapItem>): Promise<void> => {
  const itemRef = doc(db, 'roadmap', id);
  await updateDoc(itemRef, updates);
};

export const deleteRoadmapItem = async (id: string): Promise<void> => {
  const itemRef = doc(db, 'roadmap', id);
  await deleteDoc(itemRef);
};
