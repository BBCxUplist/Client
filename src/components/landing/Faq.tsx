import { useState } from 'react';
import { faqContent } from '@/constants/faq';

const Faq = () => {
  const [openItem, setOpenItem] = useState<string | null>(null);

  const toggleItem = (categoryIndex: number, itemIndex: number) => {
    const key = `${categoryIndex}-${itemIndex}`;
    setOpenItem(prev => (prev === key ? null : key));
  };

  return (
    <div
      id='faq'
      className='w-full p-6 md:p-8 lg:p-10 border-t border-dashed border-white'
    >
      <div className='max-w-7xl mx-auto'>
        <h2 className='font-bold text-white text-4xl md:text-5xl lg:text-7xl mb-8 md:mb-12'>
          Frequently Asked Questions
        </h2>

        <div className='space-y-6 md:space-y-8'>
          {faqContent.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className='bg-white/5 backdrop-blur-sm p-4 md:p-6 lg:p-8'
            >
              <h3 className='text-2xl md:text-3xl font-semibold text-white mb-4 md:mb-6 font-mondwest'>
                {category.title}
              </h3>

              <div className='space-y-4'>
                {category.items.map((item, itemIndex) => {
                  const key = `${categoryIndex}-${itemIndex}`;
                  const isOpen = openItem === key;

                  return (
                    <div
                      key={itemIndex}
                      className='border-b border-white/10 last:border-b-0'
                    >
                      <button
                        onClick={() => toggleItem(categoryIndex, itemIndex)}
                        className='w-full text-left py-4 px-2 flex justify-between items-center hover:bg-white/5 transition-all duration-300 ease-out group'
                      >
                        <h4 className='text-xl md:text-2xl lg:text-3xl font-semibold text-orange-500 pr-2 md:pr-4 font-mondwest'>
                          {item.question}
                        </h4>
                        <div
                          className={`text-white text-2xl transition-all duration-500 ease-out ${
                            isOpen
                              ? 'rotate-180 scale-110'
                              : 'rotate-0 scale-100'
                          } group-hover:scale-110`}
                        >
                          {isOpen ? '−' : '+'}
                        </div>
                      </button>

                      <div
                        className={`overflow-hidden transition-all duration-500 ease-out ${
                          isOpen
                            ? 'max-h-[500px] opacity-100'
                            : 'max-h-0 opacity-0'
                        }`}
                        style={{
                          transitionProperty: 'max-height, opacity, padding',
                          transitionTimingFunction:
                            'cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                      >
                        <div
                          className={`transition-all duration-500 ease-out ${
                            isOpen ? 'pb-4' : 'pb-0'
                          }`}
                        >
                          <p className='text-white/80 text-lg leading-relaxed leading-7'>
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faq;
