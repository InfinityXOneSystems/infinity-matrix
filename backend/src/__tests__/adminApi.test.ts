import request from 'supertest';
import express from 'express';
import adminRoutes from '../routes/adminRoutes';

const app = express();
app.use(express.json());
app.use('/api', adminRoutes);

describe('Admin API Endpoints', () => {
  describe('GET /api/agents', () => {
    it('should return list of agents', async () => {
      const response = await request(app)
        .get('/api/agents')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should return agents with correct structure', async () => {
      const response = await request(app)
        .get('/api/agents')
        .expect(200);

      const agent = response.body.data[0];
      expect(agent).toHaveProperty('id');
      expect(agent).toHaveProperty('name');
      expect(agent).toHaveProperty('type');
      expect(agent).toHaveProperty('status');
      expect(agent).toHaveProperty('metrics');
    });
  });

  describe('GET /api/agents/:id', () => {
    it('should return a specific agent', async () => {
      const response = await request(app)
        .get('/api/agents/agent-1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe('agent-1');
    });

    it('should return 404 for non-existent agent', async () => {
      const response = await request(app)
        .get('/api/agents/non-existent')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/agents/:id/start', () => {
    it('should start an agent', async () => {
      const response = await request(app)
        .post('/api/agents/agent-1/start')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('active');
    });
  });

  describe('POST /api/agents/:id/stop', () => {
    it('should stop an agent', async () => {
      const response = await request(app)
        .post('/api/agents/agent-1/stop')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('idle');
    });
  });

  describe('GET /api/system/status', () => {
    it('should return system status', async () => {
      const response = await request(app)
        .get('/api/system/status')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('status');
      expect(response.body.data).toHaveProperty('services');
      expect(response.body.data).toHaveProperty('metrics');
    });
  });
});
