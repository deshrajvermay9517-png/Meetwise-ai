# Contributing to Meetwise

Thank you for your interest in contributing to Meetwise! We are excited to build a great developer community together. This guide is designed to help you get started quickly and contribute effectively.

---

## 🗺️ How to Get Started

### 1. Pick an Issue
All work in this repository starts from a registered issue.
* Check the **[Issues](https://github.com/deshrajvermay9517-png/Meetwise-ai/issues)** tab for open issues.
* Look for issues labeled `good first issue` or `beginner` if you are new to the project or looking for smaller tasks.
* Review the issue details, requirements, and acceptance criteria.

### 2. Ask for Assignment
* Do not start working on an issue unless a maintainer has explicitly assigned it to you.
* To request assignment, reply to the issue thread expressing your interest (e.g., *"I would like to work on this issue. Could you please assign it to me?"*).
* This helps prevent multiple contributors from working on the same task simultaneously.

---

## 🛠️ Contribution Workflow

Once an issue is assigned to you, follow these steps to make your changes:

### 1. Fork the Repository
Click the **Fork** button at the top-right of the Meetwise repository page to create a copy of the repository in your GitHub account.

### 2. Clone Your Fork
Clone the forked repository to your local machine:
```bash
git clone https://github.com/YOUR_USERNAME/Meetwise-ai.git
cd Meetwise-ai
```

### 3. Create a New Branch
Create a branch for your work. Keep your branch name clear, prefixing it with the type of work you are doing:

| Work Type | Prefix Example |
| :--- | :--- |
| **New Features** | `feature/add-meeting-notes`, `feature/razorpay-integration` |
| **Bug Fixes** | `fix/navbar-responsive`, `fix/supabase-ssr-auth` |
| **Documentation** | `docs/add-readme-guide`, `docs/maintainer-instructions` |
| **Refactoring** | `refactor/clean-api-routes` |

Create your branch locally:
```bash
git checkout -b feature/add-meeting-notes
```

### 4. Make Changes & Test Locally
* Set up your local environment by copying `env.example` to `.env.local` and running `npm install`.
* Implement your changes, keeping them focused and related to the assigned issue.
* **Test your changes locally** (e.g., run `npm run dev` and test the pages/routes).
* Ensure that the changes do not break other parts of the application.
* Run `npm run lint` and `npm run build` to verify there are no compilation or styling errors.

### 5. Commit Your Changes
Use clean, descriptive commit messages:
* **Good**: `git commit -m "fix: resolve navigation overlay click blocking on mobile"`
* **Bad**: `git commit -m "fixed bugs"` or `git commit -m "changes"`

Commit your changes:
```bash
git add .
git commit -m "feature: implement meeting note summaries using Anthropic Claude API"
```

### 6. Push Your Branch
Push your branch to your forked repository on GitHub:
```bash
git push origin feature/add-meeting-notes
```

---

## 🚀 Opening a Pull Request

1. Go to the original Meetwise-ai repository on GitHub.
2. You will see a prompt to compare and open a Pull Request (PR) from your pushed branch.
3. Fill out the PR template completely:
   * **Description**: Describe the changes and why they are necessary.
   * **Related Issue**: Reference the issue you worked on (e.g., `Closes #12`).
   * **Screenshots**: Attach screenshots or GIFs of any visual changes.
   * **Checklist**: Check all boxes that apply.

---

## 🔍 How Code Review Works

Once you open a PR:
1. **CI/CD Checks**: An automated build and lint process will run. Your PR cannot be merged if these checks fail. Fix any compile or formatting errors and push again.
2. **Review**: The project maintainer ([@deshrajvermay9517-png](https://github.com/deshrajvermay9517-png)) will review your code.
3. **Feedback & Changes Requested**:
   * If the maintainer requests changes, address them in your local branch.
   * Commit and push the updates. They will automatically show up in the open PR.
   * Once you have resolved the requests, leave a comment on the PR letting the reviewer know it's ready.
4. **Approval & Merge**: When the code meets all requirements, the maintainer will approve and merge it into `main` using **Squash and Merge**.

---

## 🚫 What NOT to Do in Pull Requests

* **Do NOT submit credentials or secrets**: Never commit `.env.local` files, API keys, service roles, or database passwords. Check `git status` and `.gitignore` before committing.
* **Do NOT bundle unrelated changes**: A PR should address exactly one issue. Do not include unrelated refactoring or style fixes.
* **Do NOT work on unassigned issues**: If you start working on something without assignment, your PR may be closed to respect other contributors' efforts.
* **Do NOT force-push to your branch after opening a PR**: If you need to make changes, make a standard commit and push unless asked by a maintainer.
