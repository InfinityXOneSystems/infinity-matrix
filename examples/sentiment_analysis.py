"""Example: Sentiment analysis and social intelligence."""

import asyncio

from infinity_matrix.analytics.sentiment import SentimentAnalyzer


async def main():
    """Run sentiment analysis example."""
    # Initialize analyzer
    analyzer = SentimentAnalyzer()

    print("=== Sentiment Analysis Example ===\n")

    # Sample texts
    texts = [
        "This product is absolutely amazing! Best purchase I've ever made.",
        "Terrible experience. Would not recommend to anyone.",
        "It's okay, nothing special.",
        "Love it! Exceeded all my expectations.",
        "Disappointing and overpriced.",
    ]

    print("Analyzing individual texts with VADER:")
    for i, text in enumerate(texts, 1):
        result = await analyzer.analyze_text(text, method="vader")

        if result.get("success"):
            print(f"{i}. \"{text[:50]}...\"")
            print(f"   Score: {result['score']:.2f}")
            print(f"   Label: {result['label']}")
            print()

    print("="*50 + "\n")

    # Batch analysis
    print("Performing batch sentiment analysis...")
    batch_results = await analyzer.analyze_batch(texts, method="vader")

    positive = sum(1 for r in batch_results if "positive" in r["label"])
    negative = sum(1 for r in batch_results if "negative" in r["label"])
    neutral = sum(1 for r in batch_results if "neutral" in r["label"])

    total = len(batch_results)
    print(f"Total analyzed: {total}")
    print(f"Positive: {positive} ({positive/total*100:.1f}%)")
    print(f"Negative: {negative} ({negative/total*100:.1f}%)")
    print(f"Neutral: {neutral} ({neutral/total*100:.1f}%)")

    print("\n" + "="*50 + "\n")

    # Consensus analysis
    print("Performing consensus analysis with multiple methods...")
    test_text = "This is an incredible product that I absolutely love!"

    consensus = await analyzer.analyze_consensus(test_text)

    if consensus.get("success"):
        print(f"Text: \"{test_text}\"")
        print(f"Consensus Score: {consensus['consensus_score']:.2f}")
        print(f"Consensus Label: {consensus['consensus_label']}")
        print(f"Confidence: {consensus['confidence']:.2f}")

    print("\nSentiment analysis complete!")


if __name__ == "__main__":
    asyncio.run(main())
