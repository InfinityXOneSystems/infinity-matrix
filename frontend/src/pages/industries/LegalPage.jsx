
import React from 'react';
import IndustryPageTemplate from '@/components/industry/IndustryPageTemplate';
import { 
  Scale, Gavel, FileText, ShieldAlert 
} from 'lucide-react';

const LegalPage = () => {
  const subIndustries = [
    'Corporate Law',
    'Litigation',
    'Intellectual Property',
    'Compliance',
    'Real Estate Law',
    'Labor & Employment',
    'International Law'
  ];

  const dashboardConfig = [
    {
      title: "Case Outcomes",
      icon: Scale,
      type: "stat",
      data: { value: "78%", change: "Win Rate", trend: "up" }
    },
    {
      title: "Litigation Trends",
      icon: Gavel,
      type: "chart",
      data: { points: [20, 25, 22, 30, 40, 35, 38] }
    },
    {
      title: "Regulatory",
      icon: FileText,
      type: "list",
      data: {
        items: [
           { label: "Labor Act", value: "Updated" },
           { label: "IP Statute", value: "Review" },
           { label: "Tax Code", value: "Pending" }
        ]
      }
    },
    {
      title: "Contract Risk",
      icon: ShieldAlert,
      type: "stat",
      data: { value: "Low", change: "-5 Risks", trend: "up" }
    }
  ];

  return (
    <IndustryPageTemplate 
       industryName="Legal"
       subIndustries={subIndustries}
       dashboardConfig={dashboardConfig}
       searchPlaceholder="Search case law, statutes, or contract templates..."
    />
  );
};

export default LegalPage;
