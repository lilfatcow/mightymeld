import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CounterpartList } from '@/components/counterparts/CounterpartList';
import { MoniteProvider } from '@/contexts/MoniteContext';

// Mock useCounterparts hook
vi.mock('@/hooks/useCounterparts', () => ({
  useCounterparts: () => ({
    list: vi.fn().mockResolvedValue([]),
    loading: false
  })
}));

describe('Counterparts Management', () => {
  it('renders counterparts list correctly', () => {
    render(
      <MoniteProvider>
        <CounterpartList />
      </MoniteProvider>
    );

    expect(screen.getByText('Contacts')).toBeInTheDocument();
    expect(screen.getByTestId('add-contact-button')).toBeInTheDocument();
  });

  it('handles contact addition', async () => {
    render(
      <MoniteProvider>
        <CounterpartList />
      </MoniteProvider>
    );

    fireEvent.click(screen.getByTestId('add-contact-button'));
    expect(screen.getByText('Add New Contact')).toBeInTheDocument();
  });
});