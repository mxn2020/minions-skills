/**
 * @module @minions-skills/sdk/schemas
 * Custom MinionType schemas for Minions Skills.
 */

import type { MinionType } from 'minions-sdk';

export const skilldefinitionType: MinionType = {
  id: 'skills-skill-definition',
  name: 'Skill definition',
  slug: 'skill-definition',
  description: 'A named, versioned skill an agent can load and execute.',
  icon: '🧩',
  schema: [
    { name: 'name', type: 'string', label: 'name' },
    { name: 'description', type: 'string', label: 'description' },
    { name: 'version', type: 'string', label: 'version' },
    { name: 'inputSchema', type: 'string', label: 'inputSchema' },
    { name: 'outputSchema', type: 'string', label: 'outputSchema' },
    { name: 'promptRef', type: 'string', label: 'promptRef' },
    { name: 'toolsRequired', type: 'string', label: 'toolsRequired' },
    { name: 'category', type: 'string', label: 'category' },
    { name: 'isActive', type: 'boolean', label: 'isActive' },
  ],
};

export const skillassignmentType: MinionType = {
  id: 'skills-skill-assignment',
  name: 'Skill assignment',
  slug: 'skill-assignment',
  description: 'A link between an agent definition and a skill it is permitted to use.',
  icon: '🔗',
  schema: [
    { name: 'agentId', type: 'string', label: 'agentId' },
    { name: 'skillId', type: 'string', label: 'skillId' },
    { name: 'assignedAt', type: 'string', label: 'assignedAt' },
    { name: 'assignedBy', type: 'string', label: 'assignedBy' },
    { name: 'isActive', type: 'boolean', label: 'isActive' },
  ],
};

export const skillresultType: MinionType = {
  id: 'skills-skill-result',
  name: 'Skill result',
  slug: 'skill-result',
  description: 'The output of a skill execution within an agent run.',
  icon: '📤',
  schema: [
    { name: 'skillId', type: 'string', label: 'skillId' },
    { name: 'agentRunId', type: 'string', label: 'agentRunId' },
    { name: 'inputs', type: 'string', label: 'inputs' },
    { name: 'outputs', type: 'string', label: 'outputs' },
    { name: 'qualityScore', type: 'number', label: 'qualityScore' },
    { name: 'executedAt', type: 'string', label: 'executedAt' },
    { name: 'passed', type: 'boolean', label: 'passed' },
    { name: 'failureReason', type: 'string', label: 'failureReason' },
  ],
};

export const customTypes: MinionType[] = [
  skilldefinitionType,
  skillassignmentType,
  skillresultType,
];

