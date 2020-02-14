const Koa = require('koa')
const cors = require('koa2-cors')
const router = require('koa-router')()
const bodyParser = require('koa-bodyparser')
const bilibiliNormalVideoDownload = require('../utils/bilibiliNormalVideoDownload').bilibiliNormalVidoDownload()
const bilibiliBangumiDownload = require('../utils/bilibiliBangumiDownload').bilibiliBangumiDownload()

const app = new Koa()

app.use(cors({
        origin: ctx => ('http://localhost:9997'),
        exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
        maxAge: 5,
        credentials: true,
        allowMethods: ['GET', 'POST', 'DELETE'],
        allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
    })
)

app.use(bodyParser({
        onerror: (err, ctx) => {
                ctx.throw('body parse error', 422)
        }
}))

router.get('/searchAv/:code', async (ctx) => {
        const { request, response, params } = ctx
        console.log(request)
        console.log(params)
        const code = params.code.toLowerCase()
        const videoInfo = await bilibiliNormalVideoDownload.getVideoInfo(code)
        console.log(videoInfo)
        response.body = videoInfo
})

router.get('/searchEp/:code', async (ctx) => {
        const { request, response, params } = ctx
        console.log(request)
        console.log(params)
        const code = params.code.toLowerCase()
        const bangumiInfo = await bilibiliBangumiDownload.getBangumiInfo(code)
        console.log(bangumiInfo)
        response.body = bangumiInfo
})

router.post('/downloadAv', async (ctx) => {
        const { request, response } = ctx
        console.log(request.body)
        const { downloadInfo, code, downloadPath, downloadQuality, title } = request.body.params
        bilibiliNormalVideoDownload.normalVideoDownload({
                pages: downloadInfo,
                aid: code,
                quality: downloadQuality,
                title,
        }, downloadPath)
})

router.post('/downloadEp', async (ctx) => {
        const { request, response } = ctx
        console.log(request.body)
        const { downloadInfo, code, downloadPath, downloadQuality, title } = request.body.params
        bilibiliBangumiDownload.bangumiDownload({
                epList: downloadInfo,
                ep: code,
                quality: downloadQuality,
                title,
        }, downloadPath)
})

app.use(router.routes()).use(router.allowedMethods());

app.listen(9999)