import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { getScannerByPhone } from '../firebase/users';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [scanner, setScanner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser && authUser.phoneNumber) {
        try {
          const scannerData = await getScannerByPhone(authUser.phoneNumber);
          setScanner(scannerData);
          setUser(authUser);
        } catch (error) {
          console.error('Erreur chargement scanner:', error);
          setScanner(null);
          setUser(null);
        }
      } else {
        setUser(null);
        setScanner(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, scanner, loading };
};
