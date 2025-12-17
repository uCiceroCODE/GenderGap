# GenderGap

Il progetto é hoststo al segunte indirizzo: http://96.9.214.61:9001

Analisi e visualizzazione del gender gap (distribuzione uomini/donne) per area geografica e anno, con particolare attenzione al settore digitale nelle università italiane e in alcune aziende ICT.
Il progetto include:

* Backend: Node.js + Express + MySQL
* Frontend: React (Vite)
* Grafici: ApexCharts

---

## 📚 Stack Tecnologico

### 🔧 Backend

* Node.js + Express
* MySQL (locale, remoto o via Docker)
* mysql2 per la comunicazione col DB

### 💻 Frontend

* React + Vite
* ApexCharts
* Librerie UI aggiuntive

---

## 📁 Struttura della Repository

/
├── backend/            # API, servizi, connessione DB
├── frontend/           # UI React/Vite + grafici
├── python-tool/        # Script Python per preparare dataset
├── docker-compose.yml  # Docker per l'intero progetto
├── mydata.sql          # Backup MySQL dei dati
└── README.md


---

# 🚀 Avvio del Progetto tramite Docker (Metodo consigliato)

> ✔ Avvio automatico di backend + frontend + MySQL senza configurazioni manuali.

### 1️⃣ Clona la repository

git clone https://github.com/uCiceroCODE/GenderGap.git
cd GenderGap


### 2️⃣ Avvia Docker

Assicurati che Docker sia installato e attivo, poi lancia:

docker compose up


Dopo l’avvio, apri:

http://localhost


Questo avvierà automaticamente frontend, backend e database.

### 💡 Tips

* Devi essere nella cartella del progetto prima di lanciare docker compose up.
* Per fermare tutto:

  bash
  docker compose down
  

---

# 🚀 Avvio Manuale (senza Docker)

> ✔ Avvio separato di MySQL + backend + frontend

---

## 🗄️ 1️⃣ Configurazione MySQL

Puoi usare uno di questi:

* MySQL installato sul tuo PC
* MySQL remoto
* MySQL via Docker (es: docker run -p 3306:3306 mysql:latest)

Crea un database vuoto oppure importa il file fornito:

mysql -u root -p yourdbname < mydata.sql


### Parametri richiesti:

| Variabile   | Descrizione                |
| ----------- | -------------------------- |
| DB_HOST     | Host MySQL (es. localhost) |
| DB_PORT     | Porta MySQL (default 3306) |
| DB_NAME     | Nome DB                    |
| DB_USER     | Utente MySQL               |
| DB_PASSWORD | Password                   |

---

## 🔐 2️⃣ Configura il Backend (backend/.env)

Dentro la cartella backend/ crea il file:

DB_HOST=localhost
DB_PORT=3306
DB_NAME=yourdbname
DB_USER=root
DB_PASSWORD=yourpassword

PORT=8080
NODE_ENV=development


---

## ▶️ 3️⃣ Avvia il Backend

cd backend
npm install
npm run dev


Backend disponibile su:

http://localhost:8080


---

## 💻 4️⃣ Avvia il Frontend

cd ../frontend
npm install
npm run dev


Frontend disponibile su:

http://localhost:5173


> Il numero di porta può cambiare, Vite lo mostra in console.

---

## 🔗 5️⃣ Configurazione Frontend → Backend

Crea il file frontend/.env:

VITE_API_URL=http://localhost:8080


Utilizzo in React:

const api = import.meta.env.VITE_API_URL;


---

# 📊 Come funziona il progetto

1. Backend

   * legge i dati dal database
   * fornisce API REST al frontend

2. Frontend

   * chiama le API
   * genera grafici (ApexCharts)
   * permette filtri e confronti (anni, regioni, valori variabili)

3. Dataset

   * possono essere ampliati o rigenerati con script Python inclusi

---

# 🛠️ Scripts Utili

### Backend

npm run dev


### Frontend

npm run dev
npm run build
npm run preview


---