
# Infinity X - Developer Handoff & Technical Specifications

**Version:** 1.0.0  
**Date:** 2026-01-03  
**Status:** Ready for Backend Implementation

---

## 1. System Architecture Overview

The Infinity X platform is designed as a high-performance, event-driven architecture enabling autonomous AI agent orchestration and deep third-party integrations.

### High-Level Components
*   **Frontend**: React 18 (Vite), TailwindCSS, Framer Motion, Radix UI.
*   **Backend Services**: Firebase (Firestore, Cloud Functions, Auth, Storage) or Supabase (alternative).
*   **AI Engine**: "Vision Cortex" - a middleware layer routing requests to LLM providers (OpenAI, Anthropic, Gemini) via Vertex AI or direct APIs.
*   **Integration Layer**: Centralized "Integration Hub" managing OAuth tokens and encrypted API keys for external services (Google Workspace, Stripe, Twilio).

### Data Flow
1.  **User Action**: User configures an Agent in the UI.
2.  **State Management**: Frontend persists draft state to LocalStorage/Context.
3.  **Persistence**: Data is synced to Firestore `agents` collection.
4.  **Trigger**: Firestore `onCreate`/`onUpdate` triggers Cloud Function.
5.  **Execution**: Cloud Function initializes the Agent instance in the execution environment (Docker/Kubernetes).

---

## 2. Firestore Collection Schemas

### `users`
*   `uid` (string): Firebase Auth ID.
*   `email` (string): User email.
*   `role` (string): 'admin', 'user', 'viewer'.
*   `organizationId` (string): Link to organization.
*   `createdAt` (timestamp).
*   `settings` (map): User preferences (theme, notifications).

### `organizations`
*   `id` (string): UUID.
*   `name` (string).
*   `subscriptionTier` (string): 'free', 'pro', 'enterprise'.
*   `stripeCustomerId` (string).
*   `apiUsage` (number): Token consumption counter.

### `agents`
*   `id` (string): UUID.
*   `orgId` (string).
*   `name` (string).
*   `type` (string): 'custom', 'template'.
*   `industry` (string): 'tech', 'finance', 'healthcare', 'therapy'.
*   `personality` (map): `{ empathy: number, confidence: number, style: string }`.
*   `voiceConfig` (map): `{ model: string, speed: number, pitch: number }`.
*   `status` (string): 'active', 'paused', 'training'.
*   `memoryDepth` (string): 'session', 'long_term'.

### `workflows`
*   `id` (string): UUID.
*   `nodes` (array): ReactFlow node structure.
*   `edges` (array): ReactFlow edge structure.
*   `triggers` (array): List of automation triggers (e.g., `onEmailReceived`).
*   `active` (boolean).

### `integrations` (Sensitive)
*   `id` (string).
*   `service` (string): 'google', 'stripe', 'github'.
*   `credentials` (string): **ENCRYPTED** blob (API keys, tokens).
*   `status` (string): 'connected', 'error'.
*   `lastSync` (timestamp).

### `audit_logs`
*   `id` (string).
*   `actorId` (string).
*   `action` (string): 'AGENT_DEPLOY', 'KEY_VIEW', 'DELETE_WORKFLOW'.
*   `metadata` (map): Context of the action.
*   `timestamp` (timestamp).

---

## 3. Cloud Functions Specifications

### `onUserCreate`
*   **Trigger**: Auth User Created.
*   **Logic**: Creates `users` document, assigns default `organization`, sends welcome email via SendGrid/Twilio.

### `deployAgent`
*   **Trigger**: HTTPS Callable.
*   **Input**: `{ agentId, config }`.
*   **Logic**: Validates user quota, provisions Docker container or registers agent in orchestration layer, updates `agents` status to 'active'.

### `executeWorkflow`
*   **Trigger**: Firestore Write (on `triggers` collection) or HTTPS Schedule.
*   **Input**: `{ workflowId, payload }`.
*   **Logic**: Traverses workflow graph. For each node:
    1.  Resolves inputs.
    2.  Calls appropriate service (AI Agent, Google API, etc.).
    3.  Passes output to next node.
*   **Output**: Execution ID and status.

### `syncGoogleWorkspace`
*   **Trigger**: Pub/Sub (Scheduled every 15 mins).
*   **Logic**: Iterates through active Google integrations. Fetches new Gmails/Drive files. Updates vector database for RAG (Retrieval-Augmented Generation).

### `handleStripeWebhook`
*   **Trigger**: HTTP Request (Stripe).
*   **Logic**: Listens for `checkout.session.completed`, `customer.subscription.updated`. Updates `organizations.subscriptionTier`.

---

## 4. Google Workspace API Integration Requirements

*   **OAuth2 Scopes**:
    *   `https://www.googleapis.com/auth/gmail.readonly` (Email analysis)
    *   `https://www.googleapis.com/auth/gmail.send` (Agent replies)
    *   `https://www.googleapis.com/auth/calendar` (Scheduling)
    *   `https://www.googleapis.com/auth/drive.file` (Doc generation)
    *   `https://www.googleapis.com/auth/spreadsheets` (Data reporting)
