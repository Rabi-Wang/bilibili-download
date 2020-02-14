import React from 'react'
import { Layout, BackTop } from 'antd'
import Search from './components/Search'

const { Header, Content, Footer } = Layout

function App() {
  return (
      <Layout style={{ height: "100%" }}>
          <Header
              style={{
                  color: "white",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "200%",
                  height: "10%",
                  display: "inline-flex",
                  justifyContent: "center",
                  alignItems: "center",
              }}>
              Bilibili视频下载器
          </Header>
          <Content
              style={{
                  display: "flex", flexDirection: "column", minHeight: "600px", height: "85%", padding: "20px 10%", backgroundColor: "white"
              }}
          >
              <Search />
          </Content>
          <Footer
              style={{
                  height: "5%", position: "fixed", bottom: "5px", left: "50%", transform: "translate(-50%)", backgroundColor: "white"
              }}
          >
              Bilibili Download Created by WangJiaLe
          </Footer>
          <BackTop />
      </Layout>
  );
}

export default App;
