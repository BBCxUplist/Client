import { Mail, Users, TrendingUp, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const MailchimpFeatureSection = () => {
  return (
    <section
      id='newsletter-features'
      className='w-full p-6 md:p-8 lg:p-10 border-t border-dashed border-white'
    >
      <div className='max-w-7xl mx-auto'>
        <div className='text-center mb-12'>
          <h2 className='font-bold text-white text-4xl md:text-5xl lg:text-7xl mb-6'>
            Stay Connected
          </h2>
          <p className='text-white/70 text-xl max-w-3xl mx-auto'>
            Artists can now build their fanbase with integrated newsletter
            features. Fans get exclusive updates on new music, shows, and
            behind-the-scenes content.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12'>
          {/* For Artists */}
          <div className='bg-white/5 border border-white/10 rounded-lg p-6 text-center'>
            <div className='w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4'>
              <Mail className='w-8 h-8 text-orange-500' />
            </div>
            <h3 className='text-white font-semibold text-lg mb-2'>
              Easy Integration
            </h3>
            <p className='text-white/70 text-sm'>
              Connect your Mailchimp account in minutes and start building your
              audience
            </p>
          </div>

          {/* Growth Tracking */}
          <div className='bg-white/5 border border-white/10 rounded-lg p-6 text-center'>
            <div className='w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4'>
              <TrendingUp className='w-8 h-8 text-green-500' />
            </div>
            <h3 className='text-white font-semibold text-lg mb-2'>
              Track Growth
            </h3>
            <p className='text-white/70 text-sm'>
              Monitor subscriber growth and engagement through your artist
              dashboard
            </p>
          </div>

          {/* Fan Experience */}
          <div className='bg-white/5 border border-white/10 rounded-lg p-6 text-center'>
            <div className='w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4'>
              <Users className='w-8 h-8 text-blue-500' />
            </div>
            <h3 className='text-white font-semibold text-lg mb-2'>
              Fan Engagement
            </h3>
            <p className='text-white/70 text-sm'>
              Fans can easily subscribe to their favorite artists' newsletters
            </p>
          </div>

          {/* Seamless */}
          <div className='bg-white/5 border border-white/10 rounded-lg p-6 text-center'>
            <div className='w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4'>
              <CheckCircle className='w-8 h-8 text-purple-500' />
            </div>
            <h3 className='text-white font-semibold text-lg mb-2'>Seamless</h3>
            <p className='text-white/70 text-sm'>
              No complex setup required. Works with your existing Mailchimp
              account
            </p>
          </div>
        </div>

        {/* CTA for Artists */}
        <div className='text-center'>
          <div className='bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-lg p-8 max-w-2xl mx-auto'>
            <h3 className='text-white font-semibold text-2xl mb-4'>
              Ready to grow your fanbase?
            </h3>
            <p className='text-white/70 mb-6'>
              Join Uplist as an artist and start building your newsletter
              audience today
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link
                to='/auth'
                className='bg-orange-500 text-black px-6 py-3 font-semibold rounded-lg hover:bg-orange-600 transition-colors'
              >
                Get Started as Artist
              </Link>
              <Link
                to='/explore'
                className='bg-white/10 border border-white/30 text-white px-6 py-3 font-semibold rounded-lg hover:bg-white/20 transition-colors'
              >
                Explore Artists
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MailchimpFeatureSection;
