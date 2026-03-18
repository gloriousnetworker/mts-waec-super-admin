# MTS WAEC Super Admin — Frontend Fix Plan

> Generated: 2026-03-17
> Based on: Backend AUDIT_PLAN.md (Batch 2) + Full codebase audit
> Last Updated: 2026-03-17
> Status: **ALL BATCH 2 ITEMS COMPLETE — READY FOR BACKEND TO APPLY THEIR CHANGES**

---

## BATCH 2 STATUS SUMMARY

| Item | Severity | Frontend Status | Backend can apply? |
|------|----------|----------------|--------------------|
| C-3 · Token response handling | CRITICAL | ✅ Fixed | YES |
| H-3 · Default student password | HIGH | N/A (not applicable to super admin) | YES |
| H-5 · TOTP secret in 2FA setup | HIGH | ✅ Fixed | YES |
| M-6 · Pagination on list endpoints | MEDIUM | ✅ Fixed | YES |

**All super-admin-side Batch 2 fixes are deployed. Backend team may now apply their corresponding changes.**

---

## BATCH 2 FIXES APPLIED

---

### ✅ C-3 · JWT Tokens Returned in JSON Response Body
**Severity:** CRITICAL
**Files changed:** `src/context/AuthContext.jsx`, `src/app/login/verify-2fa/page.jsx`

**Problem:** The login and 2FA verification success checks were gated on `data.tokens` being present in the JSON response body. When the backend removes tokens from the response body (the security fix), these conditions would evaluate to `false`, silently breaking every login.

**Changes made:**

`src/context/AuthContext.jsx` — login success check:
```js
// BEFORE
} else if (data.user && data.tokens) {
  setUser(data.user);
  return { success: true, user: data.user, tokens: data.tokens };

// AFTER
} else if (data.user) {
  setUser(data.user);
  return { success: true, user: data.user };
```

`src/context/AuthContext.jsx` — verifyTwoFactor success check:
```js
// BEFORE
if (response.ok && data.user && data.tokens) {
  setUser(data.user);
  return { success: true, user: data.user, tokens: data.tokens };

// AFTER
if (response.ok && data.user) {
  setUser(data.user);
  return { success: true, user: data.user };
```

`src/app/login/verify-2fa/page.jsx`:
```js
// BEFORE
if (result.success && result.tokens) {

// AFTER
if (result.success) {
```

**Cookie transport confirmed:** All fetch calls already use `credentials: 'include'`. The `fetchWithAuth` wrapper and token refresh flow (`POST /api/auth/refresh`) are correctly implemented and do not rely on tokens in the response body. No further changes needed.

**Backend action:** Remove `tokens` from the JSON body of:
- `POST /api/auth/login` response
- `POST /api/auth/verify-2fa` response

---

### ✅ H-5 · Raw TOTP Secret in 2FA Setup Response
**Severity:** HIGH
**File changed:** `src/components/dashboard-content/Settings.jsx`

**Problem:** The 2FA setup modal displayed the raw TOTP `secret` key returned by `POST /api/auth/setup-2fa` in a visible "Secret Key" block. This exposed the secret to screen recordings, shoulder surfing, and browser DevTools.

**Changes made:**

- Removed `const [twoFASecret, setTwoFASecret] = useState('');` state
- Removed `setTwoFASecret(data.secret)` from the setup handler
- Removed the "Secret Key" display block from the modal
- Updated modal description text from "...or enter the secret key manually" to "Scan this QR code with Google Authenticator or Authy to enable two-factor authentication."
- QR code display (`data.qrCode`) is kept and continues to work as before

**Backend action:** Remove `secret` and `otpauthUrl` from `POST /api/auth/setup-2fa` response. Only `qrCode` should be returned.

---

### ✅ H-3 · Default Student Password in API Response
**Severity:** HIGH
**Applicable to super admin:** NO

The super admin dashboard has no student creation functionality. Students are created only from the school admin dashboard (`/api/admin/students`). No changes were needed in this app.

**Backend action for admin frontend:** The admin dashboard team needs to update their student creation flow to display a static message ("Default password is 123456") instead of reading it from `credentials.password` in the API response.

---

### ✅ M-6 · Pagination on List Endpoints
**Severity:** MEDIUM
**Files changed:** `src/components/dashboard-content/Students.jsx`, `src/components/dashboard-content/Admins.jsx`, `src/components/dashboard-content/Schools.jsx`, `src/components/dashboard-content/Support.jsx`

**Problem:** All four list views fetched the entire collection from the backend with no limit or page params, making them slow on large datasets.

**Changes made to all four components:**

