# Phase 6 - Admin Control Plane: Firestore Data Models

This document defines the Firestore data models for the Admin Control Plane, adhering to Google Cloud best practices, including `schema_version`, `created_at`, `updated_at`, and `provenance` fields for all documents.

## 1. Contracts

**Collection:** `contracts`

Represents a contract with associated validation information.

| Field Name      | Type     | Description                                         |
| :-------------- | :------- | :-------------------------------------------------- |
| `id`            | string   | Unique identifier for the contract (document ID)    |
| `name`          | string   | Name of the contract                                |
| `content`       | string   | The actual content of the contract                  |
| `hash_value`    | string   | SHA-256 hash of the contract content                |
| `sha_validation`| boolean  | Result of SHA validation (true if valid)            |
| `status`        | string   | Current status of the contract (e.g., 'active', 'inactive', 'pending') |
| `schema_version`| integer  | Version of the schema for this document             |
| `created_at`    | timestamp| Timestamp of document creation                      |
| `updated_at`    | timestamp| Timestamp of last document update                   |
| `provenance`    | string   | Source or actor that last modified the document     |

## 2. Deployed Services

**Collection:** `deployed_services`

Monitors deployed services, specifically Cloud Run revisions.

| Field Name      | Type     | Description                                         |
| :-------------- | :------- | :-------------------------------------------------- |
| `id`            | string   | Unique identifier for the service (document ID)     |
| `service_name`  | string   | Name of the deployed service                        |
| `project_id`    | string   | Google Cloud Project ID                             |
| `region`        | string   | Google Cloud Region                                 |
| `cloud_run_url` | string   | URL of the Cloud Run service                        |
| `revisions`     | array    | List of Cloud Run revisions for this service        |
| `revisions[].name`| string | Name of the revision                                |
| `revisions[].status`| string| Status of the revision (e.g., 'deployed', 'failed') |
| `revisions[].deployed_at`| timestamp| Timestamp of revision deployment                  |
| `schema_version`| integer  | Version of the schema for this document             |
| `created_at`    | timestamp| Timestamp of document creation                      |
| `updated_at`    | timestamp| Timestamp of last document update                   |
| `provenance`    | string   | Source or actor that last modified the document     |

## 3. CI Status

**Collection:** `ci_status`

Tracks the status of Continuous Integration (e.g., GitHub Actions).

| Field Name      | Type     | Description                                         |
| :-------------- | :------- | :-------------------------------------------------- |
| `id`            | string   | Unique identifier for the CI workflow (document ID) |
| `workflow_name` | string   | Name of the CI workflow                             |
| `repository`    | string   | GitHub repository name (e.g., 'owner/repo')         |
| `last_run_id`   | string   | ID of the last workflow run                         |
| `last_run_status`| string  | Status of the last run (e.g., 'success', 'failure', 'pending') |
| `last_run_url`  | string   | URL to the last workflow run details                |
| `schema_version`| integer  | Version of the schema for this document             |
| `created_at`    | timestamp| Timestamp of document creation                      |
| `updated_at`    | timestamp| Timestamp of last document update                   |
| `provenance`    | string   | Source or actor that last modified the document     |

## 4. Autopilot Settings

**Collection:** `autopilot_settings`

Manages Autopilot mode and kill switch.

| Field Name      | Type     | Description                                         |
| :-------------- | :------- | :-------------------------------------------------- |
| `id`            | string   | Unique identifier for the settings (document ID)    |
| `mode`          | string   | Current operational mode (e.g., 'autonomous', 'manual') |
| `kill_switch_active`| boolean| True if kill switch is active, false otherwise      |
| `last_modified_by`| string | User or system that last modified settings          |
| `schema_version`| integer  | Version of the schema for this document             |
| `created_at`    | timestamp| Timestamp of document creation                      |
| `updated_at`    | timestamp| Timestamp of last document update                   |
| `provenance`    | string   | Source or actor that last modified the document     |

## 5. Vision Cortex Data

**Collection:** `vision_cortex_data`

