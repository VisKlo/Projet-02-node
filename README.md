# FurnitureManager

## Description

**FurnitureManager** est une application web full-stack pour la gestion de meubles, matériaux et fournisseurs.  
Elle propose un tableau de bord avec statistiques et graphiques, une gestion complète des entités, et une interface basée sur React et Bootstrap 5.

---

## Fonctionnalités principales

- Gestion des meubles, matériaux, fournisseurs
- Tableau de bord avec graphiques (barres, camembert) des stocks et catégories
- Authentification utilisateur (login/logout)
- Interface responsive avec Bootstrap 5 Admin Dashboard Theme
- API REST sécurisée avec Express et Sequelize
- Mise à jour des stocks avec contrôle d’inventaire

---

## Technologies utilisées

- Frontend  
  - React  
  - React Router  
  - Axios  
  - Bootstrap 5  
  - Chart.js (Bar, Pie charts)  
  - Bootstrap Icons

- Backend  
  - Node.js  
  - Express.js  
  - Sequelize 
  - MySQL
  - Middleware d’authentification JWT  

---

## Installation

### Prérequis

- Node.js
- npm ou yarn
- Une base de données compatible Sequelize configurée (MySQL/PostgreSQL/SQLite)

### Frontend

- Le frontend tourne sur http://localhost:3000

### Backend

- L’API tourne sur http://localhost:5000

## Configuration
- Crée un fichier .env dans back-end avec les variables d’environnement :

```bash

    DB_HOST=
    DB_PORT=
    DB_NAME=
    DB_USER=
    DB_PASSWORD=
    JWT_SECRET=
    PORT=
    NODE_ENV=

```

- La base de données doit être accessible et initialisée.

## Structure du projet

```bash
/server      # Serveur Express + API REST
  /config       # Configuration DB
  /models       # Modèles Sequelize
  /routes       # Routes API
  /middleware   # Middleware (auth)
  server.js     # Point d’entrée backend

/src         # Application React
  /components   # Composants React (Sidebar, Navbar, Modal)
  /contexts     # Contexte Authentification
  /pages        # Page (Dashboard, Login, ect...)
  App.jsx
  main.jsx
```