
import React from 'react';
import IndustryPageTemplate from '@/components/industry/IndustryPageTemplate';
import { 
  Zap, Sun, Battery, BarChart3 
} from 'lucide-react';

const EnergyPage = () => {
  const subIndustries = [
    'Renewable Energy',
    'Oil & Gas',
    'Utilities',
    'Nuclear',
    'Grid Technology',
    'Battery Storage',
    'Carbon Capture'
  ];

  const dashboardConfig = [
    {
      title: "Grid Load",
      icon: Zap,
      type: "chart",
      data: { points: [40, 60, 80, 75, 65, 50, 45] }
    },
    {
      title: "Sustainability",
      icon: Sun,
      type: "stat",
      data: { value: "A+", change: "Net Zero", trend: "up" }
    },
    {
      title: "Market Prices",
      icon: BarChart3,
      type: "list",
      data: {
        items: [
           { label: "Crude Oil", value: "$78.50" },
           { label: "Natural Gas", value: "$2.40" },
           { label: "Solar kWh", value: "$0.04" }
        ]
      }
    },
    {
      title: "Storage Cap",
      icon: Battery,
      type: "stat",
      data: { value: "85%", change: "+5%", trend: "up" }
    }
  ];

  return (
    <IndustryPageTemplate 
       industryName="Energy"
       subIndustries={subIndustries}
       dashboardConfig={dashboardConfig}
       searchPlaceholder="Search grid data, consumption patterns, or regulations..."
    />
  );
};

export default EnergyPage;
