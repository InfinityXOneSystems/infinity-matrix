
import React from 'react';
import IndustryPageTemplate from '@/components/industry/IndustryPageTemplate';
import { 
  Coins, Lock, Network, TrendingUp 
} from 'lucide-react';

const CryptoPage = () => {
  const subIndustries = [
    'DeFi',
    'NFTs & Metaverse',
    'Layer 1 & 2',
    'Exchanges',
    'Mining',
    'Web3 Gaming',
    'DAOs'
  ];

  const dashboardConfig = [
    {
      title: "Market Sentiment",
      icon: TrendingUp,
      type: "chart",
      data: { points: [30, 20, 40, 60, 50, 75, 80] }
    },
    {
      title: "On-Chain Vol",
      icon: Network,
      type: "stat",
      data: { value: "$42B", change: "+12%", trend: "up" }
    },
    {
      title: "Whale Alerts",
      icon: Coins,
      type: "list",
      data: {
        items: [
           { label: "BTC Move", value: "5000 BTC" },
           { label: "ETH Inflow", value: "Exchange" },
           { label: "USDT Mint", value: "100M" }
        ]
      }
    },
    {
      title: "Security Audit",
      icon: Lock,
      type: "stat",
      data: { value: "Passed", change: "100%", trend: "up" }
    }
  ];

  return (
    <IndustryPageTemplate 
       industryName="Crypto"
       subIndustries={subIndustries}
       dashboardConfig={dashboardConfig}
       searchPlaceholder="Search tokens, wallet addresses, or transaction hashes..."
    />
  );
};

export default CryptoPage;
