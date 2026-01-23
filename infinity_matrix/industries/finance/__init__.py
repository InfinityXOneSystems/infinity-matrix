"""Financial analysis module for stocks, crypto, and market predictions."""

from datetime import datetime
from typing import Any, dict, list

import pandas as pd

from infinity_matrix.core.base import BaseAnalyzer


class FinancialAnalyzer(BaseAnalyzer[dict[str, Any], dict[str, Any]]):
    """Advanced financial analysis engine."""

    def __init__(self, **kwargs: Any):
        """Initialize financial analyzer."""
        super().__init__(kwargs)
        self._yfinance = None
        self._alpha_vantage = None

    async def initialize(self) -> None:
        """Initialize financial data sources."""
        self.log_info("financial_analyzer_initialized")

    async def shutdown(self) -> None:
        """Cleanup resources."""
        self.log_info("financial_analyzer_shutdown")

    async def analyze(self, data: dict[str, Any]) -> dict[str, Any]:
        """Analyze financial data."""
        symbol = data.get("symbol")
        timeframe = data.get("timeframe", "1d")

        if not symbol:
            return {"error": "Symbol required", "success": False}

        return await self.analyze_stock(symbol, timeframe)

    async def analyze_stock(
        self,
        symbol: str,
        timeframe: str = "1d",
        period: str = "1mo",
    ) -> dict[str, Any]:
        """
        Analyze stock performance and generate insights.

        Args:
            symbol: Stock ticker symbol
            timeframe: Data timeframe (1m, 5m, 1h, 1d, etc.)
            period: Historical period (1d, 5d, 1mo, 1y, etc.)

        Returns:
            Analysis results with predictions
        """
        try:
            import yfinance as yf

            stock = yf.Ticker(symbol)

            # Get historical data
            hist = stock.history(period=period, interval=timeframe)

            if hist.empty:
                return {"error": f"No data for {symbol}", "success": False}

            # Calculate technical indicators
            analysis = {
                "symbol": symbol,
                "current_price": float(hist["Close"].iloc[-1]),
                "previous_close": float(hist["Close"].iloc[-2]) if len(hist) > 1 else None,
                "volume": int(hist["Volume"].iloc[-1]),
                "high_52w": float(hist["High"].max()),
                "low_52w": float(hist["Low"].min()),
            }

            # Calculate returns
            if len(hist) > 1:
                analysis["daily_return"] = float(
                    (hist["Close"].iloc[-1] - hist["Close"].iloc[-2])
                    / hist["Close"].iloc[-2] * 100
                )

            # Calculate moving averages
            if len(hist) >= 20:
                analysis["sma_20"] = float(hist["Close"].rolling(window=20).mean().iloc[-1])

            if len(hist) >= 50:
                analysis["sma_50"] = float(hist["Close"].rolling(window=50).mean().iloc[-1])

            # Calculate RSI
            analysis["rsi"] = self._calculate_rsi(hist["Close"].values)

            # Generate signal
            analysis["signal"] = self._generate_signal(analysis)

            # Get company info
            try:
                info = stock.info
                analysis["company_name"] = info.get("longName", symbol)
                analysis["sector"] = info.get("sector")
                analysis["market_cap"] = info.get("marketCap")
                analysis["pe_ratio"] = info.get("trailingPE")
            except:
                pass

            analysis["success"] = True
            analysis["timestamp"] = datetime.now().isoformat()

            self.log_info("stock_analysis_complete", symbol=symbol)
            return analysis

        except Exception as e:
            self.log_error("stock_analysis_failed", symbol=symbol, error=str(e))
            return {"error": str(e), "success": False}

    def _calculate_rsi(self, prices: Any, period: int = 14) -> float:
        """Calculate Relative Strength Index."""
        import numpy as np

        deltas = np.diff(prices)
        gains = np.where(deltas > 0, deltas, 0)
        losses = np.where(deltas < 0, -deltas, 0)

        avg_gain = np.mean(gains[-period:])
        avg_loss = np.mean(losses[-period:])

        if avg_loss == 0:
            return 100.0

        rs = avg_gain / avg_loss
        rsi = 100 - (100 / (1 + rs))

        return float(rsi)

    def _generate_signal(self, analysis: dict[str, Any]) -> str:
        """Generate trading signal based on analysis."""
        signals = []

        # RSI signal
        if "rsi" in analysis:
            if analysis["rsi"] < 30:
                signals.append("oversold")
            elif analysis["rsi"] > 70:
                signals.append("overbought")

        # Moving average signal
        if "sma_20" in analysis and "sma_50" in analysis:
            if analysis["sma_20"] > analysis["sma_50"]:
                signals.append("bullish")
            else:
                signals.append("bearish")

        # Default
        if not signals:
            return "neutral"

        # Return most common signal
        from collections import Counter
        return Counter(signals).most_common(1)[0][0]

    async def analyze_portfolio(
        self,
        portfolio: dict[str, float],
    ) -> dict[str, Any]:
        """
        Analyze a portfolio of stocks.

        Args:
            portfolio: Dictionary of {symbol: quantity}

        Returns:
            Portfolio analysis
        """
        import asyncio

        analyses = await asyncio.gather(
            *[self.analyze_stock(symbol) for symbol in portfolio.keys()],
            return_exceptions=True,
        )

        total_value = 0.0
        holdings = []

        for symbol, quantity in portfolio.items():
            idx = list(portfolio.keys()).index(symbol)
            analysis = analyses[idx]

            if isinstance(analysis, dict) and analysis.get("success"):
                value = analysis["current_price"] * quantity
                total_value += value

                holdings.append({
                    "symbol": symbol,
                    "quantity": quantity,
                    "price": analysis["current_price"],
                    "value": value,
                    "signal": analysis.get("signal"),
                })

        return {
            "total_value": total_value,
            "holdings": holdings,
            "diversification": len(holdings),
            "success": True,
        }

    async def get_market_sentiment(self, symbols: list[str]) -> dict[str, Any]:
        """
        Analyze overall market sentiment for given symbols.

        Args:
            symbols: list of stock symbols

        Returns:
            Market sentiment analysis
        """
        import asyncio

        analyses = await asyncio.gather(
            *[self.analyze_stock(symbol) for symbol in symbols],
            return_exceptions=True,
        )

        signals = [
            a.get("signal", "neutral")
            for a in analyses
            if isinstance(a, dict) and a.get("success")
        ]

        bullish = signals.count("bullish") + signals.count("oversold")
        bearish = signals.count("bearish") + signals.count("overbought")
        neutral = signals.count("neutral")

        total = len(signals)

        if bullish > bearish:
            overall = "bullish"
        elif bearish > bullish:
            overall = "bearish"
        else:
            overall = "neutral"

        return {
            "overall_sentiment": overall,
            "bullish_percentage": (bullish / total * 100) if total > 0 else 0,
            "bearish_percentage": (bearish / total * 100) if total > 0 else 0,
            "neutral_percentage": (neutral / total * 100) if total > 0 else 0,
            "signals": dict(zip(symbols, signals, strict=False)),
            "success": True,
        }


