# GitHub Issue Drafts for Meetwise

This document contains 17 ready-to-copy issue drafts based on real improvements and missing components identified in the Meetwise codebase. They are divided by difficulty level: **10 Beginner**, **5 Intermediate**, and **2 Advanced**.

---

## 🟢 Beginner Issues (10 Issues)

### 1. bug: Fix Runtime Error in LogoutButton when Supabase Keys are Unconfigured
* **Issue Type**: bug
* **Problem Statement**: In `components/LogoutButton.tsx`, the Supabase browser client is initialized by importing `createBrowserClient` directly from `@supabase/ssr` and passing `process.env.NEXT_PUBLIC_SUPABASE_URL!` and `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!` with non-null assertions. If a user tries to run the application without setting these variables (e.g., during their initial local setup), it throws a runtime crash error in the browser console.
* **Why This Matters**: Instead of a crash, the application should handle unconfigured credentials gracefully by using our existing fallback/mock client returned by `getSupabaseBrowserClient()` from `lib/supabase/client.ts`.
* **Expected Solution**: Import `getSupabaseBrowserClient` in `components/LogoutButton.tsx` and replace the direct `createBrowserClient` call.
* **Files Likely Involved**:
  * `components/LogoutButton.tsx`
* **Step-by-step Guidance**:
  1. Open `components/LogoutButton.tsx`.
  2. Remove the import of `createBrowserClient` from `@supabase/ssr`.
  3. Import `getSupabaseBrowserClient` from `@/lib/supabase/client`.
  4. Replace the inline initialization inside `LogoutButton()` with:
     ```typescript
     const supabase = getSupabaseBrowserClient()
     ```
  5. Test by opening the app locally without `.env.local` to verify the button no longer crashes the page.
* **Acceptance Criteria**:
  - [ ] LogoutButton uses the `getSupabaseBrowserClient` singleton.
  - [ ] Clicking the button does not throw reference or non-null assertion errors when Supabase env variables are missing.
* **Difficulty Level**: Beginner
* **Suggested Labels**: `good first issue`, `beginner`, `bug`
* **Notes for Maintainer**: Ensure that the helper function is imported correctly and that no other direct `createBrowserClient` instances remain in other components.

---

### 2. refactor: Fix type definitions in Dashboard and Meeting details page
* **Issue Type**: refactor
* **Problem Statement**: Several variables in `app/(dashboard)/dashboard/page.tsx` and `app/(dashboard)/meetings/[id]/page.tsx` use the TypeScript `any` type (e.g. `(meetings ?? []).filter((m: any) => m.status === 'done')` and `(a: any) => a.done`). This bypasses type safety and makes refactoring more prone to errors.
* **Why This Matters**: Strict typings ensure that database query structure adjustments trigger compile-time errors instead of silent runtime crashes.
* **Expected Solution**: Refactor all occurrences of `any` in these files using the strict interfaces (`Meeting`, `ActionItem`) defined in `lib/types.ts`.
* **Files Likely Involved**:
  * `app/(dashboard)/dashboard/page.tsx`
  * `app/(dashboard)/meetings/[id]/page.tsx`
* **Step-by-step Guidance**:
  1. Open `app/(dashboard)/dashboard/page.tsx`.
  2. Locate the occurrences of `: any` (e.g. in `.filter((m: any) => ...)` and `.flatMap((m: any) => ...)`).
  3. Replace `any` with the `Meeting` type from `@/lib/types`. You may need to cast the database array result.
  4. Repeat the process for `app/(dashboard)/meetings/[id]/page.tsx` replacing `any` in action filters with `ActionItem` or `Meeting`.
  5. Run `npm run lint` and `npm run build` to verify there are no TypeScript compile errors.
* **Acceptance Criteria**:
  - [ ] All instances of `any` are removed from the dashboard and meeting page query mappings.
  - [ ] All variables are strictly typed using types from `lib/types.ts`.
  - [ ] Code builds without errors (`npm run build`).
* **Difficulty Level**: Beginner
* **Suggested Labels**: `good first issue`, `beginner`, `refactor`
* **Notes for Maintainer**: Check that no hidden `any` casts are added elsewhere and that imports from `lib/types` are clean.

---

