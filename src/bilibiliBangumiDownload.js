const axios = require('axios')
const path = require('path')
const fs = require('fs')

const bilibiliBangumiDownload = () => {

    const getEpList = (ep) => {
        let url = `https://www.bilibili.com/bangumi/play/ep${ep}`
        return axios.get(url)
            .then(res => res.data)
            .then(resData => {
                const filterData = resData.match(/INITIAL_STATE__=(.*?"]})/)
                const jsonData = JSON.parse(filterData[1])
                const { epList } = jsonData
                const newEpList = epList.map(item => ({
                    aid: item.aid,
                    cid: item.cid,
                    title: `${item.title}${item.longTitle}`
                }))
                console.log(`epList: ${JSON.stringify(newEpList)}`)
                return newEpList
            })
    }

    const getPlayList = (aid, cid, quality = 80) => {
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
                const playList = durl.map(item => ({
                    url: item.url,
                }))
                console.log(`playList: ${JSON.stringify(playList)}`)
                return playList
            })
    }

    const downloadVideo = async (downloadUrl, title, ep, downloadPath = 'E:\\code\\node\\bilibili-download\\video') => {
        if (!fs.existsSync(downloadPath)) {
            fs.rmdirSync(downloadPath)
        }
        const filePath = path.resolve(downloadPath, `${title}.flv`)
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

    const bangumiDownload = (ep = 267851) => {
        getEpList(ep)
            .then(epList => {
                getPlayList(epList[0].aid, epList[0].cid)
                    .then(playList => {
                        downloadVideo(playList[0].url, epList[0].title, ep)
                    })
            })
    }

    return {
        bangumiDownload,
    }
}

exports.bilibiliBangumiDownload = bilibiliBangumiDownload
