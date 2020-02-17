import React, { useEffect, useState, Provider } from 'react'
import { Layout, Menu, Icon } from 'antd'
import { Link, BrowserRouter, Switch, Route, Router } from 'react-router-dom'
import Search from './components/Search'
import DownloadManage from './components/DownloadManage'

const { Header, Content, Footer } = Layout

const socket = require('socket.io-client')('ws://localhost:9995')

const App = () =>{
    const [code, setCode] = useState('')
    const [processInfo, setProcessInfo] = useState([])
    const [avInfo, setAvInfo] = useState([])
    const [epInfo, setEpInfo] = useState([])
    const [title, setTitle] = useState('')
    const [downloadQuality, setQuality] = useState(116)
    const [wrap, setWrap] = useState({ title: '', cover: '', desc: '', owner: '', view: '' })

    useEffect(() => {
        socket.on('message', msg => {
            console.log(`message: ${msg}`)
        });
        socket.on('step', step => {
            // console.log(`step: ${step}`)
            // console.log(step)
        })
    }, [])

    return (
        <BrowserRouter>
            <Layout style={{ height: "100%", overflow: "hidden" }}>
                <Header style={{ height: "40px", backgroundColor: "white" }}>
                    <Menu
                        theme="light"
                        mode="horizontal"
                        defaultSelectedKeys={['home']}
                        style={{ lineHeight: '40px' }}
                    >
                        <Menu.Item key="home">
                            <Link to="/">
                                <Icon type="home" />
                                首页
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="download">
                            <Link to={{ pathname: '/downloadManage' }}>
                                <Icon type="download" />
                                下载管理
                            </Link>
                        </Menu.Item>
                    </Menu>
                </Header>
                <Content
                    style={{
                        display: "flex", flexDirection: "column", minHeight: "600px", height: "93%", padding: "5px 10%", backgroundColor: "white",
                    }}
                >
                    <Switch>
                        <Route exact path="/" render={() => {
                            return (
                                <Search
                                    {
                                        ...{
                                            code, setCode,
                                            avInfo, setAvInfo,
                                            epInfo, setEpInfo,
                                            downloadQuality, setQuality,
                                            title, setTitle,
                                            wrap, setWrap,
                                            setProcessInfo,
                                        }
                                    }
                                />
                                )
                        }} />
                        <Route exact path="/downloadManage" render={() => {
                            return (<DownloadManage downloadInfo={processInfo} setInfo={setProcessInfo} />)
                        }} />
                    </Switch>
                </Content>
                <Footer
                    style={{
                        backgroundColor: "white", display: "inlineFlex", padding: "0", textAlign: "center"
                    }}
                >
                    Bilibili Download Created by WangJiaLe
                </Footer>
            </Layout>
        </BrowserRouter>

    )
}

export default App;
