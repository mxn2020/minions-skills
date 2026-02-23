"""
Minions Skills SDK — Type Schemas
Custom MinionType schemas for Minions Skills.
"""

from minions.types import FieldDefinition, FieldValidation, MinionType

skill_definition_type = MinionType(
    id="skills-skill-definition",
    name="Skill definition",
    slug="skill-definition",
    description="A named, versioned skill an agent can load and execute.",
    icon="🧩",
    schema=[
        FieldDefinition(name="name", type="string", label="name"),
        FieldDefinition(name="description", type="string", label="description"),
        FieldDefinition(name="version", type="string", label="version"),
        FieldDefinition(name="inputSchema", type="string", label="inputSchema"),
        FieldDefinition(name="outputSchema", type="string", label="outputSchema"),
        FieldDefinition(name="promptRef", type="string", label="promptRef"),
        FieldDefinition(name="toolsRequired", type="string", label="toolsRequired"),
        FieldDefinition(name="category", type="string", label="category"),
        FieldDefinition(name="isActive", type="boolean", label="isActive"),
    ],
)

skill_assignment_type = MinionType(
    id="skills-skill-assignment",
    name="Skill assignment",
    slug="skill-assignment",
    description="A link between an agent definition and a skill it is permitted to use.",
    icon="🔗",
    schema=[
        FieldDefinition(name="agentId", type="string", label="agentId"),
        FieldDefinition(name="skillId", type="string", label="skillId"),
        FieldDefinition(name="assignedAt", type="string", label="assignedAt"),
        FieldDefinition(name="assignedBy", type="string", label="assignedBy"),
        FieldDefinition(name="isActive", type="boolean", label="isActive"),
    ],
)

skill_result_type = MinionType(
    id="skills-skill-result",
    name="Skill result",
    slug="skill-result",
    description="The output of a skill execution within an agent run.",
    icon="📤",
    schema=[
        FieldDefinition(name="skillId", type="string", label="skillId"),
        FieldDefinition(name="agentRunId", type="string", label="agentRunId"),
        FieldDefinition(name="inputs", type="string", label="inputs"),
        FieldDefinition(name="outputs", type="string", label="outputs"),
        FieldDefinition(name="qualityScore", type="number", label="qualityScore"),
        FieldDefinition(name="executedAt", type="string", label="executedAt"),
        FieldDefinition(name="passed", type="boolean", label="passed"),
        FieldDefinition(name="failureReason", type="string", label="failureReason"),
    ],
)

custom_types: list[MinionType] = [
    skill_definition_type,
    skill_assignment_type,
    skill_result_type,
]

