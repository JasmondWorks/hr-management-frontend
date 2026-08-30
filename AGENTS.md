# CLAUDE.md — Project Architecture & Agent Instructions

> This file governs how Claude Code operates in this repository. Every rule here is non-negotiable. Read the entire file before writing a single line of code or creating any file.

---

## Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript — strict mode, no `any`
- **Styling:** Tailwind CSS + `clsx` + `tailwind-merge` (via `cn()` utility)
- **State:** Zustand (client state) + React Query / TanStack Query (server cache)
- **Forms:** React Hook Form + Zod
- **HTTP:** Axios (single shared instance with interceptors)
- **Auth:** In-memory access token + httpOnly refresh token cookie

---

## Architecture: Feature-Sliced Design (FSD)

This project uses Feature-Sliced Design. Every file you create must fit into one of the five layers below. If you are unsure where a file belongs, resolve it using the decision rules in this file before proceeding.

### Layer Stack (top → bottom)

```
app/ → widgets/ → features/ → entities/ → shared/
```

**The one unbreakable rule: each layer may only import from layers below it. Never import upward.**

- `shared/` imports from nothing in this project
- `entities/` imports from `shared/` only
- `features/` imports from `entities/` and `shared/` only
- `widgets/` imports from `features/`, `entities/`, and `shared/` only
- `app/` imports from all layers

Violation of this rule is a hard error. If you find yourself needing to import a feature from another feature, stop and extract the shared logic to `entities/` or `shared/` first.

### Layer Purposes

| Layer       | Purpose                                                                                                                                                      |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `app/`      | Next.js App Router — route pages, layouts, providers, middleware. Zero business logic. Route page files are thin wrappers only.                              |
| `widgets/`  | Large composite UI blocks not tied to a single route — navbar, sidebar, page shells, dashboard cards assembled from multiple features/entities.              |
| `features/` | User capabilities — everything a user actively triggers: forms, mutation flows, multi-step actions. Grouped by domain noun when flows share state and types. |
| `entities/` | Business domain models — the nouns of the app. Owns types, reusable API calls, Zustand stores, and display components for each domain entity.                |
| `shared/`   | Pure reusables — API client, token manager, design system primitives, utils, config, constants. No business logic. Never imports from features or entities.  |

---

## Feature Naming & Grouping

Features answer: **"what can the user do?"**

- Group flows under a domain noun when they share state, types, or logic: `features/auth/login/`, `features/auth/register/`, `features/auth/forgot-password/` — all under `features/auth/`
- Do NOT create top-level `auth-login/`, `auth-register/` splits. That is wrong.
- Independent flows with no shared state go flat: `features/checkout/`, `features/onboarding/`
- Single-screen features go flat as a noun: `features/profile/`

**Grouping rule: group by shared state and shared types, not by screen count.**

---

## Directory Structure

Every project follows this exact structure. Do not invent new top-level directories.

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── forgot-password/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── settings/page.tsx
│   ├── onboarding/page.tsx
│   ├── 403/page.tsx
│   ├── layout.tsx
│   ├── providers.tsx
│   └── middleware.ts
│
├── widgets/
│   └── [widget-name]/
│       ├── ui/[WidgetName].tsx
│       └── index.ts
│
├── features/
│   └── [domain]/
│       └── [flow-name]/
│           ├── ui/[FlowName].tsx       # 'use client' — interactive component
│           ├── model/use[FlowName].ts  # 'use client' — logic hook (only if interactive)
│           ├── api/[flowName]Action.ts # 'use server' — Server Action (if needed)
│           ├── schema.ts               # Zod schema + inferred FormInput type
│           ├── types.ts                # DTOs, response types for this flow only
│           └── index.ts
│
├── entities/
│   └── [noun]/
│       ├── api/
│       │   ├── [noun]Api.ts            # Raw async API functions
│       │   └── [noun]Queries.ts        # React Query hooks (only if client-interactive)
│       ├── model/
│       │   ├── types.ts                # Entity shape types — User, Wallet, Escrow, etc.
│       │   └── [noun]Store.ts          # Zustand store
│       ├── ui/
│       │   └── [NounComponent].tsx     # Reusable display components — Server Components
│       └── index.ts
│
└── shared/
    ├── api/
    │   ├── client.ts                   # Axios instance
    │   ├── tokenManager.ts             # In-memory token store
    │   └── types.ts                    # ApiResponse<T>, PaginatedResponse<T>, ApiError
    ├── config/
    │   ├── env.ts
    │   ├── routes.ts                   # ROUTES constant
    │   └── roles.ts                    # UserRole + ROLE_ACCESS_MAP
    ├── lib/
    │   ├── queryClient.ts
    │   └── stores.ts                   # Re-export of all Zustand stores
    ├── hooks/
    ├── utils/
    │   └── cn.ts                       # clsx + tailwind-merge
    ├── constants/
    │   └── index.ts
    └── ui/
        ├── Button/
        ├── Input/
        ├── Modal/
        ├── Toast/
        └── index.ts