Stores data related to Vision Cortex functionalities.

| Field Name      | Type     | Description                                         |
| :-------------- | :------- | :-------------------------------------------------- |
| `id`            | string   | Unique identifier for the data (document ID)        |
| `data_type`     | string   | Type of Vision Cortex data (e.g., 'image_analysis_result', 'model_config') |
| `payload`       | map      | JSON payload containing specific Vision Cortex data |
| `schema_version`| integer  | Version of the schema for this document             |
| `created_at`    | timestamp| Timestamp of document creation                      |
| `updated_at`    | timestamp| Timestamp of last document update                   |
| `provenance`    | string   | Source or actor that last modified the document     |

## 6. Evidence Packs

**Collection:** `evidence_packs`

Manages links and metadata for generated evidence packs.

| Field Name      | Type     | Description                                         |
| :-------------- | :------- | :-------------------------------------------------- |
| `id`            | string   | Unique identifier for the evidence pack (document ID)|
| `name`          | string   | Name or description of the evidence pack            |
| `storage_path`  | string   | Path to the evidence pack in Cloud Storage          |
| `generated_by`  | string   | User or system that generated the pack              |
| `expiration_date`| timestamp| Date when the evidence pack link expires            |
| `schema_version`| integer  | Version of the schema for this document             |
| `created_at`    | timestamp| Timestamp of document creation                      |
| `updated_at`    | timestamp| Timestamp of last document update                   |
| `provenance`    | string   | Source or actor that last modified the document     |

## 7. Audit Logs

**Collection:** `audit_logs`

Records all administrative actions for auditing purposes.

| Field Name      | Type     | Description                                         |
| :-------------- | :------- | :-------------------------------------------------- |
| `id`            | string   | Unique identifier for the log entry (document ID)   |
| `timestamp`     | timestamp| Timestamp of the action                             |
| `actor`         | string   | User or service account performing the action       |
| `action`        | string   | Description of the action performed                 |
| `resource_type` | string   | Type of resource affected (e.g., 'contract', 'service') |
| `resource_id`   | string   | ID of the resource affected                         |
| `details`       | map      | Additional details about the action                 |
| `schema_version`| integer  | Version of the schema for this document             |
| `created_at`    | timestamp| Timestamp of document creation                      |
| `updated_at`    | timestamp| Timestamp of last document update                   |
| `provenance`    | string   | Source or actor that last modified the document     |

## 8. RBAC Roles and Permissions

**Collection:** `rbac_roles`

Defines roles and their associated permissions.

| Field Name      | Type     | Description                                         |
| :-------------- | :------- | :-------------------------------------------------- |
| `id`            | string   | Unique identifier for the role (document ID)        |
| `role_name`     | string   | Name of the role (e.g., 'admin', 'viewer')          |
| `description`   | string   | Description of the role                             |
| `permissions`   | array    | List of permissions associated with this role       |
| `permissions[].resource`| string| Resource to which the permission applies (e.g., 'contracts', 'services') |
| `permissions[].action`| string| Action allowed on the resource (e.g., 'read', 'write', 'delete') |
| `schema_version`| integer  | Version of the schema for this document             |
| `created_at`    | timestamp| Timestamp of document creation                      |
| `updated_at`    | timestamp| Timestamp of last document update                   |
| `provenance`    | string   | Source or actor that last modified the document     |

**Collection:** `rbac_users`

Maps users to roles.

| Field Name      | Type     | Description                                         |
| :-------------- | :------- | :-------------------------------------------------- |
| `id`            | string   | Unique identifier for the user (document ID)        |
| `user_id`       | string   | User's unique identifier (e.g., email, Google ID)   |
| `roles`         | array    | List of role IDs assigned to the user               |
| `schema_version`| integer  | Version of the schema for this document             |
| `created_at`    | timestamp| Timestamp of document creation                      |
| `updated_at`    | timestamp| Timestamp of last document update                   |
| `provenance`    | string   | Source or actor that last modified the document     |
