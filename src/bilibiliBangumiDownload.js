const axios = require('axios')
const downloadCore = require('./utils/downloadCore').downloadCore
const getPlayList = require('./utils/getPlayList').getPlayList

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
                const jsonData = JSON.parse(filterData[1])
                const { epList, mediaInfo: { title } } = jsonData
                const bangumiInfo = {
                    bangumiName: title,
                    epList: epList.map(item => ({
                        aid: item.aid,
                        cid: item.cid,
                        title: `${item.title}${item.longTitle}`
                    }))
                }
                return bangumiInfo
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
            newEpList.push({
                url: url,
                ...item,
            })
        }
        return newEpList
    }

    const downloadVideo = (videoInfo, ep, bangumiName, downloadPath) => {
        videoInfo.forEach(item => item.url.forEach((url, index) => downloadCore(url, `${item.title}${index > 0 ? `-${index}` : ''}`, ep, '', bangumiName, downloadPath)))
    }

    const bangumiDownload = async (ep, quality = 116, downloadPath) => {
        const bangumiInfo = await getBangumiInfo(ep)
        const { epList, bangumiName } = bangumiInfo
        console.log(`epList: ${JSON.stringify(epList)}`)
        const videoInfo = await getAllVideoInfo(epList, quality)
        console.log(`videoInfo: ${JSON.stringify(videoInfo)}`)
        console.log(`bangumiName: ${bangumiName}`)
        downloadVideo(videoInfo, ep, bangumiName, downloadPath)
    }

    return {
        bangumiDownload,
    }
}

exports.bilibiliBangumiDownload = bilibiliBangumiDownload().bangumiDownload
