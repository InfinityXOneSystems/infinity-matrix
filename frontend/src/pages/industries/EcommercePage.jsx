
import React from 'react';
import IndustryPageTemplate from '@/components/industry/IndustryPageTemplate';
import { 
  ShoppingBag, Users, TrendingUp, DollarSign 
} from 'lucide-react';

const EcommercePage = () => {
  const subIndustries = [
    'Direct to Consumer',
    'Marketplaces',
    'B2B Commerce',
    'Dropshipping',
    'Social Commerce',
    'Retail Technology',
    'Logistics'
  ];

  const dashboardConfig = [
    {
      title: "Sales Forecast",
      icon: TrendingUp,
      type: "chart",
      data: { points: [20, 45, 30, 60, 55, 80, 95] }
    },
    {
      title: "Consumer Sentiment",
      icon: Users,
      type: "stat",
      data: { value: "Positive", change: "+8.5%", trend: "up" }
    },
    {
      title: "Competitor Price",
      icon: DollarSign,
      type: "list",
      data: {
        items: [
           { label: "Product A", value: "-$2.00" },
           { label: "Product B", value: "+$5.50" },
           { label: "Product C", value: "Equal" }
        ]
      }
    },
    {
      title: "Conversion Rate",
      icon: ShoppingBag,
      type: "stat",
      data: { value: "4.2%", change: "+0.8%", trend: "up" }
    }
  ];

  return (
    <IndustryPageTemplate 
       industryName="E-commerce"
       subIndustries={subIndustries}
       dashboardConfig={dashboardConfig}
       searchPlaceholder="Search product trends, competitor pricing, or reviews..."
    />
  );
};

export default EcommercePage;
