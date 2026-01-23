/**
 * AI Prophet Static Data Loader
 * Loads AI Prophet data from the public directory
 */

const DATA_BASE_PATH = '/data/ai-prophet';

/**
 * Load pipeline results from static files
 */
export const loadPipelineResults = async () => {
  try {
    // Get list of pipeline result files
    const files = await fetch(`${DATA_BASE_PATH}/pipeline_results/`).then(r => r.text());
    
    // Parse the directory listing to find the latest file
    // For now, try to load a known file
    const response = await fetch(`${DATA_BASE_PATH}/pipeline_results/pipeline_20260111_100804.json`);
    
    if (!response.ok) {
      throw new Error('Pipeline results not found');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error loading pipeline results:', error);
    return null;
  }
};

/**
 * Load all timeline simulations
 */
export const loadTimelines = async () => {
  try {
    // Load all timeline JSON files from simulations directory
    const timelineIds = [
      'TL-0ce75f45', 'TL-bfe2b818', 'TL-1ad288dc', 'TL-7b03b638',
      'TL-0c1c5148', 'TL-3215fa3c', 'TL-5e1e0a87', 'TL-231d32a5',
      'TL-5250a61a', 'TL-cfbe5a39', 'TL-e612656f', 'TL-dcac7192',
      'TL-12ffda32', 'TL-a0cff0e3', 'TL-35176442', 'TL-0d7cc4be',
      'TL-6cdc6b5b', 'TL-8e302d8f', 'TL-82e88db9', 'TL-01d32729',
      'TL-b8316659', 'TL-6a673105', 'TL-6d00abf8', 'TL-e885bdf0',
      'TL-43e79c11'
    ];
    
    const timelines = await Promise.all(
      timelineIds.map(async (id) => {
        try {
          const response = await fetch(`${DATA_BASE_PATH}/simulations/${id}.json`);
          if (response.ok) {
            return await response.json();
          }
          return null;
        } catch (error) {
          console.error(`Error loading timeline ${id}:`, error);
          return null;
        }
      })
    );
    
    return timelines.filter(t => t !== null);
  } catch (error) {
    console.error('Error loading timelines:', error);
    return [];
  }
};

/**
 * Load portfolio data
 */
export const loadPortfolio = async () => {
  try {
    const response = await fetch(`${DATA_BASE_PATH}/portfolios/AI_PROPHET_MASTER.json`);
    
    if (!response.ok) {
      throw new Error('Portfolio not found');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error loading portfolio:', error);
    return null;
  }
};

/**
 * Load learning report
 */
export const loadLearningReport = async () => {
  try {
    const response = await fetch(`${DATA_BASE_PATH}/learning/learning_report_20260111.json`);
    
    if (!response.ok) {
      throw new Error('Learning report not found');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error loading learning report:', error);
    return null;
  }
};

/**
 * Load scraped data
 */
export const loadScrapedData = async (source) => {
  try {
    const sources = source ? [source] : [
      'crypto_data',
      'economic_calendar',
      'financial_news',
      'market_data',
      'short_interest',
      'social_sentiment'
    ];
    
    const data = await Promise.all(
      sources.map(async (src) => {
        try {
          const response = await fetch(`${DATA_BASE_PATH}/scraped/${src}_20260111_100804.json`);
          if (response.ok) {
            return { source: src, data: await response.json() };
          }
          return null;
        } catch (error) {
          console.error(`Error loading ${src}:`, error);
          return null;
        }
      })
    );
    
    return data.filter(d => d !== null);
  } catch (error) {
    console.error('Error loading scraped data:', error);
    return [];
  }
};

/**
 * Load all AI Prophet data
 */
export const loadAllData = async () => {
  try {
    const [pipeline, timelines, portfolio, learning, scraped] = await Promise.all([
      loadPipelineResults(),
      loadTimelines(),
      loadPortfolio(),
      loadLearningReport(),
      loadScrapedData()
    ]);
    
    return {
      pipeline,
      timelines,
      portfolio,
      learning,
      scraped,
      loaded_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error loading all AI Prophet data:', error);
    return null;
  }
};

export default {
  loadPipelineResults,
  loadTimelines,
  loadPortfolio,
  loadLearningReport,
  loadScrapedData,
  loadAllData
};
