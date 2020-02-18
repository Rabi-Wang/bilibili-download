import React, { useEffect, useState } from 'react'
import PropsType from 'props-type'
import { Progress } from 'antd'

const socket = require('socket.io-client')('ws://localhost:9995')

const DownloadManage = (props) => {
    const { setProcessInfo, getProcessInfo } = props
    const [localProcessInfo, setLocalProcessInfo] = useState(getProcessInfo())

    console.log(props)
    useEffect(() => {
        socket.on('step', s => {
            const tmp = [...localProcessInfo]
            const newInfo = tmp.map(item => {
                return item.title === s.title ? { ...item, step: parseFloat(s.step) } : { ...item }
            })
            // console.log(newInfo)
            setProcessInfo(newInfo)
            setLocalProcessInfo(getProcessInfo())
        })
    }, [])

    return (
        <div style={{ marginTop: "10px" }}>
            {Array.isArray(localProcessInfo) && localProcessInfo.map(item => (
                <div key={item.title} style={{ display: "float" }}>
                    <div
                        style={{ float: "left", width: "30%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "inlineBlock", margin: "0" }}
                        title={item.title}
                    >{item.title}</div>
                    <Progress
                        style={{ float: "right", width: "70%" }}
                        percent={item.step}
                        status={100.00 - item.step < 0.1 ? 'success' : 'active'}
                    />
                </div>
            ))}
        </div>
    )
}

DownloadManage.propsType = {
    setProcessInfo: PropsType.func,
    getProcessInfo: PropsType.func,
}

export default DownloadManage
