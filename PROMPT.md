**MINIONS SKILLS — SKILL LIBRARY**

You are tasked with creating the complete initial foundation for **minions-skills** — a reusable agent capability registry that functions as "the npm of agent skills". This project is part of the Minions ecosystem and builds on top of the `minions-sdk` foundation.

---

**CONCEPT OVERVIEW**

minions-skills is a structured system for defining, versioning, composing, and distributing agent capabilities. Just as npm allows developers to discover and install JavaScript packages, minions-skills allows agents and their builders to discover, install, test, and compose reusable skills.

A **skill** is a structured capability that an agent can possess — like "web search", "code review", "summarization", or "sentiment analysis". Skills have:
- Clear input/output contracts (what they accept and return)
- Version history tracking who improved them and how
- Dependency chains — skills can build on other skills
- Compatibility requirements — which models or tools they need
- Test cases to verify they work as expected
- Categories for discovery

Skills are first-class minions with typed relations. A skill can:
- `depends_on` another skill (composition)
- `implements` a skill interface (polymorphism)
- `follows` a previous version (history)
- `part_of` a skill pack (bundling)
- `references` documentation or examples

The core insight: if agents are going to become more capable, we need a structured way to share, discover, version, and compose their abilities — not just scattered prompts and tool definitions.

---

**CORE PRIMITIVES**

This project introduces the following minion types:

1. **`skill`** — A reusable agent capability
   - Fields: `name` (string, required), `description` (textarea, required), `inputSchema` (json), `outputSchema` (json), `implementation` (textarea), `model` (string), `requiredTools` (tags), `category` (select), `version` (string), `author` (string), `license` (select), `isPublic` (boolean)
   - Relations: `depends_on` (other skills), `implements` (skill interface), `follows` (previous version), `part_of` (skill pack), `references` (docs/examples)

2. **`skill-version`** — A snapshot of a skill at a specific point in time
   - Fields: `versionNumber` (string, required), `changesSummary` (textarea), `publishedAt` (date), `publishedBy` (string), `snapshot` (json, full skill data), `breakingChanges` (boolean)
   - Relations: `follows` (previous version), `references` (parent skill)

3. **`skill-dependency`** — Explicit dependency relationship between skills
   - Fields: `dependencyType` (select: required/optional/dev), `versionConstraint` (string), `reason` (textarea)
   - Relations: `parent_of` (source skill), `references` (target skill)

4. **`skill-test`** — A test case verifying skill behavior
   - Fields: `testName` (string, required), `input` (json, required), `expectedOutput` (json), `expectedBehavior` (textarea), `passed` (boolean), `executedAt` (date), `executionTime` (number)
   - Relations: `references` (parent skill)

5. **`skill-category`** — A category for organizing skills
   - Fields: `name` (string, required), `description` (textarea), `icon` (string), `color` (string)
   - Relations: `parent_of` (child categories)

---

**MINIONS SDK REFERENCE — REQUIRED DEPENDENCY**

This project depends on `minions-sdk`, a published package that provides the foundational primitives. The GH Agent building this project MUST install it from the public registries and use the APIs documented below — do NOT reimplement minions primitives from scratch.

**Installation:**
```bash
# TypeScript (npm)
npm install minions-sdk
# or: pnpm add minions-sdk

# Python (PyPI) — package name is minions-sdk, but you import as "minions"
pip install minions-sdk
```

**TypeScript SDK — Core Imports:**
```typescript
import {
  // Core types
  type Minion, type MinionType, type Relation,
  type FieldDefinition, type FieldValidation, type FieldType,
  type CreateMinionInput, type UpdateMinionInput, type CreateRelationInput,
  type MinionStatus, type MinionPriority, type RelationType,
  type ExecutionResult, type Executable,
  type ValidationError, type ValidationResult,

  // Validation
  validateField, validateFields,

  // Built-in Schemas (10 MinionType instances, reuse where applicable)
  noteType, linkType, fileType, contactType,
  agentType, teamType, thoughtType, promptTemplateType, testCaseType, taskType,
  builtinTypes,

  // Registry — stores and retrieves MinionTypes by id or slug
  TypeRegistry,

  // Relations — in-memory graph with traversal (getChildren, getParents, getTree, getNetwork)
  RelationGraph,

  // Lifecycle — create, update, soft-delete, hard-delete, restore
  createMinion, updateMinion, softDelete, hardDelete, restoreMinion,

  // Evolution — migrate minions when schemas change (preserves removed fields in _legacy)
  migrateMinion,

  // Utilities
  generateId, now, SPEC_VERSION,
} from 'minions-sdk';
```

