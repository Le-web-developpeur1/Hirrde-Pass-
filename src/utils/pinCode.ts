/**
 * Générer un code PIN aléatoire à 6 chiffres
 */
export const generatePinCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Valider un code PIN (doit être 6 chiffres)
 */
export const isValidPinCode = (pin: string): boolean => {
  return /^\d{6}$/.test(pin);
};
