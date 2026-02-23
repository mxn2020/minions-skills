---
title: Quick Start
description: Get up and running with Minions Skills in minutes
---

## TypeScript

```typescript
import { createClient } from '@minions-skills/sdk';

const client = createClient();
console.log('Version:', client.version);
```

## Python

```python
from minions_skills import create_client

client = create_client()
print(f"Version: {client['version']}")
```

## CLI

```bash
skills info
```
