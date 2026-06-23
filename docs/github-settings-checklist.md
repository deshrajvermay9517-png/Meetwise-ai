# GitHub Settings Checklist

This document contains manual configuration steps for you to perform on GitHub to prepare the **Meetwise-ai** repository for open-source contributors.

---

## 🏷️ 1. Create Issue Labels

Navigate to your repository on GitHub: `Settings → Labels`. Add/edit the following labels with consistent colors:

| Label Name | Description | Recommended Color |
| :--- | :--- | :--- |
| **`good first issue`** | Easy tasks suited for beginner contributors | `#7057ff` (Purple) |
| **`beginner`** | Straightforward tasks needing minimal domain knowledge | `#00c5ff` (Light Blue) |
| **`documentation`** | Improvements or additions to documentation | `#0075ca` (Blue) |
| **`bug`** | Something isn't working or throwing errors | `#d73a4a` (Red) |
| **`enhancement`** | New feature requests or upgrades | `#a2eeef` (Light Cyan) |
| **`help wanted`** | Extra attention or assistance needed | `#008672` (Teal) |
| **`needs review`** | Ready for maintainer code review | `#fbca04` (Yellow) |
| **`changes requested`**| Needs corrections by the contributor | `#e99695` (Pink) |
| **`ready to merge`** | Approved and ready to squash merge | `#0e8a16` (Green) |

---

## 🛡️ 2. Enable Branch Protection for "main"

Navigate to: `Settings → Branches → Branch protection rules → Add rule`.

1. **Branch name pattern**: Enter `main`.
2. **Require a pull request before merging**: **Check this box**.
   * **Require approvals**: Check this box and set **Required number of approvals before merging** to `1`.
   * **Dismiss stale pull request approvals when new commits are pushed**: Check this box.
   * **Require review from Code Owners**: Check this box (uses the `.github/CODEOWNERS` file).
3. **Require status checks to pass before merging**: Check this box.
   * Search and select the status check: `build-and-test` (from `.github/workflows/ci.yml`).
   * **Require branches to be up to date before merging**: Check this box.
4. **Require conversation resolution before merging**: **Check this box** (ensures all review comments are resolved/marked resolved before merge).
5. **Restrict who can push to matching branches**: Ensure only owner/organization accounts are allowed.
6. **Block force pushes**: Verify this is set to **Disable force push** (checked/enabled by default).
7. **Block deletions**: Verify this is set to **Disable branch deletion** (checked/enabled by default).

Click **Create** (or **Save Changes**) to apply.

---

## ⚙️ 3. Configure Pull Request Merge Settings

Navigate to: `Settings → General → Pull Requests`.

* **Allow merge commits**: **Uncheck** (disables normal merges).
* **Allow squash merging**: **Check** (enables squash and merge).
* **Allow rebase merging**: **Uncheck** (disables rebase merges).
* **Automatically delete head branches**: **Check** (automatically deletes the contributor's branch in your repository after merging to keep it clean).
