# Phase 2: Authentication & Onboarding - Architecture and Data Models

## 1. Architectural Overview

This phase focuses on establishing a robust and secure authentication and onboarding system for the Infinity X AI platform. The architecture will leverage Google Cloud services, primarily Firebase Authentication for user identity management and Firestore for persistent data storage. The system will be designed with scalability, security, and maintainability in mind, adhering to Google Cloud best practices.

### Key Components:

*   **Firebase Authentication:** Handles user registration, login, password management, and session management. Supports various authentication providers (email/password, Google, etc.).
*   **Cloud Functions for Firebase:** Backend logic for user creation, profile updates, Vision Project auto-generation, and enforcing RBAC rules. These functions will be triggered by Firebase Auth events or HTTP requests.
*   **Firestore:** NoSQL document database for storing user profiles, onboarding progress, RBAC roles, and Vision Project metadata. All collections will include `schema_version`, `created_at`, `updated_at`, and `provenance` fields.
*   **API Gateway/Cloud Endpoints:** (Implicitly part of contract-first OpenAPI design) Provides a unified and secure entry point for frontend applications to interact with backend services (Cloud Functions).
*   **Frontend Application (Placeholder):** A conceptual left-navigation app shell that interacts with the backend for authentication, onboarding, and displaying user-specific content.

## 2. Firestore Data Models

All Firestore collections will adhere to a common schema structure, including metadata fields for versioning, timestamps, and data origin. This ensures data integrity, traceability, and facilitates future schema migrations.

### Common Fields for all Documents:

*   `schema_version` (Number): Current version of the document schema. Used for backward compatibility and migration.
*   `created_at` (Timestamp): Server timestamp when the document was first created.
*   `updated_at` (Timestamp): Server timestamp when the document was last updated.
*   `provenance` (String): Describes the origin or source of the data (e.g., 'user_registration', 'admin_api', 'system_generated').

### 2.1. `users` Collection

Stores core user profile information. The document ID will be the Firebase User UID.

| Field Name        | Type      | Description                                                                 |
| :---------------- | :-------- | :-------------------------------------------------------------------------- |
| `email`           | String    | User's email address (indexed)                                              |
| `display_name`    | String    | User's display name                                                         |
| `photo_url`       | String    | URL to user's profile picture                                               |
| `onboarding_status`| String    | Current status of the onboarding flow (e.g., 'not_started', 'in_progress', 'completed') |
| `roles`           | Array<String> | List of RBAC roles assigned to the user (e.g., 'owner', 'admin', 'viewer')  |
| `vision_project_id`| String    | ID of the auto-generated Vision Project for the user (if applicable)        |

### 2.2. `onboarding_responses` Collection

Stores responses to the 8 discovery questions during the onboarding flow. Document ID could be `user_id`.

| Field Name        | Type      | Description                                                                 |
| :---------------- | :-------- | :-------------------------------------------------------------------------- |
| `user_id`         | String    | Firebase User UID                                                           |
| `question_1`      | String    | Response to discovery question 1                                            |
| `question_2`      | String    | Response to discovery question 2                                            |
| ...               | ...       | ... (up to question 8)                                                      |

### 2.3. `vision_projects` Collection

Stores metadata for auto-generated Vision Projects. Document ID will be a unique project ID.

| Field Name        | Type      | Description                                                                 |
| :---------------- | :-------- | :-------------------------------------------------------------------------- |\n| `user_id`         | String    | Firebase User UID (owner of the project)                                    |
| `project_name`    | String    | Default name for the Vision Project (e.g., 'My First Vision Project')       |
| `status`          | String    | Current status of the project (e.g., 'active', 'archived')                  |
| `configuration`   | Map       | Initial configuration settings for the Vision Project                       |

### 2.4. `sessions` Collection (Optional - for advanced session management/auditing)

If more granular session control beyond Firebase Auth tokens is needed, this collection can store session details. Document ID could be a unique session ID.

| Field Name        | Type      | Description                                                                 |
| :---------------- | :-------- | :-------------------------------------------------------------------------- |
| `user_id`         | String    | Firebase User UID                                                           |
| `login_time`      | Timestamp | Timestamp of session creation                                               |
| `last_activity`   | Timestamp | Last recorded activity time for the session                                 |
| `ip_address`      | String    | IP address from which the session originated                                |
| `user_agent`      | String    | User-Agent string of the client                                             |
| `is_active`       | Boolean   | Indicates if the session is currently active                                |

### 2.5. `roles` Collection (Optional - for dynamic RBAC role definitions)

If roles need to be dynamically managed or have associated metadata, this collection can define them. Otherwise, roles can be hardcoded strings in the `users` collection.

| Field Name        | Type      | Description                                                                 |
| :---------------- | :-------- | :-------------------------------------------------------------------------- |
| `role_name`       | String    | Unique name of the role (e.g., 'owner', 'admin', 'viewer')                  |
| `permissions`     | Array<String> | List of permissions associated with this role (e.g., 'read:users', 'write:projects') |
| `description`     | String    | Human-readable description of the role                                      |
