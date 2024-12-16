import React, { createRef } from 'react';
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react-native';
import WmVideo from '@wavemaker/app-rn-runtime/components/basic/video/video.component';
import { AssetProvider } from '@wavemaker/app-rn-runtime/core/asset.provider';
import { createVideoPlayer } from 'expo-video';


jest.mock('expo-video', () => {
  const { View } = require('react-native');
  return {
    VideoView: jest.fn((props) => <View {...props} />),
    createVideoPlayer: jest.fn(() => ({
      play: jest.fn(),
      pause: jest.fn(),
      release: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
    })),
  };
});

const loadAsset = (path) => path;

const renderComponent = (props: any = {}) =>
  render(
    <AssetProvider value={loadAsset}>
      <WmVideo {...props} />
    </AssetProvider>
  );

describe('WmVideo Component Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('renders component with default props', () => {
    renderComponent();
    expect(screen).toMatchSnapshot();
  });

  it('handles mp4 video source URL correctly', async () => {
    renderComponent({
      name: 'test',
      mp4format: 'https://example.com/video.mp4',
      webmformat: '',
      autoplay: false,
    });

    expect(createVideoPlayer).toHaveBeenCalledWith({
        uri: 'https://example.com/video.mp4',
      });
    });

  it('handles mp4 video local source correctly', async () => {
      const sourcePath = 'resources/videos/sample_video_bear.mp4'
      renderComponent({
        name: 'test',
        mp4format: sourcePath,
        webmformat: '',
        autoplay: false,
      });
      
    expect(createVideoPlayer).toHaveBeenCalledWith(sourcePath);

  });

  it('autoplays video when autoplay is true', async () => {
    const ref : any = createRef();
    renderComponent({
      name: 'test',
      mp4format: 'https://example.com/video.mp4',
      autoplay: true,
      muted: true, 
      ref: ref
    });

    const player = ref?.current?.player
    const playMock = jest.spyOn(player, 'play')

    expect(player.addListener).toHaveBeenCalledWith(
      'statusChange', expect.any(Function)
    );

    const [_statusCb, statusChangeCallback] = player.addListener.mock.calls.find(
      ([eventName]: string[]) => eventName === 'statusChange'
    );

    statusChangeCallback({ status: 'readyToPlay'})

    await waitFor(() => {
      expect(playMock).toHaveBeenCalled();
    });

  });

  it('renders height and width properly', () => {
    renderComponent({
      name: 'test',
      mp4format: 'https://example.com/video.mp4',
    });

    const videoView = screen.getByTestId('test_video');
    expect(videoView.props.style).toMatchObject({
      width: '100%',
      height: '100%',
      flex: 1,
    });
  });

  it('handles event listeners properly', async () => {
    const ref: any = createRef();
    renderComponent({
      name: 'test',
      mp4format: 'https://example.com/video.mp4',
      autoplay: true,
      ref,
    });

    const player = ref?.current?.player;

    expect(player.addListener).toHaveBeenCalledWith(
      'playingChange',
      expect.any(Function)
    );
    expect(player.addListener).toHaveBeenCalledWith(
      'statusChange',
      expect.any(Function)
    );

    const [_eventName, statusChangeCallback] = player.addListener.mock.calls.find(
      ([eventName]: string[]) => eventName === 'statusChange'
    );

    act(() => {
      statusChangeCallback({ status: 'readyToPlay' });
    });

    expect(player.play).toHaveBeenCalled();
  });

  it('renders skeleton loader when video is not ready', () => {
    renderComponent({
      name: 'test',
      showskeleton: true,
    });
    expect(screen).toMatchSnapshot();
  });


  it('shows video poster before playback starts & autoplay false', () => {
    renderComponent({
      name: 'test',
      mp4format: 'https://example.com/video.mp4',
      videoposter: 'https://example.com/poster.png',
      autoplay: false
    });

    const poster = screen.getByTestId('test_video_poster');
    expect(poster.props.source).toEqual({
      uri: 'https://example.com/poster.png',
    });
  });

  it('hide video poster before playback starts & autoplay true', () => {
    renderComponent({
      name: 'test',
      mp4format: 'https://example.com/video.mp4',
      videoposter: 'https://example.com/poster.png',
      autoplay: true
    });

    const poster = screen.queryByTestId('test_video_poster');
    expect(poster).toBeNull();
  });

  it('should play the video on tap on videoposter', ()=>{
    const ref: any = createRef();
    renderComponent({
      name: 'test',
      mp4format: 'https://example.com/video.mp4',
      videoposter: 'https://example.com/poster.png',
      ref: ref
    });

    const player = ref?.current?.player;

    const poster = screen.getByTestId('test_video_poster');
    fireEvent(poster, 'press')

    expect(player.play).toHaveBeenCalled();

  })

  it('applies accessibility props correctly', () => {
    renderComponent({
      name: 'test',
      mp4format: 'https://example.com/video.mp4',
      accessibilitylabel: 'Accessible_video',
      hint: 'Video',
      accessibilityrole: 'Video',
    });

    // // video
    expect(screen.getByLabelText('Accessible_video')).toBeTruthy();
    expect(screen.getByRole('Video')).toBeTruthy();
    expect(screen.getByA11yHint('Video')).toBeTruthy();

    // poster
    expect(screen.getByLabelText('Accessible_video_poster')).toBeTruthy();
    expect(screen.getByRole('Video_poster')).toBeTruthy();
    expect(screen.getByA11yHint('Video_poster')).toBeTruthy();
  });

  it('handles props correctly', async () => {
    const ref : any = createRef();
    renderComponent({
      name: 'test',
      mp4format: 'https://example.com/video.mp4',
      loop: true,
      muted: true, 
      ref: ref
    });

    const player = ref?.current?.player
    expect(player.loop).toBe(true);
    expect(player.muted).toBe(true);
  });

});