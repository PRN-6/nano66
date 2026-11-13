# Contributing to Nano66

Thank you for your interest in contributing to **Nano66**!

We welcome bug reports, performance enhancements, and new framework adapters. Please review the following guidelines before submitting pull requests.

---

## 🛠️ Development Setup

Nano66 is managed as a `pnpm` monorepo.

### Prerequisites

- Node.js `v18.0.0` or higher
- `pnpm` `v9.0.0` or higher
- Git

### Setup Steps

```bash
# 1. Clone repository
git clone https://github.com/nano66/nano66.git
cd nano66

# 2. Install dependencies
pnpm install

# 3. Build library packages
pnpm build

# 4. Start example sites for live testing
pnpm dev:vanilla
# or
pnpm dev:react
# or
pnpm dev:docs
```

---

## 🧪 Testing Guidelines

Testing is strictly enforced for every feature and bug fix:

1. **Unit & Integration Tests (Vitest)**:
   ```bash
   pnpm test
   pnpm test:coverage
   ```
2. **Real-Browser End-to-End Tests (Playwright)**:
   ```bash
   pnpm test:e2e
   ```
3. **TypeScript Strict Typecheck**:
   ```bash
   pnpm typecheck
   ```
4. **npm Package Dry-run Verification**:
   ```bash
   pnpm pack:check
   ```

---

## 📐 Code Quality Rules

1. **Strict TypeScript Mode:** Do not use `any` unless absolutely necessary for low-level browser API workarounds.
2. **Zero-Allocation Animation Frames:** Avoid creating objects, arrays, or anonymous closures inside `requestAnimationFrame` update loops. Use `ParticlePool` for particle management.
3. **GPU Resource Disposal:** Ensure any PixiJS textures, graphics, and sprite containers are explicitly disposed when `destroy()` is called.
4. **Never Break DOM Structure:** Nano66 must never alter, clone, or detach the original DOM hierarchy. Use non-collapsing visibility classes (`visibility: hidden !important`) to conceal content.
5. **CORS Safety:** Always provide a graceful geometric fallback for images when canvas pixel reading is blocked by CORS security.
