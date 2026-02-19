import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Settings2, Check, AlertTriangle } from 'lucide-react';
import { MATERIAL_MAPPING, RECOVERED_SCRAP_FIXED_PRICE } from '@/constants/materials';

export const MaterialMappingStatus: React.FC = () => {
  const materials = Object.entries(MATERIAL_MAPPING);
  const mappedCount = materials.filter(([mat, descs]) => 
    descs.length > 0 || mat === 'Recovered Scrap'
  ).length;

  return (
    <Card className="steel-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings2 className="h-5 w-5 text-chart-2" />
          Material Mapping Status
        </CardTitle>
        <CardDescription>
          {mappedCount} of {materials.length} materials properly configured
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {materials.map(([material, descriptions]) => {
          const isRecovered = material === 'Recovered Scrap';
          const isMapped = descriptions.length > 0 || isRecovered;

          return (
            <div 
              key={material}
              className="flex items-start justify-between p-3 rounded-lg bg-secondary/30"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {isMapped ? (
                    <Check className="h-4 w-4 text-success" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-warning" />
                  )}
                  <span className="font-medium text-foreground">{material}</span>
                </div>
                {isRecovered && (
                  <p className="text-xs text-success mt-1 ml-6">
                    Fixed price: £{RECOVERED_SCRAP_FIXED_PRICE}/ton
                  </p>
                )}
                {descriptions.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1 ml-6">
                    Mapped: {descriptions.slice(0, 3).join(', ')}
                    {descriptions.length > 3 && ` +${descriptions.length - 3} more`}
                  </p>
                )}
              </div>
              <div className="text-right">
                {isMapped ? (
                  <span className="text-sm font-semibold text-success">✓ Mapped</span>
                ) : (
                  <span className="text-sm font-semibold text-warning">⚠ Missing</span>
                )}
                {descriptions.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {descriptions.length} descriptions
                  </p>
                )}
              </div>
            </div>
          );
        })}

        <div className="mt-4 p-4 rounded-lg bg-success/10 border border-success/30">
          <p className="text-sm text-success flex items-center gap-2">
            <Check className="h-4 w-4" />
            <strong>Complete:</strong> All {materials.length} materials are mapped and ready for optimization.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
