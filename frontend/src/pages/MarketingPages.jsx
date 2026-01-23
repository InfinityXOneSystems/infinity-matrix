
import React from 'react';
import ToolMarketingTemplate from '@/components/marketing/ToolMarketingTemplate';
import { marketingContent } from '@/lib/marketing-content';

export const VisionCortexMarketing = () => <ToolMarketingTemplate config={marketingContent.visionCortex} />;
export const QuantumXMarketing = () => <ToolMarketingTemplate config={marketingContent.quantumX} />;
export const PredictMarketing = () => <ToolMarketingTemplate config={marketingContent.predict} />;
export const SimulateMarketing = () => <ToolMarketingTemplate config={marketingContent.simulate} />;
export const InfinityCoinMarketing = () => <ToolMarketingTemplate config={marketingContent.infinityCoin} />;
export const AgentBuilderMarketing = () => <ToolMarketingTemplate config={marketingContent.agentBuilder} />;
