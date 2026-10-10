import { CreditPlans } from "@/components/billing/credit-plans";

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-16 max-w-6xl space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
          Simple, Transparent Credit Packs
        </h1>
        <p className="text-base text-muted-foreground">
          Pay only for the candidates you evaluate. No recurring lock-ins, no
          seat limits. 1 credit = 1 candidate assessment invite.
        </p>
      </div>

      <CreditPlans />

      <div className="mt-16 rounded-2xl border border-border bg-card p-8 max-w-4xl mx-auto space-y-6 shadow-sm">
        <h3 className="text-xl font-bold text-foreground text-center">
          Frequently Asked Questions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-semibold text-foreground">
              How do credits work?
            </h4>
            <p className="text-muted-foreground mt-1">
              Each candidate you invite to take a test consumes 1 credit. The
              candidate can take the entire test with unlimited test runs until
              they submit.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">
              Do credits expire?
            </h4>
            <p className="text-muted-foreground mt-1">
              Never. Purchased credits remain in your organization&apos;s wallet
              until used.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">
              What payment methods are supported?
            </h4>
            <p className="text-muted-foreground mt-1">
              All major credit cards, debit cards, and Apple/Google Pay through
              Stripe Checkout.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">
              Can I test before purchasing?
            </h4>
            <p className="text-muted-foreground mt-1">
              Yes! All new recruiter accounts receive demo credits to test
              assessment workflows.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
