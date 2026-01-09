
# Frontend-Backend Contract: Infinity X Intelligence Engine

This document defines the interface contract between the Infinity X frontend application and the backend services. It serves as the single source of truth for API development, data structures, and integration patterns.

## 1. General API Standards

### Base URL
Production: `https://api.infinityx.ai/v1`
Staging: `https://staging-api.infinityx.ai/v1`
Local: `http://localhost:8000/v1`

### Content Types
- Request Body: `application/json`
- Response Body: `application/json`
- File Uploads: `multipart/form-data`

### Authentication
All protected routes require a Bearer token in the Authorization header.
