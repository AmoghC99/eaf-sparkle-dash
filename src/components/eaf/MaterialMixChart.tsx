import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ParetoScenario } from '@/types/eaf';

interface MaterialMixChartProps {
  scenario: ParetoScenario;
}

const MATERIAL_COLORS = [
  'hsl(30, 90%, 55%)',   // Primary orange
  'hsl(200, 70%, 50%)',  // Blue
  'hsl(150, 60%, 45%)',  // Green
  'hsl(280, 60%, 55%)',  // Purple
  'hsl(350, 70%, 55%)',  // Red
  'hsl(45, 80%, 55%)',   // Yellow
  'hsl(180, 60%, 45%)',  // Teal
  'hsl(320, 60%, 50%)',  // Pink
  'hsl(60, 70%, 45%)',   // Lime
  'hsl(100, 50%, 45%)',  // Light green
];

export const MaterialMixChart: React.FC<MaterialMixChartProps> = ({ scenario }) => {
  const chartData = Object.entries(scenario.mix)
    .filter(([_, val]) => val > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([material, percentage], index) => ({
      material,
      percentage,
      fill: MATERIAL_COLORS[index % MATERIAL_COLORS.length],
    }));

  const total = chartData.reduce((sum, d) => sum + d.percentage, 0);

  return (
    <Card className="steel-card">
      <CardHeader>
        <CardTitle>Material Mix: {scenario.name}</CardTitle>
        <CardDescription>
          Percentage breakdown of scrap materials in this scenario
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Bar Chart */}
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis 
                type="number" 
                domain={[0, 100]}
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                unit="%"
              />
              <YAxis 
                type="category" 
                dataKey="material"
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: 'hsl(var(--foreground))', fontSize: 11 }}
                width={95}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [`${value}%`, 'Percentage']}
              />
              <Bar dataKey="percentage" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Progress Bars */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Detailed Breakdown</h4>
          {chartData.map((item, index) => (
            <div key={item.material} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground">{item.material}</span>
                <span className="font-semibold text-foreground">
                  {item.percentage}%
                  <span className="text-muted-foreground font-normal ml-1">
                    ({((item.percentage / total) * 100).toFixed(1)}% of mix)
                  </span>
                </span>
              </div>
              <Progress 
                value={item.percentage} 
                className="h-2"
                style={{
                  // @ts-ignore - CSS variable override
                  '--progress-color': item.fill,
                } as React.CSSProperties}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
