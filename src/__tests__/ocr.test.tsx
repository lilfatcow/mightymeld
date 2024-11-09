import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DocumentScanner } from '@/components/ocr/DocumentScanner';
import { MoniteProvider } from '@/contexts/MoniteContext';

// Mock useOCR hook
vi.mock('@/hooks/useOCR', () => ({
  useOCR: () => ({
    processDocument: vi.fn().mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true });
        }, 100);
      });
    }),
    processing: false,
    retryCount: 0,
    maxRetries: 3
  })
}));

describe('OCR Processing', () => {
  it('renders document scanner correctly', () => {
    render(
      <MoniteProvider>
        <DocumentScanner onScanComplete={() => {}} />
      </MoniteProvider>
    );

    expect(screen.getByText('Upload your bill')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Select File' })).toBeInTheDocument();
  });

  it('handles file upload', async () => {
    render(
      <MoniteProvider>
        <DocumentScanner onScanComplete={() => {}} />
      </MoniteProvider>
    );

    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByTestId('file-input');
    
    fireEvent.change(input, {
      target: { files: [file] }
    });

    await waitFor(() => {
      expect(screen.getByTestId('processing-indicator')).toBeInTheDocument();
    });
  });
});