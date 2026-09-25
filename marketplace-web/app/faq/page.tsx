import Link from "next/link";

type QA = { q: string; a: React.ReactNode };

const faqs: QA[] = [
  {
    q: "What is this project?",
    a: (
      <>
        A production-style multi-vendor marketplace — sellers list products, buyers browse and
        purchase, and checkout runs atomically in a single database transaction. It was built as a
        portfolio project to demonstrate real full-stack patterns, not just CRUD.
      </>
    ),
  },
  {
    q: "What's the difference between a buyer and a seller?",
    a: (
      <>
        Buyers can browse products, add to cart, and place orders. Sellers get everything buyers
        have, plus a dashboard where they manage their own catalog. Sellers only see their own
        products — never anyone else's — which is what makes this multi-vendor.
      </>
    ),
  },
  {
    q: "How does the checkout work?",
    a: (
      <>
        When you click Checkout, the backend wraps three operations inside a single
        <code className="mx-1 px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-xs font-mono">
          prisma.$transaction
        </code>
        : it creates the order, decrements the stock of each variant, and clears your cart. If any
        step fails — say, a variant ran out of stock mid-checkout — nothing commits and the cart is
        left untouched. That's the interesting bit.
      </>
    ),
  },
  {
    q: "Can I add multiple variants to a product?",
    a: (
      <>
        Yes. When a seller creates a product, they can add variants like "Black" and "White" with
        their own stock and price deltas. Buyers pick the variant on the product detail page.
      </>
    ),
  },
  {
    q: "Is the payment real?",
    a: (
      <>
        No. This is a portfolio project, so checkout creates the order immediately with a{" "}
        <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800">
          PENDING
        </span>{" "}
        status and no payment gateway. Integrating Stripe test mode is on the roadmap.
      </>
    ),
  },
  {
    q: "What's the tech stack?",
    a: (
      <>
        React (Next.js App Router) + TypeScript + Tailwind on the frontend. Node.js + Express +
        Prisma + PostgreSQL (Neon) on the backend. Auth is JWT + bcrypt. The whole thing is
        deployed on Vercel (frontend) and Render (API).
      </>
    ),
  },
  {
    q: "How is auth handled?",
    a: (
      <>
        Signup hashes the password with bcrypt and issues a signed JWT. Every protected route
        passes through an auth middleware that verifies the token, then a role middleware that
        checks whether the user is a buyer or seller. Buyers literally can't hit seller-only
        endpoints — it returns a 403.
      </>
    ),
  },
  {
    q: "Where's the source code?",
    a: (
      <>
        On GitHub:{" "}
        <a
          href="https://github.com/IIGGRRIISS/marketplace"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-600 dark:text-brand-400 font-medium hover:underline"
        >
          github.com/IIGGRRIISS/marketplace
        </a>
        . PRs welcome.
      </>
    ),
  },
  {
    q: "Who built it?",
    a: (
      <>
        Syed Ibrahim Ali —{" "}
        <a
          href="https://github.com/IIGGRRIISS"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-600 dark:text-brand-400 font-medium hover:underline"
        >
          @IIGGRRIISS
        </a>
        . Built as a portfolio project to demonstrate full-stack engineering: auth, roles,
        transactions, deployment, the works.
      </>
    ),
  },
];

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Help &amp; FAQ
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">
          Quick answers about how the marketplace works.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((item, i) => (
          <details
            key={i}
            className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden open:shadow-sm transition-all"
          >
            <summary className="cursor-pointer list-none px-5 py-4 flex items-center justify-between gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
              <span className="font-medium text-zinc-900 dark:text-zinc-100">{item.q}</span>
              <svg
                className="shrink-0 text-zinc-400 group-open:rotate-180 transition-transform"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </summary>
            <div className="px-5 pb-5 pt-1 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              {item.a}
            </div>
          </details>
        ))}
      </div>

      <div className="mt-12 p-6 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Still curious?{" "}
          <Link
            href="/"
            className="text-brand-600 dark:text-brand-400 font-medium hover:underline"
          >
            Back to products
          </Link>{" "}
          or{" "}
          <a
            href="https://github.com/IIGGRRIISS/marketplace"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 dark:text-brand-400 font-medium hover:underline"
          >
            read the code
          </a>
          .
        </p>
      </div>
    </div>
  );
}