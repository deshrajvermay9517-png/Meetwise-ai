# Meetwise Maintainer Guide

Welcome to the maintainer guide for Meetwise! This document outlines your workflows for managing issues, assigning tasks to contributors, reviewing pull requests, communicating politely, and maintaining repository stability.

---

## 📋 1. Managing Issues

### Creating Issues
When creating new issues, always use a clear title prefix and detailed description:
* **Format**: `[Type]: Short description` (e.g., `[Bug]: Session cookie expires too early`).
* **Content**: Outline the overview, steps to reproduce (for bugs) or features requested, acceptance criteria, and specific files related to the issue.
* **Labels**: Assign appropriate labels (e.g., `bug`, `enhancement`, `documentation`, `good first issue`, `beginner`).

### Assigning Contributors
* Keep task assignments transparent. When a contributor requests to work on an issue (e.g. via a comment like *"Can I work on this?"*), assign the issue to them using the GitHub sidebar.
* **Rule of Thumb**: Only assign one contributor per issue to avoid conflicts.
* **Timeline**: Give contributors a reasonable time to complete the work (e.g., 7 days). If they do not submit a PR or update within that time, ask if they need help or unassign them to free it up for others.

---

## 🔍 2. Reviewing Pull Requests

Every pull request must be reviewed, tested, and validated before merging.

### Automated Checks (CI)
* Verify that the GitHub Actions run compiles, builds, and linting checks successfully.
* Do not merge PRs with failing CI checks.

### Code Review Guidelines
Look for the following when checking code:
1. **Targeted changes**: Ensure the contributor has only changed files relevant to the issue. Reject PRs containing arbitrary styling updates or unrelated code refactoring.
2. **Correctness**: Check logic paths, state variables, and API responses.
3. **No secrets exposed**: Ensure no `.env.local` changes, secret keys, or passwords are included in the commits.
4. **Style & Types**: Ensure proper TypeScript typing and that linting rules are followed.

### Writing Review Comments Politely
Always remain encouraging and polite. Emphasize constructive collaboration.
* **Instead of**: *"This code is messy, rewrite this function."*
* **Use**: *"Thanks for the implementation! Could we refactor this function to improve readability? For example..."*
* **Instead of**: *"You didn't test this. It breaks."*
* **Use**: *"It looks like this might cause a crash when the API returns an empty array. Could you verify this edge case or add a quick guard clause?"*

---

## 🤝 3. PR Decision Matrix

| PR State | Action | Review Action | Description |
| :--- | :--- | :--- | :--- |
| **Bugs / Issues found** | **Request Changes** | "Request changes" | Provide clear feedback on what needs to be fixed. Use code suggestion blocks when possible. |
| **Questions / Details missing** | **Comment** | "Comment" | Ask for clarification or missing screenshots without blocking. |
| **Ready to Merge** | **Approve** | "Approve" | Approve the PR. You can add a welcoming comment like *"Excellent work! Merging now."* |

---

## 🥞 4. Merging Pull Requests

### Squash and Merge
Always use the **Squash and Merge** strategy when merging PRs.
* **Why**: It combines all of the contributor's branch commits into a single clean commit on the `main` branch. This keeps the commit history of `main` readable and makes it easy to revert changes if necessary.
* **Commit Message**: Write a clean squash commit message:
  ```text
  feature: integrate Anthropic Claude for meeting summaries (#12)

  - Adds Claude API helper in lib/anthropic.ts
  - Implements summary component in app/workspace/[id]/page.tsx
  - Updates profiles schema in Supabase
  ```

---

## 🕰️ 5. Handling Stale Pull Requests

* If a contributor does not respond to review comments or requested changes after 7–10 days:
  1. Leave a polite reminder: *"Hi @username, just checking in to see if you've had a chance to look at the requested changes. Let us know if you need any help!"*
  2. If there is no response after another 5 days, close the PR politely: *"Closing this due to inactivity. Feel free to reopen or submit a new PR when you are ready to continue. Thank you for your contributions!"*

---

## 🛡️ 6. Repository Health & Branch Protection

To protect the stability of the production code:
* **Protect the `main` branch**: Enable GitHub Branch Protection on the `main` branch (see the [GitHub Settings Checklist](github-settings-checklist.md) for step-by-step instructions).
* **Require PRs**: Never commit directly to the `main` branch. Always use branches and Pull Requests.
* **Require Reviews**: Require at least 1 approving review from Code Owners before a PR can be merged.
* **Linear History**: Require conversation resolution and keep branch histories clean.
