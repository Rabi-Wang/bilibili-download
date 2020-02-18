import React, { useState } from 'react'
import axios from 'axios'
import { Input } from 'antd'
import PropsType from 'props-type'
import DownloadInfoModal from './DownloadInfoModal'
import VideoContent from './VideoContent'

const Search = (props) => {
    const [loading, setLoading] = useState(false)
    const [downloadInfoModalVisible, setDownloadInfoModalVisible] = useState(false)
    const [downloadList, setDownloadList] = useState([])
    const {
        code, setCode,
        avInfo, setAvInfo,
        epInfo, setEpInfo,
        downloadQuality, setQuality,
        setProcessInfo,
        wrap, setWrap,
    } = props

    console.log(props)
    const handleSearch = (code) => {
        const tmpCode = code.toLowerCase()
        setCode(tmpCode)
        setLoading(true)
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
                        setLoading(false)
                        setWrap({ cover: pic, title, owner: name, view: view, desc })
                        setAvInfo(pages)
                        setEpInfo([])
                    } else {
                        setLoading(false)
                        setAvInfo([])
                        setEpInfo([])
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
                    setLoading(false)
                    setWrap({ title, cover, desc: evaluate })
                    setEpInfo(newEpList)
                    setAvInfo([])
                })
                .catch(err => {
                    console.log(err)
                    setEpInfo([])
                    setAvInfo([])
                })
        } else {
            setAvInfo([])
            setEpInfo([])
        }
    }

    const showDownloadModal = (list) => {
        const newList = Array.isArray(list) ? [...list] : [list]
        setDownloadList(newList)
        setDownloadInfoModalVisible(true)
    }

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
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
            <VideoContent
                showDownloadModal={showDownloadModal}
                loading={loading}
                {
                    ...{
                        ...wrap,
                        list: /.*av.*/.test(code) ? avInfo : epInfo,
                        code,
                    }
                }
            />
            {
                downloadInfoModalVisible ? (
                    <DownloadInfoModal
                        onOk={() => { setDownloadInfoModalVisible(false) }}
                        onCancel={() => { setDownloadInfoModalVisible(false) }}
                        {
                            ...{
                                title: wrap.title,
                                code,
                                downloadList: downloadList,
                                downloadQuality, setQuality,
                                setProcessInfo,
                            }
                        }
                    />
                ) : ''
            }
        </div>
    )
}

Search.propsTyps = {
    code: PropsType.string,
    setCode: PropsType.func,
    avInfo: PropsType.array,
    setAvInfo: PropsType.func,
    epInfo: PropsType.array,
    setEpInfo: PropsType.func,
    downloadQuality: PropsType.number,
    setQuality: PropsType.func,
    setProcessInfo: PropsType.func,
    wrap: PropsType.object,
    setWrap: PropsType.func,
}

export default Search
