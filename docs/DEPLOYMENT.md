# Deployment Guide

## Quick Start

### Local Development

1. Copy environment file:
```bash
cp .env.example .env
```

2. Add required API keys to `.env`:
```bash
OPENAI_API_KEY=sk-your-key-here
POSTGRES_PASSWORD=your-password
SECRET_KEY=your-secret-key
```

3. Start services:
```bash
docker-compose up
```

4. Access:
- Frontend: http://localhost:3000
- API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Production Deployment

### Prerequisites
- Docker & Docker Compose
- 4GB+ RAM
- Domain name
- SSL certificate

### Steps

1. **Server Setup**
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

2. **Deploy Application**
```bash
git clone https://github.com/InfinityXOneSystems/infinity-matrix.git
cd infinity-matrix
cp .env.example .env
# Edit .env with production values
docker-compose up -d
```

3. **Configure SSL** (using nginx + Let's Encrypt)
```bash
sudo apt install nginx certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

## Monitoring

Check health:
```bash
curl http://localhost:8000/health
```

View logs:
```bash
docker-compose logs -f
```

## Backup

Database backup:
```bash
docker-compose exec postgres pg_dump -U infinity_user infinity_matrix > backup.sql
```

## Troubleshooting

Clear cache:
```bash
docker-compose exec redis redis-cli FLUSHALL
```

Reset:
```bash
docker-compose down -v
docker-compose up -d --build
```

## Security Checklist
- [ ] Configure strong passwords
- [ ] Add API keys
- [ ] Enable SSL/TLS
- [ ] Configure firewall
- [ ] Set up backups
- [ ] Enable monitoring

For detailed deployment instructions, see full documentation.