**Python SDK — Core Imports:**
```python
from minions import (
    # Types
    Minion, MinionType, Relation, FieldDefinition, FieldValidation,
    CreateMinionInput, UpdateMinionInput, CreateRelationInput,
    ExecutionResult, Executable, ValidationError, ValidationResult,
    # Validation
    validate_field, validate_fields,
    # Built-in Schemas (10 types)
    note_type, link_type, file_type, contact_type,
    agent_type, team_type, thought_type, prompt_template_type,
    test_case_type, task_type, builtin_types,
    # Registry
    TypeRegistry,
    # Relations
    RelationGraph,
    # Lifecycle
    create_minion, update_minion, soft_delete, hard_delete, restore_minion,
    # Evolution
    migrate_minion,
    # Utilities
    generate_id, now, SPEC_VERSION,
)
```

**Key Concepts:**
- A `MinionType` defines a schema (list of `FieldDefinition`s) — fields have `name`, `type`, `label`, `required`, `defaultValue`, `options`, `validation`
- A `Minion` is an instance with `id`, `title`, `minionTypeId`, `fields`, `status`, `tags`, timestamps
- A `Relation` is a typed directional link (12 types: `parent_of`, `depends_on`, `implements`, `relates_to`, `inspired_by`, `triggers`, `references`, `blocks`, `alternative_to`, `part_of`, `follows`, `integration_link`)
- Field types: `string`, `number`, `boolean`, `date`, `select`, `multi-select`, `url`, `email`, `textarea`, `tags`, `json`, `array`
- `TypeRegistry` auto-loads 10 built-in types; register custom types with `registry.register(myType)`
- `createMinion(input, type)` validates fields and returns `(minion, validationResult)`
- Both SDKs serialize to identical camelCase JSON; Python provides `to_dict()` / `from_dict()`

**Creating Custom MinionTypes for this project:**
```typescript
// TypeScript — define skill-specific types
const skillType: MinionType = {
  id: 'custom-skill', name: 'Skill', slug: 'skill',
  schema: [
    { name: 'name', type: 'string', label: 'Name', required: true },
    { name: 'inputSchema', type: 'json', label: 'Input Schema' },
    { name: 'outputSchema', type: 'json', label: 'Output Schema' },
    { name: 'category', type: 'select', label: 'Category', options: ['search', 'analysis', 'generation'] },
    { name: 'requiredTools', type: 'tags', label: 'Required Tools' },
  ],
  isSystem: false,
};
const registry = new TypeRegistry();
registry.register(skillType);
```
```python
# Python — same pattern
from minions import MinionType, FieldDefinition, TypeRegistry

skill_type = MinionType(
    id="custom-skill", name="Skill", slug="skill",
    schema=[
        FieldDefinition(name="name", type="string", label="Name", required=True),
        FieldDefinition(name="inputSchema", type="json", label="Input Schema"),
        FieldDefinition(name="outputSchema", type="json", label="Output Schema"),
        FieldDefinition(name="category", type="select", label="Category", options=["search", "analysis", "generation"]),
        FieldDefinition(name="requiredTools", type="tags", label="Required Tools"),
    ],
)
registry = TypeRegistry()
registry.register(skill_type)
```

**IMPORTANT:** Do NOT recreate these primitives. Import from `minions-sdk` (npm) / `minions` (PyPI). Build domain-specific types and utilities ON TOP of the SDK.

---

**WHAT YOU NEED TO CREATE**

**1. THE SPECIFICATION** (`/spec/v0.1.md`)

Write a complete markdown specification covering:

- Motivation — why agents need a skill registry
- What is a skill — formal definition
- Skill anatomy — all required and optional fields
- Input/output contracts — JSON Schema-based type system
- Skill composition — how skills combine via `depends_on` and `implements`
- Skill versioning — semantic versioning, breaking changes, migration paths
- Skill packs — bundling related skills (format: `.skill-pack.json`)
- Compatibility model — how to declare model/tool requirements
- Testing model — what makes a valid skill test
- Discovery model — categories, tags, search
- Publishing model — public vs private skills, licensing
- Skill lifecycle — creation, testing, publishing, deprecation
- Community contribution model
- Conformance checklist for skill registry implementations

**2. THE CORE LIBRARY** (`/packages/core`)

A framework-agnostic TypeScript library with dual SDK support (TypeScript + Python). Must include:

**TypeScript SDK:**
- Full TypeScript type definitions for all skill primitives
- `SkillRegistry` class with methods:
  - `register(skill)` — add a skill to the registry
  - `get(skillId)` — retrieve a skill by ID
  - `search(query, filters)` — search skills by name, category, tags
  - `install(skillName)` — install a skill from community registry
  - `uninstall(skillId)` — remove a skill
  - `list(options)` — list all skills with filtering
