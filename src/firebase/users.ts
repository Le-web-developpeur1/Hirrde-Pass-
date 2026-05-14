import { collection, getDocs, query, where } from 'firebase/firestore';
import { Scanner } from '../navigation/types';
import { db } from './config';

const COLLECTION = 'users';

/**
 * Récupérer un scanner par son numéro de téléphone
 */
export const getScannerByPhone = async (phoneNumber: string): Promise<Scanner | null> => {
  try {
    const q = query(
      collection(db, COLLECTION),
      where('phoneNumber', '==', phoneNumber),
      where('role', '==', 'scanner')
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return null;
    }
    
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Scanner;
  } catch (error) {
    console.error('Erreur getScannerByPhone:', error);
    throw error;
  }
};
