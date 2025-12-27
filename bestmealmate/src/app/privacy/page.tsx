export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: December 27, 2024</p>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
            <p>
              Welcome to BestMealMate. We respect your privacy and are committed to protecting your personal data.
              This privacy policy explains how we collect, use, and safeguard your information when you use our
              meal planning application.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Information We Collect</h2>
            <p className="mb-2">We collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Account Information:</strong> Name, email address, and password when you create an account</li>
              <li><strong>Family Profiles:</strong> Names and dietary restrictions of family members you add</li>
              <li><strong>Food Data:</strong> Pantry items, recipes, meal plans, and grocery lists you create</li>
              <li><strong>Payment Information:</strong> Processed securely through Stripe (we do not store card numbers)</li>
              <li><strong>Usage Data:</strong> How you interact with our app to improve our services</li>
              <li><strong>Images:</strong> Photos you take using the food scanner feature (processed for AI analysis)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Provide personalized meal suggestions based on your pantry and preferences</li>
              <li>Generate grocery lists and meal plans for your household</li>
              <li>Process subscription payments securely</li>
              <li>Send important updates about your account and our services</li>
              <li>Improve our AI-powered features and user experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Data Storage and Security</h2>
            <p>
              Your data is stored securely using Supabase, a trusted database provider with enterprise-grade security.
              We use encryption in transit (HTTPS) and at rest. Payment processing is handled by Stripe,
              a PCI-DSS compliant payment processor.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Third-Party Services</h2>
            <p className="mb-2">We use the following third-party services:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Supabase:</strong> Database and authentication</li>
              <li><strong>Stripe:</strong> Payment processing</li>
              <li><strong>Anthropic (Claude AI):</strong> Meal suggestions and food recognition</li>
              <li><strong>Vercel:</strong> Website hosting</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Your Rights</h2>
            <p className="mb-2">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your account and associated data</li>
              <li>Export your data</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Cookies</h2>
            <p>
              We use essential cookies to maintain your session and remember your preferences.
              We do not use tracking cookies for advertising purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Children&apos;s Privacy</h2>
            <p>
              Our service is intended for users 18 years and older. We do not knowingly collect
              personal information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes
              by posting the new policy on this page and updating the &quot;Last updated&quot; date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Contact Us</h2>
            <p>
              If you have any questions about this privacy policy, please contact us at:
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
