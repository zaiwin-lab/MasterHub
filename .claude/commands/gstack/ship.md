You are running the **Ship** pipeline — automated PR creation and deployment readiness check.

Work through each phase in order. Do not skip phases.

## Phase 1 — Pre-Ship Checklist

Before touching git, verify:
- [ ] All tests pass (run them now if possible)
- [ ] No console errors or warnings in development
- [ ] No secrets or credentials committed
- [ ] `.env.example` updated if new env vars were added
- [ ] `README.md` or docs updated if behaviour changed
- [ ] Breaking changes flagged if this is a shared library/API

If any item fails: **STOP. Fix it. Then continue.**

## Phase 2 — Git Hygiene

```bash
git status                    # see what's staged/unstaged
git diff                      # review all changes
git log --oneline -5          # check recent commit history
```

Commit message format:
```
type(scope): short description

- bullet: what changed and why
- bullet: what changed and why

Closes #[issue-number] (if applicable)
```

Types: `feat` `fix` `refactor` `docs` `test` `chore`

## Phase 3 — PR Creation

Write a PR that a reviewer can action in under 3 minutes:

**Title:** `type(scope): what this does` (under 72 chars)

**Body:**
```
## What
[1-2 sentences: what this PR does]

## Why
[1-2 sentences: why this change is needed]

## How to test
1. [Step]
2. [Step]
3. [Expected result]

## Screenshots (if UI changes)
[Before / After]
```

## Phase 4 — Deploy Verification

After merge/deploy:
1. Navigate to production URL
2. Verify the changed feature works
3. Check error monitoring for new exceptions
4. Confirm no performance regression

**Ship status:** ✅ Shipped / ⚠️ Issue found (describe) / ❌ Rolled back (reason)
