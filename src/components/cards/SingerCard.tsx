const SingerCard = () => {
  return (
    <div className="w-full p-2 border border-neutral-200 rounded-4xl bg-white/20 backdrop-blur-sm">
      <img
        src="/images/singer.jpeg"
        alt="artist"
        className="w-full h-auto aspect-square object-cover rounded-3xl"
      />
      <div className="flex flex-col  gap-2 p-4 pb-2">
        <p className="text-lg font-bold font-dm-sans">John Doe</p>
        <p className="text-sm text-neutral-200">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
          quos.
        </p>
      </div>
    </div>
  );
};

export default SingerCard;
