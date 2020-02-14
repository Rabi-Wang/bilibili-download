const fs = require('fs')
const axios = require('axios')
const path = require('path')

/* 下载视频
    * @param downloadUrl 视频播放链接
    * @param title 下载视频的文件名
    * @param ep 番剧ep号
    * @param bangumiName 对应番剧名的文件夹
    * @param downloadPath 视频保存的路径
    *  */
const downloadCore = async (downloadUrl, title, ep, av, dirName, downloadPath) => {
    const newDownloadPath = `${downloadPath}\\${dirName}`
    !fs.existsSync(newDownloadPath) && fs.mkdirSync(newDownloadPath)

    const filePath = path.resolve(newDownloadPath, `${title}.mp4`)
    const writer = fs.createWriteStream(filePath)
    let url = ep !== '' ? `https://www.bilibili.com/bangumi/play/ep${ep}` : `https://api.bilibili.com/x/web-interface/view?aid=${av}`
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
    writer.on('finish', () => {
        console.log('下载完成')
    })
}

exports.downloadCore = downloadCore
