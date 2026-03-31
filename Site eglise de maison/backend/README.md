# Église De Maison - Région de Daloa

Système de gestion des inscriptions des membres avec interface d'administration.

## Stack Technique

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla)
- Design: Noir et blanc minimaliste

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Bcrypt

## Fonctionnalités

### Interface Publique
- Formulaire d'inscription complet
- Validation des données
- Confirmation d'inscription
- Design responsive

### Interface Administration
- Authentification sécurisée
- Gestion des inscriptions (CRUD)
- Recherche et filtres avancés
- Statistiques en temps réel
- Gestion des utilisateurs admin
- Changement de mot de passe
- Export CSV

## Installation Locale

### Prérequis
- Node.js v14+
- MongoDB

### Backend

```bash
cd backend
npm install
```

Créer `.env`:
```
MONGODB_URI=mongodb://localhost:27017/eglise-maison
JWT_SECRET=votre_secret_securise
PORT=5000
```

Démarrer:
```bash
npm start
```

Initialiser l'utilisateur par défaut:
```bash
POST http://localhost:5000/api/auth/init
```

### Frontend

Modifier `config.js`:
```javascript
BASE_URL: 'http://localhost:5000/api'
```

Ouvrir `index.html` dans le navigateur.

## Déploiement Production

Voir `DEPLOYMENT.md` pour les instructions détaillées.

## Identifiants par Défaut

- Identifiant: regioaké
- Mot de passe: 1205

## Sécurité

- Mots de passe hashés avec bcrypt
- Authentification JWT
- Sessions sécurisées
- Validation des données
- Protection CORS

## API Endpoints

### Public
- POST `/api/inscrits` - Créer une inscription

### Privé (nécessite token)
- POST `/api/auth/login` - Connexion
- GET `/api/inscrits` - Liste des inscrits
- GET `/api/inscrits/stats` - Statistiques
- PUT `/api/inscrits/:id` - Modifier
- DELETE `/api/inscrits/:id` - Supprimer
- GET `/api/users` - Liste utilisateurs
- POST `/api/users` - Créer utilisateur
- PUT `/api/users/password` - Changer mot de passe
- DELETE `/api/users/:id` - Supprimer utilisateur

## Structure Base de Données

### Collection: users
```javascript
{
  identifiant: String,
  password: String (hashed),
  role: String,
  dateCreation: Date
}
```

### Collection: inscrits
```javascript
{
  nom: String,
  prenoms: String,
  sexe: String,
  dateNaissance: Date,
  lieuNaissance: String,
  zone: String,
  egliseLocale: String,
  direction: String,
  responsabilite: String,
  contact: String,
  dateInscription: Date
}
```

## Développeur

Eliel Poster  
https://elielposter.com

## License

Propriétaire - Église De Maison Région de Daloa