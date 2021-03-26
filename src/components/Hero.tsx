import React, { ReactElement } from 'react';

export function Hero(): ReactElement {
  return (
    <div className="hero">
      <div className="hero-overlay" />
      <div className="hero-content">
        <div className="logo">
          <img src="/swarm-symbol.svg" alt="Logo" />
        </div>
        <h1>Swarm Staking App</h1>
      </div>
    </div>
  );
}
