export interface Ticket {
    id: string;
    numeroUnique?: string;
    serialNumber?: string;
    status: 'pending' | 'validated' | 'expired';
    validatedAt?: any;
    validatedBy?: string;
    createdAt?: any;
    eventId?: string;
    userId?: string;
    [key: string]: any; // Pour les autres propriétés possibles
}
