
import React from 'react';
import IndustryPageTemplate from '@/components/industry/IndustryPageTemplate';
import { 
  Cpu, Code2, Share2, Lightbulb 
} from 'lucide-react';

const TechnologyPage = () => {
  const subIndustries = [
    'SaaS',
    'Artificial Intelligence',
    'Cybersecurity',
    'Cloud Computing',
    'IoT & Hardware',
    'Semiconductors',
    'Big Data'
  ];

  const dashboardConfig = [
    {
      title: "Innovation Index",
      icon: Lightbulb,
      type: "stat",
      data: { value: "High", change: "+14.2", trend: "up" }
    },
    {
      title: "Tech Adoption",
      icon: Share2,
      type: "chart",
      data: { points: [10, 25, 40, 35, 60, 85, 90] }
    },
    {
      title: "Patent Activity",
      icon: Code2,
      type: "list",
      data: {
        items: [
           { label: "Quantum Comp", value: "+22%" },
           { label: "Neural Nets", value: "+150%" },
           { label: "Blockchain", value: "-5%" }
        ]
      }
    },
    {
      title: "Market Disruption",
      icon: Cpu,
      type: "stat",
      data: { value: "Critical", change: "Alert", trend: "up" } // "up" here for high alert/activity
    }
  ];

  return (
    <IndustryPageTemplate 
       industryName="Technology"
       subIndustries={subIndustries}
       dashboardConfig={dashboardConfig}
       searchPlaceholder="Search patents, code repositories, or tech news..."
    />
  );
};

export default TechnologyPage;