### 3. refactor: Replace JavaScript hover event handlers with CSS hover classes in MeetingCard
* **Issue Type**: refactor
* **Problem Statement**: In `components/MeetingCard.tsx`, the card hover effect is handled using inline styles and React state handlers: `onMouseOver={e => (e.currentTarget.style.borderColor = '#333')}` and `onMouseOut={e => (e.currentTarget.style.borderColor = '#1f1f1f')}`. 
* **Why This Matters**: Handlers bind events to the DOM which adds memory overhead. CSS hover transitions are cleaner, performant, and follow styling best practices.
* **Expected Solution**: Define a class in `app/globals.css` with a `:hover` pseudo-selector, and assign this class to the `MeetingCard` wrapper div, removing the mouse event handlers.
* **Files Likely Involved**:
  * `components/MeetingCard.tsx`
  * `app/globals.css`
* **Step-by-step Guidance**:
  1. Open `app/globals.css` and create a class `.meeting-card-wrapper` with base styles and a hover style:
     ```css
     .meeting-card-wrapper {
       border-color: #1f1f1f;
       transition: border-color 0.15s ease;
     }
     .meeting-card-wrapper:hover {
       border-color: #333;
     }
     ```
  2. Open `components/MeetingCard.tsx`.
  3. Remove the `onMouseOver` and `onMouseOut` attributes from the outer `div` element.
  4. Assign the class name to the outer `div`.
* **Acceptance Criteria**:
  - [ ] Hover effect on meeting cards functions identically to before.
  - [ ] Inline JS event listeners (`onMouseOver`/`onMouseOut`) are removed.
* **Difficulty Level**: Beginner
* **Suggested Labels**: `good first issue`, `beginner`, `refactor`
* **Notes for Maintainer**: Verify that the transition remains smooth and works properly on mobile touches without getting stuck in hover state.

---

### 4. refactor: Centralize color values using CSS variables in globals.css
* **Issue Type**: refactor
* **Problem Statement**: The project relies on repeated hardcoded hex values for colors like Meetwise gold (`#c9a96e`, `#a4844b`), success green (`#6ec98a`), error red (`#c96e6e`), and dark greys.
* **Why This Matters**: Centralizing colors in CSS variables makes adjustments (such as adding light mode support) much easier and prevents visual inconsistency across components.
* **Expected Solution**: Define the color palette in the `:root` selector of `app/globals.css` and refactor styling across components to use `var(...)`.
* **Files Likely Involved**:
  * `app/globals.css`
  * `components/ActionItemsList.tsx`
  * `components/DeleteMeetingButton.tsx`
  * `app/page.tsx` (or other pages with hardcoded inline hex values)
* **Step-by-step Guidance**:
  1. Open `app/globals.css`.
  2. Add variables under `:root` (e.g. `--color-gold-light: #c9a96e;`, `--color-success: #6ec98a;`, `--color-error: #c96e6e;`, etc.).
  3. Search the project directory for files containing these hex codes.
  4. Replace the values in inline styles or stylesheets with `var(--color-...)`.
* **Acceptance Criteria**:
  - [ ] Standard palette variables are declared in `globals.css`.
  - [ ] Main color variables are adopted in at least 3 UI components.
  - [ ] The app appearance remains visually identical.
* **Difficulty Level**: Beginner
* **Suggested Labels**: `good first issue`, `refactor`
* **Notes for Maintainer**: Double check that variables are correctly structured and don't break TypeScript inline style typings.

---

### 5. documentation: Add JSDoc comments to AI helper modules
* **Issue Type**: documentation
* **Problem Statement**: The files in `lib/ai/` (`transcribe.ts`, `analyze.ts`, and `embed.ts`) contain core logic for Whisper transcription, Claude summarization, and vector embeddings, but they lack complete JSDoc annotations explaining function parameters, return values, and thrown exceptions.
* **Why This Matters**: Clear code documentation helps new open-source contributors understand the inputs, outputs, and behaviors of the AI pipelines quickly without reverse engineering.
* **Expected Solution**: Add standard JSDoc comments to all exported functions in these modules.
* **Files Likely Involved**:
  * `lib/ai/transcribe.ts`
  * `lib/ai/analyze.ts`
  * `lib/ai/embed.ts`
