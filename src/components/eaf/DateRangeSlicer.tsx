import React from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Filter, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

interface DateRangeSlicerProps {
  minDate: Date | null;
  maxDate: Date | null;
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  onReset: () => void;
  totalRecords: number;
  filteredRecords: number;
}

export const DateRangeSlicer: React.FC<DateRangeSlicerProps> = ({
  minDate,
  maxDate,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onReset,
  totalRecords,
  filteredRecords,
}) => {
  const isFiltered = startDate !== minDate || endDate !== maxDate;
  const filterPercentage = totalRecords > 0 ? ((filteredRecords / totalRecords) * 100).toFixed(1) : '0';

  return (
    <Card className="steel-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5 text-chart-2" />
              Date Range Filter
            </CardTitle>
            <CardDescription>
              Analyze performance over specific time periods
            </CardDescription>
          </div>
          {isFiltered && (
            <Button variant="secondary" size="sm" onClick={onReset} className="gap-1.5">
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Start Date */}
          <div className="flex-1 space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground">From</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "dd MMM yyyy") : <span>Start date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate ?? undefined}
                  onSelect={onStartDateChange}
                  disabled={(date) => {
                    if (minDate && date < minDate) return true;
                    if (endDate && date > endDate) return true;
                    return false;
                  }}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* End Date */}
          <div className="flex-1 space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground">To</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "dd MMM yyyy") : <span>End date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate ?? undefined}
                  onSelect={onEndDateChange}
                  disabled={(date) => {
                    if (maxDate && date > maxDate) return true;
                    if (startDate && date < startDate) return true;
                    return false;
                  }}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Filter Summary */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/40 border border-border">
          <div className="flex items-center gap-3">
            <Badge variant={isFiltered ? "default" : "secondary"} className="text-xs">
              {isFiltered ? 'Filtered' : 'All Data'}
            </Badge>
            <span className="text-sm text-foreground">
              <strong>{filteredRecords.toLocaleString()}</strong> of {totalRecords.toLocaleString()} records
            </span>
          </div>
          <span className="text-sm text-muted-foreground">
            {filterPercentage}% of data
          </span>
        </div>

        {/* Quick presets */}
        <div className="flex flex-wrap gap-2">
          {minDate && maxDate && (
            <>
              <QuickPresetButton
                label="Last 30 days"
                onClick={() => {
                  const start = new Date(maxDate);
                  start.setDate(start.getDate() - 30);
                  onStartDateChange(start < minDate ? minDate : start);
                  onEndDateChange(maxDate);
                }}
              />
              <QuickPresetButton
                label="Last 90 days"
                onClick={() => {
                  const start = new Date(maxDate);
                  start.setDate(start.getDate() - 90);
                  onStartDateChange(start < minDate ? minDate : start);
                  onEndDateChange(maxDate);
                }}
              />
              <QuickPresetButton
                label="Last 6 months"
                onClick={() => {
                  const start = new Date(maxDate);
                  start.setMonth(start.getMonth() - 6);
                  onStartDateChange(start < minDate ? minDate : start);
                  onEndDateChange(maxDate);
                }}
              />
              <QuickPresetButton
                label="Last year"
                onClick={() => {
                  const start = new Date(maxDate);
                  start.setFullYear(start.getFullYear() - 1);
                  onStartDateChange(start < minDate ? minDate : start);
                  onEndDateChange(maxDate);
                }}
              />
              <QuickPresetButton
                label="All time"
                onClick={onReset}
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const QuickPresetButton: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => (
  <Button
    variant="secondary"
    size="sm"
    onClick={onClick}
    className="text-xs h-7 px-2.5"
  >
    {label}
  </Button>
);
