# 📊 GenderGap

> 🇮🇹 [Leggi in italiano](./README.it.md)

Analysis and visualization of the **gender gap** (male/female distribution) by geographic area and year, with a focus on the digital sector in Italian universities and ICT companies.

🌐 Live demo: http://96.9.214.61:9001

## Features

- Interactive charts filtered by year, region, and variable
- Gender distribution data for Italian universities and ICT companies
- Dataset extensible via included Python scripts

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js + Express + MySQL |
| Frontend | React + Vite |
| Charts | ApexCharts |
| DevOps | Docker + docker-compose |

## Project Structure

```
/
├── BackEnd/           # API, services, DB connection
├── FrontEnd/          # React/Vite UI + charts
├── python tool/       # Python scripts to prepare dataset
├── docker-compose.yml # Docker for the full stack
├── mydata.sql         # MySQL data backup
└── README.md
```

## 🚀 Quick Start (Docker — recommended)

```bash
git clone https://github.com/uCiceroCODE/GenderGap.git
cd GenderGap
docker compose up
```

Then open: http://localhost

To stop:
```bash
docker compose down
```

## Manual Setup (without Docker)

### 1. MySQL

Import the provided dump:
```bash
mysql -u root -p yourdbname < mydata.sql
```

### 2. Backend — `BackEnd/.env`

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=yourdbname
DB_USER=root
DB_PASSWORD=yourpassword
PORT=8080
NODE_ENV=development
```

```bash
cd BackEnd && npm install && npm run dev
```
Backend available at: http://localhost:8080

### 3. Frontend — `FrontEnd/.env`

```env
VITE_API_URL=http://localhost:8080
```

```bash
cd FrontEnd && npm install && npm run dev
```
Frontend available at: http://localhost:5173

## How It Works

1. **Backend** reads data from MySQL and exposes REST APIs
2. **Frontend** calls the APIs and renders interactive charts
3. **Dataset** can be extended or regenerated using the included Python scripts

## Authors

[uCiceroCODE](https://github.com/uCiceroCODE)