* **Step-by-step Guidance**:
  1. Review functions like `transcribeAudio`, `analyzeMeeting`, `chunkText`, `embedText`, and `semanticSearch`.
  2. Add standard JSDoc blocks before each function:
     ```typescript
     /**
      * Transcribes audio buffer using OpenAI Whisper model.
      * @param audioBuffer - Raw audio data.
      * @param filename - Name of the audio file to determine MIME type.
      * @returns Promise resolving to transcription segments and full text.
      * @throws Error if OpenAI API key is missing or request fails.
      */
     ```
  3. Verify code compiles correctly.
* **Acceptance Criteria**:
  - [ ] All exported functions in `lib/ai/` have descriptive JSDoc comments.
  - [ ] Parameter names and types in JSDocs match code definitions.
* **Difficulty Level**: Beginner
* **Suggested Labels**: `good first issue`, `documentation`, `beginner`
* **Notes for Maintainer**: Ensure that JSDocs contain clear explanations of any potential API limits or exceptions.

---

### 6. UI/UX: Implement landing page responsive mobile navigation menu
* **Issue Type**: UI/UX
* **Problem Statement**: On viewports smaller than `820px`, the landing page navigation links (`.nav-links`) are completely hidden via `display: none !important` (in `app/page.tsx` line 127). However, there is no hamburger button or mobile drawer menu, leaving mobile visitors unable to log in, sign up, or access pricing.
* **Why This Matters**: Having no menu on mobile viewports breaks the user journey for mobile visitors and feels unprofessional.
* **Expected Solution**: Implement a basic responsive toggle button (hamburger icon) that opens a mobile drawer or overlay menu.
* **Files Likely Involved**:
  * `app/page.tsx`
* **Step-by-step Guidance**:
  1. Open `app/page.tsx`.
  2. Implement a local state `const [menuOpen, setMenuOpen] = useState(false)` inside `LandingPage()`.
  3. Create a mobile menu button (hamburger icon) that is hidden on desktop viewports and displayed on mobile.
  4. Renders a mobile overlay or dropdown menu containing navigation links when `menuOpen` is true.
  5. Add CSS transitions in the styles tag for smooth opening/closing.
* **Acceptance Criteria**:
  - [ ] Mobile menu button is visible on screens under 820px.
  - [ ] Clicking the button reveals all navigation links (Login, Signup, Pricing, Support).
  - [ ] Links navigate correctly and menu closes upon item click or background tap.
* **Difficulty Level**: Beginner / Intermediate
* **Suggested Labels**: `good first issue`, `UI/UX`, `help wanted`
* **Notes for Maintainer**: Test on mobile Safari and Chrome emulation to ensure click events trigger cleanly.

---

### 7. documentation: Add SEO metadata exports to legal and support pages
* **Issue Type**: documentation
* **Problem Statement**: The built-in static legal and support routes (`/privacy`, `/terms`, `/refund`, `/contact`) do not export custom SEO `metadata`. They default to the root metadata, resulting in the same title tag ("Meetwise — AI Meeting Notes, Summaries & Transcripts") across all pages.
* **Why This Matters**: Custom title tags and descriptions for each page improve SEO, search engine click-through rates, and conform to Next.js App Router metadata standards.
* **Expected Solution**: Export a `metadata` object in each page file.
* **Files Likely Involved**:
  * `app/privacy/page.tsx`
  * `app/terms/page.tsx`
  * `app/refund/page.tsx`
  * `app/contact/page.tsx`
* **Step-by-step Guidance**:
  1. Open `app/privacy/page.tsx`.
  2. Import the `Metadata` type from `next`.
  3. Export a metadata constant:
     ```typescript
     export const metadata: Metadata = {
       title: 'Privacy Policy — Meetwise',
       description: 'Learn how we protect and handle your meeting recordings, transcripts, and personal data.',
     }
     ```
  4. Repeat this for `terms/page.tsx`, `refund/page.tsx`, and `contact/page.tsx`.
* **Acceptance Criteria**:
  - [ ] Static pages export custom Metadata.
  - [ ] HTML title tags update correctly when navigating to these pages.
