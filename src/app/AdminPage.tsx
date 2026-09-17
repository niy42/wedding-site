import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatMoney } from "@/lib/currency";
import { api, ApiError } from "@/services/api-client";
import type { AdminDashboard } from "@/types";

export function AdminPage() {
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [passcode, setPasscode] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadDashboard() {
    try {
      const data = await api.getAdminDashboard();
      setDashboard(data);
      setAuthenticated(true);
      setError(null);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setAuthenticated(false);
        return;
      }
      setError("We couldn't load the admin dashboard. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadDashboard();
  }, []);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    if (!passcode) return;

    setLoggingIn(true);
    setError(null);
    try {
      await api.adminLogin(passcode);
      setPasscode("");
      await loadDashboard();
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 401
          ? "The admin passcode is incorrect."
          : "We couldn't sign you in. Please try again.",
      );
    } finally {
      setLoggingIn(false);
    }
  }

  async function handleLogout() {
    await api.adminLogout().catch(() => undefined);
    setAuthenticated(false);
    setDashboard(null);
  }

  if (loading) {
    return (
      <div className="bg-bg min-h-screen">
        <Container className="py-20">
          <p className="text-fg-muted text-sm" role="status">Loading admin dashboard…</p>
        </Container>
      </div>
    );
  }

  if (!authenticated || !dashboard) {
    return (
      <div className="flex justify-center items-center bg-bg px-4 min-h-screen">
        <Card className="bg-bg-elevated w-[min(360px,90vw)] text-center">
          <h1 className="font-display text-2xl">Admin</h1>
          <p className="mt-2 text-fg-muted text-sm">
            Sign in with your admin credentials to continue.
          </p>
          <form onSubmit={handleLogin}>
            <label htmlFor="admin-passcode" className="sr-only">Admin passcode</label>
            <input
              id="admin-passcode"
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Admin passcode"
              autoComplete="current-password"
              className="mt-4 px-4 py-2.5 border border-border rounded-sm w-full text-sm"
            />
            {error && <p className="mt-3 text-rose text-sm" role="alert">{error}</p>}
            <Button type="submit" className="mt-3 w-full" disabled={loggingIn || !passcode}>
              {loggingIn ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-bg min-h-screen">
      <Container className="py-10">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="font-display text-3xl">Admin</h1>
            <p className="mt-2 text-fg-muted text-sm">Live wedding and contribution data.</p>
          </div>
          <Button type="button" variant="secondary" size="xs" className="w-20 sm:w-24 h-8 cursor-pointer" onClick={handleLogout}>Sign out</Button>
        </div>

        {error && <p className="mt-6 text-rose text-sm" role="alert">{error}</p>}

        <div className="gap-4 grid sm:grid-cols-3 mt-8">
          <Card>
            <p className="text-fg-muted text-xs uppercase tracking-wide">Total raised</p>
            <p className="mt-2 font-display text-3xl">{formatMoney(dashboard.totals)}</p>
          </Card>
          <Card>
            <p className="text-fg-muted text-xs uppercase tracking-wide">Contributors</p>
            <p className="mt-2 font-display text-3xl">{dashboard.contributorCount}</p>
          </Card>
          <Card>
            <p className="text-fg-muted text-xs uppercase tracking-wide">RSVPs</p>
            <p className="mt-2 font-display text-3xl">{dashboard.rsvpCount}</p>
            <p className="mt-1 text-fg-muted text-xs">{dashboard.attendingGuestCount} guests attending</p>
          </Card>
        </div>

        <Card className="mt-6 overflow-x-auto">
          <h2 className="font-display text-xl">Gift categories</h2>
          <table className="mt-4 w-full min-w-155 text-sm text-left">
            <thead>
              <tr className="border-border border-b text-fg-muted text-xs uppercase tracking-wide">
                <th className="py-2">Category</th>
                <th className="py-2">Raised</th>
                <th className="py-2">Target</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.categories.map((category) => (
                <tr key={category.id} className="border-border-subtle border-b">
                  <td className="py-2.5">{category.title}</td>
                  <td className="py-2.5">{formatMoney(category.raised)}</td>
                  <td className="py-2.5">{category.target ? formatMoney(category.target) : "No target"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card className="mt-6 overflow-x-auto">
          <h2 className="font-display text-xl">Contributions</h2>
          <table className="mt-4 w-full min-w-375 text-sm text-left">
            <thead>
              <tr className="border-border border-b text-fg-muted text-xs uppercase tracking-wide">
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Supporter</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Phone</th>
                <th className="py-2 pr-4">Message</th>
                <th className="py-2 pr-4">Category</th>
                <th className="py-2 pr-4">Amount</th>
                <th className="py-2 pr-4">Currency</th>
                <th className="py-2 pr-4">Provider</th>
                <th className="py-2 pr-4">Reference</th>
                <th className="py-2 pr-4">Provider ref.</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.contributions.map((contribution) => (
                <tr key={contribution.id} className="border-border-subtle border-b align-top">
                  <td className="py-2.5 pr-4 whitespace-nowrap">{new Date(contribution.createdAt).toLocaleDateString("en-GB")}</td>
                  <td className="py-2.5 pr-4">
                    <div>{contribution.isAnonymous ? "Anonymous" : contribution.supporterName}</div>
                    <div className="mt-1 text-fg-muted text-xs">
                      {contribution.isPublic ? "Public" : "Private"}
                    </div>
                  </td>
                  <td className="py-2.5 pr-4">{contribution.supporterEmail}</td>
                  <td className="py-2.5 pr-4">{contribution.supporterPhone ?? "—"}</td>
                  <td className="py-2.5 pr-4 max-w-xs whitespace-normal">{contribution.supporterMessage ?? "—"}</td>
                  <td className="py-2.5 pr-4">{contribution.categoryTitle}</td>
                  <td className="py-2.5 pr-4 whitespace-nowrap">{formatMoney(contribution.amount)}</td>
                  <td className="py-2.5 pr-4">{contribution.amount.currency}</td>
                  <td className="py-2.5 pr-4">{contribution.paymentProvider ?? "—"}</td>
                  <td className="py-2.5 pr-4 font-mono text-xs">{contribution.reference}</td>
                  <td className="py-2.5 pr-4 font-mono text-xs">{contribution.providerReference ?? "—"}</td>
                  <td className="py-2.5 whitespace-nowrap">{contribution.paymentStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {dashboard.contributions.length === 0 && (
            <p className="py-6 text-fg-muted text-sm">No contributions yet.</p>
          )}
        </Card>

        <Card className="mt-6 overflow-x-auto">
          <h2 className="font-display text-xl">RSVPs</h2>
          <table className="mt-4 w-full min-w-225 text-sm text-left">
            <thead>
              <tr className="border-border border-b text-fg-muted text-xs uppercase tracking-wide">
                <th className="py-2">Name</th>
                <th className="py-2">Attendance</th>
                <th className="py-2">Guests</th>
                <th className="py-2">Email</th>
                <th className="py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.rsvps.map((rsvp) => (
                <tr key={rsvp.id} className="border-border-subtle border-b">
                  <td className="py-2.5">{rsvp.fullName}</td>
                  <td className="py-2.5">{rsvp.attending === "yes" ? "Attending" : "Declined"}</td>
                  <td className="py-2.5">{rsvp.attending === "yes" ? rsvp.guestCount : 0}</td>
                  <td className="py-2.5">{rsvp.email}</td>
                  <td className="py-2.5">{new Date(rsvp.createdAt).toLocaleDateString("en-GB")}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {dashboard.rsvps.length === 0 && (
            <p className="py-6 text-fg-muted text-sm">No RSVPs yet.</p>
          )}
        </Card>
      </Container>
    </div>
  );
}
