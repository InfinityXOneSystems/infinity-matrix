# Operator Runbook - Infinity Matrix

## Daily Operations

### System Health Check
```bash
# Check system status
npm run status

# Check health endpoints
npm run health

# View logs
docker-compose logs -f
```

### Monitoring Dashboards
- Grafana: http://localhost:3001 (admin/admin)
- Prometheus: http://localhost:9091
- Health Check: http://localhost:8080/health
- Metrics: http://localhost:9090/metrics

## Agent Management

### List All Agents
```bash
npm run agent:list
```

### Deploy New Agent
```bash
npm run agent:deploy -- --agent=<agent-id>
```

### View Agent Logs
```bash
npm run agent:logs -- --agent=<agent-id>
```

### Remove Agent
```bash
npm run agent:remove -- --agent=<agent-id>
```

## Troubleshooting

### System Won't Start
1. Check Docker services: `docker-compose ps`
2. Check logs: `docker-compose logs`
3. Verify environment variables
4. Check port availability

### Agent Failures
1. Check agent logs: `npm run agent:logs`
2. Verify agent manifest
3. Check dependencies
4. Restart agent: `npm run agent:deploy`

### Database Issues
1. Check PostgreSQL: `docker-compose logs postgres`
2. Verify connections
3. Check disk space
4. Run backup: `npm run backup`

### High Memory Usage
1. Check running agents
2. Review cache settings
3. Check for memory leaks
4. Scale resources

## Backup and Recovery

### Manual Backup
```bash
npm run backup
```

### Restore from Backup
```bash
npm run restore -- --backup=<backup-file>
```

### Automated Backups
Configured in `.env`:
- Schedule: Daily at midnight
- Retention: 30 days
- Location: ./backups

## Maintenance

### System Updates
```bash
# Pull latest changes
git pull origin main

# Rebuild
npm run docker:build

# Deploy
npm run docker:up
```

### Log Rotation
Logs are automatically rotated:
- Max size: 10MB per file
- Max files: 5
- Location: ./logs

### Database Maintenance
```bash
# Vacuum database
docker-compose exec postgres psql -U infinity -d infinity_matrix -c "VACUUM ANALYZE;"
```

## Security

### API Key Rotation
1. Generate new key
2. Update `.env`
3. Restart system
4. Update clients

### Certificate Renewal
1. Obtain new certificate
2. Update configuration
3. Restart gateways
4. Verify connections

## Scaling

### Horizontal Scaling
```bash
# Scale specific service
docker-compose up -d --scale infinity-matrix=3
```

### Vertical Scaling
Update `docker-compose.yml`:
```yaml
deploy:
  resources:
    limits:
      cpus: '4'
      memory: 8G
```

## Alerts

Common alerts and responses:

### High CPU Usage
- Check running workloads
- Scale horizontally
- Optimize queries

### High Memory Usage
- Clear cache
- Restart service
- Scale vertically

### Agent Failure
- Check logs
- Restart agent
- Verify dependencies

### Database Connection Issues
- Check connection pool
- Verify credentials
- Restart database

## Emergency Procedures

### System Crash
1. Check logs immediately
2. Identify root cause
3. Restore from last good state
4. Document incident

### Data Corruption
1. Stop affected services
2. Restore from backup
3. Verify data integrity
4. Resume operations

### Security Breach
1. Isolate affected systems
2. Rotate all credentials
3. Run security audit
4. Implement fixes
5. Resume with monitoring

## Performance Tuning

### Database Optimization
- Add indexes for slow queries
- Adjust connection pool size
- Enable query caching
- Regular VACUUM

### Cache Optimization
- Adjust TTL settings
- Monitor hit rates
- Increase cache size if needed
- Use cache warming

### Agent Optimization
- Profile agent performance
- Optimize workflows
- Adjust parallelism
- Resource allocation

## Monitoring Checklist

Daily:
- [ ] System health check
- [ ] Review error logs
- [ ] Check backup status
- [ ] Verify agent status

Weekly:
- [ ] Review performance metrics
- [ ] Check disk space
- [ ] Analyze slow queries
- [ ] Update dependencies

Monthly:
- [ ] Review security logs
- [ ] Compliance audit
- [ ] Capacity planning
- [ ] Documentation updates

## Support Contacts

- System Issues: support@infinityxone.systems
- Security Issues: security@infinityxone.systems
- Documentation: docs.infinityxone.systems
- Community: community.infinityxone.systems
