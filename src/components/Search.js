import React, { useState } from 'react'
import axios from 'axios'
import { Input, Affix } from 'antd'
import DownloadInfoModal from './DownloadInfoModal'
import VideoContent from './VideoContent'

const initialValue = {
    code: '',
    loading: false,
    downloadInfoModalVisible: false,
}

const cleanAvInfo = {
    pages: '',
    pic: '',
    avTitle: '',
    name: '',
    view: '',
    desc: '',
}

const cleanEpInfo = {
    epTitle: '',
    epList: '',
    cover: '',
    evaluate: '',
}

const Search = () => {
    const [state, setState] = useState(initialValue)
    const [avInfo, setAvInfo] = useState({})
    const [epInfo, setEpInfo] = useState({})
    const [downloadInfo, setDownloadInfo] = useState({})
    const { loading, downloadInfoModalVisible, code } = state
    const { avTitle } = avInfo
    const { epTitle } = epInfo

    const handleSearch = (code) => {
        const tmpCode = code.toLowerCase()
        const av = /.*av.*/
        const ep = /.*ep.*/
        if(av.test(tmpCode)) {
            const url = `http://localhost:9999/searchAv/${code.substring(2)}`
            axios.get(url)
                .then(res => res.data)
                .then(resData => {
                    console.log(resData)
                    const { code } = resData
                    if(code !== -404 && code !== 62002) {
                        const { data: { pic, title, owner: { name }, stat: { view }, pages, desc } } = resData
                        setState({ ...state, loading: false, code: tmpCode })
                        setAvInfo({ pic, avTitle: title, name, view, pages, desc })
                        setEpInfo(cleanEpInfo)
                    } else {
                        setState({ ...state, loading: false, code: tmpCode })
                        setEpInfo(cleanEpInfo)
                        setAvInfo(cleanAvInfo)
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
                    setAvInfo(cleanAvInfo)
                })
                .catch(err => {
                    console.log(err)
                    setEpInfo(cleanEpInfo)
                    setAvInfo(cleanAvInfo)
                })
        } else {
            setAvInfo(cleanAvInfo)
            setEpInfo(cleanEpInfo)
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
        <div style={{ display: "flex", flexDirection: "column" }}>
            <Affix offsetTop={20}>
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
            </Affix>

            <VideoContent showDownloadModal={showDownloadModal} avInfo={avInfo} epInfo={epInfo} loading={loading} />
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
