import React, { useEffect } from 'react'
import { Layout } from 'antd'
import Search from './components/Search'

const { Header, Content, Footer } = Layout

function App() {
    useEffect(() => {
        let ws = new WebSocket('ws://localhost:9995')
        ws.onopen = () => {
            // Web Socket 已连接上，使用 send() 方法发送数据
            ws.send('hello')
            console.log('数据发送中...')
        }

        ws.onmessage = (evt) => {
            let msg = evt.data
            console.log(`msg: ${msg}`)
        }

        ws.onclose = () => {
            // 关闭 websocket
            console.log('连接已关闭...')
        }
    }, [])

    return (
        <Layout style={{ height: "100%", overflow: "hidden" }}>
            <Header
                style={{
                    color: "white",
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "150%",
                    height: "5%",
                    display: "inline-flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    Bilibili视频下载器
            </Header>
            <Content
                style={{
                    display: "flex", flexDirection: "column", minHeight: "600px", height: "93%", padding: "5px 10%", backgroundColor: "white",
                }}
            >
                <Search />
            </Content>
            <Footer
                style={{
                    backgroundColor: "white", display: "inlineFlex", padding: "0", textAlign: "center"
                }}
            >
                Bilibili Download Created by WangJiaLe
            </Footer>
        </Layout>
    )
}

export default App;
