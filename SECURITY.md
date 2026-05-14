# 🔒 Configuration de sécurité

## Variables d'environnement

Ce projet utilise des variables d'environnement pour protéger les clés sensibles Firebase.

### Installation

1. Copie le fichier `.env.example` vers `.env` :
   ```bash
   cp .env.example .env
   ```

2. Remplis le fichier `.env` avec tes vraies clés Firebase :
   ```
   EXPO_PUBLIC_FIREBASE_API_KEY=ta_vraie_clé_ici
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=ton_domaine_ici
   # ... etc
   ```

3. **IMPORTANT** : Ne commit JAMAIS le fichier `.env` sur GitHub !

### Sécurité Firebase

Si tes clés ont été exposées sur GitHub :

1. **Va sur Firebase Console** : https://console.firebase.google.com
2. **Sélectionne ton projet** : hirrde-pass
3. **Paramètres du projet** → **Général**
4. **Régénère tes clés API** ou **Restreins l'accès** :
   - Ajoute des restrictions d'application (Android/iOS package names)
   - Configure les règles Firestore pour limiter l'accès
   - Active App Check pour plus de sécurité

### Règles Firestore recommandées

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Seuls les scanners authentifiés peuvent lire/écrire
    match /tickets/{ticketId} {
      allow read, write: if request.auth != null;
    }
    
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if false; // Seuls les admins via console
    }
  }
}
```

## Notes

- Le fichier `.env` est ignoré par Git (voir `.gitignore`)
- Le fichier `.env.example` est un template sans vraies clés
- Expo charge automatiquement les variables avec le préfixe `EXPO_PUBLIC_`
