'use client';

import { useState } from 'react';

export default function Home() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem', fontFamily: 'sans-serif' }}>
      <h1>AI Cost Calculator</h1>
      <p>Calculate the cost of using Claude API</p>
      <a href="/calculator" style={{ fontSize: '1.1rem', color: '#0066cc', textDecoration: 'none' }}>
        Start Calculator →
      </a>
    </div>
  );
}
