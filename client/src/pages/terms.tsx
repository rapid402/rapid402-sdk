import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfService() {
  return (
    <div className="container mx-auto max-w-4xl px-6 md:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-sm text-muted-foreground">Last updated: October 29, 2025</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Agreement to Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p>
              By accessing or using Rapid402's x402 payment facilitator services, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use our services.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Description</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p>
              Rapid402 provides an x402 payment facilitator service that enables developers to:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Verify cryptographically signed payment payloads</li>
              <li>Settle payments on the Solana blockchain</li>
              <li>Integrate x402 protocol into their applications</li>
              <li>Access our SDK and API documentation</li>
            </ul>
            <p className="text-muted-foreground">
              Our services are provided on an "as-is" and "as-available" basis. We do not guarantee uninterrupted or error-free operation.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Eligibility</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p>To use our services, you must:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Be at least 18 years old or the age of majority in your jurisdiction</li>
              <li>Have the legal capacity to enter into binding contracts</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Not be prohibited from using our services under applicable laws</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Usage and Limitations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Acceptable Use</h4>
              <p className="text-muted-foreground mb-2">You agree to:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Use our API for legitimate x402 payment processing</li>
                <li>Implement reasonable rate limiting in your applications</li>
                <li>Not attempt to bypass security measures or rate limits</li>
                <li>Not use our services for illegal or fraudulent activities</li>
                <li>Not reverse engineer or attempt to extract source code</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Prohibited Activities</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Submitting false or misleading payment information</li>
                <li>Attempting to disrupt or overload our infrastructure</li>
                <li>Using our services to facilitate money laundering</li>
                <li>Violating any applicable financial regulations</li>
                <li>Infringing on intellectual property rights</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Processing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p>
              When using our payment facilitator services:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>You are responsible for all transaction fees on the Solana network</li>
              <li>Transactions are final once settled on the blockchain</li>
              <li>We do not custody funds - all settlements go directly to specified wallets</li>
              <li>You must comply with all applicable payment regulations</li>
              <li>You are responsible for tax reporting and compliance</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p>
              Rapid402 is open-source software licensed under the MIT License. This means:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>You may use, modify, and distribute our code</li>
              <li>You must include the original copyright notice</li>
              <li>The software is provided without warranty</li>
              <li>Our branding and trademarks remain our property</li>
            </ul>
            <p className="text-muted-foreground">
              The Rapid402 name, logo, and branding are trademarks. You may not use them without permission except as necessary to reference our services.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Disclaimers and Limitations of Liability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">No Warranty</h4>
              <p className="text-muted-foreground">
                OUR SERVICES ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Limitation of Liability</h4>
              <p className="text-muted-foreground">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, RAPID402 SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, DATA, OR USE, ARISING OUT OF OR RELATED TO THESE TERMS OR OUR SERVICES.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Blockchain Risks</h4>
              <p className="text-muted-foreground">
                You acknowledge that blockchain transactions are irreversible and that we cannot recover or reverse transactions once settled. Network congestion, failed transactions, and other blockchain-related issues are beyond our control.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Indemnification</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-muted-foreground">
              You agree to indemnify and hold harmless Rapid402, its contributors, and affiliates from any claims, damages, losses, or expenses (including legal fees) arising from your use of our services, violation of these terms, or violation of any rights of third parties.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Modifications and Termination</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p>We reserve the right to:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Modify or discontinue services at any time with or without notice</li>
              <li>Suspend or terminate access for violations of these terms</li>
              <li>Change API endpoints, features, or pricing structures</li>
              <li>Refuse service to anyone for any reason</li>
            </ul>
            <p className="text-muted-foreground">
              We will make reasonable efforts to provide advance notice of significant changes.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Privacy and Data Protection</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-muted-foreground">
              Your use of our services is also governed by our <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>. Please review it to understand how we collect, use, and protect your data.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Governing Law and Dispute Resolution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p>
              These terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles.
            </p>
            <p className="text-muted-foreground">
              Any disputes arising from these terms or our services shall be resolved through binding arbitration, except where prohibited by law. You agree to waive any right to a jury trial or class action.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Severability</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-muted-foreground">
              If any provision of these terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-muted-foreground">
              We may revise these terms at any time. Continued use of our services after changes constitutes acceptance of the updated terms. Material changes will be announced on our website or via email to registered users.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>For questions about these terms or to report violations:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Email: support@rapid402.com</li>
              <li>• GitHub: <a href="https://github.com/rapid402" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">github.com/rapid402</a></li>
              <li>• X/Twitter: <a href="https://x.com/rapid402?s=21" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@rapid402</a></li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
