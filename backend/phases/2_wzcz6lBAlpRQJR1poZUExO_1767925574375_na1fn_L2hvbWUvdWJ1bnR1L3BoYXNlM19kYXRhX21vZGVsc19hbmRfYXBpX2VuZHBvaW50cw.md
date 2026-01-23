# Phase 3: Core Tools - Data Models and API Endpoints

This document consolidates the Firestore schema definitions, data models, and API endpoints for Phase 3 of the Infinity X AI platform.

## 1. Firestore Data Models

This document outlines the architectural design and data models for Phase 3 of the Infinity X AI platform, focusing on the Core Tools: Problem Solver, Simulation, Decision Maker, and Universal Predict. The design adheres to Google Cloud best practices, emphasizing scalability, security, and maintainability, with a strong focus on Firestore persistence.

## General Firestore Data Model Principles

All Firestore collections will incorporate the following common fields to ensure data integrity, traceability, and versioning:

*   `schema_version`: (String) A version identifier for the document's schema, allowing for future schema evolution.
*   `created_at`: (Timestamp) The timestamp when the document was first created.
*   `updated_at`: (Timestamp) The timestamp of the last update to the document.
*   `provenance`: (Map) A map containing information about the origin and history of the data, e.g., `{'source': 'system', 'user_id': '...'}`.

### Collection Structure

Firestore will be structured using top-level collections for each core tool, with documents representing individual instances or configurations. Subcollections will be used for related data that is logically nested within a parent document.

## Core Tool Data Models

### 1. Problem Solver

The Problem Solver module is responsible for intake and action plan generation. It will identify problems, analyze them using the 'vision cortex' (which scrapes open-source information), and propose solutions.

**Collection: `problems`**

Represents a detected problem and its associated action plan.

| Field Name       | Type      | Description                                                                  |
| :--------------- | :-------- | :--------------------------------------------------------------------------- |
| `problem_id`     | String    | Unique identifier for the problem.                                           |
| `title`          | String    | A concise title for the problem.                                             |
| `description`    | String    | Detailed description of the problem.                                         |
| `status`         | String    | Current status of the problem (e.g., 'identified', 'analyzing', 'action_plan_generated', 'resolved'). |
| `identified_by`  | String    | Identifier of the system or user who identified the problem.                 |
| `identified_at`  | Timestamp | Timestamp when the problem was identified.                                   |
| `analysis_data`  | Map       | Data from the 'vision cortex' analysis.                                      |
| `action_plan`    | Map       | Details of the generated action plan.                                        |
| `confidence_score` | Number    | A numerical score indicating the confidence in the problem identification and proposed solution. |
| `schema_version` | String    | Schema version of this document.                                             |
| `created_at`     | Timestamp | Timestamp of document creation.                                              |
| `updated_at`     | Timestamp | Timestamp of last document update.                                           |
| `provenance`     | Map       | Origin and history of the data.                                              |

### 2. Simulation

The Simulation module will generate three timelines with associated ROI for proposed solutions.

**Collection: `simulations`**

Represents a simulation run for a specific problem or scenario.

| Field Name       | Type      | Description                                                                  |
| :--------------- | :-------- | :--------------------------------------------------------------------------- |
| `simulation_id`  | String    | Unique identifier for the simulation.                                        |
| `problem_id`     | String    | Reference to the `problem_id` this simulation is for.                        |
| `scenario`       | String    | Description of the scenario being simulated.                                 |
| `input_parameters` | Map       | Parameters used to run the simulation.                                       |
| `timelines`      | Array     | An array of maps, each representing a simulated timeline with ROI.           |
| `confidence_score` | Number    | Confidence in the simulation results.                                        |
| `schema_version` | String    | Schema version of this document.                                             |
| `created_at`     | Timestamp | Timestamp of document creation.                                              |
| `updated_at`     | Timestamp | Timestamp of last document update.                                           |
| `provenance`     | Map       | Origin and history of the data.                                              |

