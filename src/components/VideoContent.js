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
                <div>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <Card
                            cover={<img alt="example" src={pic} name="referrer" content="no-referrer" />}
                            hoverable
                            style={{ minWidth: "170px", minHeight: "170px", padding: "2px", margin: "10px", boxSizing: "border-box" }}
                            bodyStyle={{ padding: "5px", border: "1px solid #e7e7e7" }}
                            bordered
                            onClick={() => { showDownloadModal(pages) }}
                        >
                            <span>{avTitle}</span><br />
                            <span>UP: {name}</span><br />
                            <span>{(view / 10000).toFixed(2)}万播放</span><br />
                            <span>点击批量下载</span>
                        </Card>
                        <div style={{ margin: "10px" }}>
                            <h2>{avTitle}</h2>
                            <h3>简介</h3>
                            <p>{desc}</p>
                        </div>
                    </div>
                    <Divider />
                    <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", paddingBottom: "50px" }}>
                        {pages.map(page => (
                            <Card
                                key={page.part}
                                cover={<img alt="example" src={pic} name="referrer" content="no-referrer" />}
                                hoverable
                                style={{ minWidth: "170px", maxWidth: '180px', minHeight: "170px", padding: "2px", margin: "10px", boxSizing: "border-box" }}
                                bodyStyle={{ padding: "5px", border: "1px solid #e7e7e7" }}
                                bordered
                                onClick={() => { showDownloadModal(page) }}
                            >
                                <span>{page.part}</span><br />
                                <span>单集下载</span>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
            {Array.isArray(epList) && (
                <div>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <Card
                            cover={<img alt="example" src={cover} name="referrer" content="no-referrer" />}
                            hoverable
                            style={{ minWidth: "170px", minHeight: "170px", padding: "2px", margin: "10px", boxSizing: "border-box" }}
                            bodyStyle={{ padding: "5px", border: "1px solid #e7e7e7" }}
                            bordered
                            onClick={() => { showDownloadModal(epList) }}
                        >
                            <span>{epTitle}</span><br />
                            <span>点击批量下载</span>
                        </Card>
                        <div>
                            <h2>{epTitle}</h2>
                            <h3>简介</h3>
                            <p>{evaluate}</p>
                        </div>
                    </div>
                    <Divider />
                    <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", paddingBottom: "50px" }}>
                        {epList.map(ep => (
                            <Card
                                key={ep.title}
                                hoverable
                                cover={<img alt="example" src={ep.cover} name="referrer" content="no-referrer" />}
                                style={{ minWidth: "170px", maxWidth: '180px', minHeight: "170px", padding: "2px", margin: "10px", boxSizing: "border-box" }}
                                bodyStyle={{ padding: "5px", border: "1px solid #e7e7e7" }}
                                bordered
                                onClick={() => { showDownloadModal(ep) }}
                            >
                                <span>{ep.title}</span><br />
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
