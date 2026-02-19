import React from 'react';
import { Trash2, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  hasData: boolean;
  onReset: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ hasData, onReset }) => {
  return (
    <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-lg bg-primary/20 molten-glow">
              <Flame className="h-8 w-8 text-primary animate-molten-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                EAF Pareto Optimizer
              </h1>
              <p className="text-muted-foreground text-sm">
                Energy & Yield Multi-Objective Optimization
              </p>
            </div>
          </div>
          
          {hasData && (
            <Button
              onClick={onReset}
              variant="destructive"
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Reset All
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
