import Link from 'next/link'

export const metadata = {
  title: 'Your Privacy Rights | BestMealMate',
  description: 'Learn about your GDPR, CCPA, and other privacy rights with BestMealMate.',
}

export default function PrivacyRights() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Privacy Rights</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: December 28, 2024</p>

        <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
          <p className="text-sm text-gray-700">
            <strong>Quick Links:</strong>{' '}
            <Link href="/privacy" className="text-orange-600 hover:underline">Privacy Policy</Link> |{' '}
            <Link href="/terms" className="text-orange-600 hover:underline">Terms of Service</Link> |{' '}
            <Link href="/cookies" className="text-orange-600 hover:underline">Cookie Policy</Link>
          </p>
        </div>

        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Overview</h2>
            <p className="mb-3">
              At BestMealMate, we respect your privacy and are committed to providing you with control over
              your personal data. This page explains the specific rights you have under various privacy laws,
              including the General Data Protection Regulation (GDPR), California Consumer Privacy Act (CCPA),
              and other regional privacy regulations.
            </p>
            <p>
              Our goal is to make it easy for you to exercise these rights. If you have any questions or
              need assistance, please contact our privacy team.
            </p>
          </section>

          {/* GDPR Section */}
          <section className="border-l-4 border-blue-500 pl-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">GDPR</span>
              Rights for EU/EEA/UK Residents
            </h2>
            <p className="mb-4">
              If you are located in the European Union, European Economic Area, United Kingdom, or Switzerland,
              the General Data Protection Regulation (GDPR) and UK GDPR grant you the following rights:
            </p>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Right to Access (Article 15)</h3>
                <p className="text-sm">
                  You can request a copy of all personal data we hold about you. We will provide this
                  information free of charge within 30 days. You&apos;ll receive a structured, commonly used,
                  machine-readable format (JSON or CSV).
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Right to Rectification (Article 16)</h3>
                <p className="text-sm">
                  You can request correction of inaccurate personal data or completion of incomplete data.
                  Most corrections can be made directly in your account settings.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Right to Erasure &quot;Right to be Forgotten&quot; (Article 17)</h3>
                <p className="text-sm">
                  You can request deletion of your personal data when it&apos;s no longer necessary, you withdraw
                  consent, or you object to processing. Some data may be retained for legal obligations
                  (e.g., payment records for tax purposes).
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Right to Restrict Processing (Article 18)</h3>
                <p className="text-sm">
                  You can request that we limit how we use your data while we verify accuracy or resolve
                  a dispute. During restriction, we will only store your data, not process it.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Right to Data Portability (Article 20)</h3>
                <p className="text-sm">
                  You can request your data in a structured, machine-readable format and have it transmitted
                  to another controller. This includes your recipes, meal plans, pantry items, and preferences.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Right to Object (Article 21)</h3>
                <p className="text-sm">
                  You can object to processing based on legitimate interests or for direct marketing purposes.
                  We will stop processing unless we have compelling legitimate grounds.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Right to Withdraw Consent</h3>
                <p className="text-sm">
                  Where processing is based on consent (e.g., marketing emails, health data), you can
                  withdraw consent at any time. This won&apos;t affect the lawfulness of prior processing.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Right to Lodge a Complaint</h3>
                <p className="text-sm">
                  If you believe we have violated your rights, you can lodge a complaint with your local
                  Data Protection Authority (DPA). We encourage you to contact us first so we can address
                  your concerns directly.
                </p>
              </div>
            </div>
          </section>

          {/* CCPA Section */}
          <section className="border-l-4 border-yellow-500 pl-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">CCPA/CPRA</span>
              Rights for California Residents
            </h2>
            <p className="mb-4">
              If you are a California resident, the California Consumer Privacy Act (CCPA) and California
              Privacy Rights Act (CPRA) provide you with specific rights regarding your personal information:
            </p>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Right to Know</h3>
                <p className="text-sm mb-2">You can request disclosure of:</p>
                <ul className="list-disc pl-6 text-sm space-y-1">
                  <li>Categories of personal information collected</li>
                  <li>Specific pieces of personal information collected</li>
                  <li>Categories of sources from which information is collected</li>
                  <li>Business purposes for collecting or selling information</li>
                  <li>Categories of third parties with whom information is shared</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Right to Delete</h3>
                <p className="text-sm">
                  You can request deletion of your personal information, subject to certain exceptions
                  (e.g., completing transactions, detecting security incidents, legal obligations).
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Right to Correct</h3>
                <p className="text-sm">
                  You can request correction of inaccurate personal information we maintain about you.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Right to Opt-Out of Sale/Sharing</h3>
                <div className="bg-green-50 p-3 rounded border border-green-200 mt-2">
                  <p className="text-sm text-green-800">
                    <strong>BestMealMate does not sell your personal information.</strong> We also do not
                    share your personal information for cross-context behavioral advertising.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Right to Limit Use of Sensitive Personal Information</h3>
                <p className="text-sm">
                  We only use sensitive personal information (like health data from wearables) for
                  purposes you explicitly consent to. You can limit or revoke this consent at any time.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Right to Non-Discrimination</h3>
                <p className="text-sm">
                  We will not discriminate against you for exercising your CCPA rights. You will not
                  receive different prices, quality of service, or be denied service for making requests.
                </p>
              </div>
            </div>

            <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">California Disclosure</h3>
            <p className="text-sm mb-3">
              In the preceding 12 months, we have collected the following categories of personal information:
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left border-b">Category</th>
                    <th className="px-4 py-2 text-left border-b">Examples</th>
                    <th className="px-4 py-2 text-left border-b">Sold?</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b">Identifiers</td>
                    <td className="px-4 py-2 border-b">Name, email, IP address</td>
                    <td className="px-4 py-2 border-b text-green-600">No</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b">Commercial Information</td>
                    <td className="px-4 py-2 border-b">Subscription history, payment records</td>
                    <td className="px-4 py-2 border-b text-green-600">No</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b">Internet Activity</td>
                    <td className="px-4 py-2 border-b">Browsing history, feature usage</td>
                    <td className="px-4 py-2 border-b text-green-600">No</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b">Sensory Data</td>
                    <td className="px-4 py-2 border-b">Food scanner images (not stored)</td>
                    <td className="px-4 py-2 border-b text-green-600">No</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Sensitive Personal Info</td>
                    <td className="px-4 py-2">Health data (with consent only)</td>
                    <td className="px-4 py-2 text-green-600">No</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Other Jurisdictions */}
          <section className="border-l-4 border-purple-500 pl-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Other Regions</span>
              Additional Privacy Rights
            </h2>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Virginia (VCDPA), Colorado (CPA), Connecticut (CTDPA)</h3>
                <p className="text-sm">
                  Residents of these states have similar rights to access, correct, delete, and port their
                  data, as well as opt out of targeted advertising (which we do not engage in).
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Brazil (LGPD)</h3>
                <p className="text-sm">
                  Brazilian residents have rights similar to GDPR, including access, correction, deletion,
                  portability, and the right to information about data sharing.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Canada (PIPEDA)</h3>
                <p className="text-sm">
                  Canadian residents can access their personal information, challenge its accuracy, and
                  withdraw consent for its use.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Australia (Privacy Act)</h3>
                <p className="text-sm">
                  Australian residents can access and correct their personal information under the
                  Australian Privacy Principles (APPs).
                </p>
              </div>
            </div>
          </section>

          {/* How to Exercise Rights */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">How to Exercise Your Rights</h2>

            <div className="space-y-4">
              <div className="p-4 border-2 border-orange-300 rounded-lg bg-orange-50">
                <h3 className="font-semibold text-gray-900 mb-2">Submit a Request</h3>
                <p className="text-sm mb-3">
                  To exercise any of your privacy rights, you can:
                </p>
                <ul className="list-disc pl-6 text-sm space-y-1">
                  <li>
                    <strong>Email:</strong>{' '}
                    <a href="mailto:privacy@bestmealmate.com" className="text-orange-600 hover:underline">
                      privacy@bestmealmate.com
                    </a>
                  </li>
                  <li>
                    <strong>Account Settings:</strong> Access, correct, or delete data directly in your
                    account settings (Dashboard → Settings → Privacy)
                  </li>
                  <li>
                    <strong>Data Export:</strong> Request a full export of your data in JSON format
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Verification Process</h3>
                <p className="text-sm">
                  To protect your privacy, we will verify your identity before processing requests. This
                  may include confirming your email address, account details, or other information. For
                  authorized agents, we require written authorization from the account holder.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Response Timeline</h3>
                <ul className="list-disc pl-6 text-sm space-y-1">
                  <li><strong>GDPR requests:</strong> Responded to within 30 days (may extend to 60 days for complex requests)</li>
                  <li><strong>CCPA requests:</strong> Responded to within 45 days (may extend to 90 days with notice)</li>
                  <li><strong>Other requests:</strong> Responded to within 30-45 days</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Request Limits</h3>
                <p className="text-sm">
                  You may make up to 2 data access requests per 12-month period. Deletion, correction,
                  and other requests have no limits. There is no fee for these requests unless they are
                  manifestly unfounded or excessive.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact Our Privacy Team</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><strong>Data Protection Officer:</strong>{' '}
                <a href="mailto:dpo@bestmealmate.com" className="text-orange-600 hover:underline">
                  dpo@bestmealmate.com
                </a>
              </p>
              <p><strong>Privacy Inquiries:</strong>{' '}
                <a href="mailto:privacy@bestmealmate.com" className="text-orange-600 hover:underline">
                  privacy@bestmealmate.com
                </a>
              </p>
              <p><strong>General Support:</strong>{' '}
                <a href="mailto:support@bestmealmate.com" className="text-orange-600 hover:underline">
                  support@bestmealmate.com
                </a>
              </p>
              <p className="mt-2"><strong>Mailing Address:</strong><br />
                BestMealMate Privacy Team<br />
                [Company Address]
              </p>
            </div>
            <p className="mt-3 text-sm text-gray-600">
              For EU residents: If you are not satisfied with our response, you may lodge a complaint
              with your local Data Protection Authority. A list of DPAs can be found at{' '}
              <a
                href="https://edpb.europa.eu/about-edpb/about-edpb/members_en"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 hover:underline"
              >
                edpb.europa.eu
              </a>.
            </p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t flex flex-wrap gap-4">
          <Link href="/" className="text-orange-600 hover:underline">← Back to Home</Link>
          <Link href="/privacy" className="text-orange-600 hover:underline">Privacy Policy</Link>
          <Link href="/terms" className="text-orange-600 hover:underline">Terms of Service</Link>
          <Link href="/cookies" className="text-orange-600 hover:underline">Cookie Policy</Link>
        </div>
      </div>
    </div>
  )
}
