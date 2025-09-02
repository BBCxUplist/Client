const About = () => {
  return (
    <div className="w-full p-6 md:p-8 lg:p-10 border-t border-dashed border-white">
      <h1 className="font-bold text-white mb-8 md:mb-12 text-4xl md:text-5xl lg:text-7xl max-w-7xl mx-auto">
        ABOUT
      </h1>
      <p className="text-gray-300 max-w-4xl mx-auto leading-relaxed uppercase text-lg md:text-xl lg:text-2xl">
        <span className="font-mondwest text-orange-500 text-3xl">Uplist</span> is an
        artist booking platform that connects talented musicians with people
        looking to hire them for events. Whether you need a singer for a{" "}
        <span className="font-mondwest text-orange-500 text-3xl ">wedding</span>,{" "}
        <span className="font-mondwest text-orange-500 text-3xl">birthday party</span>,{" "}
        <span className="font-mondwest text-orange-500 text-3xl">engagement</span>, or
        any other celebration, we make it simple to find and book{" "}
        <span className="font-mondwest text-orange-500 text-3xl">verified artists</span>.
        Artists can register on our platform, get{" "}
        <span className="font-mondwest text-orange-500 text-3xl">verified</span>, and
        receive{" "}
        <span className="font-mondwest text-orange-500 text-3xl">freelance gig</span>{" "}
        opportunities. We're here to make{" "}
        <span className="font-mondwest text-orange-500 text-3xl">live music</span>{" "}
        accessible for every occasion.
      </p>
    </div>
  );
};

export default About;