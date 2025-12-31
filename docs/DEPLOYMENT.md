# Deployment Guide - Infinity Matrix

This guide covers deploying Infinity Matrix to production environments.

## Production Checklist

Before deploying to production:

- [ ] Change `SECRET_KEY` in environment variables
- [ ] Set `ENVIRONMENT=production`
- [ ] Configure production database (PostgreSQL)
- [ ] Set up Redis for caching
- [ ] Configure SSL/TLS certificates
- [ ] Set up monitoring and alerting
- [ ] Configure backup strategy
- [ ] Review security settings
- [ ] Set up CI/CD pipeline
- [ ] Configure logging aggregation

## Deployment Options

### Option 1: Docker Compose

**Step 1: Create docker-compose.yml**

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8000:8000"
    environment:
      - ENVIRONMENT=production
      - DATABASE_URL=postgresql://user:pass@db:5432/infinity
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis
    restart: unless-stopped

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=infinity
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    restart: unless-stopped

volumes:
  postgres_data:
```

**Step 2: Deploy**

```bash
docker-compose up -d
```

### Option 2: Kubernetes

**Step 1: Create deployment.yaml**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: infinity-matrix
spec:
  replicas: 3
  selector:
    matchLabels:
      app: infinity-matrix
  template:
    metadata:
      labels:
        app: infinity-matrix
    spec:
      containers:
      - name: infinity-matrix
        image: infinityxone/infinity-matrix:latest
        ports:
        - containerPort: 8000
        env:
        - name: ENVIRONMENT
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: infinity-secrets
              key: database-url
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5
```

**Step 2: Deploy**

```bash
kubectl apply -f k8s/
```

### Option 3: Traditional Server

**Step 1: Install Dependencies**

```bash
# Install system dependencies
sudo apt-get update
sudo apt-get install -y python3.9 python3-pip redis-server postgresql

# Create application user
sudo useradd -m -s /bin/bash infinity

# Switch to application user
sudo su - infinity
```

**Step 2: Set Up Application**

```bash
# Clone repository
git clone https://github.com/InfinityXOneSystems/infinity-matrix.git
cd infinity-matrix

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -e .

# Configure environment
cp .env.example .env
nano .env  # Edit configuration
```

**Step 3: Set Up Systemd Service**

```ini
# /etc/systemd/system/infinity-matrix.service
[Unit]
Description=Infinity Matrix AI System
After=network.target

[Service]
Type=notify
User=infinity
WorkingDirectory=/home/infinity/infinity-matrix
Environment="PATH=/home/infinity/infinity-matrix/venv/bin"
ExecStart=/home/infinity/infinity-matrix/venv/bin/python -m infinity_matrix.main
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

**Step 4: Start Service**

```bash
sudo systemctl daemon-reload
sudo systemctl enable infinity-matrix
sudo systemctl start infinity-matrix
sudo systemctl status infinity-matrix
```

## Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## SSL/TLS Configuration

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

## Monitoring

### Prometheus

Add to `prometheus.yml`:

```yaml
scrape_configs:
  - job_name: 'infinity-matrix'
    static_configs:
      - targets: ['localhost:9090']
```

### Grafana Dashboard

Import the provided Grafana dashboard from `monitoring/grafana-dashboard.json`

## Backup Strategy

### Database Backups

```bash
# Automated backup script
#!/bin/bash
BACKUP_DIR="/backups/infinity-matrix"
DATE=$(date +%Y%m%d_%H%M%S)

# Backup PostgreSQL
pg_dump -U infinity infinity_db | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Keep last 30 days
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +30 -delete
```

### Application State Backups

```bash
# Backup logs and data
tar -czf /backups/infinity-matrix/data_$DATE.tar.gz \
    /home/infinity/infinity-matrix/logs \
    /home/infinity/infinity-matrix/workspace
```

## Scaling

### Horizontal Scaling

```bash
# Increase workers
python -m infinity_matrix.main --workers 8

# Or use multiple instances with load balancer
```

### Load Balancing

Use Nginx, HAProxy, or cloud load balancers to distribute traffic across multiple instances.

## Security

### Firewall Configuration

```bash
# Allow only necessary ports
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

### Security Headers

Add to Nginx configuration:

```nginx
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
add_header Strict-Transport-Security "max-age=31536000";
```

## Troubleshooting

### Check Logs

```bash
# Application logs
journalctl -u infinity-matrix -f

# Nginx logs
tail -f /var/log/nginx/error.log
```

### Performance Issues

```bash
# Check resource usage
htop

# Check database performance
psql -U infinity -d infinity_db -c "SELECT * FROM pg_stat_activity;"
```

### Common Issues

**Issue**: Service won't start
```bash
# Check service status
systemctl status infinity-matrix

# Check logs
journalctl -u infinity-matrix -n 50
```

**Issue**: High memory usage
```bash
# Reduce workers or optimize code
# Monitor with: htop or ps aux --sort=-%mem
```

## Maintenance

### Updates

```bash
# Pull latest changes
git pull origin main

# Install dependencies
pip install -e .

# Restart service
sudo systemctl restart infinity-matrix
```

### Database Migrations

```bash
# Run migrations
alembic upgrade head
```

## Support

For deployment support:
- 📧 Email: ops@infinityxone.com
- 💬 Discord: [Join our community](https://discord.gg/infinityxone)
- 📖 Docs: [Full Documentation](https://github.com/InfinityXOneSystems/infinity-matrix/wiki)
