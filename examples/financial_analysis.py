"""Example: Financial analysis and prediction."""

import asyncio

from infinity_matrix.industries.finance import FinancialAnalyzer


async def main():
    """Run financial analysis example."""
    # Initialize analyzer
    analyzer = FinancialAnalyzer()
    await analyzer.initialize()

    print("=== Financial Analysis Example ===\n")

    # Analyze a stock
    print("Analyzing AAPL stock...")
    result = await analyzer.analyze_stock("AAPL", "1d", "1mo")

    if result.get("success"):
        print(f"Current Price: ${result['current_price']:.2f}")
        print(f"Daily Return: {result.get('daily_return', 0):.2f}%")
        print(f"RSI: {result.get('rsi', 0):.2f}")
        print(f"Signal: {result.get('signal', 'N/A')}")
    else:
        print(f"Error: {result.get('error')}")

    print("\n" + "="*50 + "\n")

    # Analyze portfolio
    print("Analyzing portfolio...")
    portfolio = {
        "AAPL": 10,
        "GOOGL": 5,
        "MSFT": 8,
    }

    portfolio_result = await analyzer.analyze_portfolio(portfolio)

    if portfolio_result.get("success"):
        print(f"Total Value: ${portfolio_result['total_value']:.2f}")
        print(f"Holdings: {portfolio_result['diversification']}")

        print("\nIndividual Holdings:")
        for holding in portfolio_result['holdings']:
            print(f"  {holding['symbol']}: {holding['quantity']} shares @ ${holding['price']:.2f} = ${holding['value']:.2f}")

    print("\n" + "="*50 + "\n")

    # Get market sentiment
    print("Getting market sentiment...")
    sentiment = await analyzer.get_market_sentiment(["AAPL", "GOOGL", "MSFT", "AMZN", "TSLA"])

    if sentiment.get("success"):
        print(f"Overall Sentiment: {sentiment['overall_sentiment']}")
        print(f"Bullish: {sentiment['bullish_percentage']:.1f}%")
        print(f"Bearish: {sentiment['bearish_percentage']:.1f}%")
        print(f"Neutral: {sentiment['neutral_percentage']:.1f}%")

    # Cleanup
    await analyzer.shutdown()
    print("\nAnalysis complete!")


if __name__ == "__main__":
    asyncio.run(main())
