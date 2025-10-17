import AddMusicSection from './music/AddMusicSection';
import MusicLibrary from './music/MusicLibrary';

interface MusicTabProps {
  formData?: {
    embeds?: {
      youtube?: string[];
      soundcloud?: string[];
      spotify?: string[];
      custom?: { title: string; url: string }[];
    };
  };
  handleInputChange?: (field: string, value: any) => void;
}

const MusicTab = ({ formData, handleInputChange }: MusicTabProps) => {
  const currentEmbeds = formData?.embeds || {
    youtube: [],
    soundcloud: [],
    spotify: [],
    custom: [],
  };

  const handleAddEmbed = (platform: string, url: string) => {
    if (!handleInputChange) return;

    const currentPlatformEmbeds =
      currentEmbeds[platform as keyof typeof currentEmbeds] || [];
    const updatedEmbeds = [...currentPlatformEmbeds, url];

    handleInputChange('embeds', {
      ...currentEmbeds,
      [platform]: updatedEmbeds,
    });
  };

  const handleAddCustomTrack = (title: string, url: string) => {
    if (!handleInputChange) return;

    const currentCustomEmbeds = currentEmbeds.custom || [];
    const newTrack = { title, url };
    const updatedEmbeds = [...currentCustomEmbeds, newTrack];

    handleInputChange('embeds', {
      ...currentEmbeds,
      custom: updatedEmbeds,
    });
  };

  const handleRemoveEmbed = (platform: string, index: number) => {
    if (!handleInputChange) return;

    const currentPlatformEmbeds =
      currentEmbeds[platform as keyof typeof currentEmbeds] || [];
    const updatedEmbeds = currentPlatformEmbeds.filter((_, i) => i !== index);

    handleInputChange('embeds', {
      ...currentEmbeds,
      [platform]: updatedEmbeds,
    });
  };

  return (
    <div className='space-y-8'>
      <AddMusicSection
        onAddEmbed={handleAddEmbed}
        onAddCustomTrack={handleAddCustomTrack}
      />

      <MusicLibrary embeds={currentEmbeds} onRemoveEmbed={handleRemoveEmbed} />
    </div>
  );
};

export default MusicTab;
