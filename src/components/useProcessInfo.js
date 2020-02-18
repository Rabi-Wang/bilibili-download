import React, { useState, useEffect } from 'react'
import _ from 'lodash'
// const socket = require('socket.io-client')('ws://localhost:9995')

let processInfo = []

function useProcessInfo() {
    // const [processInfo, insideSetProcessInfo] = useState([])

    const setProcessInfo = (newProcessInfo, isPush) => {
        console.log(newProcessInfo)
        if (isPush) {
            newProcessInfo.forEach(item => {
                processInfo.push(item)
            })
            console.log('push')
            console.log(processInfo)
        } else if (newProcessInfo && processInfo) {
            let tmp = []
            newProcessInfo.forEach(item => {
                tmp = processInfo.map(i => {
                    return {
                        title: i.title,
                        step: i.title === item.title ? (i.step > item.step ? i.step : item.step) : i.step,
                    }
                })
                console.log('tmp')
                console.log(tmp)
                processInfo = _.cloneDeep(tmp)
            })
        }
    }

    const getProcessInfo = () => {
        return processInfo
    }

    // useEffect(() => {
    //     socket.on('step', s => {
    //         const tmp = [...processInfo]
    //         const newInfo = tmp.map(item => {
    //             return item.title === s.title ? { ...item, step: parseFloat(s.step) } : { ...item }
    //         })
    //         processInfo = [...newInfo]
    //     })
    // }, [])

    return [getProcessInfo, setProcessInfo]
}

export default useProcessInfo