```

---

## File-Level Rules

### `app/*/page.tsx` — Route Pages

- Zero logic. Zero state. Zero API calls.
- Only allowed content: import a feature component, return JSX wrapping it.
- May be `async` Server Components when they need to prefetch data or pass server-fetched props to client islands.

```tsx
// CORRECT
import { LoginForm } from "@/features/auth/login";
export default function LoginPage() {
  return (
    <main>
      <LoginForm />
    </main>
  );
}

// CORRECT — async server page passing data to client island
export default async function SettingsPage() {
  const profile = await authApi.getProfile();
  return <EditProfileForm initialValues={profile} />;
}
```

### `features/[domain]/[flow]/ui/`

- Always `'use client'` — these are interactive components.
- Receives data and handlers from the `model/` hook in the same flow, or as props from a server page.
- Never imports `apiClient` directly.
- Never reads from a Zustand store directly — get values from the model hook.

### `features/[domain]/[flow]/model/`

- Always `'use client'`.
- Only exists when the feature has client-side interactivity after page load.
- Static display features (read-only, no filters, no mutations from the client) do NOT get a `model/` directory. Use an `async` Server Component in `ui/` instead.
- Calls functions from `entities/*/api/` or the feature's own `api/` — never calls `apiClient` directly.

### `features/[domain]/[flow]/schema.ts`

- Zod schema only. No `'use client'` or `'use server'`.
- Runs on both server and client.
- The `FormInput` type is **always inferred** via `z.infer<typeof schema>` — never written manually.
- Each flow gets its own schema even if it touches the same entity. Validation rules are action-specific.

```typescript
// CORRECT
export const registerSchema = z.object({ ... });
export type RegisterFormInput = z.infer<typeof registerSchema>; // inferred

