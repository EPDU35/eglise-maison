# 🚀 Guide de déploiement sur Vercel

## Étape 1 — MongoDB Atlas (base de données gratuite)

1. Va sur https://cloud.mongodb.com et crée un compte
2. Clique **"Build a Database"** → choisis **"Free"**
3. Choisis une région proche (ex: Europe)
4. Dans **"Security"** → **"Database Access"** → crée un utilisateur avec un mot de passe
5. Dans **"Network Access"** → **"Add IP Address"** → clique **"Allow Access from Anywhere"** (`0.0.0.0/0`)
6. Dans **"Database"** → clique **"Connect"** → **"Drivers"** → copie l'URI :
   ```
   mongodb+srv://TON_USER:TON_MOT_DE_PASSE@cluster0.xxxxx.mongodb.net/eglise-maison
   ```

---

## Étape 2 — GitHub

1. Va sur https://github.com et crée un nouveau dépôt (repository)
2. Mets le contenu de ce dossier dedans (upload les fichiers)

---

## Étape 3 — Vercel

1. Va sur https://vercel.com et connecte-toi avec GitHub
2. Clique **"Add New Project"** → sélectionne ton dépôt GitHub
3. Clique **"Environment Variables"** et ajoute :

   | Nom | Valeur |
   |-----|--------|
   | `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/eglise-maison` |
   | `JWT_SECRET` | `egliseMaisonDaloa2024SecretKey` |

4. Clique **"Deploy"** ✅

---

## Étape 4 — Initialiser l'admin

Une seule fois après le déploiement, appelle cette URL dans ton navigateur ou Postman :

```
POST https://TON-PROJET.vercel.app/api/auth/init
```

Ou avec fetch dans la console du navigateur :
```js
fetch('https://TON-PROJET.vercel.app/api/auth/init', { method: 'POST' })
```

Cela crée le compte admin par défaut :
- **Identifiant :** `regioaké`
- **Mot de passe :** `1205`

---

## Identifiants par défaut
- **Identifiant :** regioaké  
- **Mot de passe :** 1205
