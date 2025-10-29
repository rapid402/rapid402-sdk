import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto max-w-4xl px-6 md:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: October 29, 2025</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p>
              Rapid402 is an open-source x402 payment facilitator. We are committed to protecting your privacy and being transparent about what data we collect and how we use it.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Payment Transaction Data</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Payment payload signatures for verification</li>
                <li>Transaction amounts and asset types</li>
                <li>Solana wallet addresses (payer and payee)</li>
                <li>Transaction timestamps</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">API Usage Data</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>API endpoint requests and responses</li>
                <li>Request timestamps and response times</li>
                <li>Error logs for debugging purposes</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Website Analytics</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Page views and navigation patterns</li>
                <li>Browser type and device information</li>
                <li>Geographic location (country/region)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>To verify and settle x402 payment transactions on Solana blockchain</li>
              <li>To provide, maintain, and improve our facilitator services</li>
              <li>To monitor and analyze API usage patterns and performance</li>
              <li>To detect and prevent fraud or abuse of our services</li>
              <li>To communicate with developers about service updates</li>
              <li>To comply with legal obligations and resolve disputes</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Storage and Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p>
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Encrypted data transmission using HTTPS/TLS</li>
              <li>Secure storage of transaction logs</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication mechanisms</li>
            </ul>
            <p className="text-muted-foreground">
              Transaction data is stored for audit and compliance purposes. We retain transaction logs for a reasonable period to support dispute resolution and regulatory requirements.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Blockchain Transparency</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p>
              Please note that all settled transactions are recorded on the Solana blockchain, which is a public ledger. This means:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Transaction amounts and wallet addresses are publicly visible</li>
              <li>Transaction history is permanent and cannot be deleted</li>
              <li>Anyone can view transaction details using a blockchain explorer</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Third-Party Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p>We use the following third-party services:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Solana blockchain network for transaction settlement</li>
              <li>Cloud hosting providers for API infrastructure</li>
              <li>Analytics services for website usage insights</li>
            </ul>
            <p className="text-muted-foreground">
              These services have their own privacy policies and data practices.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p>You have the right to:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Access your transaction data</li>
              <li>Request corrections to inaccurate data</li>
              <li>Request deletion of personal data (where legally permissible)</li>
              <li>Opt out of non-essential data collection</li>
              <li>Object to automated decision-making</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Sharing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p>We do not sell or rent your personal data. We may share data only in these circumstances:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>With your explicit consent</li>
              <li>To comply with legal obligations or court orders</li>
              <li>To prevent fraud or protect our rights</li>
              <li>In connection with a business transfer or acquisition</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-muted-foreground">
              Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Changes to This Policy</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-muted-foreground">
              We may update this privacy policy from time to time. We will notify users of significant changes by updating the "Last updated" date and posting announcements on our website.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>If you have questions about this privacy policy or our data practices:</p>
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
