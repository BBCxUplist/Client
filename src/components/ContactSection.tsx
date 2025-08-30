const ContactSection = () => {
  return (
    <div className="w-full bg-ui-dark-blue py-16 mt-16 border-t-[6px]   md:rounded-t-[50%] rounded-t-[20%]">
      <div className="max-w-5xl mx-auto text-center px-4">
        <h3 className="text-3xl md:text-4xl font-bold font-dm-sans text-white mb-4">
          Still have questions?
        </h3>
        <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
          Our support team is here to help. Get in touch with us and we'll
          respond within 24 hours.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-4 bg-white text-ui-dark-blue font-bold rounded-2xl hover:bg-white/80 transition-colors duration-200 shadow-sm shadow-neutral-800/20">
            Contact Us
          </button>
          <button className="px-8 py-4 bg-white border border-neutral-300 text-neutral-900 font-bold rounded-2xl hover:bg-white/80 transition-colors duration-200">
            View FAQ
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
