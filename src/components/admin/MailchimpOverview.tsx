import { useState } from 'react';
import { Mail, Users, TrendingUp, Settings, AlertCircle } from 'lucide-react';

const MailchimpOverview = () => {
  // This would normally come from an admin API endpoint
  const [stats] = useState({
    connectedArtists: 0, // This would need to be implemented in backend
    totalSubscribers: 0,
    platformGrowth: 0,
    activeNewsletters: 0,
  });

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-white font-mondwest'>
          Newsletter Integration Overview
        </h3>
        <div className='flex items-center gap-2 text-orange-400 text-sm'>
          <AlertCircle className='w-4 h-4' />
          <span>Admin Feature - Coming Soon</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <div className='bg-white/5 border border-white/10 rounded-lg p-4'>
          <div className='flex items-center gap-3'>
            <Mail className='w-8 h-8 text-blue-500' />
            <div>
              <p className='text-white/70 text-sm'>Connected Artists</p>
              <p className='text-white font-semibold text-lg'>
                {stats.connectedArtists}
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white/5 border border-white/10 rounded-lg p-4'>
          <div className='flex items-center gap-3'>
            <Users className='w-8 h-8 text-green-500' />
            <div>
              <p className='text-white/70 text-sm'>Total Subscribers</p>
              <p className='text-white font-semibold text-lg'>
                {stats.totalSubscribers.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white/5 border border-white/10 rounded-lg p-4'>
          <div className='flex items-center gap-3'>
            <TrendingUp className='w-8 h-8 text-orange-500' />
            <div>
              <p className='text-white/70 text-sm'>Growth Rate</p>
              <p className='text-white font-semibold text-lg'>
                +{stats.platformGrowth}%
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white/5 border border-white/10 rounded-lg p-4'>
          <div className='flex items-center gap-3'>
            <Settings className='w-8 h-8 text-purple-500' />
            <div>
              <p className='text-white/70 text-sm'>Active Newsletters</p>
              <p className='text-white font-semibold text-lg'>
                {stats.activeNewsletters}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features List */}
      <div className='bg-white/5 border border-white/10 rounded-lg p-6'>
        <h4 className='text-white font-semibold mb-4'>Available Features</h4>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <h5 className='text-orange-400 font-medium'>Artist Features</h5>
            <ul className='space-y-1 text-white/70 text-sm'>
              <li>• Mailchimp OAuth Integration</li>
              <li>• Newsletter Dashboard</li>
              <li>• Subscriber Management</li>
              <li>• Analytics & Growth Tracking</li>
            </ul>
          </div>
          <div className='space-y-2'>
            <h5 className='text-green-400 font-medium'>Fan Features</h5>
            <ul className='space-y-1 text-white/70 text-sm'>
              <li>• Easy Newsletter Signup</li>
              <li>• Artist Profile Integration</li>
              <li>• Mobile-Optimized Forms</li>
              <li>• GDPR Compliant</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Integration Status */}
      <div className='bg-white/5 border border-white/10 rounded-lg p-6'>
        <h4 className='text-white font-semibold mb-4'>System Status</h4>
        <div className='space-y-3'>
          <div className='flex items-center justify-between py-2 border-b border-white/10'>
            <span className='text-white/70'>Mailchimp API</span>
            <span className='text-green-400 text-sm font-medium'>
              Connected
            </span>
          </div>
          <div className='flex items-center justify-between py-2 border-b border-white/10'>
            <span className='text-white/70'>OAuth Flow</span>
            <span className='text-green-400 text-sm font-medium'>Active</span>
          </div>
          <div className='flex items-center justify-between py-2 border-b border-white/10'>
            <span className='text-white/70'>Subscription Endpoints</span>
            <span className='text-green-400 text-sm font-medium'>
              Operational
            </span>
          </div>
          <div className='flex items-center justify-between py-2'>
            <span className='text-white/70'>Error Handling</span>
            <span className='text-green-400 text-sm font-medium'>Enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MailchimpOverview;
