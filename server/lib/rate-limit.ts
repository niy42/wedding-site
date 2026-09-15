// interface Bucket { count: number; resetAt: number }
// export class RateLimiter {
//   private readonly buckets = new Map<string, Bucket>();
//   constructor(private readonly max: number, private readonly windowMs: number) { }
//   allow(key: string, now = Date.now()) { const b = this.buckets.get(key); if (!b || b.resetAt <= now) { this.buckets.set(key, { count: 1, resetAt: now + this.windowMs }); return true } if (b.count >= this.max) return false; b.count++; return true }
//   cleanup(now = Date.now()) { for (const [k, b] of this.buckets) if (b.resetAt <= now) this.buckets.delete(k) }
// }

interface Bucket {
  count: number;
  resetAt: number;
}

export class RateLimiter {
  private readonly buckets = new Map<string, Bucket>();

  constructor(
    private readonly max: number,
    private readonly windowMs: number,
  ) { }

  allow(
    key: string,
    now = Date.now(),
  ): boolean {
    const bucket = this.buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      this.buckets.set(key, {
        count: 1,
        resetAt: now + this.windowMs,
      });

      return true;
    }

    if (bucket.count >= this.max) {
      return false;
    }

    bucket.count++;

    return true;
  }

  cleanup(now = Date.now()): void {
    for (const [key, bucket] of this.buckets) {
      if (bucket.resetAt <= now) {
        this.buckets.delete(key);
      }
    }
  }
}
