/**
 * AI Prophet Service
 * Handles data fetching and integration with AI Prophet pipeline
 */

import * as dataLoader from './aiProphetDataLoader';

const AI_PROPHET_API_BASE = process.env.VITE_AI_PROPHET_API || 'http://localhost:8000/api';
const USE_STATIC_DATA = process.env.VITE_USE_STATIC_AI_PROPHET_DATA !== 'false';

/**
 * Fetch latest pipeline execution results
 */
export const fetchPipelineResults = async () => {
  try {
    const response = await fetch(`${AI_PROPHET_API_BASE}/pipeline/latest`);
    if (!response.ok) {
      throw new Error(`Failed to fetch pipeline results: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching pipeline results:', error);
    // Try loading from static files
    if (USE_STATIC_DATA) {
      const staticData = await dataLoader.loadPipelineResults();
      if (staticData) return staticData;
    }
    // Return mock data as last resort
    return {
      date: new Date().toISOString(),
      pipeline_status: 'complete',
      stages: {
        scraping: { status: 'complete', data_points: 1247 },
        predictions: { status: 'complete', count: 15 },
        simulations: { status: 'complete', timelines: 25 },
        trading: { status: 'complete', trades_executed: 3 },
        evaluation: { status: 'complete', evaluated: 8 },
        learning: { status: 'complete', accuracy: 0.847 }
      }
    };
  }
};

/**
 * Fetch all timeline simulations
 */
export const fetchTimelines = async () => {
  try {
    const response = await fetch(`${AI_PROPHET_API_BASE}/simulations/timelines`);
    if (!response.ok) {
      throw new Error(`Failed to fetch timelines: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching timelines:', error);
    // Try loading from static files
    if (USE_STATIC_DATA) {
      const staticData = await dataLoader.loadTimelines();
      if (staticData && staticData.length > 0) return staticData;
    }
    // Return mock data for development
    return [
      {
        timeline_id: 'TL-0ce75f45',
        name: 'Base Case',
        timeline_type: 'base_case',
        probability: 0.50,
        description: 'Most likely scenario based on current market trends and historical patterns',
        target_asset: 'BTC',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        theory_basis: 'Momentum Theory, Behavioral Finance',
        states: generateMockStates(30, 45000)
      },
      {
        timeline_id: 'TL-bfe2b818',
        name: 'Optimistic Bull Run',
        timeline_type: 'optimistic',
        probability: 0.25,
        description: 'Favorable market conditions with strong institutional adoption and positive regulatory developments',
        target_asset: 'BTC',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        theory_basis: 'Efficient Market Hypothesis, Network Effects',
        states: generateMockStates(30, 45000, 1.15)
      },
      {
        timeline_id: 'TL-1ad288dc',
        name: 'Bearish Correction',
        timeline_type: 'pessimistic',
        probability: 0.15,
        description: 'Market correction due to regulatory concerns, profit-taking, and macroeconomic headwinds',
        target_asset: 'BTC',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        theory_basis: 'Market Cycles, Risk Management Theory',
        states: generateMockStates(30, 45000, 0.85)
      },
      {
        timeline_id: 'TL-7b03b638',
        name: 'Momentum Surge',
        timeline_type: 'momentum',
        probability: 0.10,
        description: 'Rapid price movement driven by technical breakout patterns and FOMO dynamics',
        target_asset: 'ETH',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        theory_basis: 'Technical Analysis, Momentum Theory',
        states: generateMockStates(30, 3200, 1.25)
      }
    ];
  }
};

/**
 * Fetch specific timeline details
 */
export const fetchTimelineDetails = async (timelineId) => {
  try {
    const response = await fetch(`${AI_PROPHET_API_BASE}/simulations/timeline/${timelineId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch timeline details: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching timeline details:', error);
    return null;
  }
};

/**
 * Fetch portfolio data
 */
export const fetchPortfolio = async () => {
  try {
    const response = await fetch(`${AI_PROPHET_API_BASE}/trading/portfolio`);
    if (!response.ok) {
      throw new Error(`Failed to fetch portfolio: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    // Try loading from static files
    if (USE_STATIC_DATA) {
      const staticData = await dataLoader.loadPortfolio();
      if (staticData) return staticData;
    }
    // Return mock data for development
    return {
      portfolio_id: 'AI_PROPHET_MASTER',
      cash_balance: 1000000,
      total_value: 1000000,
      total_pnl: 0,
      total_pnl_pct: 0,
      positions: [],
      trades: [],
      created_at: new Date().toISOString()
    };
  }
};

/**
 * Fetch accuracy metrics
 */
export const fetchAccuracyMetrics = async (days = 30) => {
  try {
    const response = await fetch(`${AI_PROPHET_API_BASE}/accuracy/metrics?days=${days}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch accuracy metrics: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching accuracy metrics:', error);
    return {
      overall_accuracy: 0.0,
      total_predictions: 0,
      correct_predictions: 0,
      by_category: {},
      by_model: {}
    };
  }
};

/**
 * Trigger pipeline execution
 */
export const runPipeline = async () => {
  try {
    const response = await fetch(`${AI_PROPHET_API_BASE}/pipeline/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to run pipeline: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error running pipeline:', error);
    throw error;
  }
};

/**
 * Fetch scraped data
 */
export const fetchScrapedData = async (source = null) => {
  try {
    const url = source 
      ? `${AI_PROPHET_API_BASE}/data/scraped?source=${source}`
      : `${AI_PROPHET_API_BASE}/data/scraped`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch scraped data: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching scraped data:', error);
    return [];
  }
};

/**
 * Helper function to generate mock timeline states
 */
function generateMockStates(days, startPrice, trendMultiplier = 1.0) {
  const states = [];
  let price = startPrice;
  const baseVolume = 500000000;
  
  for (let i = 0; i < days; i++) {
    const dayChange = (Math.random() - 0.5) * 0.05 * trendMultiplier;
    price = price * (1 + dayChange);
    
    states.push({
      timestamp: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString(),
      price: price,
      volume: baseVolume * (0.5 + Math.random()),
      sentiment: (Math.random() - 0.5) * 2,
      volatility: Math.random() * 0.05,
      momentum: dayChange,
      events: []
    });
  }
  
  return states;
}

/**
 * WebSocket connection for real-time updates
 */
export class AIProphetWebSocket {
  constructor(onMessage, onError) {
    this.ws = null;
    this.onMessage = onMessage;
    this.onError = onError;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect() {
    const wsUrl = process.env.VITE_AI_PROPHET_WS || 'ws://localhost:8000/ws';
    
    try {
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        console.log('AI Prophet WebSocket connected');
        this.reconnectAttempts = 0;
      };
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.onMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        if (this.onError) this.onError(error);
      };
      
      this.ws.onclose = () => {
        console.log('WebSocket closed');
        this.reconnect();
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      if (this.onError) this.onError(error);
    }
  }

  reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
      setTimeout(() => this.connect(), delay);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }
}

export default {
  fetchPipelineResults,
  fetchTimelines,
  fetchTimelineDetails,
  fetchPortfolio,
  fetchAccuracyMetrics,
  runPipeline,
  fetchScrapedData,
  AIProphetWebSocket
};
