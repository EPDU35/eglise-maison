# Guide de Déploiement - Église De Maison

## Structure du Projet

```
eglise-maison/
├── frontend/
│   ├── index.html
│   ├── admin-login.html
│   ├── admin.html
│   ├── style.css
│   ├── admin-style.css
│   ├── config.js
│   ├── register.js
│   ├── login.js
│   └── admin.js
└── backend/
    ├── server.js
    ├── package.json
    ├── vercel.json
    ├── .env
    ├── models/
    │   ├── User.js
    │   └── Inscrit.js
    ├── routes/
    │   ├── auth.js
    │   ├── inscrits.js
    │   └── users.js
    └── middleware/
        └── auth.js
```

## Déploiement Backend sur Vercel

### 1. Préparer MongoDB Atlas

1. Créer un compte sur https://www.mongodb.com/cloud/atlas
2. Créer un cluster gratuit
3. Créer un utilisateur de base de données
4. Whitelist toutes les IP (0.0.0.0/0)
5. Copier l'URI de connexion

### 2. Déployer sur Vercel

```bash
cd backend
npm install -g vercel
vercel login
vercel
```

### 3. Configurer les variables d'environnement

Dans le dashboard Vercel:
- MONGODB_URI: votre URI MongoDB Atlas
- JWT_SECRET: une chaîne aléatoire sécurisée
- FRONTEND_URL: URL de votre frontend

### 4. Initialiser l'utilisateur par défaut

Après déploiement, faire une requête POST:
```
POST https://votre-backend.vercel.app/api/auth/init
```

## Déploiement Frontend sur Vercel

### 1. Mettre à jour config.js

```javascript
const API_CONFIG = {
    BASE_URL: 'https://votre-backend.vercel.app/api',
    // ...
};
```

### 2. Déployer

```bash
cd frontend
vercel
```

## Configuration DNS (Optionnel)

Pour utiliser un domaine personnalisé:
1. Aller dans Settings > Domains sur Vercel
2. Ajouter votre domaine
3. Configurer les DNS selon les instructions

## Vérification

1. Tester l'inscription publique
2. Tester la connexion admin (regioaké / 1205)
3. Vérifier toutes les fonctionnalités

## Maintenance

### Logs
```bash
vercel logs
```

### Redéploiement
```bash
vercel --prod
```

## Support

Développé par Eliel Poster
Website: https://elielposter.com