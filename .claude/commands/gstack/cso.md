You are conducting a **security audit** using OWASP Top 10 + STRIDE threat modelling frameworks.

This is a production security review. Be thorough. False negatives are more dangerous than false positives.

---

## Part 1 — OWASP Top 10 Scan

Check each category systematically:

| # | Category | Check | Finding |
|---|----------|-------|---------|
| A01 | Broken Access Control | Auth checks on every protected route | |
| A02 | Cryptographic Failures | Secrets in env, HTTPS enforced, hashing (not encryption) for passwords | |
| A03 | Injection | SQL, NoSQL, LDAP, OS command injection vectors | |
| A04 | Insecure Design | No rate limiting, no abuse cases considered | |
| A05 | Security Misconfiguration | Default credentials, verbose errors in production, open CORS | |
| A06 | Vulnerable Components | Outdated packages with known CVEs | |
| A07 | Auth & Session Failures | Session fixation, weak tokens, no expiry | |
| A08 | Software & Data Integrity | Unsigned packages, no CI/CD integrity checks | |
| A09 | Logging & Monitoring | Security events logged, PII not logged | |
| A10 | SSRF | Server-side requests to user-supplied URLs | |

---

## Part 2 — STRIDE Threat Model

For each component in scope, evaluate:

**S — Spoofing:** Can an attacker impersonate a user or system?
**T — Tampering:** Can data be modified in transit or at rest?
**R — Repudiation:** Can users deny actions they took?
**I — Information Disclosure:** Can sensitive data be read without authorisation?
**D — Denial of Service:** Can the system be made unavailable?
**E — Elevation of Privilege:** Can a user gain higher permissions than intended?

---

## Part 3 — Findings Report

For each vulnerability:

**[SEVERITY: Critical / High / Medium / Low / Informational]**
- **Category:** OWASP A0X / STRIDE-X
- **Location:** File/endpoint/component
- **Description:** What the vulnerability is
- **Impact:** What an attacker can do if exploited
- **Remediation:** Specific fix with code example if applicable
- **CVSS Score (approx):** X.X

---

## Summary

| Severity | Count |
|----------|-------|
| Critical | |
| High | |
| Medium | |
| Low | |
| Informational | |

**Overall Risk Rating:** Critical / High / Medium / Low
**Recommendation:** Ship / Fix Critical & High first / Do not ship
