"""FastAPI server for Infinity Matrix platform."""

from contextlib import asynccontextmanager
from typing import Any, dict, list

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from infinity_matrix.core.config import settings
from infinity_matrix.core.logging import get_logger

logger = get_logger("api")


# Request/Response Models
class AnalysisRequest(BaseModel):
    """Analysis request model."""
    symbol: str
    timeframe: str = "1d"
    analysis_type: str = "stock"


class LeadCriteria(BaseModel):
    """Lead generation criteria."""
    location: str
    lead_type: str = "buyer"
    price_range: tuple[int, int] | None = None
    property_type: str | None = None


class CampaignRequest(BaseModel):
    """Campaign creation request."""
    name: str
    lead_ids: list[str]
    template: str
    channel: str = "email"


# Lifespan context manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager."""
    logger.info("starting_api_server")
    yield
    logger.info("shutting_down_api_server")


# Create FastAPI app
app = FastAPI(
    title="Infinity Matrix API",
    description="Enterprise Intelligence Platform API",
    version="1.0.0",
    lifespan=lifespan,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root() -> dict[str, Any]:
    """Root endpoint."""
    return {
        "name": "Infinity Matrix API",
        "version": "1.0.0",
        "status": "operational",
    }


@app.get("/health")
async def health_check() -> dict[str, str]:
    """Health check endpoint."""
    return {"status": "healthy"}


# Financial Analysis Endpoints
@app.post("/api/v1/finance/analyze")
async def analyze_financial(request: AnalysisRequest) -> dict[str, Any]:
    """Analyze financial instrument."""
    from infinity_matrix.industries.finance import CryptoAnalyzer, FinancialAnalyzer

    try:
        if request.analysis_type == "crypto":
            analyzer = CryptoAnalyzer()
        else:
            analyzer = FinancialAnalyzer()

        await analyzer.initialize()
        result = await analyzer.analyze({
            "symbol": request.symbol,
            "timeframe": request.timeframe,
        })
        await analyzer.shutdown()

        return result

    except Exception as e:
        logger.error("financial_analysis_failed", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/v1/finance/market-sentiment")
async def get_market_sentiment(
    symbols: list[str] = Query(..., description="list of stock symbols")
) -> dict[str, Any]:
    """Get market sentiment for symbols."""
    from infinity_matrix.industries.finance import FinancialAnalyzer

    try:
        analyzer = FinancialAnalyzer()
        await analyzer.initialize()
        result = await analyzer.get_market_sentiment(symbols)
        await analyzer.shutdown()

        return result

    except Exception as e:
        logger.error("market_sentiment_failed", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))


# Real Estate Endpoints
@app.post("/api/v1/real-estate/discover-leads")
async def discover_real_estate_leads(criteria: LeadCriteria) -> dict[str, Any]:
    """Discover real estate leads."""
    from infinity_matrix.industries.real_estate import RealEstateEngine

    try:
        engine = RealEstateEngine()
        await engine.initialize()

        leads = await engine.discover_leads(
            location=criteria.location,
            criteria={
                "lead_type": criteria.lead_type,
                "price_range": criteria.price_range,
                "property_type": criteria.property_type,
            }
        )

        await engine.shutdown()

        return {
            "leads": leads,
            "count": len(leads),
            "success": True,
        }

    except Exception as e:
        logger.error("lead_discovery_failed", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/v1/real-estate/analyze-market")
async def analyze_real_estate_market(
    location: str = Query(..., description="Location to analyze"),
    property_type: str = Query("residential", description="Property type")
) -> dict[str, Any]:
    """Analyze real estate market."""
    from infinity_matrix.industries.real_estate import RealEstateEngine

    try:
        engine = RealEstateEngine()
        await engine.initialize()
        result = await engine.analyze_market(location, property_type)
        await engine.shutdown()

        return result

    except Exception as e:
        logger.error("market_analysis_failed", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))


# Loan Lead Generation Endpoints
@app.post("/api/v1/loans/discover-leads")
async def discover_loan_leads(
    loan_type: str = Query(..., description="Loan type"),
    min_amount: int = Query(0, description="Minimum loan amount"),
    max_amount: int = Query(1000000, description="Maximum loan amount"),
) -> dict[str, Any]:
    """Discover loan leads."""
    from infinity_matrix.industries.loans import LoanLeadGenerator

    try:
        generator = LoanLeadGenerator()
        await generator.initialize()

        leads = await generator.discover_leads({
            "loan_type": loan_type,
            "min_amount": min_amount,
            "max_amount": max_amount,
        })

        await generator.shutdown()

        return {
            "leads": leads,
            "count": len(leads),
            "success": True,
        }

    except Exception as e:
        logger.error("loan_lead_discovery_failed", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))


