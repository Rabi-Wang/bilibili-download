const axios = require('axios')
const downloadCore = require('./downloadCore').downloadCore
const getPlayList = require('./getPlayList').getPlayList

const bilibiliNormalVideoDownload = () => {

    /*
    * 根据av号获取视频信息
    * @param aid 视频av号
    * @param quality 视频分辨率
    * return 视频信息(aid, title, cid, pages, quality)
    * */
    const getVideoInfo = (aid) => {
        let url = `https://api.bilibili.com/x/web-interface/view?aid=${aid}`
        return axios.get(url)
            .then(res => res.data)
    }

    /*
    * 获取视频播放地址
    * @param videoInfo 视频信息
    * return 视频播放地址
    * */
    const getAllVideoInfo = async (videoInfo) => {
        const { pages, aid, quality } = videoInfo
        let downloadInfos = []
        for(let page of pages) {
            const { cid, part } = page
            const url = await getPlayList(aid, cid, quality)
            downloadInfos.push({ title: part, url: url })
        }
        return downloadInfos
    }

    const downloadVideo = (downloadInfo, videoInfo, downloadPath) => {
        const { title, aid } = videoInfo
        downloadInfo.forEach(info => info.url.forEach(url => downloadCore(url, info.title, '', aid, title, downloadPath)))
    }

    const download = async (videoInfo, downloadPath) => {
        console.log(videoInfo)
        console.log(`downloadPath: ${downloadPath}`)
        const downloadInfo = await getAllVideoInfo(videoInfo)
        console.log(`downloadInfo: ${JSON.stringify(downloadInfo)}`)
        downloadVideo(downloadInfo, videoInfo, downloadPath)
    }

    return {
        normalVideoDownload: download,
        getVideoInfo: getVideoInfo,
    }
}

exports.bilibiliNormalVidoDownload = bilibiliNormalVideoDownload