- `SkillComposer` class with methods:
  - `compose(...skillIds)` — combine multiple skills into a composite skill
  - `resolve(skillId)` — recursively resolve all dependencies
  - `topologicalSort(skills)` — order skills by dependency chain
- `SkillValidator` class with methods:
  - `validateSchema(skill)` — check skill definition validity
  - `validateContract(skill, input)` — verify input matches inputSchema
  - `validateOutput(skill, output)` — verify output matches outputSchema
- `CompatibilityChecker` class with methods:
  - `isCompatible(skill, agent)` — check if skill works with agent's model/tools
  - `getMissingRequirements(skill, agent)` — list what's missing
- `SkillVersionManager` class with methods:
  - `bump(skillId, type)` — create new version (major/minor/patch)
  - `getHistory(skillId)` — retrieve all versions via `follows` relations
  - `diff(v1, v2)` — compare two versions
  - `rollback(skillId, versionId)` — revert to previous version
- `SkillTester` class with methods:
  - `run(skillId, testId)` — execute a test case
  - `runAll(skillId)` — run all tests for a skill
  - `coverage(skillId)` — calculate test coverage
- Skill pack utilities:
  - `pack(skillIds, metadata)` — bundle skills into `.skill-pack.json`
  - `unpack(packFile)` — extract skills from pack
  - `validatePack(packFile)` — verify pack integrity

**Python SDK:**
- Mirror all TypeScript functionality in Python
- Use `minions_sdk` Python package as the foundation
- Maintain API parity with TypeScript SDK
- Classes: `SkillRegistry`, `SkillComposer`, `SkillValidator`, `CompatibilityChecker`, `SkillVersionManager`, `SkillTester`
- Type hints throughout
- Docstrings for all public methods

**Cross-SDK interop:**
- `.skill-pack.json` format readable by both SDKs
- Shared JSON schemas for validation
- Compatible CLI interfaces

**3. THE CLI** (`/packages/cli`)

Dual-language CLI tool (TypeScript + Python bindings). Commands:

```bash
# Core operations
skills init                          # Initialize skill registry in current project
skills list                          # List all registered skills
skills search <query>                # Search for skills by name/category/tags
skills show <skill-id>               # Show detailed skill information

# Installation
skills install <skill-name>          # Install skill from community registry
skills install @community/<pack>     # Install skill pack
skills uninstall <skill-id>          # Remove skill

# Creation and development
skills new <name>                    # Create new skill interactively
skills validate <skill-file>         # Validate skill definition
skills test <skill-id>               # Run all tests for a skill
skills test <skill-id> <test-id>    # Run specific test

# Composition
skills compose <skill-a> <skill-b> <skill-c> --output <name>  # Combine skills
skills deps <skill-id>               # Show dependency tree
skills deps <skill-id> --resolve     # Resolve all transitive dependencies

# Versioning
skills version <skill-id> --bump major|minor|patch  # Create new version
skills history <skill-id>            # Show version history
skills diff <v1-id> <v2-id>         # Compare two versions
skills rollback <skill-id> <version> # Revert to previous version

# Publishing
skills publish <skill-id>            # Publish skill to community registry
skills unpublish <skill-id>          # Remove from community registry
skills pack <skill-ids...>           # Bundle skills into .skill-pack.json
skills unpack <pack-file>            # Extract skills from pack

# Discovery
skills categories                    # List all skill categories
skills popular                       # Show most installed skills
skills recent                        # Show recently published skills
```

**4. THE DOCUMENTATION SITE** (`/apps/docs`)

Built with Astro Starlight (dual-language support). Must include:

**TypeScript docs:**
- Landing page — "The npm of agent skills"
- Getting started — install CLI, create first skill, test it
- Core concepts:
  - What is a skill
  - Input/output contracts
  - Skill composition
  - Versioning model
  - Skill packs
- Skill creation guide — step-by-step tutorial
- Testing guide — writing test cases, running tests
- Composition guide — building complex skills from simple ones
- Publishing guide — sharing skills with the community
- API reference (TypeScript) — auto-generated from JSDoc
- Community skill directory — browsable catalog
- Best practices — skill design patterns, naming conventions

**Python docs:**
- Python SDK installation
- Python API reference — auto-generated from docstrings
- Python examples — skill creation, testing, composition
- Cross-language interop guide

**Shared docs:**
- Skill pack format reference
- Compatibility model reference
- CLI command reference
- Contributing guide

**5. THE WEB PLAYGROUND** (`/apps/web`)

Optional but recommended. A Next.js or Astro app with:

