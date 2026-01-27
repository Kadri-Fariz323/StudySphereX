import React, { useState, useRef } from "react";
import { useEffect } from "react";
import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaForward,
  FaBackward,
  FaExpand,
  FaCompress,
} from "react-icons/fa";

export const VideoPlayer = ({ src, width = "100%", height = "100%", isEnded, onProgressUpdate, progressData, }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  
  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
   const [played, setPlayed] = useState(0);

   

  // Handle Play/Pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };



  // Handle Volume Change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  // Handle Mute Toggle
  const toggleMute = () => {
    if (isMuted) {
      videoRef.current.volume = volume || 1; // Restore volume
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  // Handle Skip Forward/Backward
  const skipTime = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  // Update Progress Bar
const handleTimeUpdate = () => {
  const current = videoRef.current.currentTime;
  const total = videoRef.current.duration;

  setCurrentTime(current);
  setPlayed(total ? current / total : 0); // value between 0 and 1
};

  // Handle Loaded Metadata (Duration)
  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
  };

  // Handle Seek (Click on progress bar)
  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Handle Fullscreen
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (playerRef.current.requestFullscreen) {
        playerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  // Format time (MM:SS)
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

    useEffect(() => {
    if (played === 1) {
      onProgressUpdate({
        ...progressData,
        progressValue: played,
      });
    }
  }, [played]);

  return (
    <div className="flex justify-center items-center w-full bg-gray-50 p-4">
      {/* Video Container */}
      <div
        ref={playerRef}
        className="relative w-full max-w-4xl bg-black rounded-xl overflow-hidden shadow-2xl group"
      >
        <video
          ref={videoRef}
          className="w-full h-auto cursor-pointer"
          style={{ width, height }}
          onClick={togglePlay}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={isEnded}
          src={src}
        />

        {/* Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-95 backdrop-blur-sm px-4 py-3 flex flex-col gap-2 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
          
          {/* Progress Bar */}
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 hover:h-2 transition-all"
          />

          {/* Buttons Row */}
          <div className="flex items-center justify-between text-indigo-900">
            <div className="flex items-center gap-4">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="hover:text-indigo-600 transition-colors transform hover:scale-110"
              >
                {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
              </button>

              {/* Rewind/Forward */}
              <button
                onClick={() => skipTime(-10)}
                className="hover:text-indigo-600 transition-colors"
                title="-10s"
              >
                <FaBackward size={18} />
              </button>
              <button
                onClick={() => skipTime(10)}
                className="hover:text-indigo-600 transition-colors"
                title="+10s"
              >
                <FaForward size={18} />
              </button>

              {/* Volume Controls */}
              <div className="flex items-center gap-2 group/volume">
                <button
                  onClick={toggleMute}
                  className="hover:text-indigo-600 transition-colors w-6"
                >
                  {isMuted || volume === 0 ? (
                    <FaVolumeMute size={20} />
                  ) : (
                    <FaVolumeUp size={20} />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-0 overflow-hidden group-hover/volume:w-20 transition-all duration-300 h-1 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Time Display */}
              <span className="text-xs font-medium text-indigo-800 font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="hover:text-indigo-600 transition-colors"
            >
              {isFullscreen ? (
                <FaCompress size={18} />
              ) : (
                <FaExpand size={18} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};