"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Slider } from "~/components/ui/slider";
import { cn } from "~/lib/utils";

interface AudioPlayerProps {
  audioBase64: string;
  autoplay?: boolean;
  className?: string;
}

export function AudioPlayer({ audioBase64, autoplay = false, className }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    if (!audioBase64) {
      setError("No audio source provided");
      return;
    }

    if (audioRef.current) {
      const audio = audioRef.current;
      setError(null);

      try {
        const isUrl = /^(http|https|blob:|data:)/.test(audioBase64);
        const srcUrl = isUrl ? audioBase64 : `data:audio/wav;base64,${audioBase64}`;

        if (audio.src !== srcUrl) {
          audio.src = srcUrl;
          audio.load();
        }

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleLoadedMetadata = () => setDuration(audio.duration);
        const handleEnded = () => {
          setIsPlaying(false);
          setCurrentTime(0);
        };

        audio.addEventListener("play", handlePlay);
        audio.addEventListener("pause", handlePause);
        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("loadedmetadata", handleLoadedMetadata);
        audio.addEventListener("ended", handleEnded);

        if (autoplay) {
          audio.play().catch((err) => {
            console.error("Failed to autoplay audio:", err);
            setError("Autoplay failed");
            setIsPlaying(false);
          });
        }

        return () => {
          audio.removeEventListener("play", handlePlay);
          audio.removeEventListener("pause", handlePause);
          audio.removeEventListener("timeupdate", handleTimeUpdate);
          audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
          audio.removeEventListener("ended", handleEnded);
        };
      } catch (err) {
        console.error("Error setting audio source:", err);
        setError("Error loading audio");
      }
    }
  }, [audioBase64, autoplay]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((err) => {
          console.error("Failed to play audio:", err);
          setError("Failed to play audio");
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSpeedChange = (rate: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className={cn("flex w-full flex-col items-center space-y-2", className)}>
      <audio ref={audioRef} className="hidden" />
      {error ? (
        <div className="text-sm text-red-500">{error}</div>
      ) : (
        <div className="flex w-full items-center gap-4 rounded-md border bg-card p-2 text-card-foreground">
          <Button onClick={togglePlayPause} variant="ghost" size="icon">
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          <div className="flex-grow">
            <Slider
              value={[currentTime]}
              max={duration || 1}
              step={0.1}
              onValueChange={handleSeek}
              className="w-full"
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-20">
                {playbackRate}x
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {[0.5, 1, 1.5, 2].map((rate) => (
                <DropdownMenuItem key={rate} onSelect={() => handleSpeedChange(rate)}>
                  {rate}x
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
