import React from 'react';
import { Card, Button } from '../components/UI';

export const PrivacyPolicy: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-brand-700 dark:text-white">Privacy Policy</h1>
                {onBack && (
                    <Button variant="outline" onClick={onBack}>
                        Back
                    </Button>
                )}
            </div>

            <Card className="p-8 prose dark:prose-invert max-w-none bg-white dark:bg-black border-slate-200 dark:border-slate-800">
                <div className="space-y-6 text-slate-700 dark:text-slate-300">
                    <div className="text-center border-b pb-6 dark:border-slate-700">
                        <h2 className="text-2xl font-bold mb-2">North Plains Volunteer Network</h2>
                        <h3 className="text-xl font-semibold mb-2">Privacy Policy</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            <strong>Effective Date:</strong> January 8, 2026<br />
                            <strong>Last Updated:</strong> January 8, 2026
                        </p>
                    </div>

                    <section>
                        <h4 className="text-lg font-bold text-brand-600 dark:text-yellow-400 mb-2">1. Overview</h4>
                        <p>
                            This Privacy Policy explains how North Plains Volunteer Network (“NPVN,” “we,” “us”) collects, uses, shares, and protects personal information when you use our website and services.
                        </p>
                    </section>

                    <section>
                        <h4 className="text-lg font-bold text-brand-600 dark:text-yellow-400 mb-2">2. Information We Collect</h4>

                        <h5 className="font-bold text-slate-800 dark:text-slate-200 mt-3">A. Information you provide</h5>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                            <li>Name, email address, phone number</li>
                            <li>General and precise location</li>
                            <li>Availability, skills, preferences</li>
                            <li>Requests and coordination details</li>
                            <li>Emergency contact information</li>
                        </ul>

                        <p className="mt-3 font-semibold text-sm">Sensitive information, which may include:</p>
                        <ul className="list-disc pl-5 space-y-1 mt-1 text-sm">
                            <li>Disability or functional limitations</li>
                            <li>Health-related needs relevant to services</li>
                            <li>Income or financial hardship indicators</li>
                            <li>Transportation needs</li>
                        </ul>

                        <h5 className="font-bold text-slate-800 dark:text-slate-200 mt-4">B. Information collected automatically</h5>
                        <p>IP address, device type, browser, pages viewed, timestamps</p>

                        <h5 className="font-bold text-slate-800 dark:text-slate-200 mt-4">C. Information from service providers</h5>
                        <p>Limited information from vendors that support hosting, security, background checks, and platform operations.</p>
                    </section>

                    <section>
                        <h4 className="text-lg font-bold text-brand-600 dark:text-yellow-400 mb-2">3. How We Use Information</h4>
                        <p>We use information to:</p>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                            <li>Create and manage accounts</li>
                            <li>Match volunteers with Requests</li>
                            <li>Coordinate services and logistics</li>
                            <li>Conduct screening and background checks</li>
                            <li>Improve safety, quality, and functionality</li>
                            <li>Comply with legal obligations</li>
                        </ul>
                    </section>

                    <section>
                        <h4 className="text-lg font-bold text-brand-600 dark:text-yellow-400 mb-2">4. How We Share Information</h4>
                        <p>We may share information:</p>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                            <li>With other participants when necessary to fulfill a Request</li>
                            <li>With service providers supporting platform operations, screening, and security</li>
                            <li>With community partners, such as the North Plains Senior Center, when relevant to coordination</li>
                            <li>When required by law or to protect safety, rights, or security</li>
                        </ul>
                        <p className="mt-2 font-semibold">We do not sell personal data.</p>
                    </section>

                    <section>
                        <h4 className="text-lg font-bold text-brand-600 dark:text-yellow-400 mb-2">5. Data Retention</h4>
                        <p>
                            We retain personal information only as long as reasonably necessary for operations, safety, compliance, and legal purposes.
                        </p>
                    </section>

                    <section>
                        <h4 className="text-lg font-bold text-brand-600 dark:text-yellow-400 mb-2">6. Security</h4>
                        <p>
                            We apply reasonable administrative, technical, and organizational safeguards, including enhanced protections for sensitive personal information. <strong>No system is completely secure.</strong>
                        </p>
                    </section>

                    <section>
                        <h4 className="text-lg font-bold text-brand-600 dark:text-yellow-400 mb-2">7. Data Breach Notification</h4>
                        <p>
                            If a data breach occurs, we will provide notice as required by applicable Oregon law.
                        </p>
                    </section>

                    <section>
                        <h4 className="text-lg font-bold text-brand-600 dark:text-yellow-400 mb-2">8. Cookies and Analytics</h4>
                        <p>
                            We may use cookies and similar technologies to support site functionality and understand usage patterns. You may control cookies through your browser settings.
                        </p>
                    </section>

                    <section>
                        <h4 className="text-lg font-bold text-brand-600 dark:text-yellow-400 mb-2">9. Children and Minors</h4>
                        <p>
                            NPVN services are not directed to children under 13. Participation by minors requires appropriate parent or guardian consent.
                        </p>
                    </section>

                    <section>
                        <h4 className="text-lg font-bold text-brand-600 dark:text-yellow-400 mb-2">10. Oregon Privacy Rights</h4>
                        <p>
                            Oregon residents may have rights under applicable law regarding access to, correction of, or deletion of personal data, including sensitive data. NPVN complies with applicable legal requirements.
                        </p>
                    </section>

                    <section>
                        <h4 className="text-lg font-bold text-brand-600 dark:text-yellow-400 mb-2">11. Changes to This Policy</h4>
                        <p>
                            We may update this Privacy Policy from time to time. Updates will be posted with a revised effective date.
                        </p>
                    </section>

                    <section className="border-t pt-6 dark:border-slate-700">
                        <h4 className="text-lg font-bold text-brand-600 dark:text-yellow-400 mb-2">12. Contact</h4>
                        <p>
                            <strong>North Plains Volunteer Network</strong><br />
                            Email: npvolunteernetwork@gmail.com<br />
                            Phone: 971-712-3845
                        </p>
                    </section>
                </div>
            </Card>

            <div className="flex justify-center pt-4">
                <p className="text-xs text-slate-400">
                    &copy; 2026 North Plains Volunteer Network
                </p>
            </div>
        </div>
    );
};
