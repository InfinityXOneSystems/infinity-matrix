# Infinity X AI: Phase 4 - X1 Predict & Trading Firestore Data Models

This document details the Firestore data models for the X1 Predict & Trading module, ensuring adherence to Google Cloud best practices, including common fields for schema versioning, timestamps, and data provenance. Each collection is designed to support the functionalities of paper trading, leaderboard, daily proactive picks, and trade history.

## Common Document Fields

All documents across the defined collections will include the following standard fields to ensure data consistency, traceability, and schema evolution management:

| Field Name      | Type      | Description                                                                 |
| :-------------- | :-------- | :-------------------------------------------------------------------------- |
| `schema_version`| `Integer` | Tracks the schema version of the document, facilitating schema migrations.  |
| `created_at`    | `Timestamp`| The UTC timestamp when the document was first created.                      |
| `updated_at`    | `Timestamp`| The UTC timestamp when the document was last updated.                       |
| `provenance`    | `String`  | Indicates the source or origin of the data (e.g., 'system', 'user_input', 'prediction_engine'). |

## Collection: `x1_portfolios`

This collection stores individual paper trading portfolios for each user. Each document represents a unique portfolio and contains aggregated information about its state and performance.

| Field Name          | Type      | Description                                                                 |
| :------------------ | :-------- | :-------------------------------------------------------------------------- |
| `user_id`           | `String`  | Unique identifier for the user who owns the portfolio.                      |
| `portfolio_name`    | `String`  | A user-defined name for the paper trading portfolio.                        |
| `cash_balance`      | `Number`  | The current available cash in the portfolio.                                |
| `holdings`          | `Map`     | A map where keys are stock symbols (e.g., 'GOOGL') and values are objects containing `quantity` (Integer) and `average_price` (Number). |
| `performance_metrics`| `Map`     | Contains calculated performance metrics: `accuracy` (Number), `profit` (Number), `combined_score` (Number). |
| `trade_history_ref` | `String`  | Path to the sub-collection `x1_trade_history` for this portfolio.           |

## Collection: `x1_trade_history` (Sub-collection under `x1_portfolios`)

This sub-collection, nested under each `x1_portfolios` document, records every trade executed within that specific portfolio. This provides a detailed audit trail of all trading activities.

| Field Name              | Type      | Description                                                                 |
| :---------------------- | :-------- | :-------------------------------------------------------------------------- |
| `trade_id`              | `String`  | Unique identifier for the trade.                                            |
| `symbol`                | `String`  | The stock symbol involved in the trade (e.g., 'AAPL').                     |
| `trade_type`            | `String`  | Type of trade: 'BUY' or 'SELL'.                                             |
| `quantity`              | `Integer` | Number of shares traded.                                                    |
| `price`                 | `Number`  | Price per share at which the trade was executed.                            |
| `trade_timestamp`       | `Timestamp`| The UTC timestamp when the trade occurred.                                  |
| `status`                | `String`  | Current status of the trade: 'EXECUTED', 'PENDING', 'CANCELLED'.            |
| `confidence_score`      | `Number`  | A score indicating the confidence level of the prediction that led to this trade. |
| `gated_by_high_confidence`| `Boolean` | Indicates if the trade was executed due to a high-confidence gating rule.   |

## Collection: `x1_leaderboard`

This collection stores aggregated performance data for users participating in the paper trading leaderboard. It allows for ranking and comparison of trading performance.

| Field Name          | Type      | Description                                                                 |
| :------------------ | :-------- | :-------------------------------------------------------------------------- |\n| `user_id`           | `String`  | Unique identifier for the user.                                             |
| `portfolio_id`      | `String`  | Unique identifier for the portfolio contributing to the leaderboard score.  |
| `accuracy_score`    | `Number`  | Calculated accuracy score for the user's predictions/trades.                |
| `profit_score`      | `Number`  | Calculated profit score for the user's portfolio.                           |
| `combined_score`    | `Number`  | A composite score combining accuracy and profit for overall ranking.        |
| `last_updated`      | `Timestamp`| The UTC timestamp when the leaderboard entry was last updated.              |

## Collection: `x1_daily_picks`

This collection stores the daily proactive trading picks generated by the prediction engine. These picks can be used to inform user trading decisions or for automated high-confidence gating.

| Field Name          | Type      | Description                                                                 |
| :------------------ | :-------- | :-------------------------------------------------------------------------- |
| `pick_date`         | `Timestamp`| The date for which the trading pick is valid.                               |
| `symbol`            | `String`  | The stock symbol for the daily pick.                                        |
| `action`            | `String`  | Recommended action: 'BUY', 'SELL', or 'HOLD'.                               |
| `target_price`      | `Number`  | The predicted target price for the stock.                                   |
| `confidence_score`  | `Number`  | The confidence level associated with this daily pick.                       |
| `generated_by`      | `String`  | Identifies the source or version of the prediction engine that generated the pick (e.g., 'prediction_engine_v1'). |