- Added `PAGE_SIZE = 50` constant
- Added `page` state (starts at 1) and `totalCount` state
- Updated `useEffect` to re-fetch when `page` changes
- Updated all list fetch URLs to include `?limit=50&page=${page}` params
- Handle both old response shape (`{ students: [...] }`) and new paginated shape (`{ data: [...], total: N }`):
  ```js
  const list = data.data || data.students || []; // (admins/schools/tickets respectively)
  setTotalCount(data.total || list.length);
  ```
- Added `totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))`
- Added Previous/Next pagination controls below each table, only shown when `totalPages > 1`
- Total stat cards now show `totalCount` (true total) instead of page-scoped `list.length`

**Backward compatibility:** If the backend has not yet implemented pagination (no `total` field in response), `totalCount` falls back to `list.length` and the pagination controls are hidden (`totalPages = 1`). No breaking change to existing behaviour.

**Backend action:** Add `?limit` and `?page` query param support to:
- `GET /api/super-admin/students` → respond with `{ data: [...], total: N, page: N, limit: N }`
- `GET /api/super-admin/admins` → same shape
- `GET /api/super-admin/schools` → same shape
- `GET /api/super-admin/tickets` → same shape

---

## ADDITIONAL ISSUES FOUND IN FRONTEND AUDIT

These were not from Batch 2 but were discovered during the codebase review.

---

### FIX-4 · Wrong Backend URL in Dead Code Files (HIGH) — PENDING

**Problem:**
`src/lib/api.js` and `src/utils/api.js` both point to `https://nysc-backend.vercel.app` — the wrong server. The correct backend is `https://cbt-simulator-backend.vercel.app`. These files are currently unused but are a silent landmine for any developer who imports from them.

**Status:** Not yet fixed — low urgency since these files aren't imported anywhere active, but should be cleaned up.

---

### FIX-5 · Admin Create Form Sends Hardcoded Password (MEDIUM) — PENDING

**Problem:**
`src/components/dashboard-content/Admins.jsx` initialises `formData` with `password: 'Admin123!'` and sends this in every `POST /api/super-admin/admins` request. This is a predictable, source-visible default.

**Status:** Not yet fixed — requires coordination with backend on whether the backend should auto-generate the password internally.

---

### FIX-6 · Build Ignores TypeScript and ESLint Errors (LOW) — PENDING

**Problem:** `next.config.ts` has `ignoreBuildErrors: true` for both TypeScript and ESLint, silently swallowing errors during production builds.

**Status:** Not yet fixed — no runtime impact, low priority.

---

## FILES CHANGED IN THIS FIX

| File | Change |
|------|--------|
| `src/context/AuthContext.jsx` | C-3: Removed `data.tokens` gate from login and verifyTwoFactor success checks |
| `src/app/login/verify-2fa/page.jsx` | C-3: Removed `result.tokens` gate from 2FA verify submit handler |
| `src/components/dashboard-content/Settings.jsx` | H-5: Removed `twoFASecret` state, setup handler assignment, and Secret Key display block from modal |
| `src/components/dashboard-content/Students.jsx` | M-6: Added `page`/`totalCount` state, paginated fetch, pagination controls |
| `src/components/dashboard-content/Admins.jsx` | M-6: Added `page`/`totalCount` state, paginated fetch, pagination controls |
| `src/components/dashboard-content/Schools.jsx` | M-6: Added `page`/`totalCount` state, paginated fetch, pagination controls |
| `src/components/dashboard-content/Support.jsx` | M-6: Added `page`/`totalCount` state, paginated fetch, pagination controls |

---

## SIGNAL TO BACKEND TEAM

The super admin frontend has completed all Batch 2 coordination requirements:

**C-3 — CLEARED:**
Frontend no longer reads `tokens` from the login/verify-2fa response body. All auth relies on httpOnly cookies via `credentials: 'include'`. Backend may now remove `tokens` from those response bodies.

**H-5 — CLEARED:**
Frontend no longer reads or displays `secret` or `otpauthUrl` from the 2FA setup response. Backend may now return only `qrCode` from `POST /api/auth/setup-2fa`.

**M-6 — CLEARED:**
Frontend sends `?limit=50&page=N` on all four list endpoints and handles the paginated response shape `{ data, total, page, limit }`. Fully backward compatible — will continue to work with old response shape until backend deploys pagination.

**H-3 — NOT APPLICABLE:**
Super admin does not create students. No action needed on this side. Coordinate with the admin dashboard team for H-3.

---

*Coordinate with the admin dashboard and student app teams for C-3 and H-3 before applying those backend changes platform-wide, as those frontends may not yet be updated.*
