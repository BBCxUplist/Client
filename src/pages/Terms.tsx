import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/landing/Navbar';

const Terms = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className='min-h-screen bg-neutral-950 texture-bg'>
      <Navbar />

      <div className='w-full p-4 md:p-6 lg:p-8'>
        <div className='max-w-4xl mx-auto'>
          {/* Header */}
          <div className='text-center mb-12'>
            <h1 className='font-mondwest text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4'>
              TERMS OF SERVICE
            </h1>
            <p className='text-white/70 text-lg'>
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Content */}
          <div className='bg-white/5 border border-white/10 p-6 md:p-8 space-y-8'>
            {/* Introduction */}
            <section>
              <h2 className='font-mondwest text-2xl font-bold text-white mb-4'>
                1. Introduction
              </h2>
              <p className='text-white/80 leading-relaxed'>
                Welcome to Uplist, a platform that connects music artists with
                clients for live performances, studio sessions, and other
                musical services. These Terms of Service ("Terms") govern your
                use of our website, mobile application, and services
                (collectively, the "Service") operated by Uplist ("us", "we", or
                "our").
              </p>
              <p className='text-white/80 leading-relaxed mt-4'>
                By accessing or using our Service, you agree to be bound by
                these Terms. If you disagree with any part of these terms, then
                you may not access the Service.
              </p>
            </section>

            {/* Acceptance of Terms */}
            <section>
              <h2 className='font-mondwest text-2xl font-bold text-white mb-4'>
                2. Acceptance of Terms
              </h2>
              <p className='text-white/80 leading-relaxed'>
                By creating an account, booking an artist, or using any of our
                services, you acknowledge that you have read, understood, and
                agree to be bound by these Terms and our Privacy Policy. These
                Terms constitute a legally binding agreement between you and
                Uplist.
              </p>
            </section>

            {/* User Accounts */}
            <section>
              <h2 className='font-mondwest text-2xl font-bold text-white mb-4'>
                3. User Accounts
              </h2>
              <div className='space-y-4'>
                <p className='text-white/80 leading-relaxed'>
                  To access certain features of our Service, you must register
                  for an account. You agree to:
                </p>
                <ul className='list-disc list-inside space-y-2 text-white/80 ml-4'>
                  <li>
                    Provide accurate, current, and complete information during
                    registration
                  </li>
                  <li>
                    Maintain and update your account information to keep it
                    accurate and current
                  </li>
                  <li>Maintain the security of your password and account</li>
                  <li>
                    Accept responsibility for all activities under your account
                  </li>
                  <li>
                    Notify us immediately of any unauthorized use of your
                    account
                  </li>
                </ul>
              </div>
            </section>

            {/* Artist Services */}
            <section>
              <h2 className='font-mondwest text-2xl font-bold text-white mb-4'>
                4. Artist Services and Bookings
              </h2>
              <div className='space-y-4'>
                <p className='text-white/80 leading-relaxed'>
                  Uplist facilitates connections between artists and clients. We
                  are not responsible for:
                </p>
                <ul className='list-disc list-inside space-y-2 text-white/80 ml-4'>
                  <li>
                    The quality, safety, or legality of services provided by
                    artists
                  </li>
                  <li>
                    The accuracy of artist profiles, availability, or pricing
                  </li>
                  <li>The performance or conduct of artists during bookings</li>
                  <li>Disputes between artists and clients</li>
                </ul>
                <p className='text-white/80 leading-relaxed mt-4'>
                  All bookings are subject to availability and artist approval.
                  Uplist reserves the right to cancel bookings at any time for
                  any reason.
                </p>
              </div>
            </section>

            {/* Payment Terms */}
            <section>
              <h2 className='font-mondwest text-2xl font-bold text-white mb-4'>
                5. Payment Terms
              </h2>
              <div className='space-y-4'>
                <p className='text-white/80 leading-relaxed'>
                  Payment processing is handled through secure third-party
                  payment processors. You agree to:
                </p>
                <ul className='list-disc list-inside space-y-2 text-white/80 ml-4'>
                  <li>
                    Pay all fees and charges associated with your bookings
                  </li>
                  <li>Provide accurate payment information</li>
                  <li>
                    Authorize charges for services as described in your booking
                  </li>
                  <li>Accept our refund and cancellation policies</li>
                </ul>
                <p className='text-white/80 leading-relaxed mt-4'>
                  Uplist charges a service fee on all transactions. This fee is
                  clearly displayed before booking confirmation.
                </p>
              </div>
            </section>

            {/* Cancellation and Refunds */}
            <section>
              <h2 className='font-mondwest text-2xl font-bold text-white mb-4'>
                6. Cancellation and Refund Policy
              </h2>
              <div className='space-y-4'>
                <h3 className='font-semibold text-white text-lg'>
                  Client Cancellations:
                </h3>
                <ul className='list-disc list-inside space-y-2 text-white/80 ml-4'>
                  <li>More than 48 hours: Full refund minus service fee</li>
                  <li>24-48 hours: 50% refund minus service fee</li>
                  <li>Less than 24 hours: No refund</li>
                </ul>

                <h3 className='font-semibold text-white text-lg mt-6'>
                  Artist Cancellations:
                </h3>
                <ul className='list-disc list-inside space-y-2 text-white/80 ml-4'>
                  <li>Full refund to client</li>
                  <li>
                    Artist may be subject to penalties or account restrictions
                  </li>
                </ul>
              </div>
            </section>

            {/* Prohibited Uses */}
            <section>
              <h2 className='font-mondwest text-2xl font-bold text-white mb-4'>
                7. Prohibited Uses
              </h2>
              <p className='text-white/80 leading-relaxed mb-4'>
                You may not use our Service for any unlawful purpose or to
                solicit others to perform unlawful acts. Prohibited activities
                include:
              </p>
              <ul className='list-disc list-inside space-y-2 text-white/80 ml-4'>
                <li>Violating any laws or regulations</li>
                <li>Infringing on intellectual property rights</li>
                <li>Harassing, abusing, or harming others</li>
                <li>Transmitting viruses or malicious code</li>
                <li>Attempting to gain unauthorized access to our systems</li>
                <li>Circumventing payment systems or fees</li>
                <li>Creating fake accounts or profiles</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className='font-mondwest text-2xl font-bold text-white mb-4'>
                8. Intellectual Property
              </h2>
              <p className='text-white/80 leading-relaxed'>
                The Service and its original content, features, and
                functionality are owned by Uplist and are protected by
                international copyright, trademark, patent, trade secret, and
                other intellectual property laws. Artists retain ownership of
                their original content, music, and performances.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className='font-mondwest text-2xl font-bold text-white mb-4'>
                9. Limitation of Liability
              </h2>
              <p className='text-white/80 leading-relaxed'>
                In no event shall Uplist, nor its directors, employees,
                partners, agents, suppliers, or affiliates, be liable for any
                indirect, incidental, special, consequential, or punitive
                damages, including without limitation, loss of profits, data,
                use, goodwill, or other intangible losses, resulting from your
                use of the Service.
              </p>
            </section>

            {/* Termination */}
            <section>
              <h2 className='font-mondwest text-2xl font-bold text-white mb-4'>
                10. Termination
              </h2>
              <p className='text-white/80 leading-relaxed'>
                We may terminate or suspend your account and bar access to the
                Service immediately, without prior notice or liability, under
                our sole discretion, for any reason whatsoever and without
                limitation, including but not limited to a breach of the Terms.
              </p>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className='font-mondwest text-2xl font-bold text-white mb-4'>
                11. Changes to Terms
              </h2>
              <p className='text-white/80 leading-relaxed'>
                We reserve the right, at our sole discretion, to modify or
                replace these Terms at any time. If a revision is material, we
                will provide at least 30 days notice prior to any new terms
                taking effect.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className='font-mondwest text-2xl font-bold text-white mb-4'>
                12. Contact Information
              </h2>
              <p className='text-white/80 leading-relaxed'>
                If you have any questions about these Terms of Service, please
                contact us at:
              </p>
              <div className='mt-4 p-4 bg-white/5 border border-white/10 rounded-lg'>
                <p className='text-white/80'>
                  <strong>Email:</strong> legal@uplist.com
                  <br />
                  <strong>Address:</strong> 123 Music Street, Creative District,
                  NY 10001
                  <br />
                  <strong>Phone:</strong> +1 (555) 123-4567
                </p>
              </div>
            </section>
          </div>

          {/* Back Button */}
        </div>
        <div className='text-right mt-8 sticky bottom-4'>
          <button
            onClick={handleGoBack}
            className='inline-flex items-center px-6 py-3 bg-orange-500 text-black font-semibold rounded-lg hover:bg-orange-600 transition-colors ml-auto'
          >
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Terms;
