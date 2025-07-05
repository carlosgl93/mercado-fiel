import { waitFor, renderHook, fireEvent, render } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useComunas } from '@/hooks/useComunas';
import { act } from 'react-dom/test-utils';
import { EditarComunas } from './EditarComunas';

describe('useComunas hook', async () => {
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

  const santiago = {
    country: 'Chile',
    id: 27,
    name: 'Santiago',
    region: '"Región Metropolitana de Santiago"',
  };

  test('should set comunasSearched and matchedComunas', async () => {
    const { result } = renderHook(() => useComunas(), { wrapper });
    await waitFor(() => expect(result.current).toBeDefined());
    // Check initial state
    expect(result.current.comunasSearched).toBe('');
    expect(result.current.matchedComunas).toEqual([]);
    expect(result.current.selectedComunas).toEqual([]);
    expect(result.current.allComunas).toMatchSnapshot();
    // Simulate user interactions
    act(() => {
      result.current.setComunasSearched('Santiago');
      result.current.setMatchedComunas([santiago]);
    });
    expect(result.current.comunasSearched).toBe('Santiago');
    expect(result.current.matchedComunas).toStrictEqual([santiago]);
  });

  test('should handleSelectComuna', async () => {
    const { result } = renderHook(() => useComunas(), { wrapper });
    await waitFor(() => expect(result.current).toBeDefined());
    // Check initial state
    expect(result.current.comunasSearched).toBe('');
    expect(result.current.matchedComunas).toEqual([]);
    expect(result.current.selectedComunas).toEqual([]);
    expect(result.current.allComunas).toMatchSnapshot();
    // console.log(result.current.allComunas.filter((c) => c.name.toLowerCase().includes('mach')));
    // Simulate user interactions
    act(() => {
      result.current.setComunasSearched('Santiago');
      result.current.setMatchedComunas([santiago]);
      result.current.handleSelectComuna(santiago);
    });
    expect(result.current.comunasSearched).toBe('');
    expect(result.current.matchedComunas).toStrictEqual([]);
    expect(result.current.selectedComunas).toStrictEqual([santiago]);
  });

  test('should match comunas ', async () => {
    const { result } = renderHook(() => useComunas(), { wrapper });
    const { findByPlaceholderText } = render(<EditarComunas />, { wrapper });
    const input = (await findByPlaceholderText('Indicanos tu comuna')) as HTMLInputElement;
    await waitFor(() => expect(result.current).toBeDefined());
    // Check initial state
    expect(result.current.allComunas).toMatchSnapshot();
    expect(result.current.comunasSearched).toBe('');
    expect(result.current.matchedComunas).toEqual([]);
    expect(result.current.selectedComunas).toEqual([]);
    expect(result.current.allComunas).toMatchSnapshot();
    // Simulate user interactions
    act(() => {
      fireEvent.change(input, { target: { value: 'mach' } });
    });
    // expect input value to be mach
    await waitFor(() => {
      console.log('comunasSearched', result.current.comunasSearched);
      console.log('matched comunas ', result.current.matchedComunas);

      expect(input.value).toBe('mach');
      // expect(result.current.comunasSearched).toBe('mach');
    });
    // expect(result.current.matchedComunas).toMatchInlineSnapshot([]);
  });
});
