# 📊 GenderGap

> 🇬🇧 [Read in English](./README.md)

Analisi e visualizzazione del **gender gap** (distribuzione uomini/donne) per area geografica e anno, con particolare attenzione al settore digitale nelle università italiane e in alcune aziende ICT.

🌐 Demo live: http://96.9.214.61:9001

## Funzionalità

- Grafici interattivi filtrabili per anno, regione e variabile
- Dati sulla distribuzione di genere nelle università italiane e nelle aziende ICT
- Dataset estendibile tramite gli script Python inclusi

## Stack Tecnologico

| Livello | Tecnologia |
|---|---|
| Backend | Node.js + Express + MySQL |
| Frontend | React + Vite |
| Grafici | ApexCharts |
| DevOps | Docker + docker-compose |

## Struttura della Repository

```
/
├── BackEnd/           # API, servizi, connessione DB
├── FrontEnd/          # UI React/Vite + grafici
├── python tool/       # Script Python per preparare il dataset
├── docker-compose.yml # Docker per l'intero stack
├── mydata.sql         # Backup dati MySQL
└── README.md
```

## 🚀 Avvio Rapido (Docker — consigliato)

```bash
git clone https://github.com/uCiceroCODE/GenderGap.git
cd GenderGap
docker compose up
```

Poi apri: http://localhost

Per fermare:
```bash
docker compose down
```

## Avvio Manuale (senza Docker)

### 1. MySQL

Importa il dump fornito:
```bash
mysql -u root -p nomedb < mydata.sql
```

### 2. Backend — `BackEnd/.env`

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=nomedb
DB_USER=root
DB_PASSWORD=tuapassword
PORT=8080
NODE_ENV=development
```

```bash
cd BackEnd && npm install && npm run dev
```
Backend disponibile su: http://localhost:8080

### 3. Frontend — `FrontEnd/.env`

```env
VITE_API_URL=http://localhost:8080
```

```bash
cd FrontEnd && npm install && npm run dev
```
Frontend disponibile su: http://localhost:5173

## Come Funziona

1. Il **Backend** legge i dati da MySQL ed espone API REST
2. Il **Frontend** chiama le API e renderizza i grafici interattivi
3. Il **Dataset** può essere esteso o rigenerato con gli script Python inclusi

## Autore

[uCiceroCODE](https://github.com/uCiceroCODE)
