import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Modal, Checkbox, Select, Divider, Button, Input, Icon, Upload } from 'antd'
import PropsType from 'props-type'

const { remote } = window.require('electron')

const initialState = {
    qualities: [116, 112, 80, 74, 64, 32, 16],
    downloadQuality: 116,
    plainOptions: [],
    checkedList: [],
    indeterminate: false,
    checkedAll: false,
    downloadPath: '',
}

const Option = Select.Option

const qualityMap = (quality) => {
    // 116 => 1080p60fps 需大会员, 112 => 1080p+ 需大会员, 80 => 1080p, 74 => 720p60fps 需大会员, 64 => 720p, 32 => 480p, 16 => 360p
    switch (quality) {
        case 116: return '超清(1080P 60FPS 大会员)'
        case 112: return '超清(1080P+ 大会员)'
        case 80: return '超清(1080P)'
        case 74: return '高清(720P 60FPS 大会员)'
        case 64: return '高清(720P)'
        case 32: return '标清(480P)'
        case 16: return '流畅(360P)'
        default: return ''
    }
}

const DownloadInfoModal = (props) => {
    const [state, setState] = useState(initialState)
    const { onOk, onCancel, downloadInfo, code } = props
    const { qualities, plainOptions, checkedList, indeterminate, checkedAll, downloadPath, downloadQuality } = state

    useEffect(() => {
        let plainOptions = []
        const av = /.*av.*/
        const ep = /.*ep.*/
        console.log(props)
        if (av.test(code)) {
            console.log(downloadInfo)
            const { pages } = downloadInfo
            pages.forEach(page => {
                const { part, cid } = page
                plainOptions.push({ label: part, value: cid })
            })
            setState({ ...state, plainOptions })
        } else if (ep.test(code)) {
            const { epList } = downloadInfo
            console.log(epList)
            epList.forEach(ep => {
                const { title, cid } = ep
                plainOptions.push({ label: title, value: cid })
            })
            setState({ ...state, plainOptions })
        }
    }, [])

    const handleQualityChange = (quality) => {
        setState({ ...state, downloadQuality: quality })
    }

    const videoChecked = (cid) => {
        let tmp = [...cid]
        let checkedAll = false
        let indeterminate = false
        tmp.length > 0 && (tmp.length === plainOptions.length ? checkedAll = true : indeterminate = true)
        setState({ ...state, checkedList: tmp, checkedAll, indeterminate })
    }

    const allVideoChecked = (e) => {
        const checked = e.target.checked
        setState({
            ...state,
            checkedList: checked ? plainOptions.map(option => option.value) : [],
            checkedAll: checked,
            indeterminate: false,
        })
    }

    const selectDownloadPath = () => {
        const downloadPath = remote.dialog.showOpenDialogSync({
            properties: ['openDirectory'],
        })
        setState({ ...state, downloadPath })
    }

    const changeDownloadPath = (e) => {
        const newPath = e.target.value
        console.log(newPath)
        setState({ ...state, downloadPath: newPath })
    }

    const newDownloadInfo = (type) => {
        let items = type === 'av' ? [...downloadInfo.pages] : [...downloadInfo.epList]
        let newInfo = []
        for (let checked of checkedList) {
            for (let item of items) {
                if (checked === item.cid) {
                    newInfo.push(item)
                }
            }
        }
        return newInfo
    }

    const download = () => {
        let url = ''
        let type = ''
        if (/.*av.*/.test(code)) {
            url = 'http://localhost:9999/downloadAv'
            type = 'av'
        } else {
            url = 'http://localhost:9999/downloadEp'
            type = 'ep'
        }
        const { title } = downloadInfo
        const params = {
            downloadInfo: newDownloadInfo(type),
            code: code.substring(2),
            downloadPath,
            downloadQuality,
            title,
        }
        axios.post(url, { params })
            .then(res => res.data)
    }

    const footer = (
        <div style={{ padding: "0 20px" }}>
            <div style={{ display: "flex" }}>
                <Input value={downloadPath} onChange={changeDownloadPath} placeholder="选择文件保存路径" />
                <Button onClick={selectDownloadPath}>
                    <Icon type="folder" />
                </Button>
            </div>
            <Button onClick={download} style={{ width: "100%", marginTop: "5px" }}>下载</Button>
        </div>
    )

    return (
        <Modal
            visible
            onOk={onOk}
            onCancel={onCancel}
            footer={footer}
            width="30%"
        >
            <div style={{ height: "350px", padding: "20px" }}>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                    <Checkbox
                        indeterminate={indeterminate}
                        onChange={allVideoChecked}
                        checked={checkedAll}
                    >
                        全选
                    </Checkbox>
                    <Select defaultValue={qualityMap(116)} style={{ width: "75%" }} onChange={handleQualityChange}>
                        {qualities.map(quality => (<Option key={quality}>{qualityMap(quality)}</Option>))}
                    </Select>
                </div>
                <Divider />
                <div>
                    <Checkbox.Group
                        style={{ display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "flex-start" }}
                        options={plainOptions}
                        onChange={videoChecked}
                        value={checkedList}
                    />
                </div>
            </div>
        </Modal>
    )
}

DownloadInfoModal.propsType = {
    onOk: PropsType.func,
    onCancel: PropsType.func,
    downloadInfo: {},
    code: PropsType.string,
}

export default DownloadInfoModal
