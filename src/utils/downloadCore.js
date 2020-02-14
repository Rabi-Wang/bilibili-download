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
    const pattern=/[\\/:*?"<>|]/g // win10文件禁止使用的字符
    dirName = dirName.replace(pattern, '')
    dirName = dirName.substring(0, 100) // 限制文件名的长度
    const newDownloadPath = `${downloadPath}\\${dirName}`
    !fs.existsSync(newDownloadPath) && fs.mkdirSync(newDownloadPath)
    title = title.replace(pattern, '')
    title = title.substring(0, 100)

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

    let size = 0
    const { data } = response
    const totalSize = data.rawHeaders[data.rawHeaders.indexOf('Content-Length') + 1]
    console.log(`文件大小：${totalSize}`)
    let step = 0
    data.pipe(writer)
    data.on('data', (res) => {
        size += res.length
        step = (size / totalSize * 100).toFixed(0)
        console.log(`下载进度：${step}%`)
    })
    writer.on('finish', () => {
        console.log('下载完成')
    })

}

exports.downloadCore = downloadCore
