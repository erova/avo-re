/**
 * Onboarding Engine - Core Logic
 * Self-contained in /app/now/onboarding/
 */

export interface OnboardingStep {
  id: string;
  target: string;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'bottom-left' | 'bottom-right';
  highlight?: boolean;
  action?: string;
  gifUrl?: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  targetElement: string;
  completed: boolean;
}

export interface OnboardingFlow {
  id: string;
  name: string;
  steps: OnboardingStep[];
  checklist?: ChecklistItem[];
}

export interface OnboardingConfig {
  flows: OnboardingFlow[];
  helpIndicators: string[];
}

export type OnboardingEventType = 
  | 'flow_started'
  | 'flow_completed'
  | 'flow_skipped'
  | 'step_changed'
  | 'checklist_updated';

export interface OnboardingEvent {
  type: OnboardingEventType;
  data: any;
  timestamp: number;
}

export class OnboardingEngine {
  private config: OnboardingConfig;
  private currentFlow: string | null = null;
  private currentStep: number = 0;
  private completedSteps: Set<string> = new Set();
  private checklistState: Map<string, boolean> = new Map();
  private listeners: Map<OnboardingEventType, Set<(event: OnboardingEvent) => void>> = new Map();

  constructor(config: OnboardingConfig) {
    this.config = config;
  }

  startFlow(flowId: string): void {
    const flow = this.config.flows.find(f => f.id === flowId);
    if (!flow) return;

    this.currentFlow = flowId;
    this.currentStep = 0;
    this.completedSteps.clear();
    this.emit('flow_started', { flowId, flow });
  }

  nextStep(): void {
    if (!this.currentFlow) return;
    const flow = this.getCurrentFlow();
    if (!flow) return;

    const currentStepData = flow.steps[this.currentStep];
    this.completedSteps.add(currentStepData.id);

    if (this.currentStep < flow.steps.length - 1) {
      this.currentStep++;
      this.emit('step_changed', {
        flowId: this.currentFlow,
        stepIndex: this.currentStep,
        step: flow.steps[this.currentStep]
      });
    } else {
      this.completeFlow();
    }
  }

  skipFlow(): void {
    if (!this.currentFlow) return;
    this.emit('flow_skipped', { flowId: this.currentFlow });
    this.currentFlow = null;
    this.currentStep = 0;
  }

  private completeFlow(): void {
    if (!this.currentFlow) return;
    this.emit('flow_completed', { flowId: this.currentFlow });
    this.currentFlow = null;
    this.currentStep = 0;
  }

  completeChecklistItem(itemId: string): void {
    this.checklistState.set(itemId, true);
    this.emit('checklist_updated', {
      itemId,
      completed: true,
      allItems: this.getChecklistState()
    });
  }

  getChecklistState(): ChecklistItem[] {
    const flow = this.getCurrentFlow();
    if (!flow || !flow.checklist) return [];
    return flow.checklist.map(item => ({
      ...item,
      completed: this.checklistState.get(item.id) || false
    }));
  }

  getCurrentFlow(): OnboardingFlow | null {
    if (!this.currentFlow) return null;
    return this.config.flows.find(f => f.id === this.currentFlow) || null;
  }

  getCurrentStep(): OnboardingStep | null {
    const flow = this.getCurrentFlow();
    if (!flow) return null;
    return flow.steps[this.currentStep] || null;
  }

  getCurrentStepIndex(): number {
    return this.currentStep;
  }

  getCompletedSteps(): string[] {
    return Array.from(this.completedSteps);
  }

  isFlowActive(): boolean {
    return this.currentFlow !== null;
  }

  getHelpIndicators(): string[] {
    return this.config.helpIndicators;
  }

  on(eventType: OnboardingEventType, callback: (event: OnboardingEvent) => void): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(callback);
  }

  off(eventType: OnboardingEventType, callback: (event: OnboardingEvent) => void): void {
    const callbacks = this.listeners.get(eventType);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  private emit(type: OnboardingEventType, data: any): void {
    const event: OnboardingEvent = { type, data, timestamp: Date.now() };
    const callbacks = this.listeners.get(type);
    if (callbacks) {
      callbacks.forEach(callback => callback(event));
    }
  }

  reset(): void {
    this.currentFlow = null;
    this.currentStep = 0;
    this.completedSteps.clear();
    this.checklistState.clear();
  }
}

export function createOnboardingEngine(config: OnboardingConfig): OnboardingEngine {
  return new OnboardingEngine(config);
}