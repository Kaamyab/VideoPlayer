import React from 'react'
import VideoPlayer from './components/VideoPlayer'
import './VideoPlayer.css';


const App = () => {

  const sources = [
    {
        name: '4K',
        resolution: ['3840','2160'],
        src: 'https://kaamyab.dev/videoplayer/1080.mp4',
    },
    {
        name: '1080p',
        resolution: ['1920','1080'],
        src: 'https://kaamyab.dev/videoplayer/1080.mp4',
    },
    {
        name: '720p',
        resolution: ['1280','720'],
        src: 'https://kaamyab.dev/videoplayer/480.mp4',
    }
]

  return (
    <>
      <VideoPlayer sources={sources} />
    </>
  )
}

export default App