# 3-Tier Portfolio (Cloud Engineer) — Node.js + MySQL + Docker + Jenkins CI/CD

Structure:
- app/                - Node.js Express application
- public/             - Static website (About, Services, Portfolio, Contact)
- docker-compose.yml
- Dockerfile
- Jenkinsfile
- init.sql            - MySQL schema + sample data
- .env.example
- README.md

How to use (local):
1. Copy `.env.example` to `.env` and fill values.
2. Start with Docker Compose:
   ```bash
   docker-compose up --build
   ```
3. App will be available at http://localhost:8080

Notes:
- Jenkinsfile contains a sample pipeline (adjust credentials and Docker registry).
- `init.sql` will initialize the database on first run (docker-compose mounts a volume to load it).
