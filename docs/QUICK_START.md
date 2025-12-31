# Quick Start Guide

Welcome to Infinity Matrix! This guide will help you get up and running quickly.

## Installation

### Prerequisites

- Python 3.11 or higher
- PostgreSQL 14+ (optional, for persistence)
- Redis 6+ (optional, for caching)

### Basic Installation

```bash
# Clone the repository
git clone https://github.com/InfinityXOneSystems/infinity-matrix.git
cd infinity-matrix

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment template
cp .env.example .env
```

### Configuration

Edit `.env` file with your API keys:

```bash
# Required for AI features
OPENAI_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here

# Required for vision features
GOOGLE_CLOUD_PROJECT=your_project
GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json

# Optional for communication
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
SENDGRID_API_KEY=your_key
```

## Quick Examples

### 1. Financial Analysis

```python
import asyncio
from infinity_matrix.industries.finance import FinancialAnalyzer

async def analyze_stock():
    analyzer = FinancialAnalyzer()
    await analyzer.initialize()
    
    result = await analyzer.analyze_stock("AAPL")
    print(f"Price: ${result['current_price']:.2f}")
    print(f"Signal: {result['signal']}")
    
    await analyzer.shutdown()

asyncio.run(analyze_stock())
```

### 2. Lead Generation

```python
import asyncio
from infinity_matrix.industries.real_estate import RealEstateEngine

async def generate_leads():
    engine = RealEstateEngine()
    await engine.initialize()
    
    leads = await engine.discover_leads(
        location="San Francisco, CA",
        criteria={"lead_type": "buyer"}
    )
    
    print(f"Found {len(leads)} leads")
    await engine.shutdown()

asyncio.run(generate_leads())
```

### 3. Sentiment Analysis

```python
import asyncio
from infinity_matrix.analytics.sentiment import SentimentAnalyzer

async def analyze_sentiment():
    analyzer = SentimentAnalyzer()
    
    result = await analyzer.analyze_text(
        "This is amazing!",
        method="vader"
    )
    
    print(f"Score: {result['score']:.2f}")
    print(f"Label: {result['label']}")

asyncio.run(analyze_sentiment())
```

### 4. Web Crawling

```python
import asyncio
from infinity_matrix.crawlers import ScrapingAgent

async def crawl_website():
    agent = ScrapingAgent()
    await agent.initialize()
    
    result = await agent.crawl("https://example.com")
    print(f"Status: {result['status']}")
    
    await agent.shutdown()

asyncio.run(crawl_website())
```

## Using the CLI

The platform includes a powerful CLI tool:

```bash
# Start API server
infinity-matrix serve --port 8000

# Analyze a stock
infinity-matrix analyze-stock AAPL --timeframe 1d

# Discover leads
infinity-matrix discover-leads "San Francisco, CA" --lead-type buyer

# Crawl a website
infinity-matrix crawl https://example.com

# Analyze sentiment
infinity-matrix sentiment "This is great!" --method vader

# Get economic indicator
infinity-matrix economic gdp --region US
```

## Using the API

Start the API server:

```bash
python -m infinity_matrix.api.server
```

Or with Docker:

```bash
docker-compose up
```

Access the API documentation:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Example API Requests

```bash
# Analyze stock
curl -X POST "http://localhost:8000/api/v1/finance/analyze" \
  -H "Content-Type: application/json" \
  -d '{"symbol": "AAPL", "timeframe": "1d"}'

# Discover leads
curl -X POST "http://localhost:8000/api/v1/real-estate/discover-leads" \
  -H "Content-Type: application/json" \
  -d '{"location": "San Francisco, CA", "lead_type": "buyer"}'

# Analyze sentiment
curl "http://localhost:8000/api/v1/sentiment/analyze?text=This+is+great&method=vader"

# Crawl URL
curl "http://localhost:8000/api/v1/crawl?url=https://example.com"
```

## Running with Docker

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services included:
- API server (port 8000)
- PostgreSQL database
- Redis cache
- MongoDB document store
- Prometheus monitoring

## Industry Templates

Use pre-built templates for 10+ industries:

```python
from infinity_matrix.industries.templates import IndustryTemplateFactory, Industry

# Create template for financial services
template = IndustryTemplateFactory.create(Industry.FINANCIAL_SERVICES)

# Get recommended data sources
sources = template.get_data_sources()

# Get key metrics to track
metrics = template.get_key_metrics()

# Get lead criteria
criteria = template.get_lead_criteria()

# Create analysis pipeline
pipeline = await template.create_analysis_pipeline()

# Create lead generation strategy
strategy = await template.create_lead_generation_strategy()
```

Available industries:
- Financial Services
- Real Estate
- Lending
- E-commerce
- Healthcare
- Legal
- Insurance
- Technology
- Manufacturing
- Retail

## Next Steps

1. **Explore Examples**: Check the `examples/` directory for more comprehensive examples
2. **Read Documentation**: See `docs/` for detailed API documentation
3. **Customize**: Modify industry templates and create custom analyzers
4. **Integrate**: Connect with your existing systems using the REST API
5. **Scale**: Deploy using Docker and Kubernetes for production

## Getting Help

- Documentation: https://docs.infinityxonesystems.com
- Issues: https://github.com/InfinityXOneSystems/infinity-matrix/issues
- Community: https://community.infinityxonesystems.com

## What's Next?

- Set up your first data pipeline
- Create a custom analyzer
- Build an industry-specific application
- Deploy to production

Happy analyzing! 🚀
