import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service | BestMealMate',
  description: 'Terms and conditions for using BestMealMate meal planning service.',
}

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: December 28, 2024</p>

        <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
          <p className="text-sm text-gray-700">
            <strong>Quick Links:</strong>{' '}
            <Link href="/privacy" className="text-orange-600 hover:underline">Privacy Policy</Link> |{' '}
            <Link href="/cookies" className="text-orange-600 hover:underline">Cookie Policy</Link> |{' '}
            <Link href="/privacy/rights" className="text-orange-600 hover:underline">Your Privacy Rights</Link>
          </p>
        </div>

        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p className="mb-3">
              By accessing or using BestMealMate (&quot;Service&quot;), you agree to be bound by these Terms of Service
              (&quot;Terms&quot;). If you do not agree to these terms, please do not use our Service.
            </p>
            <p>
              These Terms constitute a legally binding agreement between you and BestMealMate. We may update
              these Terms periodically, and your continued use of the Service constitutes acceptance of any changes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Description of Service</h2>
            <p className="mb-3">
              BestMealMate is a comprehensive meal planning application that helps families:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Plan meals based on available ingredients and dietary preferences</li>
              <li>Track pantry and refrigerator inventory using AI-powered food scanning</li>
              <li>Generate smart grocery lists</li>
              <li>Receive AI-powered meal suggestions from our virtual AI Chef</li>
              <li>Manage family member profiles with individual dietary needs</li>
              <li>Connect wearable devices for personalized health-based nutrition recommendations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. User Accounts</h2>
            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">3.1 Eligibility</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must be at least 18 years old to create an account</li>
              <li>You must have the legal capacity to enter into this agreement</li>
              <li>Accounts created on behalf of businesses must have authority to bind the organization</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">3.2 Account Responsibilities</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>You are responsible for maintaining the security of your account credentials</li>
              <li>You must provide accurate and complete registration information</li>
              <li>You are responsible for all activities that occur under your account</li>
              <li>You must notify us immediately of any unauthorized access</li>
              <li>We reserve the right to suspend or terminate accounts that violate these Terms</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Subscription Plans and Payments</h2>
            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">4.1 Available Plans</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left border-b">Plan</th>
                    <th className="px-4 py-2 text-left border-b">Price</th>
                    <th className="px-4 py-2 text-left border-b">Features</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b font-medium">Free</td>
                    <td className="px-4 py-2 border-b">$0/month</td>
                    <td className="px-4 py-2 border-b">1 family member, 5 recipes/week, basic features</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b font-medium">Premium</td>
                    <td className="px-4 py-2 border-b">$9.99/month</td>
                    <td className="px-4 py-2 border-b">Up to 4 family members, AI chef, smart grocery lists, food scanner</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium">Family</td>
                    <td className="px-4 py-2">$14.99/month</td>
                    <td className="px-4 py-2">Unlimited family members, all features, wearable integration, priority support</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">4.2 Billing Terms</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Subscriptions are billed monthly on the anniversary of your signup date</li>
              <li>Subscriptions automatically renew unless cancelled before the renewal date</li>
              <li>Payments are processed securely through Stripe</li>
              <li>Prices may change with 30 days&apos; notice; existing subscribers are grandfathered for their current billing cycle</li>
              <li>Failed payments may result in service interruption after a 7-day grace period</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">4.3 Cancellation</h3>
            <p>
              You may cancel your subscription at any time through your account settings. Upon cancellation:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>You retain access to paid features until the end of your current billing period</li>
              <li>Your account reverts to the Free plan after the paid period ends</li>
              <li>No partial refunds are provided for unused portions of a billing period</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Refund Policy</h2>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
              <p className="font-medium text-green-800">7-Day Money-Back Guarantee</p>
              <p className="text-sm text-green-700 mt-1">
                New subscribers can request a full refund within 7 days of their first payment.
              </p>
            </div>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>New Subscribers:</strong> Full refund available within 7 days of first payment</li>
              <li><strong>Renewals:</strong> Refunds for renewal payments are provided at our discretion</li>
              <li><strong>Disputes:</strong> Contact support before initiating a chargeback; we will work to resolve issues</li>
              <li><strong>Processing:</strong> Approved refunds are processed within 5-10 business days</li>
            </ul>
            <p className="mt-3">
              To request a refund, email{' '}
              <a href="mailto:billing@bestmealmate.com" className="text-orange-600 hover:underline">
                billing@bestmealmate.com
              </a>{' '}
              with your account email and reason for the request.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Acceptable Use Policy</h2>
            <p className="mb-3">You agree NOT to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the Service for any illegal or unauthorized purpose</li>
              <li>Share your account credentials with others or allow unauthorized access</li>
              <li>Attempt to access other users&apos; accounts or data</li>
              <li>Upload malicious content, viruses, or harmful code</li>
              <li>Attempt to reverse engineer, decompile, or hack the Service</li>
              <li>Use automated tools, bots, or scrapers without permission</li>
              <li>Resell, redistribute, or sublicense the Service</li>
              <li>Circumvent any usage limits or access controls</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Upload false, misleading, or inappropriate content</li>
            </ul>
            <p className="mt-3 text-sm text-gray-600">
              Violation of these policies may result in immediate account termination without refund.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. AI-Generated Content Disclaimer</h2>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4">
              <p className="font-medium text-yellow-800">Important Health Notice</p>
              <p className="text-sm text-yellow-700 mt-1">
                AI-generated meal suggestions and nutritional information are for informational purposes only
                and should not replace professional medical or dietary advice.
              </p>
            </div>
            <ul className="list-disc pl-6 space-y-2">
              <li>Meal suggestions are generated using artificial intelligence and may not be perfectly accurate</li>
              <li>Nutritional estimates are approximations and may vary from actual values</li>
              <li>Always verify ingredients if you have food allergies, intolerances, or specific dietary requirements</li>
              <li>We do not guarantee that AI suggestions will meet your specific health needs</li>
              <li>Consult a healthcare professional before making significant dietary changes</li>
              <li>The food scanner may occasionally misidentify items; always verify results</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Wearable Device Integration</h2>
            <p className="mb-3">
              If you choose to connect wearable devices or health apps to BestMealMate:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You authorize us to access the health data you explicitly grant permission for</li>
              <li>Health data is used solely to provide personalized nutrition recommendations</li>
              <li>We do not share your health data with third parties for marketing purposes</li>
              <li>You can disconnect devices at any time through your account settings</li>
              <li>Disconnecting will delete synced health data within 30 days</li>
              <li>Activity-based recommendations are suggestions only and should not replace medical advice</li>
            </ul>
            <p className="mt-3 text-sm text-gray-600">
              See our <Link href="/privacy" className="text-orange-600 hover:underline">Privacy Policy</Link> for
              detailed information about health data handling.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Intellectual Property</h2>
            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">9.1 Our Property</h3>
            <p>
              BestMealMate and its original content, features, functionality, branding, and technology are owned
              by BestMealMate and are protected by international copyright, trademark, patent, trade secret,
              and other intellectual property laws.
            </p>

            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">9.2 Your Content</h3>
            <p>
              You retain ownership of content you create (recipes, meal plans, notes). By using the Service,
              you grant us a limited license to store, display, and process your content to provide the Service.
            </p>

            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">9.3 Feedback</h3>
            <p>
              Any feedback, suggestions, or ideas you provide may be used by us without obligation or compensation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Limitation of Liability</h2>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="uppercase text-sm font-medium text-gray-700 mb-2">Disclaimer</p>
              <p className="text-sm">
                THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND,
                EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY,
                FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
            </div>
            <p className="mt-4 mb-3">We are NOT liable for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Dietary issues, allergic reactions, or health problems resulting from meal suggestions</li>
              <li>Inaccurate nutritional information or food identification errors</li>
              <li>Any indirect, incidental, special, consequential, or punitive damages</li>
              <li>Loss of data, profits, or business opportunities</li>
              <li>Service interruptions or downtime</li>
              <li>Third-party actions or content</li>
            </ul>
            <p className="mt-3 text-sm text-gray-600">
              Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless BestMealMate, its officers, directors, employees,
              and agents from any claims, damages, losses, liabilities, and expenses (including legal fees)
              arising from your use of the Service or violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Termination</h2>
            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">12.1 By You</h3>
            <p>
              You may delete your account at any time through your account settings or by contacting support.
            </p>

            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">12.2 By Us</h3>
            <p>
              We reserve the right to suspend or terminate your account immediately and without notice for:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Violation of these Terms or Acceptable Use Policy</li>
              <li>Fraudulent or illegal activity</li>
              <li>Non-payment after the grace period</li>
              <li>Extended inactivity (accounts inactive for 24+ months may be deleted)</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">12.3 Effect of Termination</h3>
            <p>
              Upon termination, your right to use the Service ceases immediately. We may delete your data
              according to our data retention policy. Provisions that should survive termination (including
              limitation of liability and dispute resolution) will remain in effect.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">13. Dispute Resolution</h2>
            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">13.1 Informal Resolution</h3>
            <p>
              Before filing any formal dispute, you agree to contact us at{' '}
              <a href="mailto:legal@bestmealmate.com" className="text-orange-600 hover:underline">
                legal@bestmealmate.com
              </a>{' '}
              and attempt to resolve the dispute informally for at least 30 days.
            </p>

            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">13.2 Arbitration Agreement</h3>
            <p>
              Any disputes that cannot be resolved informally shall be resolved through binding arbitration
              in accordance with the rules of the American Arbitration Association. You waive your right to
              participate in class actions or class arbitrations.
            </p>

            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">13.3 Exceptions</h3>
            <p>
              Either party may seek injunctive relief in court for intellectual property infringement or
              other urgent matters.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">14. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the State of Delaware, United States, without regard
              to conflict of law principles. For users outside the United States, local mandatory consumer
              protection laws may apply.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">15. Changes to Terms</h2>
            <p>
              We may modify these Terms at any time. We will provide notice of material changes via email
              or prominent notice in the Service at least 30 days before they take effect. Continued use
              after the effective date constitutes acceptance. If you disagree with changes, you may
              cancel your account before the effective date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">16. Miscellaneous</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Entire Agreement:</strong> These Terms, along with the Privacy Policy and Cookie Policy,
                constitute the entire agreement between you and BestMealMate</li>
              <li><strong>Severability:</strong> If any provision is found unenforceable, the remaining provisions
                remain in effect</li>
              <li><strong>Waiver:</strong> Failure to enforce any provision is not a waiver of future enforcement</li>
              <li><strong>Assignment:</strong> You may not assign these Terms; we may assign them in a business transfer</li>
              <li><strong>Force Majeure:</strong> We are not liable for failures due to circumstances beyond our control</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">17. Contact Information</h2>
            <p className="mb-3">For questions about these Terms, contact us:</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><strong>Legal Inquiries:</strong>{' '}
                <a href="mailto:legal@bestmealmate.com" className="text-orange-600 hover:underline">
                  legal@bestmealmate.com
                </a>
              </p>
              <p><strong>Billing Questions:</strong>{' '}
                <a href="mailto:billing@bestmealmate.com" className="text-orange-600 hover:underline">
                  billing@bestmealmate.com
                </a>
              </p>
              <p><strong>General Support:</strong>{' '}
                <a href="mailto:support@bestmealmate.com" className="text-orange-600 hover:underline">
                  support@bestmealmate.com
                </a>
              </p>
              <p className="mt-2"><strong>Mailing Address:</strong><br />
                BestMealMate Legal Department<br />
                [Company Address]
              </p>
            </div>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t flex flex-wrap gap-4">
          <Link href="/" className="text-orange-600 hover:underline">← Back to Home</Link>
          <Link href="/privacy" className="text-orange-600 hover:underline">Privacy Policy</Link>
          <Link href="/cookies" className="text-orange-600 hover:underline">Cookie Policy</Link>
          <Link href="/privacy/rights" className="text-orange-600 hover:underline">Your Privacy Rights</Link>
        </div>
      </div>
    </div>
  )
}
