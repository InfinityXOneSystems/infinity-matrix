"""Example: Real estate lead generation and campaign automation."""

import asyncio

from infinity_matrix.industries.real_estate import RealEstateEngine


async def main():
    """Run real estate lead generation example."""
    # Initialize engine
    engine = RealEstateEngine()
    await engine.initialize()

    print("=== Real Estate Lead Generation Example ===\n")

    # Discover leads
    print("Discovering buyer leads in San Francisco...")
    leads = await engine.discover_leads(
        location="San Francisco, CA",
        criteria={
            "lead_type": "buyer",
            "price_range": (500000, 1000000),
            "property_type": "residential",
        }
    )

    print(f"Found {len(leads)} leads")
    print("\nTop 5 leads by score:")

    for i, lead in enumerate(leads[:5], 1):
        print(f"{i}. {lead['contact']['name']} - Score: {lead['score']:.2f}")
        print(f"   Email: {lead['contact']['email']}")
        print(f"   Type: {lead['type']}")
        print()

    print("="*50 + "\n")

    # Analyze market
    print("Analyzing San Francisco real estate market...")
    market = await engine.analyze_market("San Francisco, CA", "residential")

    if market.get("success"):
        print(f"Location: {market['location']}")
        print(f"Property Type: {market['property_type']}")
        print(f"Market Temperature: {market['market_indicators']['market_temperature']}")

    print("\n" + "="*50 + "\n")

    # Launch campaign (simulated)
    print("Launching email campaign for top leads...")

    # Select top 5 leads for campaign
    top_leads = leads[:5]

    campaign_result = await engine.launch_campaign(
        leads=top_leads,
        channel="email",
    )

    if campaign_result.get("success"):
        print(f"Campaign ID: {campaign_result['campaign_id']}")
        print(f"Leads targeted: {campaign_result['leads_count']}")
        print(f"Channel: {campaign_result['channel']}")

    # Cleanup
    await engine.shutdown()
    print("\nLead generation complete!")


if __name__ == "__main__":
    asyncio.run(main())