// WRONG — never do this
export type RegisterFormInput = {
  email: string;
  password: string;
};
```

### `features/[domain]/[flow]/types.ts`

- DTOs and action-specific types that only exist for this flow.
- Does NOT duplicate types that exist in `entities/*/model/types.ts`.
- Types inferred from `schema.ts` live there, not here.
- Examples: `RegisterDto` (payload sent to server, excludes `confirmPassword`), `RegisterResponse`.

### `features/[domain]/[flow]/api/`

- Server Actions marked `'use server'`.
- Always call `revalidatePath()` or `revalidateTag()` after mutations.
- Only add this directory when the feature has a mutation not already covered by entity-level API functions.

### `entities/[noun]/model/types.ts`

- Describes what the entity **IS** — its shape, attributes, status enums.
- Consumed everywhere in the app.
- Examples: `User`, `UserProfile`, `Wallet`, `Transaction`, `Escrow`, `EscrowStatus`.
- Never define entity types inline in components or feature files.

### `entities/[noun]/api/[noun]Api.ts`

- Plain async functions that call `apiClient`. No React.
- These are called by: feature model hooks, Server Components directly, auth bootstrap.

### `entities/[noun]/api/[noun]Queries.ts`

- React Query `useQuery` / `useMutation` wrappers.
- **Only created when the data needs client-side interactivity** (filtering, pagination, polling, cache invalidation after mutations).
- Static reads skip this file entirely — Server Components call the api functions directly.

### `entities/[noun]/ui/`

- Reusable display components for this entity — `UserAvatar`, `EscrowStatusBadge`, `WalletCard`.
- Server Components by default. Add `'use client'` only if they require interactivity.
- Props only — no API calls, no store reads.

### `entities/[noun]/model/[noun]Store.ts`

- Zustand store for this entity's client state.
- One store per entity. Never a single global store.
- Always wrap with `devtools` middleware.

### `shared/ui/`

- Design system primitives only — `Button`, `Input`, `Modal`, `Toast`.
- No business logic. No API calls. No store reads. Props only.

### `shared/api/client.ts`

- The only Axios instance in the project. Never create another.
- Handles: token injection on requests, silent refresh on 401, request queue during refresh.

### `shared/api/tokenManager.ts`

- In-memory access token storage only.
- Never use `localStorage`, `sessionStorage`, or cookies for the access token.

### `shared/config/routes.ts`

- All route strings live here as the `ROUTES` constant.
- Never hardcode a route string anywhere else in the app.

### `shared/lib/stores.ts`

- Re-exports all Zustand stores for IDE discoverability.
- Consumers may also import directly from the entity.

---

## Type Placement — Decision Table

Before creating any type or interface, resolve its location using this table:

| Question                                                                       | Answer                                                             |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| Does this type describe what an entity **IS** (its shape, status, attributes)? | `entities/[noun]/model/types.ts`                                   |
| Is this type a form input shape?                                               | Infer it via `z.infer<>` in `schema.ts` — do not write it manually |
| Is this type a DTO (payload sent to server) or a flow-specific response?       | `features/[domain]/[flow]/types.ts`                                |
| Is this type a generic API wrapper used across the whole app?                  | `shared/api/types.ts`                                              |
| Is this type used in 2+ features or 2+ entities?                               | `entities/[noun]/model/types.ts` or `shared/api/types.ts`          |
| Is this type only ever used inside one specific flow?                          | `features/[domain]/[flow]/types.ts`                                |

**Never define types inline in component files or model hooks.**

---

## Server-First Rule

> Every component is a Server Component by default. Add `'use client'` only at the exact boundary where interactivity begins — never higher.

### The Pattern

```
app/(dashboard)/settings/page.tsx     ← async Server Component (fetches data, no 'use client')
    └── EditProfileForm               ← 'use client' boundary — the form itself
```

The page fetches and passes data down. The form handles interaction. `'use client'` never goes on the page.

### When to Use Each Approach

| Scenario                                               | Approach                                                               |
| ------------------------------------------------------ | ---------------------------------------------------------------------- |
| Page data, no client interaction needed after load     | `async` Server Component with direct `await`                           |
| Data user can filter, paginate, or refetch client-side | React Query `useQuery` in a Client Component                           |
| Form submissions and mutations                         | React Query `useMutation` OR Server Actions + `useTransition`          |
| Data that polls or updates via SSE                     | React Query `refetchInterval` or custom SSE hook                       |
| Server-rendered initial data + client interactivity    | `prefetchQuery` on server → `HydrationBoundary` → `useQuery` on client |

### Static Display — No `model/`, No React Query

When a feature only displays data with no client interaction, write it as an async Server Component. No `model/` directory, no `useQuery`, no `'use client'`.

```tsx
// features/escrow/escrow-detail/ui/EscrowDetail.tsx
// NO 'use client' — async Server Component

import { escrowApi } from "@/entities/escrow/api/escrowApi";

export async function EscrowDetail({ escrowId }: { escrowId: string }) {
  const escrow = await escrowApi.getById(escrowId);
  return <div>{escrow.title}</div>;
}
```

### Server Prefetch + Client Hydration

When data must be server-rendered AND client-interactive:

```tsx
// app/(dashboard)/escrow/page.tsx
export default async function EscrowPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: escrowKeys.list({ status: "all" }),
    queryFn: () => escrowApi.getAll({ status: "all" }),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EscrowList /> {/* Client Component — finds data already in cache */}
    </HydrationBoundary>
  );
}
```

---

## Auth Architecture

### Token Strategy

- **Access token:** stored in memory via `tokenManager.ts`. Cleared on page refresh.
- **Refresh token:** stored in an httpOnly cookie. Set by the backend on login/refresh.
- **Session cookie:** a lightweight readable cookie (not httpOnly) set by the backend alongside the refresh token. Used by `middleware.ts` to check auth state without making API calls.

### Bootstrap Flow (on every page load/refresh)

1. `app/providers.tsx` mounts `AuthBootstrap` which calls `useBootstrapAuth()`
2. `useBootstrapAuth` hits `/auth/refresh` — the httpOnly cookie is sent automatically
3. On success: stores the new access token in memory, fetches full profile, sets user in Zustand auth store
4. On failure: marks `isHydrated = true` and continues — user is unauthenticated
5. Protected layouts read `isHydrated` before rendering or redirecting

### Auth Store Shape

```typescript
interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isHydrated: boolean; // true once bootstrap attempt completes, regardless of outcome

  setUser: (user: UserProfile) => void;
  clearUser: () => void;
  setHydrated: () => void;
}
```

### Protected Layout Pattern

```tsx
// app/(dashboard)/layout.tsx
"use client";
export default function DashboardLayout({ children }) {
  const { isAuthenticated, isHydrated } = useAuthStore();
  if (!isHydrated) return <FullPageSpinner />;
  if (!isAuthenticated) redirect(ROUTES.LOGIN);
  return <>{children}</>;
}
```

---

## Middleware Rules

`app/middleware.ts` enforces all routing gates. It runs on the Edge and **never makes API calls**. It reads cookies only.

### Required Cookies (set by backend)

- `session` — presence indicates authenticated session
- `role` — the user's role string (matches `UserRole` type)
- `onboarding_complete` — set once onboarding is done

### Gate Order (must follow this exact sequence)

1. Not authenticated + not public route → redirect to `ROUTES.LOGIN` with `?next=` param
2. Authenticated + on public auth route → redirect to `ROUTES.DASHBOARD`
3. Authenticated + onboarding incomplete + not on onboarding route → redirect to `ROUTES.ONBOARDING`
4. Authenticated + role not allowed for this route → redirect to `ROUTES.FORBIDDEN`

### Role Access Map

Lives in `shared/config/roles.ts`. Maps each role to the route prefixes it can access. Middleware imports this — do not define role logic in the middleware file itself.

---

## Zustand Store Rules

- **One store per entity domain.** Never one giant global store.
- Always wrap with `devtools` middleware and give it a `name` for DevTools.
- Entity stores live in `entities/[noun]/model/[noun]Store.ts`.
- `shared/lib/stores.ts` re-exports all stores for discoverability.

### React Query + Zustand Sync Pattern

When React Query fetches entity data, sync it into the Zustand store inside `queryFn` or `onSuccess`:

```typescript
queryFn: async () => {
  const profile = await authApi.getProfile();
  setUser(profile); // sync to Zustand store
  return profile;
};
```

Zustand is the derived, always-current client representation of the last server response — not an independent data source.

### State Ownership Table

| Concern                                     | Owner                                |
| ------------------------------------------- | ------------------------------------ |
| Initial page data, no post-load interaction | Server Component `await`             |
| Server data with client interaction         | React Query                          |
| Loading / error state for API calls         | React Query (`isPending`, `isError`) |
| Currently logged-in user identity           | Zustand `authStore`                  |
| Live balance / SSE-driven updates           | Zustand entity store                 |
| Modal open/close, tab state                 | `useState`                           |
| Cross-component shared UI state             | Zustand (dedicated store)            |

---

## Axios Client Rules

- **One instance only** — `shared/api/client.ts`. Never create a second Axios instance.
- `withCredentials: true` on the instance — sends httpOnly refresh cookie automatically.
- Request interceptor injects the access token from `tokenManager.get()`.
- Response interceptor handles 401: silently refreshes, queues concurrent requests, retries on success, redirects to login on failure.
- Never call `axios.create()` anywhere else in the project.

---

## Form Rules

All forms use **React Hook Form + Zod**.

1. Define schema in `schema.ts` — Zod object with all validation rules.
2. Infer the form type: `export type XFormInput = z.infer<typeof xSchema>`.
3. In the model hook: `useForm<XFormInput>({ resolver: zodResolver(xSchema) })`.
4. Pass `form` object and `onSubmit` handler to the UI component.
5. UI component calls `form.handleSubmit(onSubmit)` — never define submit logic in the UI component.
6. For Server Action flows: use `useTransition` in the model hook, call the server action inside `startTransition`.
7. For API mutation flows: use `useMutation` in the model hook, call the entity API function.

---

## Naming Conventions

| Item                | Convention                    | Example                                  |
| ------------------- | ----------------------------- | ---------------------------------------- |
| Feature folder      | `kebab-case`                  | `create-escrow/`, `fund-wallet/`         |
| Entity folder       | singular noun                 | `user/`, `wallet/`, `escrow/`            |
| Component files     | `PascalCase.tsx`              | `LoginForm.tsx`, `WalletCard.tsx`        |
| Hook files          | `camelCase.ts` prefixed `use` | `useLoginForm.ts`, `useBootstrapAuth.ts` |
| Entity API files    | suffixed `Api` or `Queries`   | `userApi.ts`, `walletQueries.ts`         |
| Server Action files | suffixed `Action`             | `updateProfileAction.ts`                 |
| Store files         | suffixed `Store`              | `userStore.ts`, `walletStore.ts`         |
| Schema files        | `schema.ts`                   | `features/auth/register/schema.ts`       |
| Feature type files  | `types.ts`                    | `features/auth/register/types.ts`        |
| Entity type files   | `types.ts` in `model/`        | `entities/user/model/types.ts`           |
| Query key factories | `[noun]Keys`                  | `userKeys`, `escrowKeys`                 |
| Route constants     | `SCREAMING_SNAKE_CASE`        | `ROUTES.DASHBOARD`                       |
| Role constants      | `SCREAMING_SNAKE_CASE`        | `UserRole.ADMIN`                         |

---

## Public API — `index.ts` Pattern

Every feature and entity exposes a public API via `index.ts`. **Consumers always import from `index.ts`, never from internal paths.**

```typescript
// features/auth/login/index.ts
export { LoginForm } from "./ui/LoginForm";
export { useLoginForm } from "./model/useLoginForm";
export type { LoginFormInput } from "./schema";

