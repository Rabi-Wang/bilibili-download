import React, { useState } from 'react'
import axios from 'axios'
import { Input, Card, Skeleton, Divider } from 'antd'
import DownloadInfoModal from "./DownloadInfoModal";

const initialValue = {
    code: '',
    loading: false,
    downloadInfoModalVisible: false,
}

const Search = () => {
    const [state, setState] = useState(initialValue)
    const [avInfo, setAvInfo] = useState({})
    const [epInfo, setEpInfo] = useState({})
    const [downloadInfo, setDownloadInfo] = useState({})
    const { loading, downloadInfoModalVisible, code } = state
    const { pages, pic, avTitle, name, view, desc } = avInfo
    const { epTitle, epList, cover, evaluate } = epInfo

    const handleSearch = (code) => {
        const tmpCode = code.toLowerCase()
        console.log(tmpCode)
        const av = /.*av.*/
        const ep = /.*ep.*/
        if(av.test(tmpCode)) {
            const url = `http://localhost:9999/searchAv/${code.substring(2)}`
            axios.get(url)
                .then(res => res.data)
                .then(resData => {
                    console.log(resData)
                    const { code } = resData
                    if(code !== -404) {
                        const { data: { pic, title, owner: { name }, stat: { view }, pages, desc } } = resData
                        setState({ ...state, loading: false, code: tmpCode })
                        setAvInfo({ pic, avTitle: title, name, view, pages, desc })
                    } else {
                        setState({ ...state, loading: false, code: tmpCode })
                    }
                })
        } else if(ep.test(tmpCode)) {
            const url = `http://localhost:9999/searchEp/${code.substring(2)}`
            axios.get(url)
                .then(res => res.data)
                .then(resData => {
                    const { mediaInfo: { title, cover, evaluate }, epList } = resData
                    const newEpList = epList.map(ep => ({
                        aid: ep.aid,
                        cid: ep.cid,
                        title: ep.titleFormat + ep.longTitle,
                        cover: ep.cover,
                    }))
                    setState({ ...state, loading: false, code: tmpCode })
                    setEpInfo({ epList: newEpList, epTitle: title, cover, evaluate })
                    console.log(resData)
                })
        }
    }

    const showDownloadModal = (info) => {
        const infos = Array.isArray(info) ? [...info] : [info]
        if (/.*av.*/.test(code)) {
            setDownloadInfo({ aid: code, pages: infos, title: avTitle })
        } else {
            setDownloadInfo({ ep: code, epList: infos, title: epTitle })
        }
        setState({ ...state, downloadInfoModalVisible: true })
    }

    return (
        <div>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", padding: "10px 0" }}>
                <Input.Search
                    size="large"
                    enterButton
                    onSearch={value => { handleSearch(value) }}
                    style={{ maxWidth: "600px" }}
                    loading={loading}
                    placeholder="输入视频av号或番剧ep号"
                />
            </div>
            <Skeleton loading={loading} active>
                {Array.isArray(pages) && (
                    <div>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            <Card
                                cover={<img alt="example" src={pic} name="referrer" content="no-referrer" />}
                                hoverable
                                style={{ minWidth: "170px", height: "170px", padding: "2px", margin: "10px", boxSizing: "border-box" }}
                                bodyStyle={{ padding: "5px", border: "1px solid #e7e7e7" }}
                                bordered
                                onClick={() => { showDownloadModal(pages) }}
                            >
                                <span>{avTitle}</span><br />
                                <span>UP: {name}</span><br />
                                <span>{(view / 10000).toFixed(2)}万播放</span><br />
                                <span>点击批量下载</span>
                            </Card>
                            <div>
                                <h2>{avTitle}</h2>
                                <h3>简介</h3>
                                <p>{desc}</p>
                            </div>
                        </div>
                        <Divider />
                        <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
                            {pages.map(page => (
                                <Card
                                    key={page.part}
                                    hoverable
                                    style={{ minWidth: "170px", maxWidth: '180px', height: "170px", padding: "2px", margin: "10px", boxSizing: "border-box" }}
                                    bodyStyle={{ padding: "5px", border: "1px solid #e7e7e7" }}
                                    bordered
                                    onClick={() => { showDownloadModal(page) }}
                                >
                                    <span>{page.part}</span><br />
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
                {Array.isArray(epList) && (
                    <div>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            <Card
                                cover={<img alt="example" src={cover} name="referrer" content="no-referrer" />}
                                hoverable
                                style={{ minWidth: "170px", height: "170px", padding: "2px", margin: "10px", boxSizing: "border-box" }}
                                bodyStyle={{ padding: "5px", border: "1px solid #e7e7e7" }}
                                bordered
                                onClick={() => { showDownloadModal(epList) }}
                            >
                                <span>{epTitle}</span><br />
                                <span>点击批量下载</span>
                            </Card>
                            <div>
                                <h2>{epTitle}</h2>
                                <h3>简介</h3>
                                <p>{evaluate}</p>
                            </div>
                        </div>
                        <Divider />
                        <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
                            {epList.map(ep => (
                                <Card
                                    key={ep.title}
                                    hoverable
                                    cover={<img alt="example" src={ep.cover} name="referrer" content="no-referrer" />}
                                    style={{ minWidth: "170px", maxWidth: '180px', height: "170px", padding: "2px", margin: "10px", boxSizing: "border-box" }}
                                    bodyStyle={{ padding: "5px", border: "1px solid #e7e7e7" }}
                                    bordered
                                    onClick={() => { showDownloadModal(ep) }}
                                >
                                    <span style={{ width: "170px" }}>{ep.title}</span><br />
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </Skeleton>
            {
                downloadInfoModalVisible ? (
                    <DownloadInfoModal
                        onOk={() => { setState({ ...state, downloadInfoModalVisible: false })} }
                        onCancel={() => { setState({ ...state, downloadInfoModalVisible: false })} }
                        downloadInfo={downloadInfo}
                        code={code}
                    />
                ) : ''
            }
        </div>

    )
}

export default Search
