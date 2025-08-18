import React from 'react';

export interface AudioService {
  createAudio: (source: any, params: any) => any
}
export interface VideoService {
  VideoView: any;
  createVideoPlayer: (source: any) => any;
}
const AudioContext = React.createContext<AudioService>(null as any);
const VideoContext = React.createContext<VideoService>(null as any);

export const AudioProvider = AudioContext.Provider;
export const AudioConsumer = AudioContext.Consumer;
export const VideoProvider = VideoContext.Provider;
export const VideoConsumer = VideoContext.Consumer;