# Economic Analysis Endpoints
@app.get("/api/v1/economic/indicator")
async def get_economic_indicator(
    indicator: str = Query(..., description="Indicator name"),
    region: str = Query("US", description="Region code"),
) -> dict[str, Any]:
    """Get economic indicator."""
    from infinity_matrix.industries.economic import EconomicAnalyzer

    try:
        analyzer = EconomicAnalyzer()
        await analyzer.initialize()
        result = await analyzer.get_indicator(indicator, region)
        await analyzer.shutdown()

        return result

    except Exception as e:
        logger.error("economic_indicator_failed", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/v1/economic/snapshot")
async def get_economic_snapshot(
    region: str = Query("US", description="Region code"),
) -> dict[str, Any]:
    """Get economic snapshot."""
    from infinity_matrix.industries.economic import EconomicAnalyzer

    try:
        analyzer = EconomicAnalyzer()
        await analyzer.initialize()
        result = await analyzer.get_economic_snapshot(region)
        await analyzer.shutdown()

        return result

    except Exception as e:
        logger.error("economic_snapshot_failed", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))


# Sentiment Analysis Endpoints
@app.post("/api/v1/sentiment/analyze")
async def analyze_sentiment(
    text: str = Query(..., description="Text to analyze"),
    method: str = Query("vader", description="Analysis method"),
) -> dict[str, Any]:
    """Analyze sentiment."""
    from infinity_matrix.analytics.sentiment import SentimentAnalyzer

    try:
        analyzer = SentimentAnalyzer()
        result = await analyzer.analyze_text(text, method)

        return result

    except Exception as e:
        logger.error("sentiment_analysis_failed", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))


# Campaign Endpoints
@app.post("/api/v1/campaigns/create")
async def create_campaign(request: CampaignRequest) -> dict[str, Any]:
    """Create a campaign."""
    from infinity_matrix.campaigns import CampaignEngine

    try:
        engine = CampaignEngine()
        await engine.initialize()

        # Would fetch actual leads from database
        leads = [{"id": lid, "contact": {}} for lid in request.lead_ids]

        campaign_id = await engine.create_campaign(
            name=request.name,
            leads=leads,
            template=request.template,
            channel=request.channel,
        )

        await engine.shutdown()

        return {
            "campaign_id": campaign_id,
            "success": True,
        }

    except Exception as e:
        logger.error("campaign_creation_failed", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/v1/campaigns/{campaign_id}/launch")
async def launch_campaign(campaign_id: str) -> dict[str, Any]:
    """Launch a campaign."""
    from infinity_matrix.campaigns import CampaignEngine

    try:
        engine = CampaignEngine()
        await engine.initialize()
        await engine.launch_campaign(campaign_id)
        status = await engine.get_campaign_status(campaign_id)
        await engine.shutdown()

        return status

    except Exception as e:
        logger.error("campaign_launch_failed", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/v1/campaigns/{campaign_id}/status")
async def get_campaign_status(campaign_id: str) -> dict[str, Any]:
    """Get campaign status."""
    from infinity_matrix.campaigns import CampaignEngine

    try:
        engine = CampaignEngine()
        await engine.initialize()
        status = await engine.get_campaign_status(campaign_id)
        await engine.shutdown()

        return status

    except Exception as e:
        logger.error("campaign_status_failed", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))


# Crawler Endpoints
@app.post("/api/v1/crawl")
async def crawl_url(
    url: str = Query(..., description="URL to crawl"),
    use_headless: bool = Query(True, description="Use headless browser"),
) -> dict[str, Any]:
    """Crawl a URL."""
    try:
        if use_headless:
            from infinity_matrix.crawlers import HeadlessCrawler
            crawler = HeadlessCrawler()
        else:
            from infinity_matrix.crawlers import ScrapingAgent
            crawler = ScrapingAgent()

        await crawler.initialize()
        result = await crawler.crawl(url)
        await crawler.shutdown()

        return result

    except Exception as e:
        logger.error("crawl_failed", url=url, error=str(e))
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "infinity_matrix.api.server:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.api_reload,
        workers=settings.api_workers if not settings.api_reload else 1,
    )
