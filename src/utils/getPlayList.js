const axios = require('axios')

/*
    * 获取视频的播放链接(包括含有多p的视频)
    * @param aid 视频av号
    * @param cid 真正的视频id
    * @param quality 视频的分辨率(116 => 1080p60fps 需大会员, 112 => 1080p+ 需大会员, 80 => 1080p, 74 => 720p60fps 需大会员, 64 => 720p, 32 => 480p, 16 => 360p)
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

exports.getPlayList = getPlayList