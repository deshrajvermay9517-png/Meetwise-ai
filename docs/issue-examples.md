# Beginner Issue Examples

Here are 5 pre-written issue examples that you can copy and paste directly into your GitHub issues to welcome new contributors.

---

## 1. docs: Improve README setup section

### Overview
The current local setup section in the README.md covers basic setup, but could be clearer for absolute beginners. We want to provide step-by-step guidance, including commands for verifying Node.js and npm versions.

### What Needs to Be Done
1. Open [README.md](file:///C:/Users/deshr/.gemini/antigravity-ide/scratch/Meetwise-ai/meetwise-complete/meetwise/README.md).
2. Locate the **Local Development Setup** section.
3. Add a prerequisite check step telling developers how to verify their Node.js and npm version (e.g. `node -v` and `npm -v`). We recommend Node.js v18 or v20.
4. Format the steps with clear subheadings or lists to make it highly scannable.

### Acceptance Criteria
- [ ] Prerequisites section is added in the setup guide.
- [ ] Version requirements (Node.js >= 18.x, NPM >= 9.x) are explicitly mentioned.
- [ ] Formatting is checked and matches the rest of the document.
- [ ] The Next.js dev server builds successfully.

* **Skill Level**: Beginner
* **Effort Estimate**: 1 hour
* **Labels**: `documentation`, `good first issue`

---

## 2. docs: Add screenshots section to README

### Overview
Having visual examples of the Meetwise interface helps prospective users and contributors understand what the application does immediately. We need to add a dedicated screenshots section to the main README.

### What Needs to Be Done
1. Create or identify a location in the [README.md](file:///C:/Users/deshr/.gemini/antigravity-ide/scratch/Meetwise-ai/meetwise-complete/meetwise/README.md) file (e.g., right after the features or tech stack section).
2. Add a **Screenshots / Visuals** section header.
3. Add markdown placeholders for application pages (e.g., Dashboard, Meeting Notes details page, Settings).
4. Provide instructions in HTML comments inside the README explaining how future contributors can submit screenshots to replace the placeholders.

### Acceptance Criteria
- [ ] A new header `## 📸 Screenshots` is added to the README.
- [ ] Places for at least 3 screenshots (e.g., Login, Dashboard, Analysis) are added.
- [ ] Clear guidelines for contributing screenshots are included.

* **Skill Level**: Beginner
* **Effort Estimate**: 1 hour
* **Labels**: `documentation`, `good first issue`, `beginner`

---

## 3. docs: Improve environment variable guide in README

### Overview
Our environment variable guide details which keys are needed, but lacks description of *how* and *where* to obtain specific keys (like the Resend API Key or the Razorpay Key ID). We should expand the table in the README to provide detailed instructions.

### What Needs to Be Done
1. Review the **Environment Variables Guide** in [README.md](file:///C:/Users/deshr/.gemini/antigravity-ide/scratch/Meetwise-ai/meetwise-complete/meetwise/README.md).
2. Add inline details or a brief subsection explaining:
   * How to sign up on Supabase and fetch the API keys.
   * Where to get the OpenAI API key (link to platform.openai.com).
   * Where to find the Anthropic Claude API key (link to console.anthropic.com).
   * Link to Razorpay key page and Resend API dashboard.

### Acceptance Criteria
- [ ] Detailed description links are added for each third-party integration key in the README.
- [ ] URLs to developer consoles of OpenAI, Anthropic, Supabase, Razorpay, and Resend are verified.

* **Skill Level**: Beginner
* **Effort Estimate**: 2 hours
* **Labels**: `documentation`, `beginner`

---

## 4. docs: Add troubleshooting guide for database migrations

### Overview
Setting up a database in Supabase and running migrations manually can sometimes lead to common issues (e.g., pgvector extension disabled, order of migrations, etc.). We need to document a troubleshooting guide to help developers solve setup issues quickly.

### What Needs to Be Done
1. Create a new markdown file named `docs/troubleshooting.md`.
2. Add solutions for common errors:
   * *Error: "relation 'profiles' does not exist"*: Clarify that `001_init.sql` must be run before `002_razorpay.sql`.
   * *Error: "extension pgvector does not exist"*: Provide SQL snippet to enable `pgvector` manually.
   * *Error: port 3001 already in use*: Instruct how to change Next.js port in package.json or command line.
3. Link this new troubleshooting guide in the **Local Development Setup** section of the [README.md](file:///C:/Users/deshr/.gemini/antigravity-ide/scratch/Meetwise-ai/meetwise-complete/meetwise/README.md).

### Acceptance Criteria
- [ ] `docs/troubleshooting.md` file is created.
- [ ] Solutions for at least three common database setup issues are included.
- [ ] Link to the troubleshooting guide is present in the main README.

* **Skill Level**: Easy / Intermediate
* **Effort Estimate**: 3 hours
* **Labels**: `documentation`, `help wanted`

---

## 5. docs: Improve branch naming guidelines in contributing guide

### Overview
In our `CONTRIBUTING.md`, we mention branch naming conventions like `feature/`, `fix/`, and `docs/`. To make this even clearer for beginners, we should expand the guide with standard Git commands demonstrating how to rename local branches and how to pull/rebase upstream changes.

### What Needs to Be Done
1. Open [CONTRIBUTING.md](file:///C:/Users/deshr/.gemini/antigravity-ide/scratch/Meetwise-ai/meetwise-complete/meetwise/CONTRIBUTING.md).
2. Locate the **Create a New Branch** section.
3. Add a table or list showing:
   * How to rename a branch: `git branch -m <old-name> <new-name>`
   * How to keep a branch up to date with the original repository (upstream):
     ```bash
     git remote add upstream https://github.com/deshrajvermay9517-png/Meetwise-ai.git
     git fetch upstream
     git rebase upstream/main
     ```

### Acceptance Criteria
- [ ] Git command examples for branch management and syncing are added.
- [ ] No grammar or formatting issues exist in the modified sections.

* **Skill Level**: Beginner
* **Effort Estimate**: 2 hours
* **Labels**: `documentation`, `good first issue`
