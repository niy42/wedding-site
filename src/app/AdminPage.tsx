import { useMemo, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { formatMoney, addMoney } from "@/lib/currency";
import { giftCategories, weddingDetails } from "@/lib/wedding-content";

/**
 * UI scaffold for the admin area described in the brief (overview,
 * contributions, RSVP, content management). This screen currently
 * renders against local mock data and has NO real authentication —
 * it must sit behind server-verified admin sessions (see the
 * deliverable report) before this route is exposed in production.
 */
export function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [passcode, setPasscode] = useState("");

  const totals = useMemo(() => {
    const currency = giftCategories[0]?.raised.currency ?? "NGN";
    const total = giftCategories.reduce(
      (sum, c) => addMoney(sum, c.raised),
      { amountMinor: 0, currency }
    );
    return total;
  }, []);

  if (!unlocked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <Card className="w-[min(360px,90vw)] bg-bg-elevated text-center">
          <h1 className="font-display text-2xl">Admin</h1>
          <p className="mt-2 text-sm text-fg-muted">
            Placeholder gate — replace with real backend authentication.
          </p>
          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Passcode"
            className="mt-4 w-full rounded-[var(--radius-sm)] border border-border px-4 py-2.5 text-sm"
          />
          <button
            type="button"
            onClick={() => setUnlocked(passcode.length > 0)}
            className="mt-3 w-full rounded-[var(--radius-sm)] bg-accent px-4 py-2.5 text-sm text-bg"
          >
            Enter
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <Container className="py-10">
        <h1 className="font-display text-3xl">
          {weddingDetails.partnerOneName} &amp; {weddingDetails.partnerTwoName} — Admin
        </h1>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Card>
            <p className="text-xs uppercase tracking-wide text-fg-muted">Total raised</p>
            <p className="mt-2 font-display text-3xl">{formatMoney(totals)}</p>
          </Card>
          <Card>
            <p className="text-xs uppercase tracking-wide text-fg-muted">Contributors</p>
            <p className="mt-2 font-display text-3xl">—</p>
            <p className="mt-1 text-xs text-fg-muted">Wire to /api/admin/contributions</p>
          </Card>
          <Card>
            <p className="text-xs uppercase tracking-wide text-fg-muted">RSVPs</p>
            <p className="mt-2 font-display text-3xl">—</p>
            <p className="mt-1 text-xs text-fg-muted">Wire to /api/admin/rsvps</p>
          </Card>
        </div>

        <Card className="mt-6">
          <h2 className="font-display text-xl">Gift categories</h2>
          <table className="mt-4 w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-fg-muted">
                <th className="py-2">Category</th>
                <th className="py-2">Raised</th>
                <th className="py-2">Target</th>
              </tr>
            </thead>
            <tbody>
              {giftCategories.map((c) => (
                <tr key={c.id} className="border-b border-border-subtle">
                  <td className="py-2.5">{c.title}</td>
                  <td className="py-2.5">{formatMoney(c.raised)}</td>
                  <td className="py-2.5">{c.target ? formatMoney(c.target) : "No target"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <p className="mt-6 text-xs text-fg-muted">
          Contributions, RSVP, and content-management tables are scaffolded UI only — connect
          each to the corresponding backend endpoint once it exists (see the deliverable report
          for the full endpoint list).
        </p>
      </Container>
    </div>
  );
}
