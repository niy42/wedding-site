import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { api, ApiError } from "@/services/api-client";

type VerificationState =
  | { status: "verifying" }
  | { status: "successful" }
  | { status: "pending" }
  | { status: "failed" }
  | { status: "error" };

export function ThankYouPage() {
  const [params] = useSearchParams();
  const reference = params.get("reference");
  const [state, setState] = useState<VerificationState>({ status: "verifying" });

  useEffect(() => {
    if (!reference) {
      setState({ status: "error" });
      return;
    }
    api
      .verifyPayment(reference)
      .then((result) => {
        if (result.status === "SUCCESSFUL") setState({ status: "successful" });
        else if (result.status === "FAILED" || result.status === "CANCELLED")
          setState({ status: "failed" });
        else setState({ status: "pending" });
      })
      .catch((err) => {
        setState({ status: err instanceof ApiError ? "error" : "error" });
      });
  }, [reference]);

  return (
    <div className="flex min-h-screen items-center bg-bg text-fg">
      <Container className="text-center">
        {state.status === "verifying" && (
          <p className="text-fg-muted">Confirming your gift…</p>
        )}

        {state.status === "successful" && (
          <>
            <Heading level="display" as="p" italic className="text-accent-soft">
              Thank you ❤️
            </Heading>
            <p className="mx-auto mt-5 max-w-md text-fg-muted">
              Your kindness means more to us than you know. Thank you for being part of our
              journey.
            </p>
          </>
        )}

        {state.status === "pending" && (
          <>
            <Heading level="h2" as="p" className="text-fg">
              Almost there
            </Heading>
            <p className="mx-auto mt-4 max-w-md text-fg-muted">
              We're still confirming your payment with our provider. This can take a minute —
              feel free to close this page, we'll email you a confirmation.
            </p>
          </>
        )}

        {(state.status === "failed" || state.status === "error") && (
          <>
            <Heading level="h2" as="p" className="text-fg">
              We couldn't confirm that gift
            </Heading>
            <p className="mx-auto mt-4 max-w-md text-fg-muted">
              {state.status === "failed"
                ? "It looks like the payment didn't go through. No amount has been charged."
                : "We couldn't reach our server to confirm this. If you were charged, please contact us and we'll sort it out."}
            </p>
            <a href="/#gift" className="mt-6 inline-block text-sm text-accent-soft hover:underline">
              Return to the gift page →
            </a>
          </>
        )}
      </Container>
    </div>
  );
}
