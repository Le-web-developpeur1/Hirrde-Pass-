# 🚨 ACTIONS URGENTES - Clés Firebase exposées

## ⚡ À FAIRE MAINTENANT (dans l'ordre)

### 1️⃣ RÉGÉNÉRER LES CLÉS FIREBASE (5 min)

**Option A : Restreindre l'accès (Rapide)**
1. Va sur https://console.firebase.google.com
2. Sélectionne "hirrde-pass"
3. ⚙️ Paramètres → Général → Tes applications
4. Clique sur l'icône ⚙️ de ton app web
5. **Restrictions d'API Key** :
   - Ajoute : `localhost`, `*.expo.dev`, `*.expo.io`
   - Active "Restrict key to specific APIs"
   - Sélectionne uniquement les APIs que tu utilises

**Option B : Créer une nouvelle app (Plus sûr)**
1. Dans Firebase Console
2. Ajoute une nouvelle app Web
3. Copie les nouvelles clés dans `.env`
4. Supprime l'ancienne app

### 2️⃣ METTRE À JOUR LE FICHIER .env (1 min)

```bash
# Ouvre le fichier .env
code .env

# Remplace avec les NOUVELLES clés Firebase
```

### 3️⃣ NETTOYER L'HISTORIQUE GIT (2 options)

**Option Simple (Recommandée si peu de commits)** :
```bash
# Supprimer l'historique et recommencer
rm -rf .git
git init
git add .
git commit -m "Initial commit - Secure config"
git remote add origin https://github.com/TON_USERNAME/hirrde-pass.git
git push -u --force origin main
```

**Option Avancée (Garder l'historique)** :
```bash
# Supprimer le fichier de l'historique
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch src/firebase/config.ts" \
  --prune-empty --tag-name-filter cat -- --all

git push origin --force --all
```

### 4️⃣ COMMIT LES CHANGEMENTS (1 min)

```bash
# Ajouter les fichiers (SAUF .env qui est ignoré)
git add .gitignore
git add src/firebase/config.ts
git add .env.example
git add SECURITY.md
git add src/types/
git add src/firebase/
git add src/navigation/
git add src/screens/

# Commit
git commit -m "feat: Secure Firebase config with environment variables

- Move Firebase keys to .env file
- Add .env to .gitignore
- Add .env.example template
- Add TypeScript interfaces for better type safety
- Fix all TypeScript errors
- Add security documentation"

# Push
git push
```

### 5️⃣ VÉRIFIER QUE .env N'EST PAS TRACKÉ

```bash
# Vérifier
git status

# Le fichier .env ne doit PAS apparaître
# Si il apparaît :
git rm --cached .env
git commit -m "Remove .env from tracking"
git push
```

### 6️⃣ CONFIGURER LES RÈGLES FIRESTORE (5 min)

Dans Firebase Console → Firestore Database → Rules :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Tickets : lecture/écriture pour utilisateurs authentifiés
    match /tickets/{ticketId} {
      allow read: if request.auth != null;
      allow update: if request.auth != null 
                    && request.resource.data.status == 'validated';
    }
    
    // Users : lecture seule pour authentifiés
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if false; // Admin only via console
    }
  }
}
```

## ✅ VÉRIFICATION FINALE

```bash
# 1. Vérifier qu'aucune clé n'est dans le code
grep -r "AIzaSyBUVMhx3hOy66bIcHONsZrRqwbV_5lwCO0" src/

# 2. Vérifier que .env est ignoré
git check-ignore .env
# Doit retourner : .env

# 3. Tester l'app
npm start -- --clear
```

## 📝 RÉSUMÉ DES CHANGEMENTS

✅ **Fichiers créés** :
- `.env` - Contient les vraies clés (ignoré par Git)
- `.env.example` - Template sans clés (commité)
- `SECURITY.md` - Documentation sécurité
- `src/types/ticket.ts` - Interface TypeScript

✅ **Fichiers modifiés** :
- `.gitignore` - Ajoute `.env`
- `src/firebase/config.ts` - Utilise `process.env`
- Tous les fichiers TypeScript - Corrections d'erreurs

✅ **Sécurité** :
- Clés Firebase dans `.env` (non commité)
- `.env` dans `.gitignore`
- Types TypeScript pour plus de sécurité

## 🆘 BESOIN D'AIDE ?

Si tu as des questions ou problèmes :
1. Lis `SECURITY.md` pour plus de détails
2. Lis `fix-git-history.md` pour nettoyer l'historique
3. Contacte-moi si besoin

## ⏱️ TEMPS TOTAL : ~15 minutes
