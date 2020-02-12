const axios = require('axios')
const path = require('path')
const fs = require('fs')

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

    /*
    * 获取视频的播放链接(包括含有多p的视频)
    * @param aid 视频av号
    * @param cid 真正的视频id
    * @param quality 视频的分辨率(80 => 1080p, 64 => 720p, 32 => 480p, 16 => 320p)
    * return 视频的播放链接
    * */
    const getPlayList = (aid, cid, quality) => {
        let url = `https://api.bilibili.com/x/player/playurl?cid=${cid}&avid=${aid}&qn=${quality}`
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
            'Cookie': 'SESSDATA=371bb565%2C1582281390%2C10f39311', // cookie中的SESSDATA字段,有效期1个月
            'Host': 'api.bilibili.com',
        }
        return axios.get(url, { headers })
            .then(res => res.data)
            .then(resData => {
                const { data: { durl } } = resData
                return durl.map(item => item.url)
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

    /* 下载视频
    * @param downloadUrl 视频播放链接
    * @param title 下载视频的文件名
    * @param ep 番剧ep号
    * @param bangumiName 对应番剧名的文件夹
    * @param downloadPath 视频保存的路径
    *  */
    const downloadVideoCore = async (downloadUrl, title, ep, bangumiName, downloadPath) => {
        const newDownloadPath = `${downloadPath}\\${bangumiName}`
        !fs.existsSync(newDownloadPath) && fs.mkdirSync(newDownloadPath)

        const filePath = path.resolve(newDownloadPath, `${title}.mp4`)
        const writer = fs.createWriteStream(filePath)
        let url = `https://www.bilibili.com/bangumi/play/ep${ep}`
        const headers = {
            // 'Host': 'upos-hz-mirrorks3.acgvideo.com',
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
            'Accept': '*/*',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'Range': 'bytes=0-', // Range 的值要为 bytes=0- 才能下载完整视频
            'Referer': url,
            'Origin': 'https://www.bilibili.com',
            'Connection': 'keep-alive',
        }
        let response = await axios({
            url: downloadUrl, //需要访问的资源链接
            method: "GET",
            responseType: "stream",
            headers,
        })
        response.data.pipe(writer)
        return new Promise((resolve, reject) => {
            writer.on('finish', resolve)
            writer.on('error', reject)
        })
    }

    const downloadVideo = (videoInfo, ep, bangumiName, downloadPath) => {
        videoInfo.forEach(item => item.url.forEach((url, index) => downloadVideoCore(url, `${item.title}${index > 0 ? `-${index}` : ''}`, ep, bangumiName, downloadPath)))
    }

    const bangumiDownload = async (ep, quality = 80, downloadPath) => {
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

exports.bilibiliBangumiDownload = bilibiliBangumiDownload
