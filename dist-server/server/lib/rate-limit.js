export class RateLimiter {
    max;
    windowMs;
    buckets = new Map();
    constructor(max, windowMs) {
        this.max = max;
        this.windowMs = windowMs;
    }
    allow(key, now = Date.now()) {
        const bucket = this.buckets.get(key);
        if (!bucket || bucket.resetAt <= now) {
            this.buckets.set(key, { count: 1, resetAt: now + this.windowMs });
            return true;
        }
        if (bucket.count >= this.max)
            return false;
        bucket.count++;
        return true;
    }
    cleanup(now = Date.now()) {
        for (const [key, bucket] of this.buckets)
            if (bucket.resetAt <= now)
                this.buckets.delete(key);
    }
}