**Subcollection: `timelines` (under `simulations/{simulation_id}`)**

Each document in this subcollection represents a single timeline generated by the simulation.

| Field Name       | Type      | Description                                                                  |
| :--------------- | :-------- | :--------------------------------------------------------------------------- |
| `timeline_id`    | String    | Unique identifier for the timeline.                                          |
| `name`           | String    | Name of the timeline (e.g., 'Optimistic', 'Realistic', 'Pessimistic').       |
| `description`    | String    | Description of the timeline's assumptions and characteristics.               |
| `roi_metrics`    | Map       | Key ROI metrics for this timeline (e.g., `{'financial': 100000, 'time_saved': '3 months'}`). |
| `events`         | Array     | A chronological list of events within the timeline.                           |
| `schema_version` | String    | Schema version of this document.                                             |
| `created_at`     | Timestamp | Timestamp of document creation.                                              |
| `updated_at`     | Timestamp | Timestamp of last document update.                                           |
| `provenance`     | Map       | Origin and history of the data.                                              |

### 3. Decision Maker

The Decision Maker module will provide interactive buttons and outcomes based on simulation results.

**Collection: `decisions`**

Represents a decision point and its associated options and outcomes.

| Field Name       | Type      | Description                                                                  |
| :--------------- | :-------- | :--------------------------------------------------------------------------- |
| `decision_id`    | String    | Unique identifier for the decision.                                          |
| `problem_id`     | String    | Reference to the `problem_id` this decision is related to.                   |
| `simulation_id`  | String    | Reference to the `simulation_id` that informed this decision.                |
| `title`          | String    | Title of the decision point.                                                 |
| `description`    | String    | Detailed description of the decision to be made.                             |
| `options`        | Array     | An array of maps, each representing a possible decision option.              |
| `selected_option` | String    | The `option_id` of the chosen option.                                        |
| `decided_by`     | String    | Identifier of the user or system that made the decision.                     |
| `decided_at`     | Timestamp | Timestamp when the decision was made.                                        |
| `outcome`        | Map       | The actual outcome of the selected decision.                                 |
| `confidence_score` | Number    | Confidence in the decision's potential outcome.                              |
| `schema_version` | String    | Schema version of this document.                                             |
| `created_at`     | Timestamp | Timestamp of document creation.                                              |
| `updated_at`     | Timestamp | Timestamp of last document update.                                           |
| `provenance`     | Map       | Origin and history of the data.                                              |

**Subcollection: `options` (under `decisions/{decision_id}`)**

Each document in this subcollection represents a single option for the decision.

| Field Name       | Type      | Description                                                                  |
| :--------------- | :-------- | :--------------------------------------------------------------------------- |
| `option_id`      | String    | Unique identifier for the option.                                            |
| `name`           | String    | Name of the option.                                                          |
| `description`    | String    | Description of the option.                                                   |
| `associated_timeline_id` | String    | Reference to a `timeline_id` from the `simulations` collection.              |
| `expected_roi`   | Map       | Expected ROI metrics if this option is chosen.                               |
| `schema_version` | String    | Schema version of this document.                                             |
| `created_at`     | Timestamp | Timestamp of document creation.                                              |
| `updated_at`     | Timestamp | Timestamp of last document update.                                           |
| `provenance`     | Map       | Origin and history of the data.                                              |

### 4. Universal Predict

The Universal Predict module will provide predictions across various domains (finance, business, life, market) with confidence scoring.

**Collection: `predictions`**

Represents a prediction generated by the system.

