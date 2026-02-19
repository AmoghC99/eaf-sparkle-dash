import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BILLET_SPECS } from '@/constants/billetSpecs';
import { Shield } from 'lucide-react';

interface GradeSelectorProps {
  selectedGrade: string;
  onGradeChange: (grade: string) => void;
}

const grades = Object.keys(BILLET_SPECS).sort((a, b) => {
  const numA = parseInt(a.replace('KP', ''));
  const numB = parseInt(b.replace('KP', ''));
  return numA - numB;
});

export const GradeSelector: React.FC<GradeSelectorProps> = ({ selectedGrade, onGradeChange }) => {
  const spec = BILLET_SPECS[selectedGrade];

  return (
    <Card className="steel-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Shield className="h-4 w-4 text-primary" />
          Target Billet Grade
        </CardTitle>
        <CardDescription>
          Cu/P limits constrain which scenarios meet spec
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 flex-wrap">
          <Select value={selectedGrade} onValueChange={onGradeChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select grade" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {grades.map(grade => (
                <SelectItem key={grade} value={grade}>
                  {grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {spec && (
            <div className="flex items-center gap-3 text-sm">
              <Badge variant="outline">Cu max: {spec.cuMax}</Badge>
              <Badge variant="outline">P max: {spec.pMax}</Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
