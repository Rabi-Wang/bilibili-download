import React, { useEffect } from 'react'
import { Layout } from 'antd'
import Search from './components/Search'

const { Header, Content, Footer } = Layout

const socket = require('socket.io-client')('ws://localhost:9995')

const App = () =>{
    useEffect(() => {
        socket.on('login', (data) => {
            console.log(data)
        });
        socket.on('add user', (data) => {
            console.log(data)
        });
        socket.on('message', (data) => {
            console.log(data)
        });
        socket.emit('message', 'hello')
        console.log('数据发送中...')
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