| Field Name       | Type      | Description                                                                  |
| :--------------- | :-------- | :--------------------------------------------------------------------------- |
| `prediction_id`  | String    | Unique identifier for the prediction.                                        |
| `domain`         | String    | The domain of the prediction (e.g., 'finance', 'business', 'life', 'market'). |
| `query`          | String    | The input query or context for the prediction.                               |
| `prediction_text` | String    | The generated prediction.                                                    |
| `predicted_at`   | Timestamp | Timestamp when the prediction was generated.                                 |
| `confidence_score` | Number    | A numerical score indicating the confidence in the prediction.               |
| `control_mode`   | String    | The control mode used for this prediction (e.g., 'auto', 'hybrid', 'manual'). |
| `schema_version` | String    | Schema version of this document.                                             |
| `created_at`     | Timestamp | Timestamp of document creation.                                              |
| `updated_at`     | Timestamp | Timestamp of last document update.                                           |
| `provenance`     | Map       | Origin and history of the data.                                              |


## 2. OpenAPI Specification (API Endpoints)

(Content from `/home/ubuntu/phase3_openapi_spec.yaml` will be inserted here)

# Phase 3: Core Tools - Architectural Design and Data Models

This document outlines the architectural design and data models for Phase 3 of the Infinity X AI platform, focusing on the Core Tools: Problem Solver, Simulation, Decision Maker, and Universal Predict. The design adheres to Google Cloud best practices, emphasizing scalability, security, and maintainability, with a strong focus on Firestore persistence.

## General Firestore Data Model Principles

All Firestore collections will incorporate the following common fields to ensure data integrity, traceability, and versioning:

*   `schema_version`: (String) A version identifier for the document's schema, allowing for future schema evolution.
*   `created_at`: (Timestamp) The timestamp when the document was first created.
*   `updated_at`: (Timestamp) The timestamp of the last update to the document.
*   `provenance`: (Map) A map containing information about the origin and history of the data, e.g., `{'source': 'system', 'user_id': '...'}`.

### Collection Structure

Firestore will be structured using top-level collections for each core tool, with documents representing individual instances or configurations. Subcollections will be used for related data that is logically nested within a parent document.

## Core Tool Data Models

### 1. Problem Solver

The Problem Solver module is responsible for intake and action plan generation. It will identify problems, analyze them using the 'vision cortex' (which scrapes open-source information), and propose solutions.

**Collection: `problems`**

Represents a detected problem and its associated action plan.

| Field Name       | Type      | Description                                                                  |
| :--------------- | :-------- | :--------------------------------------------------------------------------- |
| `problem_id`     | String    | Unique identifier for the problem.                                           |
| `title`          | String    | A concise title for the problem.                                             |
| `description`    | String    | Detailed description of the problem.                                         |
| `status`         | String    | Current status of the problem (e.g., 'identified', 'analyzing', 'action_plan_generated', 'resolved'). |
| `identified_by`  | String    | Identifier of the system or user who identified the problem.                 |
| `identified_at`  | Timestamp | Timestamp when the problem was identified.                                   |
| `analysis_data`  | Map       | Data from the 'vision cortex' analysis.                                      |
| `action_plan`    | Map       | Details of the generated action plan.                                        |
| `confidence_score` | Number    | A numerical score indicating the confidence in the problem identification and proposed solution. |
| `schema_version` | String    | Schema version of this document.                                             |
| `created_at`     | Timestamp | Timestamp of document creation.                                              |
| `updated_at`     | Timestamp | Timestamp of last document update.                                           |
| `provenance`     | Map       | Origin and history of the data.                                              |

### 2. Simulation

The Simulation module will generate three timelines with associated ROI for proposed solutions.

**Collection: `simulations`**

Represents a simulation run for a specific problem or scenario.

