import React from 'react'
import { Skeleton, Divider, Card } from 'antd'
import PropsType from 'props-type'

const VideoContent = (props) => {
    const {
        showDownloadModal,
        loading,
        avInfo: { pages, pic, avTitle, name, view, desc },
        epInfo: { epTitle, epList, cover, evaluate },
    } = props

    return (
        <Skeleton loading={loading} active>
            {Array.isArray(pages) && (
                <div style={{ height: "calc(100vh * 0.93)" }}>
                    <div style={{ display: "flex", flexDirection: "row", height: "30%" }}>
                        <Card
                            cover={<img alt="example" src={pic} name="referrer" content="no-referrer" />}
                            hoverable
                            style={{ minWidth: "170px", maxWidth: "170px", minHeight: "147px", maxHeight: "147px", padding: "2px", margin: "10px", boxSizing: "border-box" }}
                            bodyStyle={{ padding: "5px", border: "1px solid #e7e7e7" }}
                            bordered
                            onClick={() => { showDownloadModal(pages) }}
                            loading={loading}
                        >
                            <span>点击批量下载</span>
                        </Card>
                        <div style={{ margin: "10px" }}>
                            <h2>{avTitle}</h2>
                            <h3>简介</h3>
                            <span>UP: {name}</span><br />
                            <span>{(view / 10000).toFixed(2)}万播放</span><br />
                            <p>{desc}</p>
                        </div>
                    </div>
                    <Divider />
                    <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", paddingBottom: "50px", height: "50%", overflowY: "scroll" }}>
                        {pages.length > 1 && pages.map(page => (
                            <Card
                                key={page.part}
                                cover={<img alt="example" src={pic} name="referrer" content="no-referrer" />}
                                hoverable
                                style={{ width: "170px", height: "163px", padding: "2px", margin: "5px", boxSizing: "border-box" }}
                                bodyStyle={{ padding: "5px", border: "1px solid #e7e7e7" }}
                                bordered
                                onClick={() => { showDownloadModal(page) }}
                                loading={loading}
                            >
                                <p
                                    style={{ overflow: "hidden", width: "150px", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "inlineBlock", margin: "0" }}
                                    title={page.part}
                                >{page.part}</p>
                                <span>单集下载</span>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
            {Array.isArray(epList) && (
                <div style={{ height: "calc(100vh * 0.93)" }}>
                    <div style={{ display: "flex", flexDirection: "row", height: "30%" }}>
                        <Card
                            cover={<img alt="example" src={cover} name="referrer" content="no-referrer" />}
                            hoverable
                            style={{ minWidth: "140px", maxWidth: "140px", minHeight: "217px", maxHeight: "217px" ,padding: "2px", margin: "10px", boxSizing: "border-box" }}
                            bodyStyle={{ padding: "5px", border: "1px solid #e7e7e7" }}
                            bordered
                            onClick={() => { showDownloadModal(epList) }}
                            loading={loading}
                        >
                            <span>点击批量下载</span>
                        </Card>
                        <div style={{ paddingTop: "10px" }}>
                            <h2>{epTitle}</h2>
                            <h3>简介</h3>
                            <p>{evaluate}</p>
                        </div>
                    </div>
                    <Divider />
                    <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", height: "50%", overflowY: "scroll" }}>
                        {epList.map(ep => (
                            <Card
                                key={ep.title}
                                hoverable
                                cover={<img alt="example" src={ep.cover} name="referrer" content="no-referrer" />}
                                style={{ width: "170px", height: "163px", padding: "2px", margin: "5px", boxSizing: "border-box" }}
                                bodyStyle={{ padding: "5px", border: "1px solid #e7e7e7" }}
                                bordered
                                onClick={() => { showDownloadModal(ep) }}
                                loading={loading}
                            >
                                <p
                                    style={{ overflow: "hidden", width: "150px", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "inlineBlock", margin: "0" }}
                                    title={ep.title}
                                >
                                    {ep.title}
                                </p>
                                <span>单集下载</span>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </Skeleton>
    )
}

VideoContent.propsType = {
    showDownloadModal: PropsType.func,
    loading: PropsType.boolean,
    avInfo: {
        pages: PropsType.array,
        pic: PropsType.string,
        avTitle: PropsType.string,
        name: PropsType.string,
        view: PropsType.number,
        desc: PropsType.string,
    },
    epInfo: {
        epTitle: PropsType.string,
        epList: PropsType.array,
        cover: PropsType.string,
        evaluate: PropsType.string
    },
}

export default VideoContent
