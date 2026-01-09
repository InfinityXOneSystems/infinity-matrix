
import React from 'react';
import IndustryPageTemplate from '@/components/industry/IndustryPageTemplate';
import { 
  Factory, Settings, Truck, ClipboardList 
} from 'lucide-react';

const ManufacturingPage = () => {
  const subIndustries = [
    'Automotive',
    'Aerospace',
    'Industrial Machinery',
    'Electronics',
    'Food & Beverage',
    'Textiles',
    'Chemicals'
  ];

  const dashboardConfig = [
    {
      title: "Supply Chain",
      icon: Truck,
      type: "stat",
      data: { value: "Optimal", change: "98% On-Time", trend: "up" }
    },
    {
      title: "Production Yield",
      icon: Factory,
      type: "chart",
      data: { points: [80, 82, 81, 85, 87, 86, 89] }
    },
    {
      title: "Maintenance",
      icon: Settings,
      type: "list",
      data: {
        items: [
           { label: "Unit 4 Belt", value: "Replace" },
           { label: "Hydraulics", value: "Check" },
           { label: "Assembly A", value: "OK" }
        ]
      }
    },
    {
      title: "Defect Rate",
      icon: ClipboardList,
      type: "stat",
      data: { value: "0.4%", change: "-0.1%", trend: "up" } // Down is good for defects, visualizing as improvement
    }
  ];

  return (
    <IndustryPageTemplate 
       industryName="Manufacturing"
       subIndustries={subIndustries}
       dashboardConfig={dashboardConfig}
       searchPlaceholder="Search suppliers, inventory levels, or production logs..."
    />
  );
};

export default ManufacturingPage;
