import {
    collection,
    doc,
    getDoc,
    getDocs,
    serverTimestamp,
    updateDoc
} from 'firebase/firestore';
import { Ticket } from '../types/ticket';
import { db } from './config';
  
  const COLLECTION = 'tickets';
  
  /**
   * Récupérer un ticket par son ID
   */
  export const getTicketById = async (ticketId: string): Promise<Ticket> => {
    try {
      const ticketDoc = await getDoc(doc(db, COLLECTION, ticketId));
      
      if (!ticketDoc.exists()) {
        throw new Error('TICKET_NOT_FOUND');
      }
      
      return { id: ticketDoc.id, ...ticketDoc.data() } as Ticket;
    } catch (error) {
      console.error('Erreur getTicketById:', error);
      throw error;
    }
  };
  
  /**
   * Valider un ticket
   */
  export const validateTicket = async (ticketId: string, scannerId: string): Promise<{ success: boolean; ticket: Ticket }> => {
    try {
      const ticket = await getTicketById(ticketId);
      
      // Vérifier si le ticket est déjà validé
      if (ticket.status === 'validated') {
        throw new Error('TICKET_ALREADY_VALIDATED');
      }
      
      // Vérifier si le ticket est expiré
      if (ticket.status === 'expired') {
        throw new Error('TICKET_EXPIRED');
      }
      
      // Valider le ticket
      await updateDoc(doc(db, COLLECTION, ticketId), {
        status: 'validated',
        validatedAt: serverTimestamp(),
        validatedBy: scannerId,
      });
      
      return { success: true, ticket };
    } catch (error) {
      console.error('Erreur validateTicket:', error);
      throw error;
    }
  };
  
  /**
   * Récupérer les statistiques des tickets
   */
  export const getTicketStats = async () => {
    try {
      const ticketsSnapshot = await getDocs(collection(db, COLLECTION));
      const total = ticketsSnapshot.size;
      const scanned = ticketsSnapshot.docs.filter(
        doc => doc.data().status === 'validated'
      ).length;
      
      return { total, scanned };
    } catch (error) {
      console.error('Erreur getTicketStats:', error);
      return { total: 0, scanned: 0 };
    }
  };
  