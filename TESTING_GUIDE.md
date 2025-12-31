# Testing Guide

## Overview

This document describes the testing strategy and how to run tests for the Infinity Matrix Admin System.

## Testing Stack

### Frontend
- **Framework**: Vitest
- **Testing Library**: React Testing Library
- **Coverage**: v8

### Backend
- **Framework**: Jest
- **API Testing**: Supertest
- **Coverage**: Built-in Jest coverage

## Running Tests

### Frontend Tests

```bash
# Run all tests
cd frontend
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests in UI mode
npm run test:ui
```

### Backend Tests

```bash
# Run all tests
cd backend
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Integration Tests

```bash
# Run full integration test suite
./test-integration.sh
```

## Test Structure

### Frontend Tests

Located in `frontend/src/tests/`:

- **Component Tests**: Test individual React components
- **Store Tests**: Test Zustand state management
- **Service Tests**: Test API and WebSocket services (to be added)

Example:
```typescript
// Button.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '../components/ui/Button';

describe('Button Component', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });
});
```

### Backend Tests

Located in `backend/src/__tests__/`:

- **API Tests**: Test REST API endpoints
- **Service Tests**: Test business logic services
- **Integration Tests**: Test full request/response cycles

Example:
```typescript
// adminApi.test.ts
import request from 'supertest';
import app from '../app';

describe('Admin API', () => {
  it('should return list of agents', async () => {
    const response = await request(app)
      .get('/api/agents')
      .expect(200);
    
    expect(response.body.success).toBe(true);
  });
});
```

## Test Coverage

### Frontend Coverage Goals
- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

### Backend Coverage Goals
- **Statements**: > 85%
- **Branches**: > 80%
- **Functions**: > 85%
- **Lines**: > 85%

## Continuous Integration

Tests are automatically run on:
- Every push to main/develop branches
- Every pull request

See `.github/workflows/ci.yml` for CI configuration.

## Writing Tests

### Best Practices

1. **Test Behavior, Not Implementation**
   - Focus on what the component/function does, not how it does it
   - Test from the user's perspective

2. **Use Descriptive Test Names**
   ```typescript
   // Good
   it('should display error message when login fails', () => {})
   
   // Bad
   it('test login', () => {})
   ```

3. **Arrange, Act, Assert (AAA)**
   ```typescript
   it('should update agent status', () => {
     // Arrange
     const agent = createAgent({ status: 'idle' });
     
     // Act
     startAgent(agent.id);
     
     // Assert
     expect(agent.status).toBe('active');
   });
   ```

4. **Keep Tests Independent**
   - Each test should be able to run in isolation
   - Use beforeEach/afterEach for setup/teardown

5. **Mock External Dependencies**
   - Mock API calls, external services
   - Use test doubles for WebSocket connections

### Frontend Testing Patterns

#### Component Testing
```typescript
describe('AgentCard', () => {
  it('should display agent information', () => {
    const agent = mockAgent({ name: 'Test Agent' });
    render(<AgentCard agent={agent} />);
    
    expect(screen.getByText('Test Agent')).toBeInTheDocument();
  });
});
```

#### Store Testing
```typescript
describe('ChatStore', () => {
  it('should create a new session', () => {
    const { result } = renderHook(() => useChatStore());
    
    act(() => {
      result.current.createSession('Test', 'gpt-4');
    });
    
    expect(result.current.sessions).toHaveLength(1);
  });
});
```

### Backend Testing Patterns

#### API Testing
```typescript
describe('POST /api/agents', () => {
  it('should create a new agent', async () => {
    const agentData = {
      name: 'New Agent',
      type: 'coding',
      capabilities: ['coding'],
    };
    
    const response = await request(app)
      .post('/api/agents')
      .send(agentData)
      .expect(201);
    
    expect(response.body.data.name).toBe('New Agent');
  });
});
```

#### Service Testing
```typescript
describe('AgentService', () => {
  it('should start an agent', () => {
    const agent = agentStore.startAgent('agent-1');
    expect(agent?.status).toBe('active');
  });
});
```

## Debugging Tests

### Frontend
```bash
# Run specific test file
npm test Button.test.tsx

# Run tests matching pattern
npm test -- --grep "Button"

# Debug in VS Code
# Add breakpoint, then use "Debug Test" in test file
```

### Backend
```bash
# Run specific test file
npm test -- adminApi.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="should return"

# Debug with Node inspector
node --inspect-brk node_modules/.bin/jest --runInBand
```

## Mocking Guidelines

### API Mocking
```typescript
// Mock axios in frontend tests
vi.mock('axios', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: mockData })),
  },
}));
```

### WebSocket Mocking
```typescript
// Mock socket.io-client
vi.mock('socket.io-client', () => ({
  io: vi.fn(() => ({
    on: vi.fn(),
    emit: vi.fn(),
    disconnect: vi.fn(),
  })),
}));
```

## Test Data

Create reusable test fixtures:

```typescript
// testUtils/fixtures.ts
export const mockAgent = (overrides = {}) => ({
  id: 'agent-1',
  name: 'Test Agent',
  type: 'coding',
  status: 'idle',
  metrics: {
    tasksCompleted: 0,
    tasksInProgress: 0,
    tasksFailed: 0,
  },
  ...overrides,
});
```

## Performance Testing

For performance testing:
```bash
# Load testing with Apache Bench
ab -n 1000 -c 10 http://localhost:3000/api/agents

# Or with Artillery
artillery quick --count 10 --num 50 http://localhost:3000/api/agents
```

## Troubleshooting

### Common Issues

1. **Tests timing out**
   - Increase timeout in test configuration
   - Check for unresolved promises

2. **Flaky tests**
   - Use `waitFor` for async operations
   - Avoid relying on specific timing

3. **Memory leaks**
   - Ensure proper cleanup in afterEach
   - Close connections, clear timers

4. **Module resolution errors**
   - Check path aliases in test config
   - Verify imports are correct

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Jest Documentation](https://jestjs.io/)
- [Supertest Documentation](https://github.com/ladjs/supertest)

---

**Last Updated**: December 2025
