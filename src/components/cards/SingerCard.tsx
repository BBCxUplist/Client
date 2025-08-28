const SingerCard = () => {
  return (
    <div className="w-full p-2 border border-neutral-200 rounded-4xl inset-shadow-sm shadow-sm shadow-orange-500/5">
      <img
        src="/images/singer.jpeg"
        alt="artist"
        className="w-full h-auto aspect-square object-cover rounded-3xl"
      />
      <div className="flex flex-col  gap-2 p-4 pb-2">
        <p className="text-lg font-bold font-dm-sans">John Doe</p>
        <p className="text-sm text-neutral-600">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
          quos.
        </p>
      </div>
    </div>
  );
};

export default SingerCard;
