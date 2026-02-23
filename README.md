# minions-skills

**Reusable skill definitions that agents can load, compose, and version**

Built on the [Minions SDK](https://github.com/mxn2020/minions).

---

## Quick Start

```bash
# TypeScript / Node.js
npm install @minions-skills/sdk minions-sdk

# Python
pip install minions-skills

# CLI (global)
npm install -g @minions-skills/cli
```

---

## CLI

```bash
# Show help
skills --help
```

---

## Python SDK

```python
from minions_skills import create_client

client = create_client()
```

---

## Project Structure

```
minions-skills/
  packages/
    core/           # TypeScript core library (@minions-skills/sdk on npm)
    python/         # Python SDK (minions-skills on PyPI)
    cli/            # CLI tool (@minions-skills/cli on npm)
  apps/
    web/            # Playground web app
    docs/           # Astro Starlight documentation site
    blog/           # Blog
  examples/
    typescript/     # TypeScript usage examples
    python/         # Python usage examples
```

---

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm run build

# Run tests
pnpm run test

# Type check
pnpm run lint
```

---

## Documentation

- Docs: [skills.minions.help](https://skills.minions.help)
- Blog: [skills.minions.blog](https://skills.minions.blog)
- App: [skills.minions.wtf](https://skills.minions.wtf)

---

## License

[MIT](LICENSE)
