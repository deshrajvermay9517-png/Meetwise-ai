# Meetwise Maintainer Review Guide

This guide is designed to help you interact professionally, politely, and efficiently with open-source contributors. It provides clear guidelines, GitHub interface instructions, and copy-pasteable comment templates for every stage of the contribution lifecycle.

---

## 💬 1. Replying to "Can I work on this?"

When a contributor requests assignment on an open issue, reply promptly and assign it. This keeps work coordinated and prevents duplicates.

### Guidelines
* Check if they are already working on multiple open tasks. It is best to limit contributors to **one active issue at a time**.
* If the issue is already assigned, let them know politely and suggest another open issue.

### Template: Assigning the Issue
> *"Hi @username! Thank you for your interest in contributing to Meetwise. I have assigned this issue to you. Looking forward to your pull request! Please let us know if you run into any questions during setup."*

### Template: If Already Assigned
> *"Hi @username! Thank you for reaching out. This issue is currently assigned to @otheruser. Please feel free to check out other open issues, such as #issue_number, or let me know if there is another task you would like to work on!"*

---

## 📌 2. Assigning the Issue in GitHub UI

To officially register the assignment:
1. Open the issue on GitHub.
2. In the right sidebar, click **Assignees**.
3. Search for the contributor’s GitHub username and select it.
4. (Optional) Set the **Projects** or **Milestone** if you are tracking releases.

---

## 🔍 3. Reviewing a Pull Request

When a contributor opens a Pull Request (PR):
1. **Check the CI Status**: Ensure the `Continuous Integration` workflow passes. If linting or build checks fail, do not review yet. Ask them to fix the build first.
2. **Read the Description**: Verify they completed the PR template and linked the corresponding issue (e.g. `Closes #12`).
3. **Inspect the Files Changed**:
   * Confirm they modified only files relevant to the issue.
   * Verify they haven't committed secrets (check for `.env` keys).
   * Check for good code practices (no unused variables, clean types, comments on complex logic).

---

## ✏️ 4. Requesting Changes Politely

If the PR requires changes, do not reject it. Instead, leave inline review comments and request edits. Use GitHub's **"Files changed"** tab to leave comments on specific lines.

### Guidelines
* Use GitHub's **Suggestion Blocks** to suggest exact code edits so the contributor can apply them with one click.
* Explain *why* the change is requested.

### Template: Requesting Changes (PR Summary Comment)
> *"Thank you for the contribution, @username! The implementation looks solid. I have left a few inline suggestions to improve readability and resolve TypeScript typing issues. Please take a look, update your branch, and let me know when it is ready for another review!"*

### Template: Inline Suggestion Example
> *"Could we add a null check here to prevent potential runtime errors if the API returns an empty array? For example:"*
> ```typescript
> if (!data) return null;
> ```

---

## ✅ 5. Approving a Pull Request

Once all changes are resolved and the PR is ready:
1. Go to the **Files changed** tab.
2. Click the green **Review changes** button at the top-right.
3. Select **Approve**.
4. Leave an encouraging comment.

### Template: PR Approval
> *"Excellent work, @username! All changes look great, and the CI checks are passing cleanly. Approving and merging this now. Thank you for helping improve Meetwise!"*

---

## 🥞 6. Merging a Pull Request

We use the **Squash and Merge** strategy to maintain a linear and readable commit history.

### Instructions in GitHub UI
1. Scroll to the bottom of the Pull Request.
2. Click the dropdown arrow next to the green merge button and select **Squash and merge**.
3. Review the commit title and message. Combine the contributor’s commit messages into a clean summary (e.g. `feature: implement mobile navigation drawer (#45)`).
4. Click **Confirm squash and merge**.

---

## 🎉 7. Commenting After Merging

After merging, thank the contributor. This encourages them to contribute again in the future.

### Template: Post-Merge Comment
> *"Merged! 🎉 Thank you again, @username, for your contribution! Your changes are now live on the main branch. We appreciate your support in making Meetwise better."*