| Field Name       | Type      | Description                                                                  |
| :--------------- | :-------- | :--------------------------------------------------------------------------- |
| `simulation_id`  | String    | Unique identifier for the simulation.                                        |
| `problem_id`     | String    | Reference to the `problem_id` this simulation is for.                        |
| `scenario`       | String    | Description of the scenario being simulated.                                 |
| `input_parameters` | Map       | Parameters used to run the simulation.                                       |
| `timelines`      | Array     | An array of maps, each representing a simulated timeline with ROI.           |
| `confidence_score` | Number    | Confidence in the simulation results.                                        |
| `schema_version` | String    | Schema version of this document.                                             |
| `created_at`     | Timestamp | Timestamp of document creation.                                              |
| `updated_at`     | Timestamp | Timestamp of last document update.                                           |
| `provenance`     | Map       | Origin and history of the data.                                              |

**Subcollection: `timelines` (under `simulations/{simulation_id}`)**

Each document in this subcollection represents a single timeline generated by the simulation.

| Field Name       | Type      | Description                                                                  |
| :--------------- | :-------- | :--------------------------------------------------------------------------- |
| `timeline_id`    | String    | Unique identifier for the timeline.                                          |
| `name`           | String    | Name of the timeline (e.g., 'Optimistic', 'Realistic', 'Pessimistic').       |
| `description`    | String    | Description of the timeline's assumptions and characteristics.               |
| `roi_metrics`    | Map       | Key ROI metrics for this timeline (e.g., `{'financial': 100000, 'time_saved': '3 months'}`). |
| `events`         | Array     | A chronological list of events within the timeline.                           |
| `schema_version` | String    | Schema version of this document.                                             |
| `created_at`     | Timestamp | Timestamp of document creation.                                              |
| `updated_at`     | Timestamp | Timestamp of last document update.                                           |
| `provenance`     | Map       | Origin and history of the data.                                              |

### 3. Decision Maker

The Decision Maker module will provide interactive buttons and outcomes based on simulation results.

**Collection: `decisions`**

Represents a decision point and its associated options and outcomes.

| Field Name       | Type      | Description                                                                  |
| :--------------- | :-------- | :--------------------------------------------------------------------------- |
| `decision_id`    | String    | Unique identifier for the decision.                                          |
| `problem_id`     | String    | Reference to the `problem_id` this decision is related to.                   |
| `simulation_id`  | String    | Reference to the `simulation_id` that informed this decision.                |
| `title`          | String    | Title of the decision point.                                                 |
| `description`    | String    | Detailed description of the decision to be made.                             |
| `options`        | Array     | An array of maps, each representing a possible decision option.              |
| `selected_option` | String    | The `option_id` of the chosen option.                                        |
| `decided_by`     | String    | Identifier of the user or system that made the decision.                     |
| `decided_at`     | Timestamp | Timestamp when the decision was made.                                        |
| `outcome`        | Map       | The actual outcome of the selected decision.                                 |
| `confidence_score` | Number    | Confidence in the decision's potential outcome.                              |
| `schema_version` | String    | Schema version of this document.                                             |
| `created_at`     | Timestamp | Timestamp of document creation.                                              |
| `updated_at`     | Timestamp | Timestamp of last document update.                                           |
| `provenance`     | Map       | Origin and history of the data.                                              |

**Subcollection: `options` (under `decisions/{decision_id}`)**

Each document in this subcollection represents a single option for the decision.

| Field Name       | Type      | Description                                                                  |
| :--------------- | :-------- | :--------------------------------------------------------------------------- |
| `option_id`      | String    | Unique identifier for the option.                                            |
| `name`           | String    | Name of the option.                                                          |
| `description`    | String    | Description of the option.                                                   |
| `associated_timeline_id` | String    | Reference to a `timeline_id` from the `simulations` collection.              |
| `expected_roi`   | Map       | Expected ROI metrics if this option is chosen.                               |
| `schema_version` | String    | Schema version of this document.                                             |
| `created_at`     | Timestamp | Timestamp of document creation.                                              |
| `updated_at`     | Timestamp | Timestamp of last document update.                                           |
| `provenance`     | Map       | Origin and history of the data.                                              |

### 4. Universal Predict

The Universal Predict module will provide predictions across various domains (finance, business, life, market) with confidence scoring.

