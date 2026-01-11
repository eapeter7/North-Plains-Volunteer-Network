import React from 'react';
import { Card, Button } from '../components/UI';

export const TermsOfService: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-brand-700 dark:text-white">Terms of Service</h1>
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
                        <h3 className="text-xl font-semibold mb-2">Website Terms of Service</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            <strong>Effective Date:</strong> January 8, 2026<br />
                            <strong>Last Updated:</strong> January 8, 2026
                        </p>
                    </div>

                    <section>
                        <h4 className="text-lg font-bold text-brand-600 dark:text-yellow-400 mb-2">1. Who We Are</h4>
                        <p>
                            North Plains Volunteer Network (“NPVN,” “we,” “us”) is a community volunteer coordination organization based in Oregon. NPVN provides a platform to connect volunteers with individuals, families, community groups, and nonprofit organizations seeking assistance (“Requests”).
                        </p>
                        <p className="mt-2">
                            The North Plains Senior Center (“NPSC”) may participate as a community partner, referral source, or host site. NPVN and NPSC are independent organizations.
                        </p>
                        <p className="mt-2">
                            NPVN is not a transportation provider, medical provider, home-care agency, contractor, or employer, and does not provide professional services.
                        </p>
                    </section>

                    <section>
                        <h4 className="text-lg font-bold text-brand-600 dark:text-yellow-400 mb-2">2. Acceptance of These Terms</h4>
                        <p>
                            By accessing or using the NPVN website, creating an account, submitting or accepting a Request, or participating in any activity connected to NPVN, you agree to these Terms of Service, the Privacy Policy, and the Participation Agreement, Release and Waiver of Liability.
                        </p>
                        <p className="mt-2 font-semibold">
                            If you do not agree, do not use the website or services.
                        </p>
                    </section>

                    <section>
                        <h4 className="text-lg font-bold text-brand-600 dark:text-yellow-400 mb-2">3. Eligibility and Accounts</h4>
                        <p>You agree to:</p>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                            <li>Provide accurate and complete information</li>
                            <li>Keep your account information current</li>
                            <li>Maintain the confidentiality of your login credentials</li>
                            <li>Notify NPVN of any unauthorized account use</li>
                        </ul>
                        <p className="mt-2">
                            Participants under 18 years of age may only participate with parent or legal guardian consent.
                        </p>
                        <p className="mt-2">
                            NPVN reserves the right to suspend or terminate accounts for violations of these Terms, safety concerns, or misuse of the platform.
                        </p>
                    </section>

                    <section>
                        <h4 className="text-lg font-bold text-brand-600 dark:text-yellow-400 mb-2">4. Screening and Background Checks</h4>
                        <p>
                            NPVN requires volunteers to complete an application process and may require background checks, identity verification, or other screening measures as a condition of participation.
                        </p>
                        <p className="mt-2">
                            Screening is intended to reduce risk but does not guarantee safety. NPVN and NPSC do not warrant or represent that any participant poses no risk to others.
                        </p>
                    </section>

                    <section>
                        <h4 className="text-lg font-bold text-brand-600 dark:text-yellow-400 mb-2">5. What NPVN Does and Does Not Do</h4>
                        <p>NPVN may provide tools to:</p>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                            <li>Post Requests and volunteer opportunities</li>
                            <li>Facilitate connections between participants</li>
                            <li>Share general guidance and community resources</li>
                        </ul>
                        <p className="mt-2">NPVN does not:</p>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                            <li>Guarantee fulfillment of any Request</li>
                            <li>Supervise, direct, or control participant actions</li>
                            <li>Guarantee participant conduct or outcomes</li>
                            <li>Provide emergency, medical, legal, financial, counseling, or licensed professional services</li>
                        </ul>
                    </section>

                    <section>
                        <h4 className="text-lg font-bold text-brand-600 dark:text-yellow-400 mb-2">6. Transportation Requests</h4>
                        <p>
                            Some Requests may involve transportation assistance, such as rides to appointments, grocery pickup, or delivery of items.
                        </p>
                        <p className="mt-2">
                            NPVN may facilitate connections for transportation-related Requests. However:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                            <li>Transportation is provided directly by individual volunteers</li>
                            <li>NPVN and NPSC do not own, operate, inspect, supervise, or insure any vehicle</li>
                            <li>NPVN and NPSC do not guarantee driver qualifications, licensure, insurance, or vehicle condition beyond any stated screening requirements</li>
                            <li>Drivers and riders are solely responsible for compliance with applicable laws, safety decisions, and insurance coverage</li>
                        </ul>
                        <p className="mt-2 font-semibold">
                            You assume all risks associated with providing or receiving transportation assistance.
                        </p>
                    </section>

                    <section>
                        <h4 className="text-lg font-bold text-brand-600 dark:text-yellow-400 mb-2">7. User Conduct and Safety</h4>
                        <p>You agree not to:</p>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                            <li>Misrepresent your identity, qualifications, or intentions</li>
                            <li>Harass, exploit, discriminate against, or threaten others</li>
                            <li>Post unlawful, unsafe, or deceptive Requests</li>
                            <li>Request or provide services requiring a license you do not have</li>
                            <li>Share highly sensitive information unnecessarily</li>
                        </ul>
                        <p className="mt-2">
                            NPVN may remove content or restrict access to protect participant safety.
                        </p>
                    </section>

                    <section>
                        <h4 className="text-lg font-bold text-brand-600 dark:text-yellow-400 mb-2">8. Health, Vulnerable Adults, and Emergencies</h4>
                        <p>
                            NPVN is not an emergency service. <strong>Call 911 for emergencies.</strong>
                        </p>
                        <p className="mt-2">
                            Requests involving health conditions, disability, memory care, or vulnerable individuals require participants to use good judgment and act lawfully. Volunteers must not represent themselves as professionals unless properly licensed.
                        </p>
                    </section>

                    <section>
                        <h4 className="text-lg font-bold text-brand-600 dark:text-yellow-400 mb-2">9. Communications Outside the Platform</h4>
                        <p>
                            NPVN uses a custom-built platform. Participants may communicate outside the platform, including by phone, text message, or email.
                        </p>
                        <p className="mt-2">
                            NPVN does not monitor or record off-platform communications. Participants are responsible for exercising caution and judgment in all interactions.
                        </p>
                    </section>

                    <section>
                        <h4 className="text-lg font-bold text-brand-600 dark:text-yellow-400 mb-2">10. Content You Submit</h4>
                        <p>
                            You retain ownership of content you submit but grant NPVN a non-exclusive, royalty-free license to use, display, and share it for operating and improving the platform.
                        </p>
                        <p className="mt-2">
                            You may only submit content you have the right to share.
                        </p>
                    </section>

                    <section>
                        <h4 className="text-lg font-bold text-brand-600 dark:text-yellow-400 mb-2">11. Third-Party Services</h4>
                        <p>
                            NPVN may use third-party service providers for hosting, security, background screening, analytics, and communications. NPVN is not responsible for third-party services or websites.
                        </p>
                    </section>

                    <section>
                        <h4 className="text-lg font-bold text-brand-600 dark:text-yellow-400 mb-2">12. Disclaimer of Warranties</h4>
                        <p className="uppercase font-semibold">
                            THE WEBSITE AND SERVICES ARE PROVIDED “AS IS” AND “AS AVAILABLE.” NPVN AND NPSC DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT, TO THE MAXIMUM EXTENT PERMITTED BY LAW.
                        </p>
                    </section>

                    <section>
                        <h4 className="text-lg font-bold text-brand-600 dark:text-yellow-400 mb-2">13. Limitation of Liability</h4>
                        <p>
                            To the fullest extent permitted by Oregon law, NPVN and NPSC are not liable for indirect, incidental, special, consequential, or punitive damages arising from:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                            <li>Use of the platform</li>
                            <li>Participant interactions</li>
                            <li>Activities coordinated through NPVN, including transportation</li>
                            <li>Acts or omissions of other participants or third parties</li>
                        </ul>
                    </section>

                    <section>
                        <h4 className="text-lg font-bold text-brand-600 dark:text-yellow-400 mb-2">14. Indemnification</h4>
                        <p>
                            You agree to indemnify and hold harmless NPVN and NPSC from claims, losses, damages, and expenses arising from your use of the platform, interactions with others, or violation of these Terms or the law.
                        </p>
                    </section>

                    <section>
                        <h4 className="text-lg font-bold text-brand-600 dark:text-yellow-400 mb-2">15. Termination</h4>
                        <p>
                            You may stop using NPVN at any time. NPVN may suspend or terminate access at its discretion for safety, compliance, or operational reasons.
                        </p>
                    </section>

                    <section>
                        <h4 className="text-lg font-bold text-brand-600 dark:text-yellow-400 mb-2">16. Governing Law</h4>
                        <p>
                            These Terms are governed by the laws of the State of Oregon. Venue lies in Oregon courts unless otherwise required by law.
                        </p>
                    </section>

                    <section className="border-t pt-6 dark:border-slate-700">
                        <h4 className="text-lg font-bold text-brand-600 dark:text-yellow-400 mb-2">17. Contact</h4>
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
