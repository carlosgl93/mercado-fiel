import { render, fireEvent, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { BrowserRouter } from 'react-router-dom';
import SearchBar from './SearchBar';
import { vi } from 'vitest';

vi.mock('@/hooks/useComunas', () => ({
  useComunas: () => ({
    allComunas: [
      { name: 'Comuna1', id: '1' },
      { name: 'Comuna2', id: '2' },
    ],
  }),
}));

vi.mock('@/store/recibeApoyo', async () => {
  const originalModule = await vi.importActual('@/store/recibeApoyo');

  return {
    ...originalModule,
    useRecibeApoyo: () => [
      {},
      {
        addComuna: vi.fn(),
      },
    ],
  };
});

describe('SearchBar', () => {
  it('renders the search bar', () => {
    render(
      <RecoilRoot>
        <BrowserRouter>
          <SearchBar />
        </BrowserRouter>
      </RecoilRoot>,
    );

    const input = screen.getByPlaceholderText('Indicanos tu comuna');
    expect(input).toBeTruthy();
  });

  it('filters the list of comunas when typing in the search bar', () => {
    render(
      <RecoilRoot>
        <BrowserRouter>
          <SearchBar />
        </BrowserRouter>
      </RecoilRoot>,
    );

    const input = screen.getByPlaceholderText('Indicanos tu comuna');
    fireEvent.change(input, { target: { value: 'Comuna1' } });

    const listItem = screen.getByText('Comuna1');
    expect(listItem).toBeTruthy();
  });
});
