import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

function pageText(container: HTMLElement): string {
  return container.textContent ?? '';
}

function heroSection(container: HTMLElement): HTMLElement | null {
  return container.querySelector('#hero');
}

describe('Junction naming', () => {
  it('renders Junction and the junction CLI', () => {
    const { container } = render(<App />);
    const text = pageText(container);
    expect(text).toContain('Junction');
    expect(text).toContain('junction');
    expect(text).toContain('junction gateway');
  });

  it('does not include the ghost emoji', () => {
    const { container } = render(<App />);
    expect(pageText(container)).not.toContain('👻');
    expect(container.innerHTML).not.toContain('👻');
  });

  it('does not claim kiro-cli is required', () => {
    const { container } = render(<App />);
    const text = pageText(container);
    expect(text).not.toMatch(/kiro-cli is required/i);
    expect(text).not.toMatch(/Prerequisites:[^\n]*kiro-cli/i);
    expect(text).toMatch(/kiro-cli is optional/i);
    expect(text).toMatch(/without requiring kiro-cli/i);
  });

  it('tells the two-plane story and the no-keys rule', () => {
    const { container } = render(<App />);
    const text = pageText(container);
    expect(text).toContain('Harness plane');
    expect(text).toContain('Model plane');
    expect(text).toMatch(/never paste provider keys/i);
    expect(text).toContain('junction gateway');
  });
    const { container } = render(<App />);
    const hero = heroSection(container);
    expect(hero).toBeTruthy();
    const heroText = (hero?.textContent ?? '').replace(/\s+/g, ' ');
    expect(heroText).toContain('Where coding agents');
    expect(heroText).toContain('meet the models you want');
    expect(heroText).toContain('Junction');
    expect(heroText).not.toMatch(/Kiro Crew/);
    expect(heroText).not.toMatch(/acpcrew/i);
    expect(heroText).not.toMatch(/kirocrew/i);
  });

  it('index.html title and description are Junction, without the ghost', () => {
    const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
    expect(html).toContain('<title>Junction</title>');
    expect(html).toContain('Where coding agents meet the models you want');
    expect(html).not.toContain('👻');
    expect(html).not.toContain('Kiro Crew');
  });
});
