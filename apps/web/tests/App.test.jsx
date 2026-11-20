import { describe, it, expect } from 'vitest';
import React from 'react';
import { App } from '../src/app/App.jsx';

describe('Web App Smoke Test', () => {
  it('instantiates App component without throwing', () => {
    expect(App).toBeDefined();
    const element = React.createElement(App);
    expect(element).toBeDefined();
  });
});
