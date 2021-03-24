import React from 'react';
import { Col, Layout, Row } from 'antd';
import { Pools, MetamaskConnect, Hero, Heading, Balances, MetamaskStatus } from './components';
import { useEthers } from './lib';
const { Header, Content, Footer } = Layout;

function App() {
  const { connected } = useEthers();
  return (
    <Layout className="layout">
      <div className="header-hero">
        <Header>
          <Row>
            <Col span={12}>
              <div className="logo">
                <img src="/logo.svg" alt="Logo" />
              </div>
            </Col>
            <Col span={12} style={{ textAlign: 'right', color: '#fff', fontSize: '1.125rem' }}>
              <MetamaskConnect />
            </Col>
          </Row>
        </Header>
        <Hero />
      </div>
      <Content>
        {connected ? (
          <>
            <Heading>Balances</Heading>
            <Balances />
            <Heading>Pools</Heading>
            <Pools />
          </>
        ) : (
          <MetamaskStatus />
        )}
      </Content>
      <Footer>
        <div style={{ textAlign: 'center' }}>Created by Swarm Network 2021.</div>
      </Footer>
    </Layout>
  );
}

export default App;
