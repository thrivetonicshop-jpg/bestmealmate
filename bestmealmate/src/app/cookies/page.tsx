import Link from 'next/link'

export const metadata = {
  title: 'Cookie Policy | BestMealMate',
  description: 'Learn about how BestMealMate uses cookies and similar technologies.',
}

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: December 28, 2024</p>

        <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
          <p className="text-sm text-gray-700">
            <strong>Quick Links:</strong>{' '}
            <Link href="/privacy" className="text-orange-600 hover:underline">Privacy Policy</Link> |{' '}
            <Link href="/terms" className="text-orange-600 hover:underline">Terms of Service</Link> |{' '}
            <Link href="/privacy/rights" className="text-orange-600 hover:underline">Your Privacy Rights</Link>
          </p>
        </div>

        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. What Are Cookies?</h2>
            <p className="mb-3">
              Cookies are small text files that are stored on your device (computer, tablet, or mobile phone)
              when you visit a website. They help the website remember your preferences, understand how you
              use the site, and improve your experience.
            </p>
            <p>
              This Cookie Policy explains what cookies we use, why we use them, and how you can control them.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Types of Cookies We Use</h2>

            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">2.1 Essential Cookies</h3>
            <p className="mb-2">
              These cookies are necessary for the website to function and cannot be disabled. They include:
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 text-sm mt-2">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left border-b">Cookie Name</th>
                    <th className="px-4 py-2 text-left border-b">Purpose</th>
                    <th className="px-4 py-2 text-left border-b">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b font-mono text-xs">sb-access-token</td>
                    <td className="px-4 py-2 border-b">Authentication session</td>
                    <td className="px-4 py-2 border-b">Session</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-mono text-xs">sb-refresh-token</td>
                    <td className="px-4 py-2 border-b">Refresh authentication</td>
                    <td className="px-4 py-2 border-b">7 days</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-mono text-xs">__stripe_mid</td>
                    <td className="px-4 py-2 border-b">Payment fraud prevention</td>
                    <td className="px-4 py-2 border-b">1 year</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-mono text-xs">__stripe_sid</td>
                    <td className="px-4 py-2">Payment session</td>
                    <td className="px-4 py-2">30 minutes</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-medium text-gray-800 mt-6 mb-2">2.2 Functional Cookies</h3>
            <p className="mb-2">
              These cookies enable enhanced functionality and personalization:
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 text-sm mt-2">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left border-b">Cookie Name</th>
                    <th className="px-4 py-2 text-left border-b">Purpose</th>
                    <th className="px-4 py-2 text-left border-b">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b font-mono text-xs">user_preferences</td>
                    <td className="px-4 py-2 border-b">Remember display preferences</td>
                    <td className="px-4 py-2 border-b">1 year</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-mono text-xs">selected_household</td>
                    <td className="px-4 py-2 border-b">Remember active household</td>
                    <td className="px-4 py-2 border-b">30 days</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-mono text-xs">cookie_consent</td>
                    <td className="px-4 py-2">Remember cookie preferences</td>
                    <td className="px-4 py-2">1 year</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-medium text-gray-800 mt-6 mb-2">2.3 Analytics Cookies</h3>
            <p className="mb-2">
              These cookies help us understand how visitors interact with our website. We use privacy-focused
              analytics that do not track individuals across websites:
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 text-sm mt-2">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left border-b">Cookie Name</th>
                    <th className="px-4 py-2 text-left border-b">Purpose</th>
                    <th className="px-4 py-2 text-left border-b">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 font-mono text-xs">_vercel_insights</td>
                    <td className="px-4 py-2">Anonymous page view analytics</td>
                    <td className="px-4 py-2">Session</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                <strong>We do NOT use:</strong> Advertising cookies, third-party tracking cookies,
                or cookies that follow you across other websites. Your privacy is our priority.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Third-Party Cookies</h2>
            <p className="mb-3">
              Some cookies are set by third-party services we use to operate BestMealMate:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Supabase:</strong> Authentication cookies to keep you logged in
              </li>
              <li>
                <strong>Stripe:</strong> Payment security cookies to protect transactions and prevent fraud
              </li>
              <li>
                <strong>Vercel:</strong> Hosting and performance cookies for optimal site performance
              </li>
            </ul>
            <p className="mt-3 text-sm text-gray-600">
              These third parties have their own privacy policies governing how they use cookies.
              We recommend reviewing their policies for more information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Local Storage and Session Storage</h2>
            <p className="mb-3">
              In addition to cookies, we use browser storage technologies:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Local Storage:</strong> Stores user preferences and cached data that persists
                across browser sessions (e.g., theme preferences, draft grocery lists)
              </li>
              <li>
                <strong>Session Storage:</strong> Stores temporary data that is cleared when you close
                your browser (e.g., current food scanner session)
              </li>
            </ul>
            <p className="mt-3 text-sm text-gray-600">
              You can clear this data through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Managing Cookie Preferences</h2>

            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">5.1 Browser Settings</h3>
            <p className="mb-3">
              Most web browsers allow you to control cookies through their settings. You can:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>View and delete existing cookies</li>
              <li>Block all cookies or only third-party cookies</li>
              <li>Set preferences for specific websites</li>
              <li>Receive notifications when cookies are set</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">5.2 Browser-Specific Instructions</h3>
            <div className="grid md:grid-cols-2 gap-3 mt-3">
              <a
                href="https://support.google.com/chrome/answer/95647"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 border rounded-lg hover:bg-gray-50 transition"
              >
                <strong>Chrome</strong>
                <p className="text-sm text-gray-600">Manage cookies in Chrome settings</p>
              </a>
              <a
                href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 border rounded-lg hover:bg-gray-50 transition"
              >
                <strong>Firefox</strong>
                <p className="text-sm text-gray-600">Cookie settings in Firefox</p>
              </a>
              <a
                href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 border rounded-lg hover:bg-gray-50 transition"
              >
                <strong>Safari</strong>
                <p className="text-sm text-gray-600">Safari cookie preferences</p>
              </a>
              <a
                href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 border rounded-lg hover:bg-gray-50 transition"
              >
                <strong>Edge</strong>
                <p className="text-sm text-gray-600">Edge cookie management</p>
              </a>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Disabling essential cookies may prevent you from using certain
                features of BestMealMate, including logging in and making payments.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Mobile App Cookies</h2>
            <p>
              If you access BestMealMate through a mobile browser, cookies work similarly to desktop browsers.
              You can manage cookie preferences through your mobile browser settings. Native app versions
              (if available) may use similar technologies like device identifiers, which can be managed
              through your device&apos;s privacy settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Cookie Consent (EU/UK Users)</h2>
            <p className="mb-3">
              For users in the European Union, United Kingdom, and other regions with cookie consent requirements:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>We display a cookie consent banner on your first visit</li>
              <li>Essential cookies are set by default (necessary for the site to function)</li>
              <li>Non-essential cookies require your explicit consent</li>
              <li>You can withdraw consent at any time through your account settings</li>
              <li>Your consent preferences are stored for 12 months</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes in our practices or
              for legal, operational, or regulatory reasons. We will post any changes on this page with
              an updated revision date. For significant changes, we may also notify you via email or
              through a prominent notice on our website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Contact Us</h2>
            <p className="mb-3">
              If you have questions about our use of cookies, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><strong>Email:</strong>{' '}
                <a href="mailto:privacy@bestmealmate.com" className="text-orange-600 hover:underline">
                  privacy@bestmealmate.com
                </a>
              </p>
              <p><strong>General Support:</strong>{' '}
                <a href="mailto:support@bestmealmate.com" className="text-orange-600 hover:underline">
                  support@bestmealmate.com
                </a>
              </p>
            </div>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t flex flex-wrap gap-4">
          <Link href="/" className="text-orange-600 hover:underline">← Back to Home</Link>
          <Link href="/privacy" className="text-orange-600 hover:underline">Privacy Policy</Link>
          <Link href="/terms" className="text-orange-600 hover:underline">Terms of Service</Link>
          <Link href="/privacy/rights" className="text-orange-600 hover:underline">Your Privacy Rights</Link>
        </div>
      </div>
    </div>
  )
}
