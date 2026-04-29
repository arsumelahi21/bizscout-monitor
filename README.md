# BizScout Monitor — Real-Time Monitoring & Anomaly Detection System

## Overview

BizScout Monitor is a full-stack monitoring system designed to track API performance in real time, detect anomalies using statistical methods, and visualize system behavior through an interactive dashboard.

The system simulates API requests, stores logs, analyzes response times, and highlights unusual patterns using **z-score–based anomaly detection**.

---

## Technology Choices & Reasoning

### Backend

* **Node.js + Express**

  * Chosen for its simplicity, flexibility, and strong ecosystem for building APIs quickly.
  * Well-suited for real-time applications and asynchronous operations (cron jobs, API calls).

* **PostgreSQL (Supabase)**

  * Provides a reliable relational structure for storing logs and querying historical data efficiently.
  * Supabase offers managed hosting, reducing setup complexity.

* **Socket.IO**

  * Enables real-time communication between backend and frontend.
  * Chosen over polling to provide instant updates with better performance.

* **node-cron**

  * Lightweight and easy-to-use scheduler for periodic tasks (API pinging).
  * Suitable for simulating production-like monitoring behavior.

---

## Architecture

### Backend (Node.js + Express)

* REST API (`/api/logs`) with pagination
* Cron-based scheduler to simulate API calls
* PostgreSQL (Supabase) for data storage
* Real-time updates using Socket.IO
* Retry logic for resilient API calls
* Structured logging using a custom logger

### Frontend (React)

* Monitoring dashboard with live updates
* Paginated table of logs
* Connection status indicator
* Anomaly highlighting (visual badges)
* Basic insights (average response time, anomaly count)

---

## Anomaly Detection (AI Feature)

The system implements statistical anomaly detection using:

### Rolling Statistics

* Calculates average and standard deviation over a **1-hour window**

### Z-Score Method

```
zScore = (responseTime - avg) / stddev
```

### Detection Logic

* An anomaly is flagged when:

```
|zScore| > threshold (default: 2)
```

### Fallback Handling

* If standard deviation is zero:

```
responseTime > avg * 1.5
```

### Alerts

* Logs anomaly events with detailed context:

  * response time
  * average
  * standard deviation
  * z-score

---

## Real-Time System

* Backend emits events via Socket.IO
* Frontend listens and updates instantly
* No manual refresh required

---

## Testing

### ✔ Integration Test (Core Functionality)

The `/api/logs` endpoint was selected as the core component because it:

* Retrieves monitoring data
* Supports pagination
* Powers the frontend dashboard

Test validates:

* HTTP status (200)
* Response structure (`data`, `meta`)
* Pagination fields (`total`, `page`, `limit`)

---

## CI/CD Pipeline

Implemented using **GitHub Actions**

### Backend Pipeline

* Install dependencies
* Run tests
* Run ESLint
* Generate coverage report


## Test Coverage

* Coverage generated using Jest
* Reports available in `/backend/coverage`

Run locally:

```bash
cd backend
npm test
```

---

## Code Quality

* ESLint configured for backend
* Enforced in CI pipeline
* Node.js environment properly configured

---

## Setup Instructions

### 1. Clone repo

```bash
git clone https://github.com/arsumelahi21/bizscout-monitor.git
cd bizscout-monitor
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env`:

```env
DB_HOST=...
DB_PORT=...
DB_USER=...
DB_PASSWORD=...
DB_NAME=postgres
```

Run server:

```bash
npm run dev
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```
Create `.env`:

```env
REACT_APP_API_URL=...
REACT_APP_SOCKET_URL=...
```

Run server:

```bash
npm start
```
---

### Database Schema

logs table:
- id
- request
- response
- status
- response_time
- is_anomaly
- created_at

---
## Scheduler

* Uses `node-cron`
* Default interval: every 5 minutes (configurable)

---

## Features Summary

* Real-time monitoring dashboard
* Statistical anomaly detection
* Rolling window analytics
* REST API with pagination
* Retry and error handling
* CI/CD pipeline with linting and coverage

---

## Design Decisions

* **Z-score over simple threshold** → more accurate anomaly detection
* **Rolling window** → adapts to recent behavior
* **Socket.IO** → real-time UX without polling
* **Backend-focused linting/testing** → prioritizes core logic reliability

---

## Trade-offs

* Simple forecasting (`predicted = avg`) instead of advanced time-series models
* Frontend linting skipped to reduce complexity and focus on backend robustness

---

## AI Assistance Disclosure

AI tools were used to assist with boilerplate setup, UI styling, and parts of the anomaly detection logic.

* **Boilerplate Setup**
  Initial structure for both backend and frontend applications was scaffolded with AI assistance.

* **Frontend Styling**
  UI components and styling (Tailwind/CSS structure) were refined with the help of AI to improve visual consistency and responsiveness.

* **Anomaly Detection Logic**
  AI was used as a guide to design and refine the statistical anomaly detection approach (rolling averages, standard deviation, and z-score methodology).

---

### My Contribution

All core logic, architecture decisions, debugging, and integration were implemented and validated manually, including:

* API design and database integration
* Real-time system using Socket.IO
* CI/CD pipeline setup
* Testing strategy and implementation
* Final anomaly detection tuning and validation