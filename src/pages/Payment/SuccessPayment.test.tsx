import { render, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { SuccessPayment } from './SuccessPayment';
import { fakeFutureApps, fakeTodayAppointments } from '@/testsData';

describe('successPayment tests', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <BrowserRouter>{children}</BrowserRouter>
      </RecoilRoot>
    </QueryClientProvider>
  );

  test('should render "Recuerda que será el día" because the appointment is not today', async () => {
    render(<SuccessPayment appointments={fakeFutureApps} />, { wrapper });
    const title = screen.findByText(/pago/i);
    const dateText = screen.getByTestId('future-app').textContent;
    expect(title).toBeTruthy();
    expect(dateText).toContain('Recuerda que será el día');
  });

  test('should render "Recuerda que la sesión es hoy" because the appointment is today', async () => {
    render(<SuccessPayment appointments={fakeTodayAppointments} />, { wrapper });
    const title = screen.findByText(/pago/i);
    const dateText = screen.getByTestId('same-day-app').textContent;
    expect(title).toBeTruthy();
    expect(dateText).toContain('Recuerda que la sesión es hoy a las');
  });
});
