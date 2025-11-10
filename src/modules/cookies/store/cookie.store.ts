import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface Cookie {
    key: string;
    value: string;
    domain: string;
    path: string;
    expires?: string;
    secure?: boolean;
    httpOnly?: boolean;
}

interface CookieStoreState {
    cookies: Cookie[];
    addCookie: (cookie: Cookie) => void;
    updateCookie: (oldCookie: Cookie, newCookie: Cookie) => void;
    removeCookie: (domain: string, key: string) => void;
    getCookiesForDomain: (domain: string) => Cookie[];
    clearCookies: () => void;
    clearExpiredCookies: () => number; // Returns count of cleared cookies
}

const useCookieStore = create<CookieStoreState>()(
    devtools(
        persist(
            (set, get) => ({
                cookies: [],
                addCookie: (cookie) =>
                    set((state) => {
                        // Remove existing cookie with same key and domain if exists
                        const filteredCookies = state.cookies.filter(
                            (c) => !(c.key === cookie.key && c.domain === cookie.domain)
                        );
                        return { cookies: [...filteredCookies, cookie] };
                    }),
                removeCookie: (domain, key) =>
                    set((state) => ({
                        cookies: state.cookies.filter(
                            (c) => !(c.key === key && c.domain === domain)
                        ),
                    })),
                getCookiesForDomain: (domain) => {
                    const targetDomain = domain.toLowerCase();
                    return get().cookies.filter((c) => {
                        const cookieDomain = c.domain.toLowerCase();
                        // Exact match
                        if (cookieDomain === targetDomain) return true;
                        // Subdomain match (e.g., api.example.com matches example.com)
                        if (targetDomain.endsWith('.' + cookieDomain)) return true;

                        return false;
                    });
                },
                updateCookie: (oldCookie, newCookie) =>
                    set((state) => {
                        // Remove old cookie
                        const withoutOld = state.cookies.filter(
                            (c) => !(c.key === oldCookie.key && c.domain === oldCookie.domain)
                        );
                        // Remove any existing cookie that conflicts with the new one
                        const withoutConflict = withoutOld.filter(
                            (c) => !(c.key === newCookie.key && c.domain === newCookie.domain)
                        );
                        return { cookies: [...withoutConflict, newCookie] };
                    }),
                clearCookies: () => set({ cookies: [] }),
                clearExpiredCookies: () => {
                    const now = new Date();
                    const currentCookies = get().cookies;
                    const validCookies = currentCookies.filter((cookie) => {
                        if (!cookie.expires) return true; // No expiry = keep
                        const expiryDate = new Date(cookie.expires);
                        return expiryDate > now;
                    });
                    const clearedCount = currentCookies.length - validCookies.length;
                    if (clearedCount > 0) {
                        set({ cookies: validCookies });
                    }
                    return clearedCount;
                },
            }),
            { name: 'cookie-store' }
        )
    )
);

export default useCookieStore;
