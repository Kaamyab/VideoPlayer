import React, { useEffect, useRef, useState } from 'react';
import { Maximize2, Pause, Play, PlayCircle, VolumeCross, VolumeHigh, VolumeLow } from 'iconsax-react';
import Settings from './Settings';
import useQuality from '../hooks/useQuality';
// import useNetwork from '../hooks/useNetwork'

const VideoPlayer2 = ({ sources }) => {

    const videoRef = useRef(null);
    const progressRef = useRef(null);
    const controls = useRef(null);
    const videoPlayer = useRef(null);
    const bufferRef = useRef(null);
    const volumeInput = useRef(null);

    const [isWaiting, setIsWaiting] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [durationSec, setDurationSec] = useState(videoRef?.current?.duration);
    const [elapsedSec, setElapsedSec] = useState(0)
    const [elapsed, setElapsed] = useState('00 : 00')
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [volume, setVolume] = useState(1);
    // const [buffer, setBuffer] = useState()
    // const [VideoBuffered, setVideoBuffered] = useState([])

    const [selected, { setQuality }] = useQuality(sources)

    const togglePlay = () => {
        if (videoRef.current) {
            const video = videoRef.current;
            if (isPlaying) {
                video.pause();
            } else {
                video.play();
            }
        }
    };

    const onWaiting = () => {
        if (isPlaying) setIsPlaying(false);
        setIsWaiting(true);
    };

    const onPlay = () => {
        if (isWaiting) setIsWaiting(false);
        setIsPlaying(true);
        videoRef.current.focus();
    };

    const onPause = () => {
        setIsPlaying(false);
        setIsWaiting(false);
    };

    const onProgress = () => {
        const element = videoRef.current;
        if (!element.buffered || !bufferRef.current) return;
        if (!element.buffered.length) return;

        const inc = bufferRef.current.width / videoRef.current.duration;

        // Canvas Styles
        const context = bufferRef.current.getContext('2d')
        context.fillStyle = 'White'
        context.strokeStyle = 'White'
        context.fillRect(0, 0, bufferRef.width, bufferRef.height);

        // Loop on each Buffer to update the Canvas
        // let OBJ = []
        if (element.buffered.length) {
            for (let i = 0; i < element.buffered.length; i++) {
                const start = element.buffered.start(i) * inc;
                const end = element.buffered.end(i) * inc;
                const width = end - start;
                // OBJ = [...OBJ, {
                //   widthPX: width,
                //   widthSeconds: element.buffered.end(i) - element.buffered.start(i),
                //   start: start * inc,
                //   end: end * inc
                // }]
                context.fillRect(start, 0, width, bufferRef.current.height);
                context.rect(start, 0, width, bufferRef.current.height);
                context.stroke();
            }
        }
    };

    const onTimeUpdate = () => {
        const element = videoRef.current;
        setIsWaiting(false);
        if (!element.buffered || !progressRef.current) return;
        const duration = element.duration;
        const time = TimeFormatter(Math.floor(element.currentTime));
        setElapsed(time)
        setElapsedSec(element.currentTime)
        if (progressRef && duration > 0) {
            progressRef.current.style.width =
                (element.currentTime / duration) * 100 + "%";
        }
    };

    const TimeFormatter = (time) => {
        const MS = [('0' + Math.floor(time / 60)).slice(-2), ('0' + Math.floor(time % 60)).slice(-2)];
        const FinalFormat = MS[0] + ' : ' + MS[1];
        return FinalFormat;
    }

    const onInitialLoad = () => {
        const duration = videoRef.current.duration
        setDurationSec(TimeFormatter(duration))
    }

    useEffect(() => {
        const video = videoRef.current
        setIsWaiting(true)
        video.pause()
        video.src = selected.src
        video.currentTime = elapsedSec
        setIsWaiting(false)
        video.play()
        // Canvas Styles
        const context = bufferRef.current.getContext('2d')
        context.clearRect(0, 0, bufferRef.current.width, bufferRef.current.height);
        // eslint-disable-next-line
    }, [selected.src])

    useEffect(() => {
        if (!videoRef.current) {
            return;
        }
        const element = videoRef.current;

        element.addEventListener("loadedmetadata", onInitialLoad);
        element.addEventListener("progress", onProgress);
        element.addEventListener("timeupdate", onTimeUpdate);
        element.addEventListener("waiting", onWaiting);
        element.addEventListener("play", onPlay);
        element.addEventListener("playing", onPlay);
        element.addEventListener("pause", onPause);

        // clean up
        return () => {
            element.removeEventListener("loadedmetadata", onInitialLoad);
            element.removeEventListener("waiting", onWaiting);
            element.removeEventListener("play", onPlay);
            element.removeEventListener("playing", onPlay);
            element.removeEventListener("pause", onPause);
            element.removeEventListener("progress", onProgress);
            element.removeEventListener("timeupdate", onTimeUpdate);
        };
    });

    const toggleFullscreen = () => {
        const video = videoPlayer.current
        if (!isFullscreen || isFullscreen == null) {
            // All Browsers
            if (video.requestFullscreen) {
                video.requestFullscreen();
            }
            /* Safari */
            else if (video.webkitRequestFullscreen) {
                video.webkitRequestFullscreen();
            }
            /* IE11 */
            else if (video.msRequestFullscreen) {
                video.msRequestFullscreen();
            }
            setIsFullscreen(true)
        } else {
            // All Browsers
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            /* Safari */
            else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
            /* IE11 */
            else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            setIsFullscreen(false)
        }
    }

    const seekToPosition = (pos) => {
        if (!videoRef.current) return;
        if (pos < 0 || pos > 1) return;

        const durationMs = videoRef.current.duration * 1000 || 0;

        const newElapsedMs = durationMs * pos;
        const newTimeSec = newElapsedMs / 1000;
        videoRef.current.currentTime = newTimeSec;
    };

    const onKeyDown = (event) => {
        // Space Key
        if (event.key === ' ' || event.keyCode === '32' || event.code === 'Space') {
            togglePlay()
        }
        // Arrow Right Key
        else switch (event.key) {
            case 'ArrowRight':
                if (event.shiftKey) {
                    videoRef.current.playbackRate = 3;
                }
                else videoRef.current.currentTime += 10
                break;
            case 'ArrowLeft':
                videoRef.current.currentTime -= 10
                break;
            default:
                break;
        }
    }

    const onKeyUp = (event) => {
        switch (event.key) {
            case 'ArrowRight':
                if (event.shiftKey) {
                    videoRef.current.playbackRate = 1;
                }
                else videoRef.current.currentTime += 10
                break;
            case 'ArrowLeft':
                videoRef.current.currentTime -= 10
                break;
            default:
                break;
        }
    }
    // const { autoQuality } = useNetwork()

    return (
        <div ref={videoPlayer} className="video-player">
            <div
                onMouseMove={() => {
                    controls.current.classList.add('show')
                }}
                onMouseLeave={() => !videoRef.current.paused && controls.current.classList.remove('show')}
                onDoubleClick={toggleFullscreen}
            >
                <div className={`waiting-placeholder ${isWaiting ? 'flex' : 'none'}`}><div className="lds-ring"><div></div><div></div><div></div><div></div></div></div>
                <div className={`waiting-placeholder cursor-pointer ${(!isPlaying && !isWaiting) ? 'flex' : 'none'}`} onClick={togglePlay}>
                    <PlayCircle size="64" color="#fff" variant="Bold" className='play-icon-middle' />
                </div>
                <video
                    ref={videoRef}
                    src={'https://kaamyab.dev/videoplayer/1080.mp4'}
                    poster='https://kaamyab.dev/videoplayer/poster.webp'
                    onClick={togglePlay}
                    onKeyDown={onKeyDown}
                    onKeyUp={onKeyUp}
                    className='object-cover'
                />
                <div ref={controls} className="controls">

                    {/* Progress Bar */}
                    <div className="progress" onClick={(e) => {
                        const { left, width } = e.currentTarget.getBoundingClientRect();
                        const clickedPos = (e.clientX - left) / width;
                        seekToPosition(clickedPos);
                    }}>
                        <div className='progress-placehold'>
                            <canvas ref={bufferRef} className="buffer-bar" style={{}}></canvas>
                            <div ref={progressRef} className="progress-bar" style={{ width: 0 }}></div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className='control-buttons'>
                        {/* LeftSide */}
                        <div className='control-buttons control-left [&>*]:h-full'>
                            <button onClick={togglePlay} className=''>
                                {isPlaying ? (
                                    <Pause size="24" color="#fff" />
                                ) : (
                                    <Play size="24" color="#fff" />
                                )}
                            </button>
                            <div className='timer'>{elapsed}<span className='duration-splitter'> / </span>{durationSec}</div>
                        </div>

                        {/* RightSide */}
                        <div className='control-buttons control-right'>
                            {/* Volume */}
                            <div className='volume-container'>
                                <div className='volume-icon' onClick={() => { volume === 0 ? setVolume(100) : setVolume(0) }}>
                                    {volume >= 0.5 ? <VolumeHigh size="24" color="#fff" /> : volume > 0.1 ? <VolumeLow size="24" color="#fff" /> : <VolumeCross size="24" color="#fff" />}
                                </div>
                                <div ref={volumeInput} className='volume-input'
                                    onClick={(e) => {
                                        const { left, width } = e.currentTarget.getBoundingClientRect();
                                        let clickedPos = (e.clientX - left) / width;
                                        videoRef.current.volume = clickedPos
                                        setVolume(clickedPos)
                                    }}
                                >
                                    <div className='volume-range'>
                                        <div className='volume-placeholder'></div>
                                        <div className='volume-bar' style={{ width: (volume * 100) + '%' }}></div>
                                    </div>
                                </div>
                            </div>
                            <Settings sources={sources} setQuality={setQuality} selectedQuality={selected} />
                            <Maximize2 size="24" color="#fff" onClick={toggleFullscreen} />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default VideoPlayer2;
