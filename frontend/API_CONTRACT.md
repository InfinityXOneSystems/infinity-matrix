
# Infinity X - Comprehensive Backend-Frontend Contract (v3.1.0)

**Status:** ACTIVE
**Last Updated:** 2026-01-04
**Protocol:** HTTPS / WSS
**Base URL:** `https://api.infinityx.ai/v1`
**Environment:** Production

---

## 1. Core Architecture & Standards

### 1.1 Authentication
All protected endpoints require a Bearer Token via the `Authorization` header.
*   **Header:** `Authorization: Bearer <jwt_token>`
*   **Token Format:** HS256 signed JWT
*   **Expiration:** 1 hour (access), 7 days (refresh)

### 1.2 Rate Limiting (Leaky Bucket)
| Tier | Rate Limit | Burst |
| :--- | :--- | :--- |
| **Public** | 60 req/min | 10 |
| **User** | 1000 req/min | 50 |
| **Pro** | 5000 req/min | 200 |
| **Enterprise** | Unlimited | - |

### 1.3 Response Envelope
All JSON responses follow this strict envelope:
