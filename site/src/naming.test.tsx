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
  });

  it('keeps kiro-cli out of the first viewport', () => {
    const { container } = render(<App />);
    const hero = heroSection(container);
    expect(hero?.textContent ?? '').not.toMatch(/kiro-cli/i);
    expect(hero?.textContent ?? '').toContain('junction setup && junction gateway');
  });

  it('tells the two-plane story and the no-keys rule', () => {
    const { container } = render(<App />);
    const text = pageText(container);
    expect(text).toContain('Harness plane');
    expect(text).toContain('Model plane');
    expect(text).toMatch(/never paste provider keys/i);
    expect(text).toContain('junction gateway');
    expect(text).toContain('Why not just run an agent CLI?');
  });

  it('leads with two planes and role routing, not a feature-card clone', () => {
    const { container } = render(<App />);
    const text = pageText(container);
    expect(text).toContain('Role routing');
    expect(text).toContain('junction planes');
    expect(text).toContain('getjunction.dev');
    expect(text).not.toContain('junction-site.vercel.app');
    expect(text).not.toContain('A custom domain is not attached yet');
    expect(text).not.toContain('junction.computer');
    expect(text).not.toMatch(/22 built-in themes/i);
    expect(text).not.toMatch(/Backend Modules/);
    expect(text).not.toMatch(/Agent Types/);
    expect(text).not.toMatch(/Everything you need/);
  });

  it('does not leak implementation paths on the marketing page', () => {
    const { container } = render(<App />);
    const text = pageText(container);
    expect(text).not.toContain('~/.kiro/crew');
    expect(text).not.toMatch(/localhost:5476/);
  });

  it('does not present another product name as Junction', () => {
    const { container } = render(<App />);
    const text = pageText(container);
    expect(text).not.toMatch(/Kiro Crew/);
    expect(text).not.toMatch(/kirocrew/i);
    // GitHub slug stays laqaer/acpcrew until a human rename; clone paths are
    // not a product name.
    const leftover = text
      .replace(/github\.com\/laqaer\/acpcrew(?:\.git)?/gi, '')
      .replace(/\bcd acpcrew\b/gi, '');
    expect(leftover).not.toMatch(/acpcrew/i);
    expect(text).toMatch(/kiro-cli is optional/i);
  });

  it('sells the switch, not an upstream dashboard clone', () => {
    const { container } = render(<App />);
    const text = pageText(container);
    expect(text).toContain('Do I need a vendor agent CLI?');
    expect(text).toContain('LOCAL');
    expect(text).toContain('Two planes, one switch');
    expect(text).toContain('Loopback dashboard');
    expect(text).toContain('Install it on this machine');
    expect(text).toContain('First run');
    expect(text).toContain('junction setup && junction gateway');
    expect(text).not.toContain('Unlock the dashboard');
    expect(text).not.toContain('YOLO');
    expect(text).not.toMatch(/Discussions/);
    expect(text).not.toMatch(/Older Sessions/);
  });

  it('index.html title and description are Junction, without the ghost', () => {
    const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
    expect(html).toContain('<title>Junction</title>');
    expect(html).toContain('Where coding agents meet the models you want');
    expect(html).toContain('https://getjunction.dev/');
    expect(html).not.toContain('👻');
    expect(html).not.toContain('Kiro Crew');
    expect(html).not.toContain('junction.computer');
  });
});
