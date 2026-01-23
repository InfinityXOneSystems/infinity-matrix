
import React from 'react';
import IndustryPageTemplate from '@/components/industry/IndustryPageTemplate';
import { 
  TrendingUp, PieChart, AlertCircle, Landmark 
} from 'lucide-react';

const FinancePage = () => {
  const subIndustries = [
    'Investment Banking',
    'Fintech',
    'Insurance',
    'Wealth Management',
    'Private Equity',
    'Venture Capital',
    'Regulatory Compliance'
  ];

  const dashboardConfig = [
    {
      title: "Market Trends",
      icon: TrendingUp,
      type: "chart",
      data: { points: [65, 72, 68, 85, 90, 88, 95] }
    },
    {
      title: "Portfolio Risk",
      icon: PieChart,
      type: "stat",
      data: { value: "Low", change: "-2.4%", trend: "up" } // trend up here means good (less risk)
    },
    {
      title: "Regulatory Alerts",
      icon: AlertCircle,
      type: "list",
      data: {
        items: [
           { label: "SEC Filing 10-K", value: "New" },
           { label: "GDPR Update", value: "Pending" },
           { label: "Basel III", value: "Review" }
        ]
      }
    },
    {
      title: "Investment Signals",
      icon: Landmark,
      type: "stat",
      data: { value: "Strong Buy", change: "+15", trend: "up" }
    }
  ];

  return (
    <IndustryPageTemplate 
       industryName="Finance"
       subIndustries={subIndustries}
       dashboardConfig={dashboardConfig}
       searchPlaceholder="Search tickers, market reports, or regulatory filings..."
    />
  );
};

export default FinancePage;
