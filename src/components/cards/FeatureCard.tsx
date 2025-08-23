interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="w-1/3 p-4 border border-neutral-200 rounded-3xl inset-shadow-sm shadow-sm shadow-orange-600/5">
      <div
        className={`p-3 bg-orange-600 rounded-2xl w-fit shadow-sm shadow-black/50 inset-shadow-lg inset-shadow-black`}
      >
        <img src={icon} alt={title.toLowerCase()} className="w-8 h-8" />
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <p className="text-lg font-bold font-dm-sans">{title}</p>
        <p className="text-sm text-neutral-600">{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