// features/auth/index.ts
export * from "./login";
export * from "./register";
export * from "./forgot-password";
```

If you find yourself writing `import { X } from '@/features/auth/login/ui/LoginForm'` from outside that feature, the `index.ts` is missing an export. Fix the index, don't break the pattern.

---

## File Relocation Rules

Use this table whenever you're unsure where a file belongs or whether an existing file is in the right place:

| Signal                                      | Action                                                                     |
| ------------------------------------------- | -------------------------------------------------------------------------- |
| File is imported by 3+ different features   | Move to `entities/[noun]/` or `shared/`                                    |
| File only used in one flow                  | Keep it inside that feature flow                                           |
| File has zero business logic (pure display) | `shared/ui/` or `entities/[noun]/ui/`                                      |
| File defines entity shape types             | `entities/[noun]/model/types.ts`                                           |
| File defines flow-specific DTOs             | `features/[domain]/[flow]/types.ts`                                        |
| File defines a form schema                  | `features/[domain]/[flow]/schema.ts`                                       |
| File makes API calls                        | `entities/[noun]/api/` or `features/[domain]/[flow]/api/` — never in `ui/` |
| File reads from a Zustand store             | Feature `model/` hook or widget — never in `shared/ui/`                    |

> The itch to relocate a file is always the right signal. Follow it immediately rather than leaving a misplaced file and moving on.

---

## Anti-Patterns — Never Do These

| Anti-Pattern                                       | What to Do Instead                                                                                   |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `apiClient` called directly inside a UI component  | Call it only in `entities/*/api/` or `features/*/api/`                                               |
| Entity types defined inline in components          | Define in `entities/[noun]/model/types.ts`                                                           |
| `FormInput` types written manually                 | Always use `z.infer<typeof schema>`                                                                  |
| Entity types duplicated inside feature `types.ts`  | Import from `entities/[noun]/model/types.ts` and extend if needed                                    |
| Zustand store read inside `shared/ui/`             | Pass values as props from the model hook                                                             |
| Single giant store file for all app state          | One store per entity                                                                                 |
| Hardcoded route string anywhere in the app         | Use `ROUTES.*` from `shared/config/routes.ts`                                                        |
| Access token in `localStorage` or `sessionStorage` | In-memory only via `tokenManager`                                                                    |
| API call inside `middleware.ts`                    | Middleware reads cookies only                                                                        |
| Logic inside `app/*/page.tsx`                      | Pages import from features — zero logic in page files                                                |
| `'use client'` on a page or layout for form needs  | Put `'use client'` on the form component only                                                        |
| `model/` + `useQuery` for a static read            | Use `async` Server Component with direct `await`                                                     |
| `useEffect` for data fetching                      | Server Component `await` or React Query                                                              |
| Importing a feature from another feature           | Extract to `entities/` or `shared/` first                                                            |
| `schema.ts` and `types.ts` merged into one file    | Keep them separate — schema owns validation + inferred types, `types.ts` owns DTOs + response shapes |
| Second `axios.create()` call anywhere              | Extend or configure the single instance in `shared/api/client.ts`                                    |
| Defining query keys as plain strings inline        | Always use a `[noun]Keys` factory object in `[noun]Queries.ts`                                       |

---

## Checklist Before Creating Any File

Answer every question before writing code:

1. **Which layer does this file belong to?** (app / widgets / features / entities / shared)
2. **Does it only import from layers below it?**
3. **If it's a type — does it describe an entity shape (→ entities) or a flow-specific payload (→ feature)?**
4. **If it's a component — is it a Server Component (default) or does it need `'use client'`? What is the minimum boundary?**
5. **If it fetches data — is this a one-time server read (→ `async` Server Component) or does the user interact with it after load (→ React Query)?**
6. **If it's a form — does `schema.ts` exist? Is the form type inferred from it?**
7. **Does an `index.ts` need to be updated to expose this file's exports?**
8. **Is there already a file somewhere in the project that does this job?** If yes, extend it instead of creating a duplicate.

---

## Current Project Context (Learnings)

- **Theming & Colors**: The project uses semantic Tailwind variables mapped to CSS variables (e.g. `bg-card`, `bg-background`, `border-border`, `text-foreground`, `text-muted-foreground`, `bg-primary`, `text-primary-foreground`) to support both light and dark modes dynamically. Never hardcode absolute dark or light colors like `bg-[#1a1c1e]`, `text-white` or `border-[#2e3135]`.
- **Icons**: A comprehensive set of preset UI icons are already provided in `@/shared/ui/icons`. Always prefer importing these local icons over third-party icon libraries like `@heroicons`.
- **Form Elements**: Utilize established UI primitives like `InputField` from `shared/ui` to maintain consistency instead of manually creating raw `input` tags with class names.