* **Difficulty Level**: Beginner
* **Suggested Labels**: `good first issue`, `documentation`, `beginner`
* **Notes for Maintainer**: Verify that the main layout metadata is overridden correctly without issues.

---

### 8. bug: Fix timezone-dependent Hydration Mismatch in Greeting component
* **Issue Type**: bug
* **Problem Statement**: In `components/Greeting.tsx`, `new Date().getHours()` is evaluated in the component body during the initial render. Since Next.js pre-renders page content on the server (using server/UTC time) before hydrating on the client (using user's local timezone), this mismatch causes a runtime hydration warning.
* **Why This Matters**: Mismatch errors slow down page loads, trigger console warnings, and can cause visual flashing of the greeting text.
* **Expected Solution**: Delay the rendering of the timezone-dependent greeting text until after the client component has successfully mounted.
* **Files Likely Involved**:
  * `components/Greeting.tsx`
* **Step-by-step Guidance**:
  1. Open `components/Greeting.tsx`.
  2. Implement a local state `const [mounted, setMounted] = useState(false)`.
  3. Trigger `setMounted(true)` inside a `useEffect` hook with an empty dependency array.
  4. If `mounted` is false, render a default greeting placeholder (e.g. "Hello") or return null to prevent mismatches.
* **Acceptance Criteria**:
  - [ ] Greeting displays correctly based on local browser time.
  - [ ] No "Hydration failed" or "Text content did not match" errors are thrown in the browser console.
* **Difficulty Level**: Beginner
* **Suggested Labels**: `good first issue`, `beginner`, `bug`
* **Notes for Maintainer**: Verify that the layout shift is minimal upon hydration.

---

### 9. testing: Write unit tests for lib/types.ts helper utilities
* **Issue Type**: testing
* **Problem Statement**: The project lacks unit tests. The helper functions defined in `lib/types.ts` (`isPro`, `canUseFeature`, `safePlan`) are crucial for authorization and limit enforcements but have no automated test coverage.
* **Why This Matters**: Unit tests verify that billing checks and feature gates behave correctly and prevent regression when plans are modified.
* **Expected Solution**: Setup a basic Vitest or Jest configuration and add unit tests covering all plan helpers.
* **Files Likely Involved**:
  * `package.json`
  * `lib/types.ts`
  * `lib/types.test.ts` (New)
* **Step-by-step Guidance**:
  1. Add test runners to devDependencies (e.g. `npm install -D vitest`).
  2. Add a `test` script in `package.json` to run tests.
  3. Create `lib/types.test.ts` and write tests verifying:
     - `safePlan(null)` returns `'free'`.
     - `safePlan('pro')` returns `'pro'`.
     - `isPro('pro')` is true, `'free'` is false.
     - `canUseFeature('free', 'search')` is false, `'pro'` is true.
  4. Run `npm run test` to verify.
* **Acceptance Criteria**:
  - [ ] Test command `npm run test` is defined in `package.json`.
  - [ ] All functions in `lib/types.ts` are covered by tests.
  - [ ] Tests pass locally.
* **Difficulty Level**: Beginner
* **Suggested Labels**: `good first issue`, `testing`
* **Notes for Maintainer**: Verify that the test framework installs lightweight dev dependencies and does not conflict with Next.js compilation.

---

### 10. UI/UX: Add a confirmation dialog before logging out
* **Issue Type**: UI/UX
* **Problem Statement**: In `components/LogoutButton.tsx`, clicking the logout button logs the user out instantly and redirects them without asking for confirmation.
* **Why This Matters**: Accidental clicks on the logout button can interrupt the user flow, forcing them to re-authenticate, which is annoying.
* **Expected Solution**: Add a state variable to confirm logout or open a native browser dialog (`window.confirm()`) before calling `auth.signOut()`.
* **Files Likely Involved**:
  * `components/LogoutButton.tsx`
* **Step-by-step Guidance**:
  1. Open `components/LogoutButton.tsx`.
  2. Inside `handleLogout`, add a check:
     ```typescript
     const confirmed = window.confirm("Are you sure you want to log out?")
     if (!confirmed) return
     ```
  3. Alternatively, implement a confirmation popup state in the React component for a custom dark-themed UI modal.
* **Acceptance Criteria**:
  - [ ] Clicking logout triggers a prompt.
  - [ ] Confirming logs out; cancelling keeps the user logged in.
* **Difficulty Level**: Beginner
* **Suggested Labels**: `good first issue`, `UI/UX`, `beginner`
* **Notes for Maintainer**: Native confirm is acceptable for a quick fix, but a styled custom overlay matches the premium design better. Review the styling.

---

## 🟡 Intermediate Issues (5 Issues)

### 11. enhancement: Add manual Action Item creation and editing controls to UI
* **Issue Type**: enhancement
* **Problem Statement**: The database schema and PATCH API route (`/api/action-items/[id]`) support full modifications of action items, including updating the description (`text`), `owner`, `due_date`, and `priority`. However, the frontend component `ActionItemsList.tsx` only allows checking the `done` status and deleting items, with no UI for editing or adding new tasks manually.
* **Why This Matters**: AI transcription might miss action items or get owners wrong. Users need to be able to add action items manually and edit AI-generated ones to make the meeting list accurate.
* **Expected Solution**: Enhance `components/ActionItemsList.tsx` to include an "Add Action Item" form and add edit inputs (fields for owner, due_date, text, priority) on click.
* **Files Likely Involved**:
  * `components/ActionItemsList.tsx`
* **Step-by-step Guidance**:
  1. Open `components/ActionItemsList.tsx`.
  2. Implement an "Edit" toggle state for individual action items in the list.
  3. Render text input, priority select dropdown, owner text field, and date picker when in edit mode.
  4. Create an "Add Action Item" button and form that sends a `POST` request (create a `/api/action-items` endpoint if needed, or update page) to insert a new row in Supabase.
  5. Add client-side state handling to refresh the list of tasks.
* **Acceptance Criteria**:
  - [ ] Users can add a new action item manually.
  - [ ] Users can edit existing action item text, owner, due date, and priority.
  - [ ] Changes persist to Supabase database.
* **Difficulty Level**: Intermediate
* **Suggested Labels**: `enhancement`, `help wanted`, `UI/UX`
* **Notes for Maintainer**: Ensure inputs are validated on the backend. Check that the UI matches the premium glassmorphism dark theme.

---

### 12. bug: Fix security bypass in reset-counts cron route when CRON_SECRET is unconfigured
* **Issue Type**: bug
* **Problem Statement**: In `app/api/cron/reset-counts/route.ts`, the cron task is protected by validating the `Authorization` header against `process.env.CRON_SECRET`. If `CRON_SECRET` is not set locally or in production (evaluating to `undefined`), a request carrying the header `Authorization: Bearer undefined` will match the validation check and trigger the monthly usage limit resets.
* **Why This Matters**: Attackers could continuously reset meeting usage limits for all free users, causing denial of service or abuse of paid API limits.
* **Expected Solution**: Add an explicit check at the beginning of the route to verify that `CRON_SECRET` is defined and contains a secure, non-empty value.
* **Files Likely Involved**:
  * `app/api/cron/reset-counts/route.ts`
* **Step-by-step Guidance**:
  1. Open `app/api/cron/reset-counts/route.ts`.
  2. Add validation before checking the request header:
     ```typescript
     const cronSecret = process.env.CRON_SECRET
     if (!cronSecret || cronSecret.trim() === '' || cronSecret === 'your-random-secret-here') {
       return NextResponse.json({ error: 'Cron secret is not configured' }, { status: 500 })
     }
     ```
  3. Test with missing environment variable in `.env.local` to verify the endpoint fails securely.
* **Acceptance Criteria**:
  - [ ] Requests are rejected with a 500 error if `CRON_SECRET` is empty or set to default example values.
  - [ ] Unconfigured systems do not allow authorization headers to match `undefined`.
* **Difficulty Level**: Intermediate
* **Suggested Labels**: `bug`, `help wanted`
* **Notes for Maintainer**: Security check. Validate that the production environment sets a strong alphanumeric secret.

---

### 13. UI/UX: Refactor StatusPoller to poll lightweight API instead of full page refresh
* **Issue Type**: UI/UX
* **Problem Statement**: The `StatusPoller` component uses `setInterval` to invoke `router.refresh()` every 5 seconds while a meeting is processing. This forces Next.js to fetch all page layout and database relations again, which is resource heavy and causes flickering animations.
* **Why This Matters**: Standard page refreshes degrade performance and waste database queries. Checking status should be lightweight and fast.
* **Expected Solution**: Create a dedicated status API endpoint `/api/meetings/[id]/status` returning only the status string, and update the poller to fetch this endpoint, updating the parent state when status changes to `done`.
* **Files Likely Involved**:
  * `components/StatusPoller.tsx`
  * `app/api/meetings/[id]/status/route.ts` (New)
* **Step-by-step Guidance**:
  1. Create a new route file `app/api/meetings/[id]/status/route.ts`.
  2. Implement a `GET` handler returning `{ status: meeting.status }` from Supabase for the authenticated user.
  3. Open `components/StatusPoller.tsx`.
  4. Replace `router.refresh()` with a client-side fetch to the status endpoint.
  5. If status becomes `done` or `error`, trigger a single `router.refresh()` to reload the full page.
* **Acceptance Criteria**:
  - [ ] Polling queries the lightweight status endpoint rather than reloading the server component.
  - [ ] Full page reloads occur only once when processing finishes.
* **Difficulty Level**: Intermediate
* **Suggested Labels**: `enhancement`, `UI/UX`
* **Notes for Maintainer**: Check that unauthorized users cannot fetch status of other users' meetings.

---

### 14. testing: Write integration tests for Supabase Auth and Client singletons
* **Issue Type**: testing
* **Problem Statement**: The helper functions `createClient` in `lib/supabase/server.ts` and `getSupabaseBrowserClient` in `lib/supabase/client.ts` contain critical logic to automatically return mock interfaces when API keys are not configured. We do not have integration tests to verify this singletons behavior.
* **Why This Matters**: If these singletons break, developers will experience authentication or database query errors during local setup or deployment.
* **Expected Solution**: Add integration tests verifying correct client initialization under mocked environmental states.
* **Files Likely Involved**:
  * `lib/supabase/server.ts`
  * `lib/supabase/client.ts`
  * `lib/supabase/client.test.ts` (New)
* **Step-by-step Guidance**:
  1. Add testing packages (e.g. `@testing-library/react` and Vitest environment mocks).
  2. Create test suites in `lib/supabase/client.test.ts`.
  3. Mock `process.env` to simulate unconfigured keys and assert that mock objects (e.g. auth mock with `getUser`) are returned.
  4. Mock `process.env` with valid credentials and verify that the actual Supabase client is returned.
* **Acceptance Criteria**:
  - [ ] Integration tests verify fallback/mock states are returned when environment keys are absent.
  - [ ] Singletons return actual instances when keys are valid.
* **Difficulty Level**: Intermediate
* **Suggested Labels**: `testing`
* **Notes for Maintainer**: Review the environment variable mocking implementation.

---

### 15. enhancement: Implement a functional contact form API route using Resend
* **Issue Type**: enhancement
* **Problem Statement**: The Contact page (`app/contact/page.tsx`) uses a simulated form submission with a client-side `setTimeout` timeout. Form entries are discarded, meaning users cannot submit support requests.
* **Why This Matters**: A SaaS app must have a reliable contact system for billing problems, refunds, and user feedback.
* **Expected Solution**: Create a POST API endpoint `/api/contact` that accepts form input and uses our Resend email module (`lib/email.ts`) to email the support team.
* **Files Likely Involved**:
  * `app/contact/page.tsx`
  * `app/api/contact/route.ts` (New)
  * `lib/email.ts`
* **Step-by-step Guidance**:
  1. Create `app/api/contact/route.ts` to receive `name`, `email`, and `message`.
  2. Add an email-sending utility in `lib/email.ts` (e.g. `sendSupportRequestEmail`) that sends an email to the support mailbox using the Resend SDK.
  3. Validate fields (presence of name, valid email structure, message length).
  4. Update `app/contact/page.tsx` to submit forms using fetch requests to `/api/contact`.
* **Acceptance Criteria**:
  - [ ] Contact form sends entries to the `/api/contact` API.
  - [ ] Resend integration delivers support requests to the configured support inbox.
  - [ ] Form displays error alerts if API returns a failure status.
* **Difficulty Level**: Intermediate
* **Suggested Labels**: `enhancement`, `help wanted`
* **Notes for Maintainer**: Verify that rate limits or reCaptcha are considered if open endpoints are exposed.

---

## 🔴 Advanced Issues (2 Issues)

### 16. bug: Implement audio chunking to handle uploads exceeding 25 MB
* **Issue Type**: bug
* **Problem Statement**: In `app/api/upload/route.ts`, the file upload limit is configured to `100 MB`. However, the OpenAI Whisper API (`whisper-1`) used in `lib/ai/transcribe.ts` has a strict file size limit of **25 MB**. Uploading files between 25 MB and 100 MB succeeds at the upload endpoint but fails during processing with an OpenAI request error.
* **Why This Matters**: Users will experience failed analyses for longer meeting recordings, causing bad UX and wasting upload bandwidth.
* **Expected Solution**: Implement an audio processing step in the backend (using a library like `fluent-ffmpeg` or splitting buffers) to divide audio files larger than 25 MB into chunks, transcribe them individually, and merge transcripts. Alternatively, compress the audio file to reduce size.
* **Files Likely Involved**:
  * `lib/ai/transcribe.ts`
  * `app/api/process/route.ts`
* **Step-by-step Guidance**:
  1. Open `lib/ai/transcribe.ts`.
  2. Install a library like `@ffmpeg-installer/ffmpeg` and `fluent-ffmpeg` or write a custom buffer splitter.
  3. Modify `transcribeAudio` to check if buffer size exceeds 25 MB.
  4. If it does, split the audio into parts under 25 MB, send requests to Whisper API concurrently or sequentially, and stitch the text and segment timestamps (adjusting segment offsets) back together.
  5. Run tests with a 30 MB audio file to ensure transcription works and segments align.
* **Acceptance Criteria**:
  - [ ] Audio files up to 100 MB are transcribed successfully.
  - [ ] No OpenAI request payload size errors occur during Whisper execution.
  - [ ] Timestamps of transcribed segments remain mathematically aligned.
* **Difficulty Level**: Advanced
* **Suggested Labels**: `bug`, `help wanted`
* **Notes for Maintainer**: Audio splitting requires binaries (like ffmpeg) or native Node.js buffer manipulators. Ensure it runs smoothly inside serverless execution limits (e.g. Vercel's 5 min execution window).

---

### 17. enhancement: Implement speaker identification (diarization) in transcription pipeline
* **Issue Type**: enhancement
* **Problem Statement**: In `lib/ai/transcribe.ts`, the current speaker labeling is a placeholder heuristic: `detectSpeaker(i)` alternates speaker labels (A, B, C, D) every 3 segments. It does not perform actual speaker recognition, resulting in incorrect transcripts.
* **Why This Matters**: Meeting summaries and sentiment tracking rely on accurate speaker mapping. Hardcoded alternation makes the transcripts useless for meetings with overlapping or quiet speakers.
* **Expected Solution**: Integrate a speaker diarization API (such as AssemblyAI, Deepgram, or a custom Pyannote-audio wrapper) or use Claude to analyze and predict speaker changes based on dialogue clues and context.
* **Files Likely Involved**:
  * `lib/ai/transcribe.ts`
  * `lib/ai/analyze.ts`
* **Step-by-step Guidance**:
  1. Review alternative speech-to-text providers that support diarization (like Deepgram or AssemblyAI).
  2. Implement API integrations inside `lib/ai/transcribe.ts` when diarization is enabled.
  3. Alternatively, modify the prompt inside `lib/ai/analyze.ts` to instruct Claude to review the transcript and assign correct names to speaker labels based on name introductions in the dialog.
  4. Save the diarized speakers back to Supabase.
* **Acceptance Criteria**:
  - [ ] Transcripts accurately reflect speaker changes rather than alternating every 3 lines.
  - [ ] Participants list in dashboard correctly reflects real meeting attendees.
* **Difficulty Level**: Advanced
* **Suggested Labels**: `enhancement`, `help wanted`
* **Notes for Maintainer**: Deepgram diarization or LLM-based labeling requires API keys. Ensure fallback models remain operational if premium services are unconfigured.
