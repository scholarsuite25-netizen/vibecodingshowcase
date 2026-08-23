# Architectural Guidelines & Rate Limit Strategies

This file contains custom instructions for the AI agent. When implementing features in this project, adhere to the following architectural rules when applicable:

## 1. Multi-Model Routing (OpenRouter)
**Trigger:** When the user requests to add AI generation, LLM features, or text completions.
**Rule:** Use the OpenRouter API instead of a direct provider to avoid rate limits and handle fallbacks.
- Create secure server-side API routes for all OpenRouter calls.
- Default to Google's Gemini 1.5 Flash (or the currently requested model).
- Configure the OpenRouter fallback routing array to automatically fall back to an open-source model (e.g., Llama 3) if the primary model hits a rate limit or fails.

## 2. API Rate Limiting (Upstash / Redis)
**Trigger:** When the user requests to publish public-facing APIs, protect routes against spam, or add user rate-limiting.
**Rule:** Protect API routes using Redis-based rate limiting.
- Install and use `@upstash/ratelimit` and `@upstash/redis`.
- Create a middleware or utility function that limits users to a sensible default (e.g., 10 requests per minute) based on IP address or authenticated User ID.
- Return a `429 Too Many Requests` HTTP status if exceeded, and ensure the frontend UI handles this gracefully by telling the user to slow down.

## 3. Context Caching (Gemini API)
**Trigger:** When the user requests to analyze massive documents (PDFs, large codebases, books) repeatedly.
**Rule:** Use the official `@google/genai` SDK and implement Context Caching to save on token costs and avoid TPM limits.
- Do not pass the full massive text in every prompt.
- Write a server-side script to upload the source data via the Gemini File API.
- Generate a Cache ID for the uploaded files.
- Use that Cache ID for all subsequent user queries referencing that data.

## 4. Pre-Flight Systems Architecture (The "OpenCode" Workflow)
**Trigger:** When starting any new feature, bug fix, or complex integration.
**Rule:** Enforce a "Read Before Write" and "Plan Before Code" methodology to emulate advanced coding models.
- **Audit Existing Code:** Always run terminal commands (`grep`, `ls`) or use `view_file` to thoroughly read the existing codebase architecture before making ANY edits. Never assume file structures.
- **Modularization:** Keep `page.tsx` extremely clean. Abstract UI elements into reusable components inside `/components` and abstract logic into `/lib` or hooks.
- **Zero-Mock Policy:** Never build fake JSON placeholders for data unless explicitly told to. Build real, extensible data structures (like SQLite/PostgreSQL schemas or Firebase collections).

## 5. Strict Brand Assets & UI Identity
**Trigger:** When generating new user interfaces, navbars, or updating styles.
**Rule:** Prioritize user-provided brand assets over AI-generated placeholders.
- **Asset Discovery:** Always check the `/public` directory first for existing logos, favicons, or brand imagery (e.g., `Chrisland-Logo.jpeg`) before using generic icons.
- **Anti-Slop UI:** Reject generic "AI UI" templates (like purple-to-blue gradients or stacked nested cards). Use sophisticated, mathematically scaled typography and spacing.
- **Brand Consistency:** If a primary brand color is established (e.g., Chrisland University Purple and Gold), extract those exact hex codes and use them consistently across the app's Tailwind configuration. 

## 6. Secure Full-Stack Boundaries
**Trigger:** When integrating any third-party APIs, SDKs, or databases.
**Rule:** Emulate a secure production environment.
- **No Client-Side Secrets:** NEVER expose API keys (Gemini, OpenRouter, Stripe, Supabase) in client-side React components or prefix them with `NEXT_PUBLIC_` unless they are explicitly meant to be public.
- **API First:** Always create a Next.js API route (`/app/api/...`) or Server Action to act as a secure proxy between the frontend client and the third-party service.

## 7. Database & Backend Preference (Supabase)
**Trigger:** When a database, user authentication, or backend storage is needed.
**Rule:** Default to Supabase for all database and backend needs.
- Do NOT provision Firebase or Cloud SQL unless the user explicitly overrides this rule.
- Use `@supabase/supabase-js` or `@supabase/ssr` for integration.
- Rely on Supabase's PostgreSQL database, Row Level Security (RLS) for data protection, and Supabase Auth for user management.

## 8. Deployment Compatibility (Vercel & Hostinger)
**Trigger:** When configuring the build system, `package.json`, or environment variables.
**Rule:** Ensure the codebase is universally deployable.
- The app must be fully compatible with Vercel's Edge/Serverless functions natively.
- Avoid proprietary Vercel-only packages (like `@vercel/postgres`) so the app can easily be migrated to a standard Node.js server on Hostinger or a VPS in the future.
- Use standard `.env.example` files to clearly map out required variables for GitHub Actions or external CI/CD pipelines.

## 9. The "Zero-Cost" / Bootstrapper Architecture
**Trigger:** When selecting third-party services, APIs, or infrastructure.
**Rule:** Strictly prioritize 100% free-tier resources and open-source alternatives.
- Only suggest or implement tools that offer generous free tiers (e.g., Supabase Free Tier, Resend for free emails, Vercel for free hosting, free public APIs).
- If a requested feature requires a paid service, explicitly warn the user and attempt to find a free or open-source workaround first.

## 10. Continuous Auto-Deployment (GitHub & Vercel)
**Trigger:** Whenever code changes, feature additions, bug fixes, or optimizations are completed and verified.
**Rule:** Always stage, commit with a descriptive message, and automatically push changes to the `main` branch on GitHub (`git push origin main`) to trigger Vercel's automated CI/CD deployment pipeline without requiring manual user intervention.