- Skill browser — search, filter by category, view details
- Skill composer UI — drag-and-drop skill composition
- Test runner — run skill tests in browser
- Version diff viewer — visual comparison of skill versions
- Community leaderboard — top contributors, most popular skills
- Skill playground — test a skill with custom input (if safe)

**6. PROJECT STRUCTURE**

Standard monorepo:

```
minions-skills/
├── packages/
│   ├── core/                 # TypeScript core library
│   │   ├── src/
│   │   │   ├── types.ts                  # Skill type definitions
│   │   │   ├── registry.ts               # SkillRegistry class
│   │   │   ├── composer.ts               # SkillComposer class
│   │   │   ├── validator.ts              # SkillValidator class
│   │   │   ├── compatibility.ts          # CompatibilityChecker class
│   │   │   ├── version-manager.ts        # SkillVersionManager class
│   │   │   ├── tester.ts                 # SkillTester class
│   │   │   ├── pack.ts                   # Skill pack utilities
│   │   │   └── index.ts                  # Public API
│   │   ├── tests/
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── python-sdk/           # Python SDK
│   │   ├── minions_skills/
│   │   │   ├── __init__.py
│   │   │   ├── types.py
│   │   │   ├── registry.py
│   │   │   ├── composer.py
│   │   │   ├── validator.py
│   │   │   ├── compatibility.py
│   │   │   ├── version_manager.py
│   │   │   ├── tester.py
│   │   │   └── pack.py
│   │   ├── tests/
│   │   ├── setup.py
│   │   └── pyproject.toml
│   └── cli/                  # CLI tool (TypeScript-based, callable from both)
│       ├── src/
│       │   ├── commands/
│       │   │   ├── init.ts
│       │   │   ├── list.ts
│       │   │   ├── install.ts
│       │   │   ├── new.ts
│       │   │   ├── compose.ts
│       │   │   ├── test.ts
│       │   │   ├── publish.ts
│       │   │   └── ...
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
├── apps/
│   ├── docs/                 # Astro Starlight docs (dual-language)
│   │   ├── src/
│   │   │   ├── content/
│   │   │   │   ├── docs/
│   │   │   │   │   ├── typescript/
│   │   │   │   │   ├── python/
│   │   │   │   │   └── shared/
│   │   │   │   └── config.ts
│   │   │   └── pages/
│   │   └── astro.config.mjs
│   └── web/                  # Optional playground (Next.js)
│       ├── src/
│       │   ├── app/
│       │   ├── components/
│       │   └── lib/
│       └── package.json
├── spec/
│   ├── v0.1.md               # Main specification
│   ├── skill-pack-format.md  # .skill-pack.json format spec
│   └── conformance.md        # Conformance checklist
├── examples/
│   ├── skills/
│   │   ├── web-search.json           # Simple skill example
│   │   ├── summarizer.json           # Another simple skill
│   │   ├── researcher.json           # Composite skill (search + summarize)
│   │   └── ...
│   ├── skill-packs/
│   │   ├── research-pack.skill-pack.json
│   │   └── writing-pack.skill-pack.json
│   └── integrations/
│       ├── typescript-example/
│       └── python-example/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml            # Lint, test, build (TS + Python)
│   │   └── publish.yml       # Publish to npm + PyPI
│   ├── CONTRIBUTING.md
│   └── CODE_OF_CONDUCT.md
├── README.md
├── LICENSE                   # AGPL-3.0
├── package.json              # Workspace root
└── CHANGELOG.md
```

---

**BEYOND THE STANDARD PATTERN**

In addition to the standard minions SDK foundation, this project must include:

**1. SkillRegistry**
- Persistent storage of registered skills
- Search and filtering capabilities
- Integration with community registry API (if public skills enabled)

**2. SkillComposer**
- Dependency resolution algorithm (topological sort)
- Composite skill generation — creates a new skill that orchestrates multiple skills
- Conflict detection — warns if two skills have incompatible requirements

**3. Input/Output Contract Schema**
- JSON Schema-based type system for skill contracts
- Validation engine that checks inputs before skill execution
- Output verification to ensure skills return what they promise

**4. Compatibility Checker**
- Model compatibility matrix — which skills work with which LLMs
- Tool requirement verification — does the agent have the tools this skill needs?
- Missing dependency detection and suggestions

**5. Community Skill Pack Format**
- `.skill-pack.json` file structure:
```json
{
  "name": "@community/research-pack",
  "version": "1.0.0",
  "description": "Skills for research workflows",
  "author": "community",
  "license": "MIT",
  "skills": [
    { "id": "skill-1", "definition": {...} },
    { "id": "skill-2", "definition": {...} }
  ],
  "dependencies": [
    { "source": "skill-2", "target": "skill-1", "type": "required" }
  ],
  "metadata": {
    "category": "research",
    "tags": ["search", "summarize", "cite"]
  }
}
```

