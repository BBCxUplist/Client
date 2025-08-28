const ContactSection = () => {
  return (
    <div className="w-full bg-neutral-800 py-16 mt-16 border-t-[6px] border-orange-500  md:rounded-t-[50%] rounded-t-[20%]">
      <div className="max-w-5xl mx-auto text-center px-4">
        <h3 className="text-3xl md:text-4xl font-bold font-dm-sans text-neutral-100 mb-4">
          Still have questions?
        </h3>
        <p className="text-neutral-100 text-lg mb-8 max-w-2xl mx-auto">
          Our support team is here to help. Get in touch with us and we'll
          respond within 24 hours.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-4 bg-neutral-100 text-neutral-900 font-bold rounded-2xl hover:bg-neutral-200 transition-colors duration-200 shadow-sm shadow-neutral-800/20">
            Contact Us
          </button>
          <button className="px-8 py-4 border border-neutral-300 text-neutral-100 font-bold rounded-2xl hover:bg-neutral-100 transition-colors duration-200">
            View FAQ
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
