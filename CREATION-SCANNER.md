# 📱 Création d'un Scanner avec Code PIN

## 🔐 Structure d'un Scanner dans Firestore

Quand tu crées un nouveau scanner dans la collection `users`, voici les champs requis :

```javascript
{
  nom: "Scanner 1",              // Nom du scanner
  email: "scanner01@gmail.com",  // Email
  phoneNumber: "+224626058033",  // Numéro de téléphone (format international)
  role: "scanner",               // Rôle (toujours "scanner")
  isActive: true,                // Statut actif/inactif
  eventAssigned: "eventId123",   // ID de l'événement assigné
  pinCode: "123456"              // Code PIN à 6 chiffres
}
```

## 🎯 Génération automatique du PIN

### Option 1 : Générer un PIN aléatoire (Recommandé)

Utilise la fonction `generatePinCode()` :

```javascript
import { generatePinCode } from './src/utils/pinCode';

const newScanner = {
  nom: "Scanner 2",
  email: "scanner02@gmail.com",
  phoneNumber: "+224620000000",
  role: "scanner",
  isActive: true,
  eventAssigned: "eventId123",
  pinCode: generatePinCode() // Génère un PIN aléatoire comme "847392"
};
```

### Option 2 : Définir un PIN personnalisé

```javascript
const newScanner = {
  nom: "Scanner 3",
  email: "scanner03@gmail.com",
  phoneNumber: "+224621111111",
  role: "scanner",
  isActive: true,
  eventAssigned: "eventId123",
  pinCode: "654321" // PIN personnalisé
};
```

## 📋 Exemple de création dans Firebase Console

1. Va dans **Firestore Database**
2. Ouvre la collection `users`
3. Clique sur **Ajouter un document**
4. Remplis les champs :
   - `nom` : "Scanner Test"
   - `email` : "test@gmail.com"
   - `phoneNumber` : "+224626058033"
   - `role` : "scanner"
   - `isActive` : true
   - `eventAssigned` : "ton_event_id"
   - `pinCode` : "123456"

## 🔑 Code PIN par défaut

Si un scanner n'a pas de `pinCode` dans Firestore, le code par défaut est **123456**.

## ⚠️ Important

- Le PIN doit être **exactement 6 chiffres**
- Le numéro de téléphone doit être au **format international** (+224...)
- Le `role` doit être **"scanner"** (en minuscules)
- L'`eventAssigned` doit correspondre à un événement existant

## 🔄 Réinitialiser un PIN

Pour réinitialiser le PIN d'un scanner :

1. Va dans Firestore
2. Trouve le document du scanner dans `users`
3. Modifie le champ `pinCode` avec un nouveau code
4. Le scanner pourra se connecter avec le nouveau PIN
