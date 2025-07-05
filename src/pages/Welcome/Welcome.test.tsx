import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import Welcome from './Welcome';
import { RecoilRoot } from 'recoil';
import App from '@/App';

test('renders homepage', () => {
  render(
    <RecoilRoot>
      <App>
        <Welcome />
      </App>
    </RecoilRoot>,
  );
  const comoFuncinaText = screen.findByText(/funciona/i);
  expect(comoFuncinaText).toBeTruthy();
});
