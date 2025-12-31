# Production Deployment Checklist

## Pre-Deployment

### Environment Configuration
- [ ] Copy `.env.example` to `.env` in both frontend and backend
- [ ] Set strong `JWT_SECRET` (minimum 32 characters)
- [ ] Configure AI provider API keys:
  - [ ] `OPENAI_API_KEY` (if using OpenAI)
  - [ ] `ANTHROPIC_API_KEY` (if using Anthropic)
  - [ ] `OLLAMA_URL` (if using Ollama)
- [ ] Set `CORS_ORIGIN` to production domain
- [ ] Configure GitHub integration (if needed):
  - [ ] `GITHUB_TOKEN`
  - [ ] `GITHUB_APP_ID`
  - [ ] `GITHUB_APP_PRIVATE_KEY`
- [ ] Set `NODE_ENV=production` in backend

### Security
- [ ] Review and update all default passwords/secrets
- [ ] Ensure `.env` files are in `.gitignore`
- [ ] Configure firewall rules on server
- [ ] Set up fail2ban or similar intrusion prevention
- [ ] Enable rate limiting in production
- [ ] Configure HTTPS/SSL certificates
- [ ] Review CORS settings
- [ ] Enable security headers (helmet.js)

### Infrastructure
- [ ] Server meets minimum requirements:
  - [ ] 2+ CPU cores
  - [ ] 4GB+ RAM
  - [ ] 20GB+ disk space
  - [ ] Docker 20.10+
  - [ ] Docker Compose 2.0+
- [ ] DNS records configured
- [ ] SSL certificates obtained (Let's Encrypt recommended)
- [ ] Backup strategy in place
- [ ] Monitoring tools configured

### Testing
- [ ] Run all unit tests: `npm test`
- [ ] Run integration tests: `./test-integration.sh`
- [ ] Test Docker builds locally
- [ ] Verify health check endpoints
- [ ] Test WebSocket connections
- [ ] Test AI provider integrations
- [ ] Perform load testing
- [ ] Test backup/restore procedures

## Deployment Steps

### 1. Initial Server Setup

```bash
# Connect to server
ssh user@your-server.com

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Log out and back in for group changes to take effect
```

### 2. Clone Repository

```bash
# Clone the repository
git clone https://github.com/InfinityXOneSystems/infinity-matrix.git
cd infinity-matrix

# Checkout production branch
git checkout main
```

### 3. Configure Environment

```bash
# Backend configuration
cp backend/.env.example backend/.env
nano backend/.env
# Update all required variables

# Frontend configuration  
cp frontend/.env.example frontend/.env
nano frontend/.env
# Update API URLs to production domain
```

### 4. Build and Deploy

```bash
# Make launch script executable
chmod +x launch.sh

# Launch the system
./launch.sh

# Or manually with docker-compose
docker-compose up -d --build
```

### 5. Verify Deployment

```bash
# Check container status
docker-compose ps

# Check logs
docker-compose logs -f

# Test health endpoint
curl http://localhost:3000/health

# Test frontend
curl http://localhost
```

### 6. Configure SSL (Production)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

### 7. Set Up Auto-Start

```bash
# Create systemd service
sudo nano /etc/systemd/system/infinity-matrix.service
```

Add:
```ini
[Unit]
Description=Infinity Matrix Admin System
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/user/infinity-matrix
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
User=user

[Install]
WantedBy=multi-user.target
```

Enable service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable infinity-matrix
sudo systemctl start infinity-matrix
```

## Post-Deployment

### Verification
- [ ] Frontend accessible at domain
- [ ] Backend API responding
- [ ] WebSocket connections working
- [ ] AI chat functional
- [ ] Agent management working
- [ ] Real-time updates functioning
- [ ] Health checks passing
- [ ] SSL certificate valid
- [ ] All services running

### Monitoring Setup
- [ ] Configure log aggregation
- [ ] Set up uptime monitoring
- [ ] Configure alerting (email/SMS)
- [ ] Set up performance monitoring
- [ ] Configure error tracking (Sentry, etc.)
- [ ] Set up log rotation

### Documentation
- [ ] Document production URLs
- [ ] Document admin credentials
- [ ] Document monitoring dashboards
- [ ] Document backup locations
- [ ] Create incident response plan
- [ ] Document rollback procedures

## Maintenance

### Regular Tasks
- [ ] Weekly: Review logs for errors
- [ ] Weekly: Check disk space
- [ ] Weekly: Review security alerts
- [ ] Monthly: Update dependencies
- [ ] Monthly: Review performance metrics
- [ ] Monthly: Test backup restoration
- [ ] Quarterly: Security audit
- [ ] Quarterly: Load testing

### Update Procedure

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up -d --build

# Verify deployment
curl http://localhost:3000/health
```

### Rollback Procedure

```bash
# Stop current version
docker-compose down

# Checkout previous version
git checkout <previous-commit>

# Rebuild and start
docker-compose up -d --build

# Verify
curl http://localhost:3000/health
```

## Troubleshooting

### Common Issues

**Containers won't start:**
```bash
# Check logs
docker-compose logs

# Check Docker status
sudo systemctl status docker

# Restart Docker
sudo systemctl restart docker
```

**Database connection errors:**
```bash
# Check environment variables
docker-compose exec backend printenv

# Verify database container is running
docker-compose ps
```

**Performance issues:**
```bash
# Check resource usage
docker stats

# Check system resources
htop

# Review logs for bottlenecks
docker-compose logs backend | grep -i slow
```

## Emergency Contacts

- **System Admin**: [contact info]
- **DevOps Team**: [contact info]
- **On-Call Engineer**: [contact info]

## Resources

- [Operator Runbook](OPERATOR_RUNBOOK.md)
- [Testing Guide](TESTING_GUIDE.md)
- [README](README.md)
- [GitHub Repository](https://github.com/InfinityXOneSystems/infinity-matrix)

---

**Deployment Date**: _____________
**Deployed By**: _____________
**Production URL**: _____________
**Backup Location**: _____________

**Version**: 1.0.0
**Last Updated**: December 2025
