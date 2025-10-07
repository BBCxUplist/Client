import { Link } from 'react-router-dom';
import Navbar from '@/components/landing/Navbar';

const Privacy = () => {
  return (
    <div className='min-h-screen bg-neutral-950 texture-bg'>
      <Navbar />

      <div className='w-full p-4 md:p-6 lg:p-8'>
        <div className='max-w-4xl mx-auto'>
          {/* Header */}
          <div className='text-center mb-12'>
            <h1 className='font-mondwest text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4'>
              PRIVACY POLICY
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
                At Uplist, we are committed to protecting your privacy and
                ensuring the security of your personal information. This Privacy
                Policy explains how we collect, use, disclose, and safeguard
                your information when you use our platform to connect artists
                with clients.
              </p>
              <p className='text-white/80 leading-relaxed mt-4'>
                By using our Service, you consent to the data practices
                described in this Privacy Policy. If you do not agree with the
                practices described in this policy, please do not use our
                Service.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className='font-mondwest text-2xl font-bold text-white mb-4'>
                2. Information We Collect
              </h2>

              <h3 className='font-semibold text-white text-lg mb-3'>
                Personal Information:
              </h3>
              <ul className='list-disc list-inside space-y-2 text-white/80 ml-4 mb-6'>
                <li>Name, email address, and phone number</li>
                <li>Profile pictures and biographical information</li>
                <li>
                  Payment information (processed securely through third-party
                  providers)
                </li>
                <li>Location data for service area matching</li>
                <li>Communication preferences and settings</li>
              </ul>

              <h3 className='font-semibold text-white text-lg mb-3'>
                Artist-Specific Information:
              </h3>
              <ul className='list-disc list-inside space-y-2 text-white/80 ml-4 mb-6'>
                <li>Musical genres, instruments, and performance styles</li>
                <li>Portfolio images, audio samples, and video content</li>
                <li>Performance history and client reviews</li>
                <li>Availability calendar and booking preferences</li>
                <li>Pricing information and service packages</li>
              </ul>

              <h3 className='font-semibold text-white text-lg mb-3'>
                Usage Information:
              </h3>
              <ul className='list-disc list-inside space-y-2 text-white/80 ml-4'>
                <li>Device information and browser type</li>
                <li>IP address and location data</li>
                <li>Pages visited and features used</li>
                <li>Search queries and booking history</li>
                <li>Communication logs and support interactions</li>
              </ul>
            </section>

            {/* How We Use Information */}
            <section>
              <h2 className='font-mondwest text-2xl font-bold text-white mb-4'>
                3. How We Use Your Information
              </h2>
              <p className='text-white/80 leading-relaxed mb-4'>
                We use the information we collect to provide, maintain, and
                improve our services:
              </p>
              <ul className='list-disc list-inside space-y-2 text-white/80 ml-4'>
                <li>Facilitate connections between artists and clients</li>
                <li>Process bookings, payments, and transactions</li>
                <li>Provide customer support and resolve disputes</li>
                <li>Send important updates about your account and bookings</li>
                <li>Improve our platform and develop new features</li>
                <li>Ensure platform safety and prevent fraud</li>
                <li>Comply with legal obligations and enforce our terms</li>
                <li>Personalize your experience and show relevant content</li>
              </ul>
            </section>

            {/* Information Sharing */}
            <section>
              <h2 className='font-mondwest text-2xl font-bold text-white mb-4'>
                4. Information Sharing and Disclosure
              </h2>
              <p className='text-white/80 leading-relaxed mb-4'>
                We do not sell, trade, or rent your personal information to
                third parties. We may share your information in the following
                circumstances:
              </p>

              <h3 className='font-semibold text-white text-lg mb-3'>
                With Other Users:
              </h3>
              <ul className='list-disc list-inside space-y-2 text-white/80 ml-4 mb-6'>
                <li>Artist profiles are visible to potential clients</li>
                <li>Client information is shared with booked artists</li>
                <li>Reviews and ratings are displayed publicly</li>
              </ul>

              <h3 className='font-semibold text-white text-lg mb-3'>
                With Service Providers:
              </h3>
              <ul className='list-disc list-inside space-y-2 text-white/80 ml-4 mb-6'>
                <li>Payment processors for transaction handling</li>
                <li>Cloud storage providers for data hosting</li>
                <li>Analytics services for platform improvement</li>
                <li>Customer support tools for assistance</li>
              </ul>

              <h3 className='font-semibold text-white text-lg mb-3'>
                Legal Requirements:
              </h3>
              <ul className='list-disc list-inside space-y-2 text-white/80 ml-4'>
                <li>When required by law or legal process</li>
                <li>To protect our rights and prevent fraud</li>
                <li>In case of emergency or safety concerns</li>
                <li>With your explicit consent</li>
              </ul>
            </section>

            {/* Data Security */}
            <section>
              <h2 className='font-mondwest text-2xl font-bold text-white mb-4'>
                5. Data Security
              </h2>
              <p className='text-white/80 leading-relaxed mb-4'>
                We implement appropriate technical and organizational measures
                to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction:
              </p>
              <ul className='list-disc list-inside space-y-2 text-white/80 ml-4'>
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Access controls and authentication systems</li>
                <li>Secure payment processing through certified providers</li>
                <li>Employee training on data protection practices</li>
                <li>Incident response procedures for security breaches</li>
              </ul>
            </section>

            {/* Cookies and Tracking */}
            <section>
              <h2 className='font-mondwest text-2xl font-bold text-white mb-4'>
                6. Cookies and Tracking Technologies
              </h2>
              <p className='text-white/80 leading-relaxed mb-4'>
                We use cookies and similar tracking technologies to enhance your
                experience:
              </p>
              <ul className='list-disc list-inside space-y-2 text-white/80 ml-4'>
                <li>
                  <strong>Essential Cookies:</strong> Required for basic
                  platform functionality
                </li>
                <li>
                  <strong>Performance Cookies:</strong> Help us understand how
                  you use our platform
                </li>
                <li>
                  <strong>Functional Cookies:</strong> Remember your preferences
                  and settings
                </li>
                <li>
                  <strong>Marketing Cookies:</strong> Show relevant
                  advertisements (with consent)
                </li>
              </ul>
              <p className='text-white/80 leading-relaxed mt-4'>
                You can control cookie settings through your browser
                preferences, though disabling certain cookies may affect
                platform functionality.
              </p>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className='font-mondwest text-2xl font-bold text-white mb-4'>
                7. Your Privacy Rights
              </h2>
              <p className='text-white/80 leading-relaxed mb-4'>
                Depending on your location, you may have the following rights
                regarding your personal information:
              </p>
              <ul className='list-disc list-inside space-y-2 text-white/80 ml-4'>
                <li>
                  <strong>Access:</strong> Request a copy of your personal
                  information
                </li>
                <li>
                  <strong>Correction:</strong> Update or correct inaccurate
                  information
                </li>
                <li>
                  <strong>Deletion:</strong> Request deletion of your personal
                  information
                </li>
                <li>
                  <strong>Portability:</strong> Receive your data in a
                  structured format
                </li>
                <li>
                  <strong>Restriction:</strong> Limit how we process your
                  information
                </li>
                <li>
                  <strong>Objection:</strong> Object to certain processing
                  activities
                </li>
                <li>
                  <strong>Withdraw Consent:</strong> Withdraw consent for data
                  processing
                </li>
              </ul>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className='font-mondwest text-2xl font-bold text-white mb-4'>
                8. Data Retention
              </h2>
              <p className='text-white/80 leading-relaxed'>
                We retain your personal information for as long as necessary to
                provide our services, comply with legal obligations, resolve
                disputes, and enforce our agreements. When you delete your
                account, we will delete or anonymize your personal information,
                except where we are required to retain it for legal or
                regulatory purposes.
              </p>
            </section>

            {/* International Transfers */}
            <section>
              <h2 className='font-mondwest text-2xl font-bold text-white mb-4'>
                9. International Data Transfers
              </h2>
              <p className='text-white/80 leading-relaxed'>
                Your information may be transferred to and processed in
                countries other than your own. We ensure that such transfers
                comply with applicable data protection laws and implement
                appropriate safeguards to protect your information during
                international transfers.
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className='font-mondwest text-2xl font-bold text-white mb-4'>
                10. Children's Privacy
              </h2>
              <p className='text-white/80 leading-relaxed'>
                Our Service is not intended for children under 13 years of age.
                We do not knowingly collect personal information from children
                under 13. If you are a parent or guardian and believe your child
                has provided us with personal information, please contact us
                immediately.
              </p>
            </section>

            {/* Changes to Privacy Policy */}
            <section>
              <h2 className='font-mondwest text-2xl font-bold text-white mb-4'>
                11. Changes to This Privacy Policy
              </h2>
              <p className='text-white/80 leading-relaxed'>
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Last updated" date. We encourage you
                to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className='font-mondwest text-2xl font-bold text-white mb-4'>
                12. Contact Us
              </h2>
              <p className='text-white/80 leading-relaxed mb-4'>
                If you have any questions about this Privacy Policy or our data
                practices, please contact us:
              </p>
              <div className='mt-4 p-4 bg-white/5 border border-white/10 rounded-lg'>
                <p className='text-white/80'>
                  <strong>Privacy Officer:</strong> privacy@uplist.com
                  <br />
                  <strong>General Inquiries:</strong> support@uplist.com
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
          <Link
            to='/auth'
            className='inline-flex items-center px-6 py-3 bg-orange-500 text-black font-semibold rounded-lg hover:bg-orange-600 transition-colors'
          >
            ← Back to Registration
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
