import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy | BestMealMate',
  description: 'Learn how BestMealMate collects, uses, and protects your personal information.',
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: December 28, 2025</p>

        <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
          <p className="text-sm text-gray-700">
            <strong>Quick Links:</strong>{' '}
            <Link href="/terms" className="text-orange-600 hover:underline">Terms of Service</Link> |{' '}
            <Link href="/cookies" className="text-orange-600 hover:underline">Cookie Policy</Link> |{' '}
            <Link href="/privacy/rights" className="text-orange-600 hover:underline">Your Privacy Rights (GDPR/CCPA)</Link>
          </p>
        </div>

        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
            <p className="mb-3">
              Welcome to BestMealMate (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We respect your privacy and are
              committed to protecting your personal data in compliance with applicable privacy laws, including the
              General Data Protection Regulation (GDPR), California Consumer Privacy Act (CCPA), and other regional
              privacy regulations.
            </p>
            <p>
              This privacy policy explains how we collect, use, share, and safeguard your information when you use
              our meal planning application and related services (collectively, the &quot;Service&quot;).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Information We Collect</h2>

            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">2.1 Information You Provide</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account Information:</strong> Name, email address, and password when you create an account</li>
              <li><strong>Profile Information:</strong> Dietary preferences, allergies, and cooking preferences</li>
              <li><strong>Family Profiles:</strong> Names, ages, and dietary restrictions of family members you add</li>
              <li><strong>Food Data:</strong> Pantry items, recipes, meal plans, and grocery lists you create</li>
              <li><strong>Payment Information:</strong> Billing address and payment details (processed securely through Stripe; we do not store full card numbers)</li>
              <li><strong>Communications:</strong> Messages you send to our support team</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">2.2 Information Collected Automatically</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Device Information:</strong> Browser type, operating system, device identifiers</li>
              <li><strong>Usage Data:</strong> Pages visited, features used, time spent on the Service</li>
              <li><strong>Log Data:</strong> IP address, access times, referring URLs</li>
              <li><strong>Cookies:</strong> See our <Link href="/cookies" className="text-orange-600 hover:underline">Cookie Policy</Link> for details</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">2.3 Images and Camera Data</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Food Scanner Images:</strong> Photos you take using our food scanner feature are processed by AI to identify food items</li>
              <li><strong>Barcode Scans:</strong> Barcode data is used to look up product information</li>
              <li><strong>Image Retention:</strong> Images are processed in real-time and are not permanently stored on our servers unless you explicitly save them</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">2.4 Health and Wearable Device Data</h3>
            <p className="mb-2">If you connect wearable devices or health apps, we may collect:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Activity Data:</strong> Steps, distance, active minutes, calories burned</li>
              <li><strong>Health Metrics:</strong> Heart rate, sleep data, weight (only if you grant permission)</li>
              <li><strong>Nutrition Data:</strong> Calorie intake, macronutrient tracking from connected apps</li>
            </ul>
            <p className="mt-2 text-sm text-gray-600">
              Health data is treated with extra care and is only used to provide personalized nutrition recommendations.
              You can disconnect wearable devices at any time through your account settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Provide Services:</strong> Deliver personalized meal suggestions, manage your pantry, and generate grocery lists</li>
              <li><strong>Personalization:</strong> Customize recommendations based on dietary preferences, health goals, and activity levels</li>
              <li><strong>AI Features:</strong> Power our AI chef and food scanner using machine learning</li>
              <li><strong>Payments:</strong> Process subscription payments and manage billing</li>
              <li><strong>Communication:</strong> Send account updates, service announcements, and (with consent) marketing emails</li>
              <li><strong>Analytics:</strong> Understand usage patterns to improve our Service</li>
              <li><strong>Security:</strong> Detect and prevent fraud, abuse, and security incidents</li>
              <li><strong>Legal Compliance:</strong> Meet our legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Legal Basis for Processing (GDPR)</h2>
            <p className="mb-3">For users in the European Economic Area (EEA), UK, and Switzerland, we process your data based on:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Contract Performance:</strong> To provide the Service you signed up for</li>
              <li><strong>Legitimate Interests:</strong> To improve our Service, prevent fraud, and ensure security</li>
              <li><strong>Consent:</strong> For marketing communications and processing of health data</li>
              <li><strong>Legal Obligation:</strong> To comply with applicable laws</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Data Sharing</h2>
            <p className="mb-3">We do not sell your personal data. We may share your information with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Service Providers:</strong> Third parties that help us operate the Service (see Section 6)</li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or government request</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>With Your Consent:</strong> When you explicitly authorize sharing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Third-Party Services</h2>
            <p className="mb-3">We use trusted third-party services to operate BestMealMate:</p>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left border-b">Provider</th>
                    <th className="px-4 py-2 text-left border-b">Purpose</th>
                    <th className="px-4 py-2 text-left border-b">Data Shared</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b">Supabase</td>
                    <td className="px-4 py-2 border-b">Database & Authentication</td>
                    <td className="px-4 py-2 border-b">Account data, app data</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b">Stripe</td>
                    <td className="px-4 py-2 border-b">Payment Processing</td>
                    <td className="px-4 py-2 border-b">Billing info, payment details</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b">Anthropic (Claude AI)</td>
                    <td className="px-4 py-2 border-b">AI Meal Suggestions, Food Recognition</td>
                    <td className="px-4 py-2 border-b">Pantry items, food images</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b">Vercel</td>
                    <td className="px-4 py-2 border-b">Website Hosting</td>
                    <td className="px-4 py-2 border-b">Server logs, IP addresses</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b">Open Food Facts</td>
                    <td className="px-4 py-2 border-b">Barcode Product Lookup</td>
                    <td className="px-4 py-2 border-b">Scanned barcodes only</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b">Wearable Providers</td>
                    <td className="px-4 py-2 border-b">Health Data Sync</td>
                    <td className="px-4 py-2 border-b">Authorization tokens only</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b">Google Analytics</td>
                    <td className="px-4 py-2 border-b">Website Analytics</td>
                    <td className="px-4 py-2 border-b">Usage data, page views, anonymized IP</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b">Google Ads</td>
                    <td className="px-4 py-2 border-b">Advertising & Conversion Tracking</td>
                    <td className="px-4 py-2 border-b">Conversion events, anonymized user data</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Google AdSense</td>
                    <td className="px-4 py-2">Display Advertising</td>
                    <td className="px-4 py-2">Ad preferences, anonymized browsing data</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-gray-600">
              For advertising services: We use Google Ads for marketing and Google AdSense to display ads.
              You can opt out of personalized advertising at{' '}
              <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">
                Google Ads Settings
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Data Retention</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account Data:</strong> Retained while your account is active, plus 30 days after deletion request</li>
              <li><strong>Payment Records:</strong> Retained for 7 years for tax and legal compliance</li>
              <li><strong>Health Data:</strong> Retained while connected, deleted within 30 days of disconnection</li>
              <li><strong>Usage Logs:</strong> Retained for 90 days</li>
              <li><strong>Food Images:</strong> Processed in real-time, not permanently stored</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Data Security</h2>
            <p className="mb-3">We implement industry-standard security measures:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Encryption in transit (TLS/HTTPS) and at rest</li>
              <li>Secure authentication with password hashing</li>
              <li>Regular security audits and monitoring</li>
              <li>Access controls and employee training</li>
              <li>PCI-DSS compliant payment processing through Stripe</li>
            </ul>
            <p className="mt-3 text-sm text-gray-600">
              While we strive to protect your data, no method of transmission or storage is 100% secure.
              Please use strong passwords and contact us immediately if you suspect unauthorized access.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Your Privacy Rights</h2>
            <p className="mb-3">Depending on your location, you may have the following rights:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update inaccurate or incomplete data</li>
              <li><strong>Deletion:</strong> Request deletion of your data (&quot;right to be forgotten&quot;)</li>
              <li><strong>Portability:</strong> Receive your data in a machine-readable format</li>
              <li><strong>Restriction:</strong> Limit how we process your data</li>
              <li><strong>Objection:</strong> Object to processing based on legitimate interests</li>
              <li><strong>Withdraw Consent:</strong> Revoke previously given consent</li>
            </ul>
            <p className="mt-3">
              <Link href="/privacy/rights" className="text-orange-600 hover:underline font-medium">
                Learn more about your GDPR and CCPA rights →
              </Link>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">10. International Data Transfers</h2>
            <p>
              Your data may be transferred to and processed in countries outside your residence, including
              the United States. We ensure appropriate safeguards are in place, including Standard Contractual
              Clauses approved by the European Commission, to protect your data during international transfers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Children&apos;s Privacy</h2>
            <p>
              BestMealMate is intended for users 18 years and older. We do not knowingly collect personal
              information from children under 13 (or 16 in the EEA). If we learn that we have collected
              data from a child, we will delete it promptly. If you believe a child has provided us with
              personal information, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Do Not Track</h2>
            <p>
              Some browsers have a &quot;Do Not Track&quot; feature. We currently do not respond to DNT signals,
              as there is no industry standard for handling them. However, we honor opt-out preferences
              set through your account settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">13. Changes to This Policy</h2>
            <p>
              We may update this privacy policy periodically. We will notify you of material changes by
              posting the new policy with an updated date and, for significant changes, sending an email
              notification. Continued use of the Service after changes constitutes acceptance of the
              updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">14. Contact Us</h2>
            <p className="mb-3">
              For privacy-related questions, requests, or complaints, contact our Data Protection Team:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><strong>Email:</strong>{' '}
                <a href="mailto:hello@bestmealmate.com" className="text-orange-600 hover:underline">
                  hello@bestmealmate.com
                </a>
              </p>
              <p><strong>General Support:</strong>{' '}
                <a href="mailto:hello@bestmealmate.com" className="text-orange-600 hover:underline">
                  hello@bestmealmate.com
                </a>
              </p>
              <p className="mt-2"><strong>Mailing Address:</strong><br />
                BestMealMate Privacy Team<br />
                [Company Address]
              </p>
            </div>
            <p className="mt-3 text-sm text-gray-600">
              If you are in the EEA and are not satisfied with our response, you have the right to
              lodge a complaint with your local Data Protection Authority.
            </p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t flex flex-wrap gap-4">
          <Link href="/" className="text-orange-600 hover:underline">← Back to Home</Link>
          <Link href="/terms" className="text-orange-600 hover:underline">Terms of Service</Link>
          <Link href="/cookies" className="text-orange-600 hover:underline">Cookie Policy</Link>
          <Link href="/privacy/rights" className="text-orange-600 hover:underline">Your Privacy Rights</Link>
        </div>
      </div>
    </div>
  )
}
