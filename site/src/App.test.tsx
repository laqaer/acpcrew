import { render } from '@testing-library/react';
import App from './App';
import { describe, it, expect } from 'vitest';

describe('App', () => {
  it('should render without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });

  it('brands the rendered page as Junction', () => {
    const { container } = render(<App />);
    const text = container.textContent ?? '';
    expect(text).toContain('Junction');
    expect(text).toContain('junction');
    expect(text).not.toContain('👻');
    expect(text).not.toMatch(new RegExp(['kiro', 'crew'].join('[\\s._/-]*'), 'i'));
  });
});
