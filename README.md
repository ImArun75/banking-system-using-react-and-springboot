# Banking System (React + Spring Boot)

A small banking proof-of-concept showcasing card-based operations (top-up, withdraw), transaction history, and admin view. Built using a React SPA with two Spring Boot microservices, routed via a gateway service.

---

## Architecture

| Component        | Tech & Purpose |
|------------------|----------------|
| **banking-ui**   | React + TypeScript (Vite). Talks to System 1 (gateway) and System 2 (core) via HTTP. |
| **system1-gateway** | Spring Boot. Exposes `/transaction`, validates input, forwards to core bank service. |
| **system2-corebank** | Spring Boot. Handles card logic & transactions. Exposes `/process`, `/card/{cardNumber}`, `/transactions/**`. |

Each backend can run separately (e.g. Render), frontend as static (e.g. Vercel).

---

## Technologies

**Frontend:** React, TypeScript, Vite, Axios  
**Backend:** Java 17, Spring Boot, Maven, Spring Web, Spring Security (basic config)  
**Deployment:** Docker, Render, Vercel

---

## Prerequisites

- Node.js ≥ 18  
- Java 17+  
- Maven (or `mvnw`)  
- Git

---

## Local Setup

```
git clone https://github.com/<your-username>/banking-system-using-react-and-springboot.git
cd banking-system-using-react-and-springboot

```
---

# Start system2-corebank

```
cd system2-corebank
mvn clean package
mvn spring-boot:run   # http://localhost:8082

```

# Test:

```
curl http://localhost:8082/card/4123456789012345
# {"cardNumber":"4123456789012345","balance":1000.0,"customerName":"John Doe"}


```


# Start system1-gateway

```
cd ../system1-gateway
mvn clean package
mvn spring-boot:run   # http://localhost:8081

```

# Check:

```
# system1-gateway/src/main/resources/application.properties
system2.url=http://localhost:8082


```
# Test:

```
curl -X POST http://localhost:8081/transaction \
  -H "Content-Type: application/json" \
  -d '{ "cardNumber":"4123456789012345", "pin":"1234", "amount":10, "type":"topup" }'

```

# Windows PowerShell(At end):

```
curl -Uri "http://localhost:8081/transaction" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{ "cardNumber":"4123456789012345","pin":"1234","amount":10,"type":"topup" }'


```
---
# Start React Frontend

```
cd ../banking-ui
npm install
npm run dev   # http://localhost:5173

```
# API configuration (banking-ui/src/services/api.ts):
Replace this links with deployed backend both links for frontend deployment
```
const SYSTEM1_API = 'http://localhost:8081';
const SYSTEM2_API = 'http://localhost:8082';

```

---

# UI Features
View card & balance

Top-up or withdraw (PIN required)

Transaction history

Admin view: all transactions

---

# CORS & Security

@CrossOrigin allows http://localhost:5173 during dev

CSRF disabled (POC only)

Security permits: /health, /transaction, /card/**, /transactions/**

For deployment: add deployed frontend origin
