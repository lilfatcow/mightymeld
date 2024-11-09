import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useOCR } from '@/hooks/useOCR';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Loader2, Upload } from 'lucide-react';

interface DocumentScannerProps {
  onScanComplete: (data: any) => void;
}

export function DocumentScanner({ onScanComplete }: DocumentScannerProps) {
  const { processDocument, processing, retryCount, maxRetries } = useOCR();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    const result = await processDocument(file);
    if (result) {
      onScanComplete(result);
    }
  }, [processDocument, onScanComplete]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxFiles: 1,
    disabled: processing
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className="flex-1 border-2 border-dashed rounded-lg p-12 text-center"
      >
        <input {...getInputProps()} data-testid="file-input" />
        {processing ? (
          <div className="flex flex-col items-center gap-4" data-testid="processing-indicator">
            <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
            <div className="space-y-2">
              <p className="font-medium">Processing document...</p>
              {retryCount > 0 && (
                <>
                  <Progress value={(retryCount / maxRetries) * 100} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    Retry attempt {retryCount} of {maxRetries}
                  </p>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <p className="font-medium">Upload your bill</p>
              <p className="text-sm text-muted-foreground">
                Drag and drop or click to upload your bill
              </p>
            </div>
            <Button variant="secondary">Select File</Button>
          </div>
        )}
      </div>
    </div>
  );
}