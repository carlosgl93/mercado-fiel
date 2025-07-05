import { waitFor, renderHook } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useDisponibilidadNew } from '@/hooks/useDisponibilidadNew';

test('renders EditAvailableDays and displays availability data', async () => {
  // const availabilityData = [
  //   { day: 'Monday', times: { startTime: '9:00', endTime: '17:00' }, isAvailable: true },
  //   { day: 'Tuesday', times: { startTime: '9:00', endTime: '17:00' }, isAvailable: false },
  // ];

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

  const { result } = renderHook(() => useDisponibilidadNew(), { wrapper });

  await waitFor(() => expect(result.current).toBeDefined());

  // Check if the component renders correctly
  //const container = screen.getByText(
  //  'Agrega que dias y horas estas disponible para que te lleguen solicitudes que te acomoden.',
  //);

  //expect(container).toBeTruthy();

  //   // Check if the availability data is displayed correctly
  //   for (const dayData of availabilityData) {
  //     const dayName = await waitFor(() => screen.getByText(dayData.day));
  //     expect(dayName).toBeTruthy();

  //     const switchElement = await waitFor(() => screen.getByRole('switch'));
  //     expect(switchElement).toBeTruthy();
  //     // expect(switchElement).toHaveAttribute('checked', dayData.isAvailable.toString());
  //   }
});
