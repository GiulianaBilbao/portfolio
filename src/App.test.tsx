import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import fc from 'fast-check';
import App from './App';

/**
 * Scaffold sanity test. Confirms the testing toolchain
 * (Vitest + React Testing Library + jsdom + fast-check) executes.
 * Real component/property tests are added in later tasks.
 */
describe('scaffold toolchain', () => {
  it('renders the owner name (React Testing Library + jsdom)', () => {
    render(<App />);
    expect(screen.getByText('Giuliana C. Bilbao')).toBeInTheDocument();
  });

  it('runs a fast-check property (property-based testing available)', () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (a, b) => {
        return a + b === b + a;
      }),
      { numRuns: 100 },
    );
  });
});
