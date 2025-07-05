import { render, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { expect, test } from 'vitest';
import App from './App';

test('renders without crashing', () => {
  render(
    <RecoilRoot>
      <App />
    </RecoilRoot>,
  );
  const linkElement = screen.getByText(/Mercado Fiel/i);
  expect(linkElement).toBeTruthy();
});
