
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

interface YouTubePlayerProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ isOpen, onClose, videoUrl, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState([50]);
  const [playbackRate, setPlaybackRate] = useState('1');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState([0]);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // YouTube 비디오 ID 추출
  const getVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : '';
  };

  const videoId = getVideoId(videoUrl);
  const embedUrl = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&controls=0&modestbranding=1&rel=0`;

  const togglePlay = () => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      if (isPlaying) {
        iframe.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      } else {
        iframe.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      if (isMuted) {
        iframe.contentWindow?.postMessage('{"event":"command","func":"unMute","args":""}', '*');
      } else {
        iframe.contentWindow?.postMessage('{"event":"command","func":"mute","args":""}', '*');
      }
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value);
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      iframe.contentWindow?.postMessage(`{"event":"command","func":"setVolume","args":[${value[0]}]}`, '*');
    }
  };

  const handleProgressChange = (value: number[]) => {
    setProgress(value);
    if (iframeRef.current && duration > 0) {
      const iframe = iframeRef.current;
      const seekTime = (value[0] / 100) * duration;
      iframe.contentWindow?.postMessage(`{"event":"command","func":"seekTo","args":[${seekTime}, true]}`, '*');
    }
  };

  const changePlaybackRate = (rate: string) => {
    setPlaybackRate(rate);
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      iframe.contentWindow?.postMessage(`{"event":"command","func":"setPlaybackRate","args":[${rate}]}`, '*');
    }
  };

  const skipTime = (seconds: number) => {
    if (iframeRef.current && duration > 0) {
      const iframe = iframeRef.current;
      const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
      iframe.contentWindow?.postMessage(`{"event":"command","func":"seekTo","args":[${newTime}, true]}`, '*');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://www.youtube.com') return;
      
      try {
        const data = JSON.parse(event.data);
        if (data.event === 'video-progress') {
          setCurrentTime(data.info.currentTime);
          setDuration(data.info.duration);
          if (data.info.duration > 0) {
            setProgress([(data.info.currentTime / data.info.duration) * 100]);
          }
        }
      } catch (e) {
        // Ignore parsing errors
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full p-0 bg-black border-0">
        {/* 커스텀 헤더 with X 버튼 */}
        <div className="relative p-4 pb-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-2 right-2 z-10 text-white hover:bg-white/20 hover:text-red-500 p-2 h-auto w-auto rounded-full"
          >
            <X className="w-6 h-6 stroke-[3]" />
          </Button>
          <DialogHeader>
            <DialogTitle className="text-white pr-10">{title}</DialogTitle>
            <DialogDescription className="text-gray-300">샘플 영상을 시청해보세요</DialogDescription>
          </DialogHeader>
        </div>
        
        <div className="space-y-4">
          {/* 비디오 영역 */}
          <div className="bg-black aspect-video mx-4">
            <iframe
              ref={iframeRef}
              src={embedUrl}
              className="w-full h-full rounded-lg"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          
          {/* 컨트롤 패널 */}
          <div className="bg-gray-900 p-6 mx-4 mb-4 rounded-lg space-y-4">
            {/* 진행바 */}
            <div className="space-y-2">
              <div className="relative w-full h-2 bg-transparent border border-gray-400 rounded-full">
                <div 
                  className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-300"
                  style={{ width: `${progress[0]}%` }}
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress[0]}
                  onChange={(e) => handleProgressChange([Number(e.target.value)])}
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <div className="flex justify-between text-sm text-gray-300">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
            
            {/* 메인 컨트롤 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => skipTime(-10)}
                  className="text-white hover:bg-white/20 p-2"
                >
                  <SkipBack className="w-5 h-5" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePlay}
                  className="text-white hover:bg-white/20 p-3"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => skipTime(10)}
                  className="text-white hover:bg-white/20 p-2"
                >
                  <SkipForward className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="flex items-center gap-4">
                {/* 음량 조절 */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                    className="text-white hover:bg-white/20 p-2"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </Button>
                  <div className="w-20">
                    <Slider
                      value={volume}
                      onValueChange={handleVolumeChange}
                      max={100}
                      step={1}
                    />
                  </div>
                </div>
                
                {/* 배속 조절 */}
                <Select value={playbackRate} onValueChange={changePlaybackRate}>
                  <SelectTrigger className="w-20 h-8 bg-transparent border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.25">0.25x</SelectItem>
                    <SelectItem value="0.5">0.5x</SelectItem>
                    <SelectItem value="0.75">0.75x</SelectItem>
                    <SelectItem value="1">1x</SelectItem>
                    <SelectItem value="1.25">1.25x</SelectItem>
                    <SelectItem value="1.5">1.5x</SelectItem>
                    <SelectItem value="2">2x</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 p-2"
                >
                  <Maximize className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default YouTubePlayer;
