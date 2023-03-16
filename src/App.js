import { Maximize2, Pause, Play, PlayCircle, VolumeCross, VolumeHigh, VolumeLow } from 'iconsax-react';
import React, { useEffect, useRef, useState } from 'react';
import './VideoPlayer.css';

const App = ({ url }) => {

  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const controls = useRef(null);
  const videoPlayer = useRef(null);
  const bufferRef = useRef(null);
  const volumeInput = useRef(null);

  const [isWaiting, setIsWaiting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [durationSec, setDurationSec] = useState(null);
  const [elapsedSec, setElapsedSec] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [volume, setVolume] = useState(1);

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

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }

    const onWaiting = () => {
      if (isPlaying) setIsPlaying(false);
      setIsWaiting(true);
    };

    const onPlay = () => {
      if (isWaiting) setIsWaiting(false);
      setIsPlaying(true);
    };

    const onPause = () => {
      setIsPlaying(false);
      setIsWaiting(false);
    };

    const element = videoRef.current;

    const onProgress = () => {
      if (!element.buffered || !bufferRef.current) return;
      if (!element.buffered.length) return;
      const bufferedEnd = element.buffered.end(element.buffered.length - 1);
      const duration = element.duration;
      if (bufferRef && duration > 0) {
        bufferRef.current.style.width = (bufferedEnd / duration) * 100 + "%";
      }
    };

    const onTimeUpdate = () => {
      setIsWaiting(false);
      if (!element.buffered || !progressRef.current) return;
      const duration = element.duration;
      setDurationSec(duration);
      setElapsedSec(element.currentTime);
      if (progressRef && duration > 0) {
        progressRef.current.style.width =
          (element.currentTime / duration) * 100 + "%";
      }
    };

    element.addEventListener("progress", onProgress);
    element.addEventListener("timeupdate", onTimeUpdate);

    element.addEventListener("waiting", onWaiting);
    element.addEventListener("play", onPlay);
    element.addEventListener("playing", onPlay);
    element.addEventListener("pause", onPause);

    // clean up
    return () => {
      element.removeEventListener("waiting", onWaiting);
      element.removeEventListener("play", onPlay);
      element.removeEventListener("playing", onPlay);
      element.removeEventListener("pause", onPause);
      element.removeEventListener("progress", onProgress);
      element.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [videoRef.current]);

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

  return (
    <div ref={videoPlayer} className="video-player">
      <div
        onMouseOver={() => {
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
          src={"https://kaamyab.dev/videoplayer/1.mp4"}
          onClick={togglePlay}
        />
        <div ref={controls} className="controls">

          {/* Progress Bar */}
          <div className="progress" onClick={(e) => {
            const { left, width } = e.currentTarget.getBoundingClientRect();
            const clickedPos = (e.clientX - left) / width;
            seekToPosition(clickedPos);
          }}>
            <div className='progress-placehold'>
              <div ref={bufferRef} className="buffer-bar" style={{}}></div>
              <div ref={progressRef} className="progress-bar" style={{ width: 0 }}></div>
            </div>
          </div>

          {/* Buttons */}
          <div className='control-buttons'>
            {/* LeftSide */}
            <div className='control-buttons control-left'>
              <button onClick={togglePlay}>
                {isPlaying ? (
                  <Pause size="24" color="#fff" />
                ) : (
                  <Play size="24" color="#fff" />
                )}
              </button>
              <p className='timer'>{Math.floor(elapsedSec / 60) + ' : ' + Math.floor(elapsedSec % 60)}</p>
            </div>
            {/* RightSide */}
            <div className='control-buttons control-right'>
              {/* Volume */}
              <div className='volume-container'>
                <div className='volume-icon' onClick={() => { volume == 0 ? setVolume(100) : setVolume(0) }}>
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
              <Maximize2 size="24" color="#fff" onClick={toggleFullscreen} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;
