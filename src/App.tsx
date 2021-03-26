import React from 'react';
import { Col, Layout, Row } from 'antd';
import { Pools, MetamaskConnect, Hero, Heading, Balances, Rewards, MetamaskStatus } from './components';
import { useEthers } from './lib';
const { Header, Content, Footer } = Layout;

function App() {
  const { connected } = useEthers();
  return (
    <Layout className="layout">
      <div className="header-hero">
        <div className="header-hero-overlay" />
        <div className="header-hero-content">
          <Header>
            <div style={{ textAlign: 'right', color: '#fff', fontSize: '1.125rem' }}>
              <MetamaskConnect />
            </div>
          </Header>
          <Hero />
        </div>
      </div>
      <Content>
        {connected ? (
          <>
            {/*<Heading>Balances</Heading>*/}
            {/*<Balances />*/}
            <Heading>Pools</Heading>
            <Pools />
            {/*
            <Heading>Refill Rewards</Heading>
            <Rewards />
*/}
          </>
        ) : (
          <div>Conneting to Ethereum...</div>
        )}
      </Content>
      <Footer>
        <div style={{ textAlign: 'center' }}>
          Created by <a href="https://swarmnetwork.org">Swarm Network</a> 2021.
        </div>
      </Footer>
    </Layout>
  );
}

export default App;
