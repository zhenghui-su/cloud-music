import React, { useRef, useState } from "react";
import { formatPlayTime, getName } from "../../../api/utils";
import {
    NormalPlayerContainer,
    Top,
    Middle,
    Bottom,
    Operators,
    CDWrapper,
    ProgressWrapper
} from "./style";
import { CSSTransition } from "react-transition-group";
import animations from "create-keyframe-animation";
import { prefixStyle } from "../../../api/utils";
import ProgressBarWrapper from "../../../baseUI/progress-bar/index";
import ProgressBar from "../../../baseUI/progress-bar";


function NormalPlayer(props) {
    const {
        fullScreen,
        song,
        mode,
        playing,
        percent,
        currentTime,
        duration,
    } = props;

    const {
        changeMode,
        handlePrev,
        handleNext,
        onProgressChange,
        clickPlaying,
        toggleFullScreen
    } = props;
    const { percentChange } = props;
    const normalPlayerRef = useRef();
    const cdWrapperRef = useRef();
    const transform = prefixStyle("transform");

    const progressBar = useRef();
    const progress = useRef();
    const progressBtn = useRef();
    const [touch, setTouch] = useState({});

    const progressBtnWidth = 16;



    // 计算偏移的辅助函数
    const _getPosAndScale = () => {
        const targetWidth = 40;
        const paddingLeft = 40;
        const paddingBottom = 30;
        const paddingTop = 80;
        const width = window.innerWidth * 0.8;
        const scale = targetWidth / width;
        // 两个圆心的横坐标距离和纵坐标距离
        const x = -(window.innerWidth / 2 - paddingLeft);
        const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
        return {
            x,
            y,
            scale
        };
    };
    // 启用帧动画
    const enter = () => {
        normalPlayerRef.current.style.display = "block";
        const { x, y, scale } = _getPosAndScale();//获取miniPlayer图片中心相对normalPlayer唱片中心的偏移
        let animation = {
            0: {
                transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
            },
            60: {
                transform: `translate3d(0, 0, 0) scale(1.1)`
            },
            100: {
                transform: `translate3d(0, 0, 0) scale(1)`
            }
        };
        animations.registerAnimation({
            name: "move",
            animation,
            presets: {
                duration: 400,
                easing: "linear"
            }
        });
        animations.runAnimation(cdWrapperRef.current, "move");
    };

    const afterEnter = () => {
        // 进入后解绑帧动画
        const cdWrapperDom = cdWrapperRef.current;
        animations.unregisterAnimation("move");
        cdWrapperDom.style.animation = "";
    };
    //离开动画的逻辑
    const leave = () => {
        if (!cdWrapperRef.current) return;
        const cdWrapperDom = cdWrapperRef.current;
        cdWrapperDom.style.transition = "all 0.4s";
        const { x, y, scale } = _getPosAndScale();
        cdWrapperDom.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    };

    const afterLeave = () => {
        if (!cdWrapperRef.current) return;
        const cdWrapperDom = cdWrapperRef.current;
        cdWrapperDom.style.transition = "";
        cdWrapperDom.style[transform] = "";
        // 一定要注意现在要把 normalPlayer 这个 DOM 给隐藏掉，因为 CSSTransition 的工作只是把动画执行一遍 
        // 不置为 none 现在全屏播放器页面还是存在
        normalPlayerRef.current.style.display = "none";
    };
    // 处理进度条的偏移
    const _offset = (offsetWidth) => {
        progress.current.style.width = `${offsetWidth} px`;
        progressBtn.current.style.transform = `translate3d (${offsetWidth} px, 0, 0)`;
    };

    const _changePercent = () => {
        const barWidth = progressBar.current.clientWidth - progressBtnWidth;
        const curPercent = progress.current.clientWidth / barWidth;// 新的进度计算
        percentChange(curPercent);// 把新的进度传给回调函数并执行
    };
    const progressTouchStart = (e) => {
        const startTouch = {};
        startTouch.initiated = true;//initial 为 true 表示滑动动作开始了
        startTouch.startX = e.touches[0].pageX;// 滑动开始时横向坐标
        startTouch.left = progress.current.clientWidth;// 当前 progress 长度
        setTouch(startTouch);
    };

    const progressTouchMove = (e) => {
        if (!touch.initiated) return;
        // 滑动距离   
        const deltaX = e.touches[0].pageX - touch.startX;
        const barWidth = progressBar.current.clientWidth - progressBtnWidth;
        const offsetWidth = Math.min(Math.max(0, touch.left + deltaX), barWidth);
        _offset(offsetWidth);
    };

    const progressTouchEnd = (e) => {
        const endTouch = JSON.parse(JSON.stringify(touch));
        endTouch.initiated = false;
        setTouch(endTouch);
        _changePercent();
    };
    const progressClick = (e) => {
        const rect = progressBar.current.getBoundingClientRect();
        const offsetWidth = e.pageX - rect.left;
        _offset(offsetWidth);
        _changePercent();
    };
    return (
        <CSSTransition
            classNames="normal"
            in={fullScreen}
            timeout={400}
            mountOnEnter
            onEnter={enter}
            onEntered={afterEnter}
            onExit={leave}
            onExited={afterLeave}
        >
            <NormalPlayerContainer ref={normalPlayerRef}>
                <div className="background">
                    <img
                        src={song.al.picUrl + "?param=300x300"}
                        width="100%"
                        height="100%"
                        alt="歌曲图片"
                    />
                </div>
                <div className="background layer"></div>
                <Top className="top">
                    <div className="back" onClick={() => toggleFullScreen(false)}>
                        <i className="iconfont icon-back">&#xe662;</i>
                    </div>
                    <h1 className="title">{song.name}</h1>
                    <h1 className="subtitle">{getName(song.ar)}</h1>
                </Top>
                <Middle ref={cdWrapperRef}>
                    <CDWrapper>
                        <div className="cd">
                            <img
                                className={`image play ${playing ? "" : "pause"}`}
                                src={song.al.picUrl + "?param=400x400"}
                                alt=""
                            />
                        </div>

                        <div className="icon i-center">
                            <i
                                className="iconfont"
                                onClick={e => clickPlaying(e, !playing)}
                                dangerouslySetInnerHTML={{
                                    __html: playing ? "&#xe723;" : "&#xe731;"
                                }}
                            ></i>
                        </div>
                    </CDWrapper>
                </Middle>

                <Bottom className="bottom">
                    <ProgressWrapper>
                        <span className="time time-l">{formatPlayTime(currentTime)}</span>
                        <div className="progress-bar-wrapper">
                            <ProgressBar
                                percent={percent}
                                percentChange={onProgressChange}
                            ></ProgressBar>
                        </div>
                        <div className="time time-r">{formatPlayTime(duration)}</div>
                    </ProgressWrapper>
                    <Operators>
                        <div className="icon i-left" >
                            <i className="iconfont">&#xe625;</i>
                        </div>
                        <div className="icon i-left">
                            <i className="iconfont">&#xe6e1;</i>
                        </div>
                        <div className="icon i-center">
                            <i className="iconfont">&#xe723;</i>
                        </div>
                        <div className="icon i-right">
                            <i className="iconfont">&#xe718;</i>
                        </div>
                        <div className="icon i-right">
                            <i className="iconfont">&#xe640;</i>
                        </div>
                    </Operators>
                </Bottom>
            </NormalPlayerContainer>
        </CSSTransition>
    );
}
export default React.memo(NormalPlayer);
