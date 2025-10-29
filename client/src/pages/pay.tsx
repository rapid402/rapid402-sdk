import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { CheckCircle2, AlertCircle, Loader2, ExternalLink } from "lucide-react";
import type { PaymentRequest } from "@shared/schema";

export default function PayPage() {
  const [, params] = useRoute("/pay/:id");
  const paymentId = params?.id;
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [value, setValue] = useState("");
  const [v, setV] = useState("");
  const [r, setR] = useState("");
  const [s, setS] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [txHash, setTxHash] = useState("");
  const { toast } = useToast();

  const { data: paymentRequest, isLoading, error } = useQuery<PaymentRequest>({
    queryKey: [`/api/v1/payment-requests/${paymentId}`],
    enabled: !!paymentId,
  });

  useEffect(() => {
    if (paymentRequest) {
      setTo(paymentRequest.recipientAddress);
      setValue(paymentRequest.amount);
    }
  }, [paymentRequest]);

  const submitPaymentMutation = useMutation({
    mutationFn: async (signature: { from: string; to: string; value: string; v: string; r: string; s: string }) => {
      const response = await apiRequest("POST", `/api/v1/payment-requests/${paymentId}/submit`, { signature });
      return response.json();
    },
    onSuccess: (response: any) => {
      setIsSubmitted(true);
      setTxHash(response.transactionHash || "");
      toast({
        title: "Payment Successful",
        description: "Your payment has been verified and settled.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to submit payment",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!from || !v || !r || !s) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all signature fields",
        variant: "destructive",
      });
      return;
    }

    submitPaymentMutation.mutate({ from, to, value, v, r, s });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-2xl px-6 md:px-8 py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !paymentRequest) {
    return (
      <div className="container mx-auto max-w-2xl px-6 md:px-8 py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Payment request not found or has expired.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="container mx-auto max-w-2xl px-6 md:px-8 py-12">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <CheckCircle2 className="h-6 w-6" />
              Payment Successful
            </CardTitle>
            <CardDescription>Your payment has been verified and settled on-chain</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Transaction Hash</Label>
              <div className="flex gap-2">
                <Input value={txHash} readOnly data-testid="input-tx-hash" />
                {txHash && txHash !== "simulated-solana-tx" && txHash !== "simulated-base-tx" && txHash !== "simulated-bsc-tx" && (
                  <Button size="icon" variant="outline" asChild data-testid="button-explorer">
                    <a href={`#`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
            <Alert>
              <AlertDescription>
                The merchant has received your payment at <strong>{paymentRequest.recipientAddress}</strong>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-6 md:px-8 py-12">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Complete Payment</h1>
        <p className="text-muted-foreground">
          Sign this payment in your wallet and paste the signature below
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount:</span>
            <span className="font-mono font-medium">{paymentRequest.amount} {paymentRequest.asset}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Network:</span>
            <span className="font-medium capitalize">{paymentRequest.network.replace("-", " ")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">To:</span>
            <span className="font-mono text-xs">{paymentRequest.recipientAddress}</span>
          </div>
          {paymentRequest.description && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Description:</span>
              <span>{paymentRequest.description}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sign Payment</CardTitle>
          <CardDescription>
            Open your wallet app, sign the payment message, and paste the signature components below
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              <strong>Important:</strong> Sign a message with these details in your wallet:
              <ul className="mt-2 list-disc list-inside text-sm space-y-1">
                <li>From: Your wallet address</li>
                <li>To: {paymentRequest.recipientAddress}</li>
                <li>Value: {paymentRequest.amount}</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="from">From Address</Label>
            <Input
              id="from"
              placeholder="Your wallet address"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              data-testid="input-from"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="v">Signature V</Label>
            <Input
              id="v"
              placeholder="27 or 28 (or 0x1b/0x1c)"
              value={v}
              onChange={(e) => setV(e.target.value)}
              data-testid="input-v"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="r">Signature R</Label>
            <Input
              id="r"
              placeholder="0x..."
              value={r}
              onChange={(e) => setR(e.target.value)}
              data-testid="input-r"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="s">Signature S</Label>
            <Input
              id="s"
              placeholder="0x..."
              value={s}
              onChange={(e) => setS(e.target.value)}
              data-testid="input-s"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={submitPaymentMutation.isPending}
            className="w-full"
            data-testid="button-submit-payment"
          >
            {submitPaymentMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Verifying Payment...
              </>
            ) : (
              "Submit Payment"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
