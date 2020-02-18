import React from 'react'
import _ from 'lodash'

let processInfo = []

function useProcessInfo() {

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

    return [getProcessInfo, setProcessInfo]
}

export default useProcessInfo
