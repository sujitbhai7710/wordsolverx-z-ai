export interface PerformanceMetrics {
    fcp?: number;
    lcp?: number;
    cls?: number;
    inp?: number;
}

export interface AnalyticsEvent {
    category: 'gameplay' | 'engagement' | 'error' | 'performance';
    action: string;
    label?: string;
    value?: number;
    metadata?: Record<string, any>;
}

type GtagFunction = (...args: any[]) => void;

function getGtag(): GtagFunction | null {
    if (typeof window === 'undefined') return null;
    return (window as Window & typeof globalThis & { gtag?: GtagFunction }).gtag ?? null;
}

class Monitor {
    private metrics: PerformanceMetrics = {};
    private isInitialized = false;

    init() {
        if (typeof window === 'undefined' || this.isInitialized) return;
        this.isInitialized = true;

        this.observeLCP();
        this.observeCLS();
        this.observeINP();
        this.observeFCP();
    }

    private observeLCP() {
        try {
            const observer = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.metrics.lcp = lastEntry.startTime;

                if (this.metrics.lcp > 2500) {
                    console.warn(`[Performance] High LCP detected: ${Math.round(this.metrics.lcp)}ms`);
                }
            });
            observer.observe({ type: 'largest-contentful-paint', buffered: true });
        } catch (e) {
            // Browser doesn't support this metric
        }
    }

    private observeCLS() {
        try {
            let clsValue = 0;
            const observer = new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    if (!(entry as any).hadRecentInput) {
                        clsValue += (entry as any).value;
                    }
                }
                this.metrics.cls = clsValue;

                if (this.metrics.cls > 0.1) {
                    console.warn(`[Performance] High CLS detected: ${this.metrics.cls.toFixed(3)}`);
                }
            });
            observer.observe({ type: 'layout-shift', buffered: true });
        } catch (e) {
            // Browser doesn't support this metric
        }
    }

    private observeINP() {
        try {
            const observer = new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    this.metrics.inp = Math.max(this.metrics.inp || 0, entry.duration);

                    if (this.metrics.inp > 200) {
                        console.warn(`[Performance] High INP detected: ${Math.round(this.metrics.inp)}ms`);
                    }
                }
            });
            observer.observe({ type: 'event', buffered: true, durationThreshold: 40 } as any);
        } catch (e) {
            // Browser doesn't support this metric
        }
    }

    private observeFCP() {
        try {
            const observer = new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntriesByName('first-contentful-paint')) {
                    this.metrics.fcp = entry.startTime;

                    if (this.metrics.fcp > 1800) {
                        console.warn(`[Performance] High FCP detected: ${Math.round(this.metrics.fcp)}ms`);
                    }
                }
            });
            observer.observe({ type: 'paint', buffered: true });
        } catch (e) {
            // Browser doesn't support this metric
        }
    }

    getMetrics(): PerformanceMetrics {
        return { ...this.metrics };
    }
}

class Tracker {
    private lastPagePath: string | null = null;

    trackEvent(event: AnalyticsEvent) {
        if (typeof window === 'undefined') return;

        const gtag = getGtag();
        if (gtag) {
            gtag('event', event.action, {
                event_category: event.category,
                event_label: event.label,
                value: event.value,
                ...event.metadata
            });
        }

        // In a real application, this would send data to an analytics endpoint
        // (e.g., Google Analytics, Mixpanel, custom backend)
        // For now, we log it to the console in development
        if (import.meta.env?.DEV) {
            console.groupCollapsed(`[Analytics] ${event.action}`);
            console.log('Category:', event.category);
            if (event.label) console.log('Label:', event.label);
            if (event.value !== undefined) console.log('Value:', event.value);
            if (event.metadata) console.log('Metadata:', event.metadata);
            console.groupEnd();
        }
    }

    trackPageView(path: string) {
        if (path === this.lastPagePath) return;
        this.lastPagePath = path;

        const gtag = getGtag();
        if (gtag && typeof window !== 'undefined') {
            gtag('event', 'page_view', {
                page_path: path,
                page_location: window.location.href,
                page_title: document.title
            });
        }

        if (import.meta.env?.DEV) {
            console.groupCollapsed('[Analytics] page_view');
            console.log('Category:', 'engagement');
            console.log('Label:', path);
            console.groupEnd();
        }
    }

    trackError(error: Error, component?: string) {
        this.trackEvent({
            category: 'error',
            action: 'exception',
            label: error.name,
            metadata: {
                message: error.message,
                stack: error.stack,
                component
            }
        });
    }
}

export const PerformanceMonitor = new Monitor();
export const AnalyticsTracker = new Tracker();
