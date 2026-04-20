import { describe, it, expect } from 'vitest';
import { render, screen }        from '@testing-library/react';
import { MemoryRouter }           from 'react-router-dom';
import ErrorBoundary              from '../components/ErrorBoundary.jsx';

// Component that always throws
function Bomb() { throw new Error('Test explosion'); }

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <div>Safe content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Safe content')).toBeInTheDocument();
  });

  it('renders fallback when child throws', () => {
    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    );
    expect(screen.getByText('Test explosion')).toBeInTheDocument();
  });

  it('shows reload button', () => {
    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    );
    expect(screen.getByText('Reload Page')).toBeInTheDocument();
  });
});
