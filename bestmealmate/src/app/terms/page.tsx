export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: December 27, 2024</p>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using BestMealMate, you agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Description of Service</h2>
            <p>
              BestMealMate is a meal planning application that helps families plan meals, track pantry items,
              generate grocery lists, and receive AI-powered meal suggestions based on available ingredients
              and dietary preferences.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. User Accounts</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>You must be at least 18 years old to create an account</li>
              <li>You are responsible for maintaining the security of your account</li>
              <li>You must provide accurate and complete information</li>
              <li>You are responsible for all activities under your account</li>
              <li>Notify us immediately of any unauthorized access</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Subscription and Payments</h2>
            <p className="mb-2">We offer the following subscription plans:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Free:</strong> Limited features, 1 family member, 5 recipes/week</li>
              <li><strong>Premium ($9.99/month):</strong> Up to 4 family members, AI chef, smart grocery lists</li>
              <li><strong>Family ($14.99/month):</strong> Unlimited family members, all features included</li>
            </ul>
            <p className="mt-3">
              Subscriptions are billed monthly and will automatically renew unless cancelled.
              You may cancel at any time through your account settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Refund Policy</h2>
            <p>
              We offer a 7-day money-back guarantee for new subscribers. If you are not satisfied
              with our service, contact us within 7 days of your first payment for a full refund.
              After this period, refunds are provided at our discretion.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Acceptable Use</h2>
            <p className="mb-2">You agree not to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Use the service for any illegal purpose</li>
              <li>Share your account credentials with others</li>
              <li>Attempt to access other users&apos; accounts</li>
              <li>Upload malicious content or attempt to harm the service</li>
              <li>Use automated tools to access the service without permission</li>
              <li>Resell or redistribute the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. AI-Generated Content</h2>
            <p>
              Our meal suggestions and recipes are generated using artificial intelligence.
              While we strive for accuracy, we do not guarantee that all suggestions will be
              suitable for your dietary needs. Always verify ingredients if you have allergies
              or specific dietary requirements.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Intellectual Property</h2>
            <p>
              BestMealMate and its original content, features, and functionality are owned by
              BestMealMate and are protected by international copyright, trademark, and other
              intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Limitation of Liability</h2>
            <p>
              BestMealMate is provided &quot;as is&quot; without warranties of any kind. We are not liable
              for any damages arising from your use of the service, including but not limited to
              dietary issues, allergic reactions, or any indirect, incidental, or consequential damages.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Termination</h2>
            <p>
              We reserve the right to terminate or suspend your account at any time for violations
              of these terms. You may also delete your account at any time through your account settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Changes to Terms</h2>
            <p>
              We may modify these terms at any time. We will notify users of significant changes
              via email or through the application. Continued use after changes constitutes
              acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Governing Law</h2>
            <p>
              These terms are governed by the laws of the United States. Any disputes will be
              resolved in the courts of the applicable jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">13. Contact</h2>
            <p>
              For questions about these terms, contact us at:
              <br />
              <a href="mailto:support@bestmealmate.com" className="text-orange-600 hover:underline">
                support@bestmealmate.com
              </a>
            </p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t">
          <a href="/" className="text-orange-600 hover:underline">← Back to Home</a>
        </div>
      </div>
    </div>
  )
}
