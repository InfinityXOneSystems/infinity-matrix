# Phase 5: Data Models and OpenAPI Specification

## 1. Firestore Data Models

This section outlines the data models for the Firestore collections that will be used in the Agent Builder & Launch phase. Each model includes the standard fields for schema versioning, timestamps, and data provenance.

### 1.1 `agent_templates` Collection

This collection stores the prebuilt agent templates.

| Field Name | Data Type | Description |
|---|---|---|
| `template_id` | String | Unique identifier for the template. |
| `name` | String | Name of the agent template. |
| `description` | String | A brief description of the agent's purpose and capabilities. |
| `version` | String | Version of the template. |
| `parameters` | Map | A map of configurable parameters for the agent, including default values. |
| `schema_version` | String | The version of the document schema. |
| `created_at` | Timestamp | The time the document was created. |
| `updated_at` | Timestamp | The time the document was last updated. |
| `provenance` | String | Information about the origin or source of the template. |

### 1.2 `agent_instances` Collection

This collection stores the instances of agents created by users.

| Field Name | Data Type | Description |
|---|---|---|
| `instance_id` | String | Unique identifier for the agent instance. |
| `user_id` | String | The ID of the user who owns this agent instance. |
| `template_id` | String | The ID of the template used to create this instance. |
| `name` | String | The name of the agent instance. |
| `custom_parameters` | Map | A map of user-defined parameters that override the template defaults. |
| `autonomy_mode` | String | The selected autonomy mode: `Full Auto`, `Hybrid`, or `Manual`. |
| `persistent_memory` | Map | A map representing the agent's persistent memory. |
| `day_0_plan` | String | The initial plan generated for the agent. |
| `status` | String | The current status of the agent instance (e.g., `creating`, `running`, `stopped`). |
| `schema_version` | String | The version of the document schema. |
| `created_at` | Timestamp | The time the document was created. |
| `updated_at` | Timestamp | The time the document was last updated. |
| `provenance` | String | Information about the origin or source of the instance. |

### 1.3 `users` Collection

This collection stores user information and their roles for RBAC.

| Field Name | Data Type | Description |
|---|---|---|
| `user_id` | String | Unique identifier for the user. |
| `email` | String | The user's email address. |
| `role` | String | The user's role (e.g., `admin`, `developer`, `viewer`). |
| `schema_version` | String | The version of the document schema. |
| `created_at` | Timestamp | The time the document was created. |
| `updated_at` | Timestamp | The time the document was last updated. |
| `provenance` | String | Information about the origin or source of the user data. |

## 2. OpenAPI Specification (version 3.0)

This section provides a high-level OpenAPI specification for the Agent Builder & Launch API. This will be used to generate the API client and server code.

```yaml
openapi: 3.0.0
info:
  title: Infinity X AI - Agent Builder & Launch API
  version: 1.0.0
  description: API for managing agent templates and instances.

paths:
  /agent-templates:
    get:
      summary: List all agent templates
      responses:
        '200':
          description: A list of agent templates.
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/AgentTemplate'

  /agent-templates/{templateId}:
    get:
      summary: Get a single agent template
      parameters:
        - name: templateId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: An agent template.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AgentTemplate'

  /agent-instances:
    get:
      summary: List all agent instances for the authenticated user
      responses:
        '200':
          description: A list of agent instances.
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/AgentInstance'
    post:
      summary: Create a new agent instance
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateAgentInstance'
      responses:
        '201':
          description: The created agent instance.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AgentInstance'

  /agent-instances/{instanceId}:
    get:
      summary: Get a single agent instance
      parameters:
        - name: instanceId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: An agent instance.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AgentInstance'
    patch:
      summary: Update an agent instance
      parameters:
        - name: instanceId
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateAgentInstance'
      responses:
        '200':
          description: The updated agent instance.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AgentInstance'

components:
  schemas:
    AgentTemplate:
      type: object
      properties:
        template_id: { type: string }
        name: { type: string }
        description: { type: string }
        version: { type: string }
        parameters: { type: object }

    AgentInstance:
      type: object
      properties:
        instance_id: { type: string }
        user_id: { type: string }
        template_id: { type: string }
        name: { type: string }
        custom_parameters: { type: object }
        autonomy_mode: { type: string, enum: ['Full Auto', 'Hybrid', 'Manual'] }
        persistent_memory: { type: object }
        day_0_plan: { type: string }
        status: { type: string, enum: ['creating', 'running', 'stopped'] }

    CreateAgentInstance:
      type: object
      properties:
        template_id: { type: string }
        name: { type: string }
        custom_parameters: { type: object }
        autonomy_mode: { type: string, enum: ['Full Auto', 'Hybrid', 'Manual'] }

    UpdateAgentInstance:
      type: object
      properties:
        name: { type: string }
        custom_parameters: { type: object }
        autonomy_mode: { type: string, enum: ['Full Auto', 'Hybrid', 'Manual'] }
```
