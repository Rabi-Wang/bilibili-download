const axios = require('axios')
const downloadCore = require('./downloadCore').downloadCore
const getPlayList = require('./getPlayList').getPlayList

const bilibiliBangumiDownload = () => {

    /* 根据番剧ep号获取番剧列表
    * @param ep 番剧ep号
    * return 番剧所有剧集列表(aid, cid, title)
    * */
    const getBangumiInfo = (ep) => {
        let url = `https://www.bilibili.com/bangumi/play/ep${ep}`
        return axios.get(url)
            .then(res => res.data)
            .then(resData => {
                const filterData = resData.match(/INITIAL_STATE__=(.*?"]})/)
                return JSON.parse(filterData[1])
            })
    }

    /* 在剧集列表中添加播放链接
    * @param epList 番剧剧集列表
    * @param quality 视频质量
    * return 剧集信息
    * */
    const getAllVideoInfo = async (epList, quality) => {
        let newEpList = []
        for(let item of epList) {
            const url = await getPlayList(item.aid, item.cid, quality)
            url.forEach((u, i) => {
                newEpList.push({
                    url: u,
                    title: `${item.title}${i > 0 ? `-${i}` : ''}`
                })
            })
        }
        return newEpList
    }

    const downloadVideo = async (allInfo, sendMessage) => {
        console.log(allInfo)
        const { ep, bangumiName, downloadPath, videoInfo } = allInfo
        videoInfo.forEach(info => {
            downloadCore(info.url, info.title, ep, '', bangumiName, downloadPath)
                .then((res) => {
                    console.log(`下载完成回调：${res}`)
                    sendMessage(res)
                })
        })

    }

    const bangumiDownload = async (bangumiInfo, downloadPath, sendMessage) => {
        const { epList, title, ep, quality } = bangumiInfo
        // console.log(`epList: ${JSON.stringify(epList)}`)
        const videoInfo = await getAllVideoInfo(epList, quality)
        // console.log(`videoInfo: ${JSON.stringify(videoInfo)}`)
        // console.log(`bangumiName: ${title}`)
        downloadVideo({ videoInfo, ep, bangumiName: title, downloadPath }, sendMessage)
    }

    return {
        bangumiDownload,
        getBangumiInfo,
    }
}

exports.bilibiliBangumiDownload = bilibiliBangumiDownload