class CryptoAnalyzer(BaseAnalyzer[dict[str, Any], dict[str, Any]]):
    """Cryptocurrency analysis engine."""

    def __init__(self, **kwargs: Any):
        """Initialize crypto analyzer."""
        super().__init__(kwargs)

    async def initialize(self) -> None:
        """Initialize crypto data sources."""
        self.log_info("crypto_analyzer_initialized")

    async def shutdown(self) -> None:
        """Cleanup resources."""
        self.log_info("crypto_analyzer_shutdown")

    async def analyze(self, data: dict[str, Any]) -> dict[str, Any]:
        """Analyze cryptocurrency data."""
        symbol = data.get("symbol")

        if not symbol:
            return {"error": "Symbol required", "success": False}

        return await self.analyze_crypto(symbol)

    async def analyze_crypto(
        self,
        symbol: str,
        vs_currency: str = "usd",
    ) -> dict[str, Any]:
        """
        Analyze cryptocurrency.

        Args:
            symbol: Crypto symbol (BTC, ETH, etc.)
            vs_currency: Quote currency

        Returns:
            Analysis results
        """
        try:
            import ccxt

            exchange = ccxt.binance()

            # Get ticker data
            ticker = exchange.fetch_ticker(f"{symbol}/{vs_currency.upper()}")

            # Get OHLCV data
            ohlcv = exchange.fetch_ohlcv(
                f"{symbol}/{vs_currency.upper()}",
                "1d",
                limit=30,
            )

            df = pd.DataFrame(
                ohlcv,
                columns=["timestamp", "open", "high", "low", "close", "volume"],
            )

            analysis = {
                "symbol": symbol,
                "current_price": ticker["last"],
                "change_24h": ticker["percentage"],
                "high_24h": ticker["high"],
                "low_24h": ticker["low"],
                "volume_24h": ticker["quoteVolume"],
                "market_cap": ticker.get("info", {}).get("marketCap"),
                "high_30d": float(df["high"].max()),
                "low_30d": float(df["low"].min()),
                "avg_volume_30d": float(df["volume"].mean()),
                "volatility": float(df["close"].pct_change().std()),
                "success": True,
                "timestamp": datetime.now().isoformat(),
            }

            self.log_info("crypto_analysis_complete", symbol=symbol)
            return analysis

        except Exception as e:
            self.log_error("crypto_analysis_failed", symbol=symbol, error=str(e))
            return {"error": str(e), "success": False}
