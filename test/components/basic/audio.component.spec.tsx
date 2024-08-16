import React, { ReactNode, createRef } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import WmAudio from '@wavemaker/app-rn-runtime/components/basic/audio/audio.component';
import WmAudioProps from '../../../src/components/basic/audio/audio.props';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react-native';
import { Sound } from 'expo-av/build/Audio';
import { AssetProvider } from '@wavemaker/app-rn-runtime/core/asset.provider';

const mockAVPlaybackStatusSuccess = {
  isLoaded: true,
  uri: '',
  durationMillis: 2000, // 2 minutes in milliseconds
  positionMillis: 0, // Start position
  isPlaying: true, // Whether it's currently playing
  isMuted: false, // Whether the sound is muted
  volume: 1.0, // Full volume
  rate: 1.0, // Normal playback speed
  shouldCorrectPitch: true,
  isLooping: false, // Not looping
  didJustFinish: false, // Whether the sound just finished playing
};

const timer = (time = 100) =>
  new Promise((resolve: any, reject) => {
    setTimeout(() => resolve(), time);
  });

const createAsyncMock = jest.spyOn(Sound, 'createAsync').mockResolvedValue({
  sound: {
    playAsync: jest.fn(),
    pauseAsync: jest.fn().mockResolvedValue(mockAVPlaybackStatusSuccess),
    unloadAsync: jest.fn(),
    setPositionAsync: jest.fn(),
    setStatusAsync: jest.fn().mockResolvedValue(mockAVPlaybackStatusSuccess),
    getStatusAsync: jest.fn().mockResolvedValue(mockAVPlaybackStatusSuccess),
    replayAsync: jest.fn(),
  },
  status: {
    isLoaded: true,
    durationMillis: 2000,
  },
});

const renderComponent = (props = {}) => {
  let defaultProps: WmAudioProps;
  defaultProps = new WmAudioProps();
  defaultProps.controls = true;
  defaultProps.mp3format = 'https://www.example.com/audio.mp3';
  const loadAsset = (path) => path;

  return render(
    <AssetProvider value={loadAsset}>
      <WmAudio {...defaultProps} {...props} />
    </AssetProvider>
  );
};

describe('WmAudio component', () => {
  beforeEach(() => {});

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Check Rendering with Default Props
  it('renders correctly with default props', () => {
    renderComponent({ name: 'audio' });
    expect(screen).toMatchSnapshot();
    expect(screen.getByTestId('audio_slider')).toBeTruthy();
    expect(screen.getByTestId('audio_mute_icon')).toBeTruthy();
    expect(screen.getByTestId('audio_play_icon')).toBeTruthy();
  });

  // Playing and Pausing Audio
  it('handles playing and pausing audio correctly', async () => {
    renderComponent({ name: 'audio' });
    const playButton = screen.getByTestId('audio_play_icon');
    fireEvent.press(playButton);

    await timer(300);
    expect(createAsyncMock).toHaveBeenCalled();

    expect(screen.getByTestId('audio_pause_icon')).toBeTruthy();

    const pauseButton = screen.getByTestId('audio_pause_icon');
    fireEvent.press(pauseButton);

    await timer(300);

    expect(screen.getByTestId('audio_play_icon')).toBeTruthy();
  });

  // Mute and Unmute
  it('handles mute and unmute correctly', async () => {
    renderComponent({ name: 'audio' });

    const playButton = screen.getByTestId('audio_play_icon');
    fireEvent.press(playButton);

    await timer(300);

    const muteButton = screen.getByTestId('audio_mute_icon');
    fireEvent.press(muteButton);

    await waitFor(() => {
      expect(screen.getByTestId('audio_unmute_icon')).toBeTruthy();
    });

    const unmuteButton = screen.getByTestId('audio_unmute_icon');
    fireEvent.press(unmuteButton);

    await waitFor(() => {
      expect(screen.getByTestId('audio_mute_icon')).toBeTruthy();
    });
  });

  // Lifecycle Methods
  it('calls componentDidMount and componentWillUnmount correctly', async () => {
    const componentDidMountSpy = jest.spyOn(
      WmAudio.prototype,
      'componentDidMount'
    );
    const componentWillUnmountSpy = jest.spyOn(
      WmAudio.prototype,
      'componentWillUnmount'
    );
    const { unmount } = renderComponent({
      name: 'audio',
    });

    expect(componentDidMountSpy).toHaveBeenCalled();

    unmount();
    expect(componentWillUnmountSpy).toHaveBeenCalled();
  });

  // Accessibility Props
  it('applies accessibility props correctly', () => {
    renderComponent({ name: 'audio', accessibilitylabel: 'Audio Player' });

    expect(screen.getByLabelText('Audio Player')).toBeTruthy();
  });

  // Autoplay
  it('automatically plays audio when autoplay is true', async () => {
    renderComponent({ name: 'audio', autoplay: true });

    await timer(1000);
    expect(Sound.createAsync).toHaveBeenCalled();
  });

  // Slider Handling
  it('handles slider correctly', async () => {
    const ref = createRef();
    console.log('__proto__', Sound.prototype);
    const mockSetPositionAsync = jest.spyOn(
      Sound.prototype,
      'setPositionAsync'
    );
    renderComponent({ name: 'audio', autoplay: true, ref });

    await timer(1000);

    const mockSetPositionAsyncRef = jest.spyOn(
      ref.current.sound,
      'setPositionAsync'
    );

    const slider = screen.getByTestId('audio_slider');
    fireEvent(slider, 'valueChange', 2);

    await waitFor(() => {
      expect(Sound.createAsync).toHaveBeenCalled();
      expect(mockSetPositionAsyncRef).toHaveBeenCalledWith(2000);
    });
  });

  // Loop
  it('replays audio when loop is true', async () => {
    const ref = createRef();

    const mockReplayAsync = jest.spyOn(Sound.prototype, 'replayAsync');
    renderComponent({ name: 'audio', loop: true, autoplay: true, ref });

    await timer(1000);

    const mockReplayAsyncRef = jest.spyOn(ref.current.sound, 'replayAsync');

    expect(Sound.createAsync).toHaveBeenCalled();

    await timer(1000);
    await timer(1000);
    await timer(1000);

    await waitFor(() => {
      expect(mockReplayAsyncRef).toHaveBeenCalled();
    });
  });

  // Handle Props Change
  it('handles prop changes correctly', async () => {
    let defaultProps = new WmAudioProps();
    defaultProps.controls = true;
    defaultProps.mp3format = 'https://www.example.com/audio.mp3';
    const { rerender } = renderComponent({ name: 'audio' });
    const loadAsset = (path) => path;

    const newProps = {
      ...defaultProps,
      mp3format: 'https://www.example.com/newaudio.mp3',
      autoplay: true,
    };
    rerender(
      <AssetProvider value={loadAsset}>
        <WmAudio {...newProps} />
      </AssetProvider>
    );

    await waitFor(() => {
      expect(createAsyncMock).toHaveBeenCalledWith(
        { uri: 'https://www.example.com/newaudio.mp3' },
        { isMuted: false }
      );
    });
  });
});
