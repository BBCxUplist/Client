import { useState } from "react";
import FAQCard from "@/components/cards/FAQCard";
import { faqs } from "@/constants/faqs";

const FAQ = () => {
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <div className="max-w-5xl mx-auto mt-16 px-4 sm:px-6 lg:px-8">
      <p className="text-2xl font-bold font-dm-sans">
        Frequently Asked <span className="text-orange-600">Questions</span>
      </p>

      <div className=" mt-6 border border-neutral-200 rounded-3xl shadow-sm shadow-orange-600/5 divide-y divide-neutral-200 ">
        {/* All FAQs in one section */}
        {faqs.map((faq) => (
          <FAQCard
            key={faq.id}
            question={faq.question}
            answer={faq.answer}
            category={faq.category}
            isOpen={openFAQ === faq.id}
            onToggle={() => toggleFAQ(faq.id)}
          />
        ))}
      </div>


    </div>
  );
};

export default FAQ;
