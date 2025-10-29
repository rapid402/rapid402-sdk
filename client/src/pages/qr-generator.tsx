import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import QRCode from "qrcode";
import { Copy, QrCode, Download } from "lucide-react";

export default function QRGeneratorPage() {
  const [amount, setAmount] = useState("");
  const [asset, setAsset] = useState("SOL");
  const [network, setNetwork] = useState("solana-mainnet");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [description, setDescription] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [paymentUrl, setPaymentUrl] = useState("");
  const { toast } = useToast();

  const createPaymentMutation = useMutation({
    mutationFn: async (data: {
      amount: string;
      asset: string;
      network: string;
      recipientAddress: string;
      description?: string;
    }) => {
      const response = await apiRequest("/api/v1/payment-requests", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: async (response: any) => {
      const paymentId = response.id;
      const url = `${window.location.origin}/pay/${paymentId}`;
      setPaymentUrl(url);

      // Generate QR code
      try {
        const qrUrl = await QRCode.toDataURL(url, {
          width: 400,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        });
        setQrCodeUrl(qrUrl);
        
        toast({
          title: "QR Code Generated",
          description: "Your payment request has been created successfully.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to generate QR code",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create payment request",
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    if (!amount || !recipientAddress) {
      toast({
        title: "Missing Fields",
        description: "Please fill in amount and recipient address",
        variant: "destructive",
      });
      return;
    }

    createPaymentMutation.mutate({
      amount,
      asset,
      network,
      recipientAddress,
      description,
    });
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(paymentUrl);
    toast({
      title: "Copied",
      description: "Payment URL copied to clipboard",
    });
  };

  const handleDownloadQR = () => {
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = `payment-qr-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="container mx-auto max-w-4xl px-6 md:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">QR Code Payment Generator</h1>
        <p className="text-lg text-muted-foreground">
          Create a payment request QR code that anyone can scan to pay you with crypto.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Create Payment Request
            </CardTitle>
            <CardDescription>
              Fill in the payment details to generate your QR code
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="text"
                placeholder="10"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                data-testid="input-amount"
              />
              <p className="text-xs text-muted-foreground">
                Amount in the smallest unit (e.g., lamports for SOL, wei for ETH/BNB)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="asset">Asset</Label>
              <Select value={asset} onValueChange={setAsset}>
                <SelectTrigger id="asset" data-testid="select-asset">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SOL">SOL</SelectItem>
                  <SelectItem value="USDC">USDC</SelectItem>
                  <SelectItem value="USDT">USDT</SelectItem>
                  <SelectItem value="ETH">ETH</SelectItem>
                  <SelectItem value="BNB">BNB</SelectItem>
                  <SelectItem value="BUSD">BUSD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="network">Network</Label>
              <Select value={network} onValueChange={setNetwork}>
                <SelectTrigger id="network" data-testid="select-network">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solana-mainnet">Solana Mainnet</SelectItem>
                  <SelectItem value="solana-devnet">Solana Devnet</SelectItem>
                  <SelectItem value="base-mainnet">BASE Mainnet</SelectItem>
                  <SelectItem value="base-sepolia">BASE Sepolia</SelectItem>
                  <SelectItem value="bsc-mainnet">BSC Mainnet</SelectItem>
                  <SelectItem value="bsc-testnet">BSC Testnet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipientAddress">Your Wallet Address</Label>
              <Input
                id="recipientAddress"
                type="text"
                placeholder="0x... or your Solana address"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                data-testid="input-recipient"
              />
              <p className="text-xs text-muted-foreground">
                Where you want to receive the payment
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Payment for services..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                data-testid="input-description"
                rows={3}
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={createPaymentMutation.isPending}
              className="w-full"
              data-testid="button-generate"
            >
              {createPaymentMutation.isPending ? "Generating..." : "Generate QR Code"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Payment QR Code</CardTitle>
            <CardDescription>
              Share this QR code to receive payments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {qrCodeUrl ? (
              <>
                <div className="flex justify-center bg-muted p-6 rounded-lg">
                  <img src={qrCodeUrl} alt="Payment QR Code" className="max-w-full" data-testid="img-qr-code" />
                </div>

                <div className="space-y-2">
                  <Label>Payment URL</Label>
                  <div className="flex gap-2">
                    <Input value={paymentUrl} readOnly data-testid="input-payment-url" />
                    <Button size="icon" variant="outline" onClick={handleCopyUrl} data-testid="button-copy-url">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button onClick={handleDownloadQR} variant="outline" className="w-full" data-testid="button-download">
                  <Download className="h-4 w-4 mr-2" />
                  Download QR Code
                </Button>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">How it works:</h4>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Customer scans this QR code</li>
                    <li>They see your payment details</li>
                    <li>They sign the payment in their wallet</li>
                    <li>They paste the signature to complete payment</li>
                    <li>Funds are sent directly to your wallet</li>
                  </ol>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <QrCode className="h-16 w-16 mb-4 opacity-20" />
                <p>Fill in the form and click "Generate QR Code" to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
