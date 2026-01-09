
/**
 * Consolidated Marketing Pages Wrapper
 * Uses the ToolMarketingTemplate to render specific tool landing pages.
 */
import React from 'react';
import ToolMarketingTemplate from '@/components/marketing/ToolMarketingTemplate';
import { marketingContent } from '@/lib/marketing-content';

export const VisionCortexPage = () => <ToolMarketingTemplate config={marketingContent.visionCortex} />;
export const QuantumXPage = () => <ToolMarketingTemplate config={marketingContent.quantumX} />;
export const PredictPage = () => <ToolMarketingTemplate config={marketingContent.predict} />;
export const SimulatePage = () => <ToolMarketingTemplate config={marketingContent.simulate} />;
export const InfinityCoinPage = () => <ToolMarketingTemplate config={marketingContent.infinityCoin} />;
export const AgentBuilderPage = () => <ToolMarketingTemplate config={marketingContent.agentBuilder} />;