**6. Skill Test Runner**
- Execute tests in isolated context
- Measure execution time and success rate
- Generate test coverage reports

---

**CLI COMMAND DETAILS**

Commands extracted from `.env.projects`:

```bash
skills list                                    # List all registered skills
skills install web-search                      # Install a skill by name
skills install @community/research-pack        # Install a skill pack
skills validate <skill-file>                   # Validate skill definition
skills compose search summarize cite --output researcher-skill  # Compose skills
skills test <skill-id>                         # Run tests for a skill
skills publish                                 # Publish skill to registry
```

Extended with full lifecycle commands as detailed in section 3.

---

**DUAL SDK SUPPORT**

This project must support both TypeScript and Python from day one:

**TypeScript SDK:**
- Published to npm as `@minions-skills/sdk`
- Tree-shakeable ES modules
- Full TypeScript type definitions
- Works in Node.js, Bun, Deno

**Python SDK:**
- Published to PyPI as `minions-skills`
- Type hints throughout (PEP 484)
- Works with Python 3.9+
- Integrates with `minions-sdk` Python package

**Cross-SDK interop:**
- Both SDKs read/write the same `.skill-pack.json` format
- Both SDKs validate against the same JSON schemas
- CLI works with both SDK installations
- Documentation covers both languages side-by-side

---

**TONE AND POSITIONING**

Position minions-skills as the missing infrastructure for agent development. The message:

*Agents need capabilities. Right now, those capabilities live in scattered prompts, tool definitions, and custom code. minions-skills gives agents a structured way to discover, install, test, and compose reusable abilities — just like npm does for JavaScript packages.*

The docs should speak to:
- AI engineers building production agents
- Researchers experimenting with multi-agent systems
- Open source contributors who want to share agent skills

Emphasize:
- Discoverability — find skills instead of reinventing them
- Composability — build complex skills from simple primitives
- Reliability — test-driven skill development
- Versioning — track improvements over time
- Community — share skills with the ecosystem

Avoid:
- Overpromising — skills are structured definitions, not magic
- Complexity — keep the core simple, extend progressively

---

**DELIVERABLES**

Produce all files necessary to launch minions-skills as a production-quality project:

1. **Complete specification** (`/spec/v0.1.md`) — detailed enough to implement from
2. **TypeScript core library** (`/packages/core`) — fully functional, tested, documented
3. **Python SDK** (`/packages/python-sdk`) — API-compatible with TypeScript SDK
4. **CLI tool** (`/packages/cli`) — all commands working, dual-language support
5. **Documentation site** (`/apps/docs`) — comprehensive, dual-language, publishable
6. **Web playground** (`/apps/web`) — optional but recommended, visual skill browser
7. **Example skills** (`/examples/skills`) — 5-10 realistic skill examples
8. **Example skill packs** (`/examples/skill-packs`) — 2-3 thematic bundles
9. **Root README** — compelling pitch, quick start, ecosystem positioning
10. **CI/CD workflows** (`.github/workflows`) — lint, test, build, publish (npm + PyPI)
11. **Contributing guide** (`.github/CONTRIBUTING.md`)
12. **Changelog** (`CHANGELOG.md`) — ready for v0.1.0

All code should be production quality — not stubs or placeholders. All docs should be complete enough to publish. The project should be ready to share publicly.

---

**AGENT SKILL VALUE**

Why this project matters for agents:

- **Agents can discover capabilities** — instead of being hard-coded, agents can search for and install skills they need
- **Agents can compose abilities** — combine simple skills into complex workflows
- **Agents can self-improve** — version skills, test them, roll back failures
- **Agents can share knowledge** — publish skills to the community, learn from others
- **Agents can verify reliability** — run tests before deploying a skill

This is infrastructure for making agents more capable, more composable, and more reliable. It's the npm registry that the agent ecosystem doesn't yet have.

---

Work systematically:
1. Start with the specification
2. Build TypeScript core library (types → registry → composer → validator → tester → pack utilities)
3. Build Python SDK (mirror TypeScript API)
4. Build CLI (commands → integration with both SDKs)
5. Write documentation (dual-language structure → guides → API reference)
6. Create examples (simple skills → composite skills → skill packs)
7. Build optional playground (skill browser → composer UI)
8. Write README and contributing guide
9. Set up CI/CD

Deliver a complete, production-ready foundation for the agent skill ecosystem.
