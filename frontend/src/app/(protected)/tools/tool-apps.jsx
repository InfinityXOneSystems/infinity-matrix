
/**
 * Consolidated App Tools Wrapper
 * Imports the functional tool components and re-exports them
 * mapped to the new architecture.
 */
import React from 'react';
import VisionCortexApp from '@/pages/app/VisionCortexApp';
import QuantumXApp from '@/pages/app/QuantumXApp';
import PredictApp from '@/pages/app/PredictApp';
import SimulateApp from '@/pages/app/SimulateApp';
import AgentBuilderApp from '@/pages/app/AgentBuilderApp';
import InfinityCoinApp from '@/pages/app/InfinityCoinApp';

export const VisionCortexTool = () => <VisionCortexApp />;
export const QuantumXTool = () => <QuantumXApp />;
export const PredictTool = () => <PredictApp />;
export const SimulateTool = () => <SimulateApp />;
export const AgentBuilderTool = () => <AgentBuilderApp />;
export const InfinityCoinTool = () => <InfinityCoinApp />;
