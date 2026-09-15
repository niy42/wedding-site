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
      <div className="flex justify-center items-center bg-bg min-h-screen">
        <Card className="bg-bg-elevated w-[min(360px,90vw)] text-center">
          <h1 className="font-display text-2xl">Admin</h1>
          <p className="mt-2 text-fg-muted text-sm">
            Placeholder gate — replace with real backend authentication.
          </p>
          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Passcode"
            className="mt-4 px-4 py-2.5 border border-border rounded-sm w-full text-sm"
          />
          <button
            type="button"
            onClick={() => setUnlocked(passcode.length > 0)}
            className="bg-accent mt-3 px-4 py-2.5 rounded-sm w-full text-bg text-sm"
          >
            Enter
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-bg min-h-screen">
      <Container className="py-10">
        <h1 className="font-display text-3xl">
          {weddingDetails.partnerOneName} &amp; {weddingDetails.partnerTwoName} — Admin
        </h1>

        <div className="gap-4 grid sm:grid-cols-3 mt-8">
          <Card>
            <p className="text-fg-muted text-xs uppercase tracking-wide">Total raised</p>
            <p className="mt-2 font-display text-3xl">{formatMoney(totals)}</p>
          </Card>
          <Card>
            <p className="text-fg-muted text-xs uppercase tracking-wide">Contributors</p>
            <p className="mt-2 font-display text-3xl">—</p>
            <p className="mt-1 text-fg-muted text-xs">Wire to /api/admin/contributions</p>
          </Card>
          <Card>
            <p className="text-fg-muted text-xs uppercase tracking-wide">RSVPs</p>
            <p className="mt-2 font-display text-3xl">—</p>
            <p className="mt-1 text-fg-muted text-xs">Wire to /api/admin/rsvps</p>
          </Card>
        </div>

        <Card className="mt-6">
          <h2 className="font-display text-xl">Gift categories</h2>
          <table className="mt-4 w-full text-sm text-left">
            <thead>
              <tr className="border-border border-b text-fg-muted text-xs uppercase tracking-wide">
                <th className="py-2">Category</th>
                <th className="py-2">Raised</th>
                <th className="py-2">Target</th>
              </tr>
            </thead>
            <tbody>
              {giftCategories.map((c) => (
                <tr key={c.id} className="border-border-subtle border-b">
                  <td className="py-2.5">{c.title}</td>
                  <td className="py-2.5">{formatMoney(c.raised)}</td>
                  <td className="py-2.5">{c.target ? formatMoney(c.target) : "No target"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <p className="mt-6 text-fg-muted text-xs">
          Contributions, RSVP, and content-management tables are scaffolded UI only — connect
          each to the corresponding backend endpoint once it exists (see the deliverable report
          for the full endpoint list).
        </p>
      </Container>
    </div>
  );
}