*   **Refresh Strategy**: Backend must handle token refresh automatically. Store `refresh_token` securely in `integrations` collection (encrypted).
*   **Rate Limits**: Implement exponential backoff for Google API quota errors (429).

---

## 5. Payment/Stripe Integration Requirements

*   **Products**:
    1.  **Starter**: 1 Agent, Basic Memory.
    2.  **Pro**: 5 Agents, Long-term Memory, Workspace Integration.
    3.  **Enterprise**: Unlimited Agents, Custom LLM fine-tuning.
*   **Implementation**:
    *   Use Stripe Customer Portal for user management.
    *   Metered billing for "Token Usage" beyond plan limits.
    *   Webhook signature verification is mandatory.

---

## 6. Authentication Flow

1.  **Frontend**: Uses Firebase Auth SDK (Email/Password, Google Sign-In).
2.  **Token**: ID Token passed in HTTP Authorization header for API calls.
3.  **Middleware**: Backend verifies ID Token and checks `users` collection for role/permissions (RBAC) before processing requests.
4.  **Session**: Persistent sessions handled by SDK; explicit logout clears local state.

---

## 7. Real-time Listener Requirements

*   **Dashboard Stats**: Listen to `organizations/{id}/stats` for live API usage updates.
*   **Agent Status**: Listen to `agents` query where `orgId == currentOrg` to show online/offline status in real-time.
*   **Terminal/Logs**: Listen to `executions/{id}/logs` for streaming agent thought processes during workflow debugging.

---

## 8. Error Handling & Validation Rules

*   **Input Validation**: Use Zod or Joi schemas for all API endpoints.
*   **API Errors**: Return standard JSON: `{ error: { code: string, message: string, details: any } }`.
*   **Frontend**: Use Error Boundaries (React) to catch UI crashes. Display Toast notifications for async errors.
*   **Retry Policy**: Cloud Functions should retry on transient errors (network issues) but fail fast on configuration errors (400 Bad Request).

---

## 9. Security & Encryption Requirements

*   **API Keys**: NEVER store third-party API keys (OpenAI, Stripe) in plain text.
    *   **Encryption**: Use AES-256-GCM.
    *   **Key Management**: Rotate encryption keys periodically using Google Cloud KMS or AWS KMS.
*   **Firestore Rules**:
    *   Users can only read/write their own org data.
    *   `integrations` collection is strictly `read: false` for client-side; only Cloud Functions can access.
*   **Headers**: Implement Helmet (Express) for security headers (CSP, HSTS).

---

## 10. Rate Limiting & Quota Management

*   **Per User**: Limit agent creations based on subscription tier.
*   **Per IP**: 100 requests/minute on public API endpoints using Redis-based rate limiting.
*   **LLM Guardrails**: Hard limit on monthly token spend per organization to prevent billing runaway.
*   **Alerts**: Trigger email to admin when org reaches 80% and 100% of usage limits.

---

## 11. Testing Requirements

*   **Unit Tests**: Jest for utility functions and data transformers.
*   **Component Tests**: React Testing Library for Agent Builder and Workflow Canvas.
*   **Integration Tests**: Emulators for Firebase Auth/Firestore to test security rules.
*   **E2E Tests**: Cypress/Playwright flows for:
    1.  Sign up -> Create Organization.
    2.  Create Agent -> Deploy.
    3.  Run Workflow -> Verify Output.

---

## 12. Deployment Checklist

1.  [ ] Run `npm run lint` and `npm test`.
2.  [ ] Build React app (`npm run build`).
3.  [ ] Deploy Firestore Rules and Indexes.
4.  [ ] Deploy Cloud Functions (ensure secrets are set in environment variables).
5.  [ ] Verify Stripe Webhook URL matches production endpoint.
6.  [ ] Verify Google OAuth Consent Screen is verified/published.
7.  [ ] Enable Domain SSL.

---

## 13. API Endpoint Specifications (Internal)

*   `POST /api/v1/agents/create`
*   `GET /api/v1/agents/{id}/status`
*   `POST /api/v1/workflows/trigger/{id}`
*   `POST /api/v1/integrations/google/auth`
*   `GET /api/v1/analytics/usage`

---

## 14. Database Indexing Requirements

**Firestore Composite Indexes Required:**
*   `agents`: `orgId` (ASC) + `status` (ASC)
*   `audit_logs`: `orgId` (ASC) + `timestamp` (DESC)
*   `executions`: `workflowId` (ASC) + `startedAt` (DESC)
*   `users`: `email` (ASC)

---

## 15. Backup & Disaster Recovery Procedures

*   **Daily Backups**: Automated export of Firestore data to Google Cloud Storage (Coldline).
*   **Point-in-Time Recovery**: Enable PITR (Point-in-Time Recovery) window of 7 days for critical collections (`users`, `integrations`).
*   **Disaster Recovery Drill**: Quarterly test of restoring data from GCS bucket to a staging project to verify integrity.
*   **Incident Response**: PagerDuty integration for Cloud Function failures > 5% error rate.
