import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine, Label } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ParetoScenario } from '@/types/eaf';

interface ParetoChartProps {
  scenarios: ParetoScenario[];
  selectedScenario: ParetoScenario | null;
  onSelectScenario: (scenario: ParetoScenario) => void;
}

const SCENARIO_COLORS: { [key: string]: string } = {
  'Energy-Optimized': 'hsl(200, 70%, 50%)',
  'Yield-Optimized': 'hsl(150, 60%, 45%)',
  'Balanced': 'hsl(30, 90%, 55%)',
  'Current Mix': 'hsl(280, 60%, 55%)',
};

export const ParetoChart: React.FC<ParetoChartProps> = ({
  scenarios,
  selectedScenario,
  onSelectScenario,
}) => {
  const chartData = scenarios.map(s => ({
    ...s,
    x: s.energyPerTon,
    y: s.yield,
  }));

  const avgEnergy = scenarios.reduce((sum, s) => sum + s.energyPerTon, 0) / scenarios.length;
  const avgYield = scenarios.reduce((sum, s) => sum + s.yield, 0) / scenarios.length;

  return (
    <Card className="steel-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-primary animate-molten-pulse" />
          Pareto Frontier: Energy vs Yield Trade-Off
        </CardTitle>
        <CardDescription>
          Click on a point to select and explore that scenario
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                type="number" 
                dataKey="x" 
                name="Energy" 
                unit=" KWh"
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              >
                <Label 
                  value="Energy per Ton (KWh)" 
                  position="bottom" 
                  offset={20}
                  style={{ fill: 'hsl(var(--muted-foreground))' }}
                />
              </XAxis>
              <YAxis 
                type="number" 
                dataKey="y" 
                name="Yield" 
                unit="%"
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              >
                <Label 
                  value="Yield (%)" 
                  angle={-90} 
                  position="insideLeft"
                  style={{ fill: 'hsl(var(--muted-foreground))' }}
                />
              </YAxis>
              <ReferenceLine 
                x={avgEnergy} 
                stroke="hsl(var(--muted-foreground))" 
                strokeDasharray="5 5" 
                strokeOpacity={0.5}
              />
              <ReferenceLine 
                y={avgYield} 
                stroke="hsl(var(--muted-foreground))" 
                strokeDasharray="5 5" 
                strokeOpacity={0.5}
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                formatter={(value: number, name: string) => {
                  if (name === 'Energy') return [`${value} KWh`, 'Energy/Ton'];
                  if (name === 'Yield') return [`${value}%`, 'Yield'];
                  return [value, name];
                }}
                labelFormatter={(_, payload) => {
                  if (payload && payload[0]) {
                    return (payload[0].payload as ParetoScenario).name;
                  }
                  return '';
                }}
              />
              <Scatter 
                data={chartData} 
                onClick={(data) => onSelectScenario(data as unknown as ParetoScenario)}
                style={{ cursor: 'pointer' }}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={SCENARIO_COLORS[entry.name] || 'hsl(var(--primary))'}
                    stroke={selectedScenario?.name === entry.name ? 'hsl(var(--foreground))' : 'transparent'}
                    strokeWidth={selectedScenario?.name === entry.name ? 3 : 0}
                    r={selectedScenario?.name === entry.name ? 12 : 8}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 mt-4 pt-4 border-t border-border">
          {scenarios.map((scenario) => (
            <button
              key={scenario.name}
              onClick={() => onSelectScenario(scenario)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all ${
                selectedScenario?.name === scenario.name
                  ? 'bg-secondary ring-2 ring-primary'
                  : 'hover:bg-secondary/50'
              }`}
            >
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: SCENARIO_COLORS[scenario.name] }}
              />
              <span className="text-sm text-foreground">{scenario.name}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
