import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Privacy Policy | StepEase",
    description: "Privacy Policy for StepEase - AI-powered SOP builder",
}

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-3xl mx-auto px-4 py-16">
                <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

                <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
                    <p className="text-muted-foreground">
                        Last updated: January 21, 2026
                    </p>

                    <section>
                        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
                        <p>
                            We collect information you provide directly to us, including:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Account information (name, email) through Clerk authentication</li>
                            <li>SOP content and notes you create</li>
                            <li>Chat conversations with the AI assistant</li>
                            <li>Usage data and analytics</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
                        <p>We use the information we collect to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Provide, maintain, and improve our services</li>
                            <li>Process and store your SOP documents</li>
                            <li>Send you technical notices and support messages</li>
                            <li>Respond to your comments and questions</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Data Storage</h2>
                        <p>
                            Your data is stored securely using Convex, a real-time database platform.
                            We implement appropriate security measures to protect your information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Third-Party Services</h2>
                        <p>We use the following third-party services:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Clerk</strong> - Authentication and user management</li>
                            <li><strong>Convex</strong> - Database and real-time sync</li>
                            <li><strong>Google AI / Groq</strong> - AI processing for SOP generation</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Your Rights</h2>
                        <p>You have the right to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Access your personal data</li>
                            <li>Delete your account and associated data</li>
                            <li>Export your SOP documents</li>
                            <li>Opt out of non-essential communications</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us at{" "}
                            <a href="mailto:privacy@stepease.com" className="text-primary hover:underline">
                                privacy@stepease.com
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
