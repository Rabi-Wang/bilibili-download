import React, { useEffect, useState } from 'react'
import PropsType from 'props-type'
import { Progress } from 'antd'

const socket = require('socket.io-client')('ws://localhost:9995')

const DownloadManage = (props) => {
    const { downloadInfo, setInfo } = props

    console.log(props)
    useEffect(() => {
        socket.on('step', s => {
            console.log('step')
            console.log(s)
            const tmp = [...downloadInfo]
            const newInfo = tmp.map(item => {
                return item.title === s.title ? { ...item, step: s.step } : { ...item }
            })
            setInfo(newInfo)
        })
    }, [])

    return (
        <div style={{ marginTop: "10px" }}>
            {Array.isArray(downloadInfo) ? downloadInfo.map(item => (
                <div key={item.title} style={{ display: "float" }}>
                    <div
                        style={{ float: "left", width: "30%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "inlineBlock", margin: "0" }}
                        title={item.title}
                    >{item.title}</div>
                    <Progress
                        style={{ float: "right", width: "70%" }}
                        percent={item.step}
                        status="active"
                    />
                </div>
            )) : 'test'}
        </div>
    )
}

export default DownloadManage
