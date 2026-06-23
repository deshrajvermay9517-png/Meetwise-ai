# Meetwise — AI Meeting Notes SaaS

Meetwise is a premium, production-ready AI meeting notes SaaS. It turns your meeting recordings into transcripts, summaries, action items, and searchable knowledge using a modern, stable Next.js and Supabase tech stack.

---

## ⚡ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router) + [TypeScript](https://www.typescriptlang.org/)
- **Styling**: Vanilla CSS (TailwindCSS optional)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL, Supabase Auth SSR, Supabase Storage)
- **Transcription**: [OpenAI Whisper API](https://platform.openai.com/docs/guides/speech-to-text) (Optional)
- **AI Analytics**: [Anthropic Claude API](https://docs.anthropic.com/) (Summaries, action items, speaker sentiment, semantic search - Optional)
- **Payments**: [Razorpay](https://razorpay.com/) (Optional)
- **Email**: [Resend](https://resend.com/) (Optional)

---

## 📁 Folder Structure

Below is an overview of the core project structure:

```text
meetwise/
├── .github/                 # GitHub configuration and templates
│   ├── ISSUE_TEMPLATE/      # Custom issue templates (bugs, features, docs, beginner tasks)
│   ├── workflows/           # CI/CD Workflows (GitHub Actions)
│   ├── CODEOWNERS           # Review assignment configuration
│   └── pull_request_template.md # PR description guidelines
├── app/                     # Next.js App Router (Pages, layouts, API routes)
│   ├── privacy/             # Privacy Policy page
│   ├── terms/               # Terms of Service page
│   ├── refund/              # Refund policy page
│   └── contact/             # Contact support form page
├── components/              # Shared React UI components
├── docs/                    # Maintainer, contribution, and example documentation
│   ├── github-settings-checklist.md
│   ├── issue-examples.md
│   └── maintainer-guide.md
├── lib/                     # Client libraries, helpers, and API integrations
├── supabase/                # Database migrations and configuration
├── .env.local               # Local environment variables (ignored by Git)
├── env.example              # Template for configuring local variables
├── package.json             # NPM package manifest
├── setup.sh                 # Initial setup shell script
└── tsconfig.json            # TypeScript configuration
```

---

## ⚙️ Local Development Setup

Follow these steps to set up Meetwise on your machine.

### 1. Install Dependencies
Run the following command from the project root:
```bash
npm install
```

### 2. Environment Variables Configuration
Copy the `env.example` file to create a `.env.local` file:
```bash
cp env.example .env.local
```
Fill in the variables in `.env.local` using the guide below.

---

## 🔐 Environment Variables Guide

Here is a guide to the environment variables used in `env.example`:

| Variable | Description | Required | Default/Example |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes | `https://your-project.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase public API key | Yes | `your-anon-key` |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key (bypass RLS) | Yes | `your-service-role-key` |
| `NEXT_PUBLIC_APP_URL` | Application root URL | Yes | `http://localhost:3001` |
| `CRON_SECRET` | Secret token for validating cron trigger endpoints | Yes | `your-random-secret-here` |
| `OPENAI_API_KEY` | OpenAI API Key for Whisper transcription & embeddings | No | `sk-...` |
| `ANTHROPIC_API_KEY` | Anthropic API Key for meeting analysis and summary generation | No | `sk-ant-...` |
| `RAZORPAY_KEY_ID` | Razorpay checkout key | No | `rzp_test_...` |
| `RAZORPAY_KEY_SECRET` | Razorpay API secret key | No | `your-razorpay-secret` |
| `RAZORPAY_WEBHOOK_SECRET` | Secret for verifying incoming Razorpay webhooks | No | `your-webhook-secret` |
| `RESEND_API_KEY` | Resend API Key for sending emails | No | `re_...` |
| `RESEND_FROM_EMAIL` | Sender email address registered in Resend | No | `noreply@yourdomain.com` |

---

## 🛠️ How to Run the Project

### 1. Supabase Auth Configuration
Configure the authentication redirect URLs in your Supabase Project Dashboard:
- **Site URL**: `http://localhost:3001`
- **Redirect URLs**: `http://localhost:3001/**`

### 2. Supabase Database Migration
Ensure you have the `pgvector` extension enabled in your Supabase PostgreSQL database. Run the SQL files in `supabase/migrations/` in order:
1. `001_init.sql` (Creates core profiles, workspaces, meetings, transcripts, summaries, action_items, meeting_embeddings, and integrations tables)
2. `002_razorpay.sql` (Creates payment audit tables)

### 3. Run the Local Development Server
Meetwise is configured to run on port **3001** to avoid conflicts with other local servers:
```bash
npm run dev -- -p 3001
```
Open [http://localhost:3001](http://localhost:3001) in your browser to view the application.

---

## 🤝 How to Contribute

We welcome contributions from the community! To get started, please review our [CONTRIBUTING.md](CONTRIBUTING.md) guide.

### How to Create an Issue
1. Navigate to the **Issues** tab on GitHub and click **New Issue**.
2. Select the template that fits your request (e.g., Bug Report, Feature Request, Documentation, or Good First Issue).
3. Fill out the form fields with as much detail as possible to help maintainers assess the request.
4. Wait for a maintainer to review, label, and assign the issue before beginning work.

### How to Open a Pull Request
1. Fork the repository and create a new branch from `main`. Use descriptive naming (e.g., `fix/navbar-responsive` or `feature/add-meeting-notes`).
2. Make your changes, ensuring they are well-tested and don't introduce regression.
3. Commit your changes with clear, descriptive commit messages.
4. Push to your branch and open a Pull Request. Fill out the [PR template](.github/pull_request_template.md) completely, making sure to link the corresponding issue (e.g., `Closes #12`).
5. Ensure the CI suite passes.

---

## 🔍 Maintainer Review Process

To ensure code quality and stability, all contributions go through code review:
- **Automated Checks**: Every PR triggers a GitHub Actions workflow that runs TypeScript compilation, checking, linting, and building.
- **Review**: A maintainer (default owner: [@deshrajvermay9517-png](https://github.com/deshrajvermay9517-png)) will review the code, suggest changes, or request clarification.
- **Approval & Merging**: Once the PR satisfies the requirements and receives approval, the maintainer will merge the changes into `main` using a **Squash and Merge** strategy.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
