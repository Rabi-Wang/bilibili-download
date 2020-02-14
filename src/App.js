import React from 'react'
import { Layout } from 'antd'
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
        <Content style={{ display: "flex", flexDirection: "column", minHeight: "600px", height: "85%", padding: "20px 10%" }}>
          <Search />
        </Content>
        <Footer style={{ textAlign: "center", height: "5%" }}>Bilibili Download Created by WangJiaLe</Footer>
      </Layout>
  );
}

export default App;
