# 🚨 Nettoyer l'historique Git (Clés exposées)

## Étapes à suivre IMMÉDIATEMENT

### 1. Régénérer les clés Firebase (PRIORITÉ)

**Va sur Firebase Console** :
1. https://console.firebase.google.com
2. Sélectionne "hirrde-pass"
3. ⚙️ Paramètres du projet → Général
4. Dans "Vos applications", clique sur l'app web
5. **Régénère l'API Key** ou **Restreins l'accès**

**Restrictions recommandées** :
- Ajoute des restrictions HTTP referrers
- Active App Check
- Configure les règles Firestore strictes

### 2. Supprimer les clés de l'historique Git

**Option A : Supprimer le fichier de l'historique (Recommandé)**

```bash
# Installer BFG Repo-Cleaner (plus rapide que git filter-branch)
# Télécharge depuis : https://rtyley.github.io/bfg-repo-cleaner/

# Ou utilise git filter-branch
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch src/firebase/config.ts" \
  --prune-empty --tag-name-filter cat -- --all

# Forcer le push
git push origin --force --all
```

**Option B : Supprimer tout l'historique et recommencer**

```bash
# Sauvegarder le code actuel
cd ..
cp -r hirrde-pass hirrde-pass-backup

# Dans le projet
cd hirrde-pass

# Supprimer .git
rm -rf .git

# Réinitialiser Git
git init
git add .
git commit -m "Initial commit with secure config"

# Forcer le push sur GitHub
git remote add origin https://github.com/TON_USERNAME/hirrde-pass.git
git push -u --force origin main
```

### 3. Vérifier que .env est ignoré

```bash
# Vérifier que .env n'est pas tracké
git status

# Si .env apparaît, le supprimer du cache
git rm --cached .env
git commit -m "Remove .env from tracking"
git push
```

### 4. Mettre à jour le .env local

```bash
# Copier le template
cp .env.example .env

# Éditer avec les NOUVELLES clés Firebase
nano .env  # ou code .env
```

### 5. Tester l'application

```bash
# Nettoyer le cache
npm start -- --clear

# Ou
expo start -c
```

## ⚠️ IMPORTANT

- ✅ Le fichier `.env` est maintenant dans `.gitignore`
- ✅ Le fichier `config.ts` utilise maintenant `process.env`
- ✅ Le fichier `.env.example` est un template sans vraies clés
- ❌ Ne commit JAMAIS le fichier `.env`
- ❌ Les anciennes clés dans l'historique Git sont toujours visibles

## Vérification finale

```bash
# Vérifier qu'aucune clé n'est dans le code
grep -r "AIzaSyBUVMhx3hOy66bIcHONsZrRqwbV_5lwCO0" .

# Si ça retourne quelque chose, il faut nettoyer
```

## Ressources

- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
- [GitHub: Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
