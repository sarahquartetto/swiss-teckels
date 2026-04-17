## Swiss-Teckels API (MongoDB)

### 1) Configure MongoDB Atlas
- Create a cluster
- Create a database user
- Allow your IP (or `0.0.0.0/0` for dev)
- Copy the connection string (MongoDB URI)

### 2) Configure env
Create `server/.env` from `server/.env.example`:

- `MONGODB_URI=...`
- `MONGODB_DB=swiss-teckels`
- `PORT=3001`

### 3) Seed database (loads `src/data/teckels.json`)
From project root:

```bash
cd "server" && npm run seed
```

### 4) Run API
From project root:

```bash
cd "server" && npm run dev
```

Health check:
- `GET /api/health`

Teckels:
- `GET /api/teckels`
- `GET /api/teckels/:id`

