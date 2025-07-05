import { render, screen } from '@testing-library/react';
import { expect } from 'vitest';
import BackButton from '../BackButton';
import { BrowserRouter } from 'react-router-dom';

describe('BackButton Tests', () => {
  it('renders with text', () => {
    render(
      <BrowserRouter>
        <BackButton />
      </BrowserRouter>,
    );
    const linkElement = screen.getByText(/Atras/i);
    expect(linkElement).toBeTruthy();
  });

  it('renders without text', () => {
    render(
      <BrowserRouter>
        <BackButton displayText={false} />
      </BrowserRouter>,
    );
    const linkElement = screen.queryByText(/Atras/i);
    expect(linkElement).toBeNull();
  });
});
