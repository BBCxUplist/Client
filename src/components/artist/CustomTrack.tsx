import React, { useRef, useMemo } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

interface CustomTrackProps {
  trackUrl: string;
  trackTitle: string;
  index: number;
}

const CustomTrack = React.memo(({ trackUrl, trackTitle }: CustomTrackProps) => {
  const audioPlayerRef = useRef<AudioPlayer>(null);

  // Memoize the audio player props to prevent unnecessary re-renders
  const audioPlayerProps = useMemo(
    () => ({
      ref: audioPlayerRef,
      src: trackUrl,
      showJumpControls: false,
      showSkipControls: false,
      showDownloadProgress: false,
      showFilledProgress: true,
      autoPlayAfterSrcChange: false,
      layout: 'horizontal' as const,
      customAdditionalControls: [],
      customVolumeControls: [],
    }),
    [trackUrl]
  );

  return (
    <div className='bg-white/5 border border-white/10 transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20 rounded-xl overflow-hidden'>
      {/* Title Section */}
      <div className='px-6 pt-5 pb-2'>
        <h4 className='text-white font-medium text-lg tracking-wide'>
          {trackTitle}
        </h4>
      </div>

      {/* Audio Player Section */}
      <div className='custom-audio-player px-4 pb-4'>
        <AudioPlayer {...audioPlayerProps} />
      </div>

      <style>{`
        /* 1. Reset Container Styles to fit parent */
        .custom-audio-player .rhap_container {
          background-color: transparent;
          box-shadow: none;
          padding: 10px 0;
          border: none;
        }

        /* 2. Align Content Horizontally (Row) */
        .custom-audio-player .rhap_main {
          display: flex;
          flex-direction: row; /* Horizontal alignment */
          gap: 16px;
          align-items: center; /* Vertical center */
          width: 100%;
        }

        /* 3. Controls Section (Play Button) */
        .custom-audio-player .rhap_controls-section {
          flex: 0 0 auto; /* Do not stretch */
          margin: 0;
        }

        .custom-audio-player .rhap_main-controls {
          justify-content: center;
        }

        /* Play/Pause Button Styling */
        .custom-audio-player .rhap_play-pause-button {
          background-color: white;
          color: #1a1a1a; /* Dark icon */
          border-radius: 50%;
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          border: none;
          font-size: 20px; /* Icon size */
        }

        .custom-audio-player .rhap_play-pause-button:hover {
          transform: scale(1.05);
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
        }

        /* 4. Progress Bar Section */
        .custom-audio-player .rhap_progress-section {
          flex: 1; /* Take up remaining space */
          display: flex;
          align-items: center;
          padding: 0; /* Remove default padding */
        }

        .custom-audio-player .rhap_progress-container {
          margin: 0;
          height: 6px;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }

        .custom-audio-player .rhap_progress-bar {
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          height: 100%;
        }

        .custom-audio-player .rhap_progress-filled {
          background-color: white;
          border-radius: 4px;
        }

        /* The Circle Indicator on the bar */
        .custom-audio-player .rhap_progress-indicator {
          background: white;
          width: 12px;
          height: 12px;
          top: -3px; /* Center it vertically on the 6px bar */
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
          opacity: 0; /* Hide by default, show on hover */
          transition: opacity 0.2s ease;
        }

        .custom-audio-player .rhap_progress-container:hover .rhap_progress-indicator {
          opacity: 1;
        }

        /* 5. Time Text Styling */
        .custom-audio-player .rhap_time {
          color: rgba(255, 255, 255, 0.6);
          font-size: 13px;
          font-family: monospace; /* Keeps numbers aligned nicely */
        }

        .custom-audio-player .rhap_current-time {
          margin-right: 8px;
        }
        
        .custom-audio-player .rhap_total-time {
          margin-left: 8px;
        }
      `}</style>
    </div>
  );
});

export default CustomTrack;
