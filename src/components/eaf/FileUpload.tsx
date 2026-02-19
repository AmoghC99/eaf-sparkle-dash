import React from 'react';
import { Upload, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface FileUploadProps {
  title: string;
  description: string;
  requiredColumns: string[];
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isUploaded: boolean;
  recordCount?: number;
  variant: 'primary' | 'secondary';
  optional?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  title,
  description,
  requiredColumns,
  onFileUpload,
  isUploaded,
  recordCount,
  variant,
  optional = false,
}) => {
  return (
    <Card className="steel-card">
      <CardHeader>
        <div className="flex items-center gap-3">
          {isUploaded ? (
            <CheckCircle2 className="h-6 w-6 text-success" />
          ) : (
            <Upload className={`h-6 w-6 ${variant === 'primary' ? 'text-chart-2' : 'text-primary'}`} />
          )}
          <div>
            <CardTitle className="text-lg">
              {title}
              {optional && <span className="text-muted-foreground text-sm ml-2">(Optional)</span>}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isUploaded ? (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-success/10 border border-success/30">
            <FileSpreadsheet className="h-8 w-8 text-success" />
            <div>
              <p className="font-medium text-success">File uploaded successfully</p>
              <p className="text-sm text-muted-foreground">{recordCount?.toLocaleString()} records loaded</p>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Required columns:</p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                {requiredColumns.map((col, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {col}
                  </li>
                ))}
              </ul>
            </div>

            <label className="block">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={onFileUpload}
                className="block w-full text-sm text-muted-foreground 
                  file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 
                  file:text-sm file:font-semibold file:cursor-pointer
                  file:bg-primary file:text-primary-foreground 
                  hover:file:bg-primary/90 cursor-pointer"
              />
            </label>
            
            <p className="text-xs text-muted-foreground">
              Supports Excel files (.xlsx, .xls). First sheet will be processed.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
};
