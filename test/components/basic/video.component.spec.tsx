import React, { ReactNode, createRef } from 'react';
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react-native';
import WmVideo from '@wavemaker/app-rn-runtime/components/basic/video/video.component';
import WmVideoProps from '../../../src/components/basic/video/video.props';
import { AssetConsumer, AssetProvider } from '../../../src/core/asset.provider';
import { AVPlaybackStatus, Video } from 'expo-av';

// Mock Expo Video component
// jest.mock('expo-av', () => ({
//   Video: jest.fn((props) => <div {...props} />),
// }));

const loadAsset = (path) => path;
const renderComponent = (props = {}) =>
  render(
    <AssetProvider value={loadAsset}>
      <WmVideo {...props} />
    </AssetProvider>
  );

describe('Test Video component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders component with default props', () => {
    render(
      <AssetProvider value={loadAsset}>
        <WmVideo />
      </AssetProvider>
    );
    expect(screen).toMatchSnapshot();
  });

  // Source URL Handling
  it('handles different mp4 video source URL correctly', async () => {
    renderComponent({
      name: 'test',
      mp4format: 'https://example.com/video.mp4',
    });

    const video = screen.getByTestId('test_video');
    await waitFor(() => {
      expect(video.props.source).toMatchObject({
        uri: 'https://example.com/video.mp4',
      });
    });
  });

  it('handles different webm video source URLs correctly', async () => {
    renderComponent({
      name: 'test',
      webmformat: 'https://example.com/video.webm',
    });

    const video = screen.getByTestId('test_video');

    await waitFor(() => {
      expect(video.props.source).toMatchObject({
        uri: 'https://example.com/video.webm',
      });
    });
  });

  // Autoplay Functionality
  it('autoplays the video when autoplay is true', () => {
    renderComponent({
      name: 'test',
      mp4format: 'https://example.com/video.mp4',
      autoplay: true,
    });
    const video = screen.getByTestId('test_video');
    expect(video.props.status.shouldPlay).toBe(true);
  });

  // Accessibility Props
  it('applies accessibility props correctly', () => {
    renderComponent({
      name: 'test',
      mp4format: 'https://example.com/video.mp4',
      accessibilitylabel: 'Accessible Video',
      hint: 'video',
      accessibilityrole: 'Video',
    });
    expect(screen.getByLabelText('Accessible Video')).toBeTruthy();
    expect(screen.getByRole('Video')).toBeTruthy();
    expect(screen.getByA11yHint('video')).toBeTruthy();
  });

  it('shows controls when controls prop is true', () => {
    renderComponent({
      name: 'test',
      mp4format: 'https://example.com/video.mp4',
      accessibilitylabel: 'Accessible Video',
      hint: 'video',
      accessibilityrole: 'Video',
      controls: true,
    });
    const video = screen.getByTestId('test_video');
    expect(video.props.useNativeControls).toBe(true);
  });

  // Loop Prop Functionality
  it('loops the video when loop prop is true', () => {
    renderComponent({
      name: 'test',
      mp4format: 'https://example.com/video.mp4',
      accessibilitylabel: 'Accessible Video',
      hint: 'video',
      accessibilityrole: 'Video',
      loop: true,
    });
    const video = screen.getByTestId('test_video');
    expect(video.props.status.isLooping).toBe(true);
  });

  // Mute Prop Functionality
  it('mutes the video when muted prop is true', () => {
    renderComponent({
      name: 'test',
      mp4format: 'https://example.com/video.mp4',
      accessibilitylabel: 'Accessible Video',
      hint: 'video',
      accessibilityrole: 'Video',
      muted: true,
    });
    const video = screen.getByTestId('test_video');
    expect(video.props.status.isMuted).toBe(true);
  });

  // Poster Source
  it('sets poster image correctly', () => {
    renderComponent({
      name: 'test',
      mp4format: 'https://example.com/video.mp4',
      videoposter: 'https://example.com/poster.png',
      accessibilitylabel: 'Accessible Video',
      hint: 'video',
      accessibilityrole: 'Video',
    });
    const video = screen.root.children[1];
    expect(video.props.posterSource).toEqual({
      uri: 'https://example.com/poster.png',
    });
  });
});
