import React from 'react';
import { Database, Receipt, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface SummaryStatsProps {
  productionCount: number;
  priceCount: number | null;
  isOptimized: boolean;
}

export const SummaryStats: React.FC<SummaryStatsProps> = ({
  productionCount,
  priceCount,
  isOptimized,
}) => {
  const stats = [
    {
      label: 'Production Records',
      value: productionCount.toLocaleString(),
      subtext: 'Heats analyzed',
      icon: Database,
      iconColor: 'text-chart-2',
    },
    {
      label: 'Price Records',
      value: priceCount?.toLocaleString() ?? 'N/A',
      subtext: 'Scrap transactions',
      icon: Receipt,
      iconColor: 'text-primary',
    },
    {
      label: 'Optimization Status',
      value: isOptimized ? '✓ Ready' : 'Pending',
      subtext: isOptimized ? 'Pareto frontier calculated' : 'Upload data to begin',
      icon: CheckCircle2,
      iconColor: isOptimized ? 'text-success' : 'text-muted-foreground',
      valueColor: isOptimized ? 'text-success' : 'text-muted-foreground',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, idx) => (
        <Card key={idx} className="steel-card">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                <p className={`text-3xl font-bold mt-2 ${stat.valueColor || 'text-foreground'}`}>
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{stat.subtext}</p>
              </div>
              <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
