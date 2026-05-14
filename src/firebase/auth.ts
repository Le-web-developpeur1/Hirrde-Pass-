import { 
    signInWithPhoneNumber,
    PhoneAuthProvider,
    signInWithCredential,
  } from 'firebase/auth';
  import { auth } from './config';
  import { getScannerByPhone } from './users';
  
  /**
   * Étape 1 : Vérifier le numéro et envoyer le code SMS
   */
  export const sendSMSCode = async (phoneNumber, recaptchaVerifier) => {
    try {
      // 1. Vérifier si le scanner existe dans Firestore
      const scanner = await getScannerByPhone(phoneNumber);
      
      if (!scanner) {
        throw new Error('PHONE_NOT_REGISTERED');
      }
      
      // Vérifier si le scanner est actif
      if (scanner.hasOwnProperty('isActive') && !scanner.isActive) {
        throw new Error('ACCOUNT_DISABLED');
      }
      
      // 2. Envoyer le code SMS via Firebase
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        recaptchaVerifier
      );
      
      return {
        confirmationResult,
        scanner,
      };
    } catch (error) {
      console.error('Erreur sendSMSCode:', error);
      throw error;
    }
  };
  
  /**
   * Étape 2 : Vérifier le code SMS
   */
  export const verifySMSCode = async (confirmationResult, code) => {
    try {
      const userCredential = await confirmationResult.confirm(code);
      
      // Récupérer le profil scanner
      const scanner = await getScannerByPhone(userCredential.user.phoneNumber);
      
      if (!scanner) {
        await auth.signOut();
        throw new Error('SCANNER_NOT_FOUND');
      }
      
      return {
        user: userCredential.user,
        scanner,
      };
    } catch (error) {
      if (error.code === 'auth/invalid-verification-code') {
        throw new Error('INVALID_CODE');
      }
      throw error;
    }
  };
  
  /**
   * Déconnexion
   */
  export const logout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Erreur logout:', error);
      throw error;
    }
  };
  