import { useRef } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

interface CustomTrackProps {
  trackUrl: string;
  trackTitle: string;
  index: number;
}

const CustomTrack = ({ trackUrl, trackTitle, index }: CustomTrackProps) => {
  const audioPlayerRef = useRef<AudioPlayer>(null);

  return (
    <div className='bg-white/5 p-6 rounded-xl border border-white/10 transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20'>
      <div className='flex items-center gap-4 mb-4'>
        <div className='flex-1'>
          <h4 className='text-white font-semibold text-lg'>{trackTitle}</h4>
          <p className='text-white/60 text-sm'>Track {index + 1}</p>
        </div>
        <div className='flex items-center gap-2 text-orange-400 text-sm'>
          <svg
            className='w-4 h-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3'
            />
          </svg>
          <span className='font-medium'>Audio Track</span>
        </div>
      </div>

      <div className='custom-audio-player'>
        <AudioPlayer
          ref={audioPlayerRef}
          src={trackUrl}
          customAdditionalControls={[]}
          customVolumeControls={[]}
          showJumpControls={false}
          layout='horizontal-reverse'
          style={{
            backgroundColor: 'transparent',
            boxShadow: 'none',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        />
      </div>

      <style>{`
        .custom-audio-player .rhap_container {
          background-color: rgba(255, 255, 255, 0.05);
          box-shadow: none;
          padding: 20px;
          border-radius: 12px;
        }

        .custom-audio-player .rhap_main {
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .custom-audio-player .rhap_controls-section {
          margin: 0;
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .custom-audio-player .rhap_main-controls {
          display: flex;
          align-items: center;
          justify-content: right;
          gap: 12px;
          width: 100%;
        }

        .custom-audio-player .rhap_main-controls-button {
          color: white;
        }

        .custom-audio-player .rhap_play-pause-button {
          background-color: #f97316;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
        }

        .custom-audio-player .rhap_play-pause-button:hover {
          background-color: #ea580c;
          transform: scale(1.08);
          box-shadow: 0 6px 16px rgba(249, 115, 22, 0.5);
        }

        .custom-audio-player .rhap_play-pause-button svg {
          color: black;
          width: 28px;
          height: 28px;
        }

        .custom-audio-player .rhap_progress-section {
          width: 100%;
        }

        .custom-audio-player .rhap_progress-container {
          margin: 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .custom-audio-player .rhap_progress-bar {
          background-color: rgba(255, 255, 255, 0.1);
          height: 8px;
          border-radius: 4px;
          flex: 1;
        }

        .custom-audio-player .rhap_progress-filled {
          background: linear-gradient(90deg, #f97316 0%, #fb923c 100%);
          border-radius: 4px;
        }

        .custom-audio-player .rhap_progress-indicator {
          background-color: #fff;
          width: 16px;
          height: 16px;
          top: -4px;
          box-shadow: 0 0 12px rgba(249, 115, 22, 0.6);
          border: 2px solid #f97316;
        }

        .custom-audio-player .rhap_time {
          color: rgba(255, 255, 255, 0.7);
          font-size: 13px;
          font-weight: 500;
          min-width: 45px;
        }

        .custom-audio-player .rhap_current-time {
          text-align: right;
        }

        .custom-audio-player .rhap_total-time {
          text-align: left;
        }

        .custom-audio-player .rhap_volume-controls {
          display: none;
        }

        .custom-audio-player .rhap_additional-controls {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default CustomTrack;
