
import React from 'react';
import IndustryPageTemplate from '@/components/industry/IndustryPageTemplate';
import { 
  Activity, Heart, FilePlus, Stethoscope 
} from 'lucide-react';

const HealthcarePage = () => {
  const subIndustries = [
    'Pharmaceuticals',
    'Biotechnology',
    'Hospitals & Care',
    'Medical Devices',
    'Telehealth',
    'Health Insurance',
    'Genomics'
  ];

  const dashboardConfig = [
    {
      title: "Patient Analytics",
      icon: Activity,
      type: "chart",
      data: { points: [45, 50, 55, 52, 60, 65, 70] }
    },
    {
      title: "Compliance Score",
      icon: FilePlus,
      type: "stat",
      data: { value: "99.8%", change: "+0.2%", trend: "up" }
    },
    {
      title: "Treatment Trends",
      icon: Stethoscope,
      type: "list",
      data: {
        items: [
           { label: "Immunotherapy", value: "+12%" },
           { label: "Tele-Consults", value: "+45%" },
           { label: "Generic Rx", value: "+5%" }
        ]
      }
    },
    {
      title: "Diagnostic AI",
      icon: Heart,
      type: "stat",
      data: { value: "Active", change: "94% Acc", trend: "up" }
    }
  ];

  return (
    <IndustryPageTemplate 
       industryName="Healthcare"
       subIndustries={subIndustries}
       dashboardConfig={dashboardConfig}
       searchPlaceholder="Search clinical trials, drug interactions, or patient data..."
    />
  );
};

export default HealthcarePage;
