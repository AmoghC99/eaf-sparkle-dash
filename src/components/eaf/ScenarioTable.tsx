import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ParetoScenario } from '@/types/eaf';
import { TrendingUp, Zap, AlertTriangle, CheckCircle } from 'lucide-react';

interface ScenarioTableProps {
  scenarios: ParetoScenario[];
  selectedScenario: ParetoScenario | null;
  onSelectScenario: (scenario: ParetoScenario) => void;
  targetGrade?: string;
}

export const ScenarioTable: React.FC<ScenarioTableProps> = ({
  scenarios,
  selectedScenario,
  onSelectScenario,
  targetGrade,
}) => {
  return (
    <Card className="steel-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-success" />
          Scenario Comparison
        </CardTitle>
        <CardDescription>
          Compare all optimization scenarios side-by-side
          {targetGrade && ` — constrained to ${targetGrade} spec`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Scenario</TableHead>
              <TableHead className="text-right text-muted-foreground">
                <span className="flex items-center justify-end gap-1">
                  <Zap className="h-4 w-4" /> Energy/Ton
                </span>
              </TableHead>
              <TableHead className="text-right text-muted-foreground">Yield %</TableHead>
              <TableHead className="text-right text-muted-foreground">Est. Cu</TableHead>
              <TableHead className="text-right text-muted-foreground">Est. P</TableHead>
              <TableHead className="text-center text-muted-foreground">Spec</TableHead>
              <TableHead className="text-center text-muted-foreground">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scenarios.map((scenario) => {
              const isSelected = selectedScenario?.name === scenario.name;
              const meetsSpec = scenario.meetsSpec !== false;
              
              return (
                <TableRow 
                  key={scenario.name}
                  className={`border-border cursor-pointer transition-colors ${
                    isSelected ? 'bg-primary/10' : 'hover:bg-secondary/30'
                  } ${!meetsSpec ? 'opacity-70' : ''}`}
                  onClick={() => onSelectScenario(scenario)}
                >
                  <TableCell className="font-medium text-foreground">
                    <div className="flex items-center gap-2">
                      {scenario.name}
                      {scenario.name === 'Balanced' && (
                        <Badge variant="secondary" className="text-xs">Recommended</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-chart-2">
                    {scenario.energyPerTon.toLocaleString()} KWh
                  </TableCell>
                  <TableCell className="text-right font-semibold text-success">
                    {scenario.yield}%
                  </TableCell>
                  <TableCell className={`text-right font-mono ${!meetsSpec ? 'text-destructive' : 'text-foreground'}`}>
                    {scenario.estimatedCu?.toFixed(4) ?? '—'}
                  </TableCell>
                  <TableCell className={`text-right font-mono ${!meetsSpec ? 'text-destructive' : 'text-foreground'}`}>
                    {scenario.estimatedP?.toFixed(4) ?? '—'}
                  </TableCell>
                  <TableCell className="text-center">
                    {targetGrade ? (
                      meetsSpec ? (
                        <CheckCircle className="h-4 w-4 text-success inline" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-destructive inline" />
                      )
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant={isSelected ? "default" : "secondary"}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectScenario(scenario);
                      }}
                    >
                      {isSelected ? '✓ Selected' : 'View'}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
