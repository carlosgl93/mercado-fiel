import { render, screen } from '@testing-library/react';
import { test, expect, vi } from 'vitest';
import { RecoilRoot } from 'recoil';
import { MobileFilters } from './MobileFilters';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

test('renders new title', () => {
  const toggleDrawer = vi.fn();
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  render(
    <QueryClientProvider client={client}>
      <BrowserRouter>
        <RecoilRoot>
          <MobileFilters closeFilters={toggleDrawer} />
        </RecoilRoot>
      </BrowserRouter>
    </QueryClientProvider>,
  );
  const linkElement = screen.getByText(/Comuna donde recibirás apoyo/i);
  expect(linkElement).toBeTruthy();
});
