"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, CreditCard, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

function PaymentForm({
  clientSecret,
  customerEmail,
  customerName,
  monthlyAmount,
  agreementName,
  signatureId,
}: {
  clientSecret: string;
  customerEmail: string;
  customerName: string;
  monthlyAmount: number;
  agreementName: string;
  signatureId: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error("Stripe is not ready. Please try again.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Confirm the payment setup
      const { error, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: customerName,
            email: customerEmail,
          },
        },
      });

      if (error) {
        setErrorMessage(error.message || "Payment setup failed");
        toast.error(error.message || "Payment setup failed");
        setIsProcessing(false);
        return;
      }

      if (setupIntent.status === "succeeded") {
        // Payment method saved successfully
        // Create the subscription
        const response = await fetch("/api/stripe/confirm-subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentMethodId: setupIntent.payment_method,
            customerEmail,
            customerName,
            monthlyAmount,
            agreementName,
            signatureId,
          }),
        });

        const result = await response.json();

        if (result.success) {
          toast.success("Payment method saved and subscription created!");
          // Redirect to success page
          router.push(`/payment/success?signatureId=${signatureId}`);
        } else {
          setErrorMessage(result.error || "Failed to create subscription");
          toast.error(result.error || "Failed to create subscription");
        }
      }
    } catch (err) {
      console.error("Payment error:", err);
      setErrorMessage("An unexpected error occurred");
      toast.error("An unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Card Information
        </label>
        <div className="p-4 border rounded-lg bg-white">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
          />
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
          <AlertCircle className="h-4 w-4" />
          {errorMessage}
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-800">
          <strong>Monthly Recurring Payment:</strong> ${monthlyAmount.toFixed(2)}/month
        </p>
        <p className="text-xs text-amber-700 mt-1">
          Your card will be charged automatically each month. You can cancel anytime.
        </p>
      </div>

      <Button
        type="submit"
        className="w-full bg-[#C8A951] hover:bg-[#b89a42] text-[#1e3a5f] font-semibold"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Save Payment Method & Setup Subscription
          </>
        )}
      </Button>
    </form>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8f] flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p className="text-lg">Loading payment system...</p>
        </div>
      </div>
    }>
      <PaymentPageContent />
    </Suspense>
  );
}

function PaymentPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const signatureId = searchParams.get("signatureId");
  const customerEmail = searchParams.get("email");
  const customerName = searchParams.get("name");
  const monthlyAmount = parseFloat(searchParams.get("amount") || "0");
  const agreementName = searchParams.get("agreement") || "Agreement";

  useEffect(() => {
    if (!signatureId || !customerEmail || !monthlyAmount) {
      setError("Missing required payment information");
      setIsLoading(false);
      return;
    }

    // Create setup intent
    async function createSetupIntent() {
      try {
        const response = await fetch("/api/stripe/create-setup-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerEmail,
            customerName,
            signatureId,
          }),
        });

        const result = await response.json();

        if (result.clientSecret) {
          setClientSecret(result.clientSecret);
        } else {
          setError(result.error || "Failed to initialize payment");
        }
      } catch (err) {
        console.error("Error creating setup intent:", err);
        setError("Failed to initialize payment system");
      } finally {
        setIsLoading(false);
      }
    }

    createSetupIntent();
  }, [signatureId, customerEmail, customerName, monthlyAmount]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8f] flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p className="text-lg">Loading payment system...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8f] flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-700 mb-2">Error</h2>
            <p className="text-gray-600">{error}</p>
            <Button
              className="mt-4 w-full"
              onClick={() => router.push("/")}
            >
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8f] flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-[#C8A951] rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="h-8 w-8 text-[#1e3a5f]" />
          </div>
          <CardTitle className="text-2xl text-[#1e3a5f]">
            Setup Monthly Payment
          </CardTitle>
          <CardDescription>
            Complete your {agreementName} by setting up your monthly recurring payment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Customer:</span>
              <span className="font-medium">{customerName}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{customerEmail}</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="text-gray-600">Monthly Fee:</span>
              <span className="font-bold text-[#1e3a5f]">${monthlyAmount.toFixed(2)}/month</span>
            </div>
          </div>

          {clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <PaymentForm
                clientSecret={clientSecret}
                customerEmail={customerEmail!}
                customerName={customerName || customerEmail!}
                monthlyAmount={monthlyAmount}
                agreementName={agreementName}
                signatureId={signatureId!}
              />
            </Elements>
          )}

          <p className="text-xs text-gray-500 text-center mt-6">
            Secured by Stripe. Your card information is never stored on our servers.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