**Collection: `predictions`**

Represents a prediction generated by the system.

| Field Name       | Type      | Description                                                                  |
| :--------------- | :-------- | :--------------------------------------------------------------------------- |
| `prediction_id`  | String    | Unique identifier for the prediction.                                        |
| `domain`         | String    | The domain of the prediction (e.g., 'finance', 'business', 'life', 'market'). |
| `query`          | String    | The input query or context for the prediction.                               |
| `prediction_text` | String    | The generated prediction.                                                    |
| `predicted_at`   | Timestamp | Timestamp when the prediction was generated.                                 |
| `confidence_score` | Number    | A numerical score indicating the confidence in the prediction.               |
| `control_mode`   | String    | The control mode used for this prediction (e.g., 'auto', 'hybrid', 'manual'). |
| `schema_version` | String    | Schema version of this document.                                             |
| `created_at`     | Timestamp | Timestamp of document creation.                                              |
| `updated_at`     | Timestamp | Timestamp of last document update.                                           |
| `provenance`     | Map       | Origin and history of the data.                                              |

## Next Steps

With the data models defined, the next phase will involve generating the OpenAPI specification for these core tools.

```yaml

openapi: 3.0.0
info:
  title: Infinity X AI - Phase 3 Core Tools API
  version: 1.0.0
  description: API for Infinity X AI Phase 3 Core Tools including Problem Solver, Simulation, Decision Maker, and Universal Predict.

servers:
  - url: https://api.infinityx.ai/v1
    description: Production server

paths:
  /problems:
    post:
      summary: Create a new problem
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ProblemInput'
      responses:
        '201':
          description: Problem created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Problem'
        '400':
          description: Invalid input
    get:
      summary: Retrieve a list of problems
      responses:
        '200':
          description: A list of problems
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Problem'

  /problems/{problem_id}:
    get:
      summary: Retrieve a single problem by ID
      parameters:
        - in: path
          name: problem_id
          required: true
          schema:
            type: string
          description: Unique identifier of the problem
      responses:
        '200':
          description: Problem details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Problem'
        '404':
          description: Problem not found
    put:
      summary: Update an existing problem
      parameters:
        - in: path
          name: problem_id
          required: true
          schema:
            type: string
          description: Unique identifier of the problem
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ProblemInput'
      responses:
        '200':
          description: Problem updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Problem'
        '400':
          description: Invalid input
        '404':
          description: Problem not found

  /simulations:
    post:
      summary: Create a new simulation
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/SimulationInput'
      responses:
        '201':
          description: Simulation created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Simulation'
        '400':
          description: Invalid input
    get:
      summary: Retrieve a list of simulations
      responses:
        '200':
          description: A list of simulations
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Simulation'

  /simulations/{simulation_id}:
    get:
      summary: Retrieve a single simulation by ID
      parameters:
        - in: path
          name: simulation_id
          required: true
          schema:
            type: string
          description: Unique identifier of the simulation
      responses:
        '200':
          description: Simulation details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Simulation'
        '404':
          description: Simulation not found
    put:
      summary: Update an existing simulation
      parameters:
        - in: path
          name: simulation_id
          required: true
          schema:
            type: string
          description: Unique identifier of the simulation
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/SimulationInput'
      responses:
        '200':
          description: Simulation updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Simulation'
        '400':
          description: Invalid input
        '404':
          description: Simulation not found

  /decisions:
    post:
      summary: Create a new decision
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/DecisionInput'
      responses:
        '201':
          description: Decision created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Decision'
        '400':
          description: Invalid input
    get:
      summary: Retrieve a list of decisions
      responses:
        '200':
          description: A list of decisions
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Decision'

  /decisions/{decision_id}:
    get:
      summary: Retrieve a single decision by ID
      parameters:
        - in: path
          name: decision_id
          required: true
          schema:
            type: string
          description: Unique identifier of the decision
      responses:
        '200':
          description: Decision details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Decision'
        '404':
          description: Decision not found
    put:
      summary: Update an existing decision
      parameters:
        - in: path
          name: decision_id
          required: true
          schema:
            type: string
          description: Unique identifier of the decision
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/DecisionInput'
      responses:
        '200':
          description: Decision updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Decision'
        '400':
          description: Invalid input
        '404':
          description: Decision not found

  /predictions:
    post:
      summary: Create a new prediction
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PredictionInput'
      responses:
        '201':
          description: Prediction created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Prediction'
        '400':
          description: Invalid input
    get:
      summary: Retrieve a list of predictions
      responses:
        '200':
          description: A list of predictions
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Prediction'

  /predictions/{prediction_id}:
    get:
      summary: Retrieve a single prediction by ID
      parameters:
        - in: path
          name: prediction_id
          required: true
          schema:
            type: string
          description: Unique identifier of the prediction
      responses:
        '200':
          description: Prediction details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Prediction'
        '404':
          description: Prediction not found
    put:
      summary: Update an existing prediction
      parameters:
        - in: path
          name: prediction_id
          required: true
          schema:
            type: string
          description: Unique identifier of the prediction
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PredictionInput'
      responses:
        '200':
          description: Prediction updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Prediction'
        '400':
          description: Invalid input
        '404':
          description: Prediction not found

components:
  schemas:
    Provenance:
      type: object
      properties:
        source:
          type: string
          description: The origin of the data (e.g., system, user).
        user_id:
          type: string
          description: The ID of the user if applicable.
      example:
        source: system
        user_id: user-123

    ProblemInput:
      type: object
      required:
        - title
        - description
        - identified_by
      properties:
        title:
          type: string
          description: A concise title for the problem.
        description:
          type: string
          description: Detailed description of the problem.
        status:
          type: string
          description: Current status of the problem.
          enum: [identified, analyzing, action_plan_generated, resolved]
          default: identified
        identified_by:
          type: string
          description: Identifier of the system or user who identified the problem.
        analysis_data:
          type: object
          description: Data from the 'vision cortex' analysis.
        action_plan:
          type: object
          description: Details of the generated action plan.
        confidence_score:
          type: number
          format: float
          description: A numerical score indicating the confidence.

    Problem:
      allOf:
        - $ref: '#/components/schemas/ProblemInput'
        - type: object
          required:
            - problem_id
            - identified_at
            - schema_version
            - created_at
            - updated_at
            - provenance
          properties:
            problem_id:
              type: string
              description: Unique identifier for the problem.
              readOnly: true
            identified_at:
              type: string
              format: date-time
              description: Timestamp when the problem was identified.
              readOnly: true
            schema_version:
              type: string
              description: Schema version of this document.
              readOnly: true
            created_at:
              type: string
              format: date-time
              description: Timestamp of document creation.
              readOnly: true
            updated_at:
              type: string
              format: date-time
              description: Timestamp of last document update.
              readOnly: true
            provenance:
              $ref: '#/components/schemas/Provenance'
              readOnly: true

    TimelineItem:
      type: object
      required:
        - name
        - description
        - roi_metrics
      properties:
        timeline_id:
          type: string
          description: Unique identifier for the timeline.
          readOnly: true
        name:
          type: string
          description: Name of the timeline (e.g., 'Optimistic', 'Realistic', 'Pessimistic').
        description:
          type: string
          description: Description of the timeline's assumptions and characteristics.
        roi_metrics:
          type: object
          description: Key ROI metrics for this timeline.
        events:
          type: array
          items:
            type: object
            description: A chronological list of events within the timeline.

    SimulationInput:
      type: object
      required:
        - problem_id
        - scenario
        - input_parameters
      properties:
        problem_id:
          type: string
          description: Reference to the problem_id this simulation is for.
        scenario:
          type: string
          description: Description of the scenario being simulated.
        input_parameters:
          type: object
          description: Parameters used to run the simulation.
        timelines:
          type: array
          items:
            $ref: '#/components/schemas/TimelineItem'
          description: An array of maps, each representing a simulated timeline with ROI.
        confidence_score:
          type: number
          format: float
          description: Confidence in the simulation results.

    Simulation:
      allOf:
        - $ref: '#/components/schemas/SimulationInput'
        - type: object
          required:
            - simulation_id
            - schema_version
            - created_at
            - updated_at
            - provenance
          properties:
            simulation_id:
              type: string
              description: Unique identifier for the simulation.
              readOnly: true
            schema_version:
              type: string
              description: Schema version of this document.
              readOnly: true
            created_at:
              type: string
              format: date-time
              description: Timestamp of document creation.
              readOnly: true
            updated_at:
              type: string
              format: date-time
              description: Timestamp of last document update.
              readOnly: true
            provenance:
              $ref: '#/components/schemas/Provenance'
              readOnly: true

    OptionItem:
      type: object
      required:
        - name
        - description
        - associated_timeline_id
        - expected_roi
      properties:
        option_id:
          type: string
          description: Unique identifier for the option.
          readOnly: true
        name:
          type: string
          description: Name of the option.
        description:
          type: string
          description: Description of the option.
        associated_timeline_id:
          type: string
          description: Reference to a timeline_id from the simulations collection.
        expected_roi:
          type: object
          description: Expected ROI metrics if this option is chosen.

    DecisionInput:
      type: object
      required:
        - problem_id
        - simulation_id
        - title
        - description
      properties:
        problem_id:
          type: string
          description: Reference to the problem_id this decision is related to.
        simulation_id:
          type: string
          description: Reference to the simulation_id that informed this decision.
        title:
          type: string
          description: Title of the decision point.
        description:
          type: string
          description: Detailed description of the decision to be made.
        options:
          type: array
          items:
            $ref: '#/components/schemas/OptionItem'
          description: An array of maps, each representing a possible decision option.
        selected_option:
          type: string
          description: The option_id of the chosen option.
        decided_by:
          type: string
          description: Identifier of the user or system that made the decision.
        decided_at:
          type: string
          format: date-time
          description: Timestamp when the decision was made.
        outcome:
          type: object
          description: The actual outcome of the selected decision.
        confidence_score:
          type: number
          format: float
          description: Confidence in the decision's potential outcome.

    Decision:
      allOf:
        - $ref: '#/components/schemas/DecisionInput'
        - type: object
          required:
            - decision_id
            - schema_version
            - created_at
            - updated_at
            - provenance
          properties:
            decision_id:
              type: string
              description: Unique identifier for the decision.
              readOnly: true
            schema_version:
              type: string
              description: Schema version of this document.
              readOnly: true
            created_at:
              type: string
              format: date-time
              description: Timestamp of document creation.
              readOnly: true
            updated_at:
              type: string
              format: date-time
              description: Timestamp of last document update.
              readOnly: true
            provenance:
              $ref: '#/components/schemas/Provenance'
              readOnly: true

    PredictionInput:
      type: object
      required:
        - domain
        - query
        - prediction_text
      properties:
        domain:
          type: string
          description: The domain of the prediction (e.g., 'finance', 'business', 'life', 'market').
          enum: [finance, business, life, market]
        query:
          type: string
          description: The input query or context for the prediction.
        prediction_text:
          type: string
          description: The generated prediction.
        confidence_score:
          type: number
          format: float
          description: A numerical score indicating the confidence in the prediction.
        control_mode:
          type: string
          description: The control mode used for this prediction.
          enum: [auto, hybrid, manual]
          default: auto

    Prediction:
      allOf:
        - $ref: '#/components/schemas/PredictionInput'
        - type: object
          required:
            - prediction_id
            - predicted_at
            - schema_version
            - created_at
            - updated_at
            - provenance
          properties:
            prediction_id:
              type: string
              description: Unique identifier for the prediction.
              readOnly: true
            predicted_at:
              type: string
              format: date-time
              description: Timestamp when the prediction was generated.
              readOnly: true
            schema_version:
              type: string
              description: Schema version of this document.
              readOnly: true
            created_at:
              type: string
              format: date-time
              description: Timestamp of document creation.
              readOnly: true
            updated_at:
              type: string
              format: date-time
              description: Timestamp of last document update.
              readOnly: true
            provenance:
              $ref: '#/components/schemas/Provenance'
              readOnly: true
          description: Name of the option.
        description:
          type: string
          description: Description of the option.
        associated_timeline_id:
          type: string
          description: Reference to a timeline_id from the simulations collection.
        expected_roi:
          type: object
          description: Expected ROI metrics if this option is chosen.

    DecisionInput:
      type: object
      required:
        - problem_id
        - simulation_id
        - title
        - description
      properties:
        problem_id:
          type: string
          description: Reference to the problem_id this decision is related to.
        simulation_id:
          type: string
          description: Reference to the simulation_id that informed this decision.
        title:
          type: string
          description: Title of the decision point.
        description:
          type: string
          description: Detailed description of the decision to be made.
        options:
          type: array
          items:
            $ref: '#/components/schemas/OptionItem'
          description: An array of maps, each representing a possible decision option.
        selected_option:
          type: string
          description: The option_id of the chosen option.
        decided_by:
          type: string
          description: Identifier of the user or system that made the decision.
        decided_at:
          type: string
          format: date-time
          description: Timestamp when the decision was made.
        outcome:
          type: object
          description: The actual outcome of the selected decision.
        confidence_score:
          type: number
          format: float
          description: Confidence in the decision's potential outcome.

    Decision:
      allOf:
        - $ref: '#/components/schemas/DecisionInput'
        - type: object
          required:
            - decision_id
            - schema_version
            - created_at
            - updated_at
            - provenance
          properties:
            decision_id:
              type: string
              description: Unique identifier for the decision.
              readOnly: true
            schema_version:
              type: string
              description: Schema version of this document.
              readOnly: true
            created_at:
              type: string
              format: date-time
              description: Timestamp of document creation.
              readOnly: true
            updated_at:
              type: string
              format: date-time
              description: Timestamp of last document update.
              readOnly: true
            provenance:
              $ref: '#/components/schemas/Provenance'
              readOnly: true

    PredictionInput:
      type: object
      required:
        - domain
        - query
        - prediction_text
      properties:
        domain:
          type: string
          description: The domain of the prediction (e.g., 'finance', 'business', 'life', 'market').
          enum: [finance, business, life, market]
        query:
          type: string
          description: The input query or context for the prediction.
        prediction_text:
          type: string
          description: The generated prediction.
        confidence_score:
          type: number
          format: float
          description: A numerical score indicating the confidence in the prediction.
        control_mode:
          type: string
          description: The control mode used for this prediction.
          enum: [auto, hybrid, manual]
          default: auto

    Prediction:
      allOf:
        - $ref: '#/components/schemas/PredictionInput'
        - type: object
          required:
            - prediction_id
            - predicted_at
            - schema_version
            - created_at
            - updated_at
            - provenance
          properties:
            prediction_id:
              type: string
              description: Unique identifier for the prediction.
              readOnly: true
            predicted_at:
              type: string
              format: date-time
              description: Timestamp when the prediction was generated.
              readOnly: true
            schema_version:
              type: string
              description: Schema version of this document.
              readOnly: true
            created_at:
              type: string
              format: date-time
              description: Timestamp of document creation.
              readOnly: true
            updated_at:
              type: string
              format: date-time
              description: Timestamp of last document update.
              readOnly: true
            provenance:
              $ref: '#/components/schemas/Provenance'
              readOnly: true
```
