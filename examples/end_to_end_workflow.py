"""Example: Complete end-to-end workflow - Real estate intelligence to campaign."""

import asyncio
from datetime import datetime

from infinity_matrix.analytics.sentiment import SentimentAnalyzer
from infinity_matrix.campaigns import CampaignEngine
from infinity_matrix.industries.real_estate import RealEstateEngine


async def main():
    """
    Complete workflow demonstrating:
    1. Market analysis
    2. Lead discovery and scoring
    3. Sentiment analysis on leads
    4. Campaign creation and launch
    5. Analytics tracking
    """

    print("="*70)
    print("INFINITY MATRIX - END-TO-END REAL ESTATE INTELLIGENCE WORKFLOW")
    print("="*70)
    print()

    # Step 1: Market Analysis
    print("STEP 1: MARKET ANALYSIS")
    print("-"*70)

    engine = RealEstateEngine()
    await engine.initialize()

    location = "San Francisco, CA"
    print(f"Analyzing {location} real estate market...")

    market = await engine.analyze_market(location, "residential")

    if market.get("success"):
        print(f"✓ Market Temperature: {market['market_indicators']['market_temperature']}")
        print("✓ Analysis Complete")

    print()

    # Step 2: Lead Discovery
    print("STEP 2: LEAD DISCOVERY & SCORING")
    print("-"*70)

    print("Discovering high-value buyer leads...")

    leads = await engine.discover_leads(
        location=location,
        criteria={
            "lead_type": "buyer",
            "price_range": (750000, 1500000),
            "property_type": "residential"
        }
    )

    print(f"✓ Found {len(leads)} total leads")

    # Filter for high-quality leads
    high_quality_leads = [l for l in leads if l["score"] >= 0.7]
    print(f"✓ {len(high_quality_leads)} high-quality leads (score >= 0.7)")

    # Display top leads
    print("\nTop 5 Leads:")
    for i, lead in enumerate(high_quality_leads[:5], 1):
        print(f"  {i}. {lead['contact']['name']} - Score: {lead['score']:.2f}")

    print()

    # Step 3: Sentiment Analysis (simulated social media mentions)
    print("STEP 3: SENTIMENT ANALYSIS")
    print("-"*70)

    analyzer = SentimentAnalyzer()

    # Simulate social media mentions about the market
    social_mentions = [
        "San Francisco real estate market is heating up!",
        "Great time to buy in SF, prices are stabilizing",
        "Love the new developments in the area",
    ]

    print("Analyzing market sentiment from social media...")
    sentiment_results = await analyzer.analyze_batch(social_mentions)

    avg_sentiment = sum(r["score"] for r in sentiment_results) / len(sentiment_results)
    print(f"✓ Average Market Sentiment: {avg_sentiment:.2f}")

    positive_count = sum(1 for r in sentiment_results if "positive" in r["label"])
    print(f"✓ Positive Mentions: {positive_count}/{len(sentiment_results)}")

    print()

    # Step 4: Campaign Creation
    print("STEP 4: CAMPAIGN CREATION")
    print("-"*70)

    campaign_engine = CampaignEngine()
    await campaign_engine.initialize()

    # Create personalized email template
    template = """
    Hi {name},

    We noticed you're interested in properties in San Francisco.
    The market is currently {market_temp} with great opportunities in your price range.

    Based on our analysis, we have several properties that match your criteria:
    - Price Range: $750K - $1.5M
    - Type: Residential
    - Location: San Francisco

    Would you like to schedule a viewing?

    Best regards,
    The Infinity Matrix Team
    """

    print("Creating email campaign for top leads...")

    campaign_id = await campaign_engine.create_campaign(
        name=f"SF Real Estate - High Value Buyers - {datetime.now().strftime('%Y-%m-%d')}",
        leads=high_quality_leads[:10],  # Top 10 leads
        template=template,
        channel="email"
    )

    print(f"✓ Campaign Created: {campaign_id}")

    print()

    # Step 5: Campaign Launch (simulated)
    print("STEP 5: CAMPAIGN LAUNCH")
    print("-"*70)

    print("Launching campaign...")

    # In production, this would actually send emails
    print("✓ Campaign launched (simulation mode)")
    print(f"✓ Target: {len(high_quality_leads[:10])} leads")
    print("✓ Channel: Email")

    # Get campaign status
    status = await campaign_engine.get_campaign_status(campaign_id)

    if status.get("success"):
        print(f"✓ Status: {status['status']}")
        print(f"✓ Contacted: {status['stats']['contacted']}/{status['stats']['total_leads']}")

    print()

    # Step 6: Analytics
    print("STEP 6: CAMPAIGN ANALYTICS")
    print("-"*70)

    analytics = await campaign_engine.get_campaign_analytics(campaign_id)

    if analytics.get("success"):
        print("Campaign Performance:")
        print(f"  Contact Rate: {analytics['rates']['contact_rate']:.1f}%")
        print(f"  Response Rate: {analytics['rates']['response_rate']:.1f}%")
        print(f"  Conversion Rate: {analytics['rates']['conversion_rate']:.1f}%")

    print()

    # Cleanup
    await engine.shutdown()
    await campaign_engine.shutdown()

    print("="*70)
    print("WORKFLOW COMPLETE")
    print("="*70)
    print()
    print("Summary:")
    print(f"  ✓ Analyzed {location} market")
    print(f"  ✓ Discovered {len(leads)} leads")
    print(f"  ✓ Scored and filtered to {len(high_quality_leads)} high-quality leads")
    print(f"  ✓ Analyzed market sentiment: {avg_sentiment:.2f}")
    print("  ✓ Created and launched campaign")
    print("  ✓ Tracked performance analytics")
    print()
    print("This workflow demonstrates the power of Infinity Matrix for:")
    print("  • Autonomous data gathering and analysis")
    print("  • AI-powered lead scoring and qualification")
    print("  • Multi-source intelligence aggregation")
    print("  • Automated campaign orchestration")
    print("  • Real-time analytics and optimization")
    print()
    print("Ready for production deployment! 🚀")


if __name__ == "__main__":
    asyncio.run(main())
