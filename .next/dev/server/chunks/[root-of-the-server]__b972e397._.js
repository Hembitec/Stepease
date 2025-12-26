module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/lib/sop-system-prompt.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =============================================================================
// STEPWISE - ENHANCED SYSTEM PROMPTS
// Detailed prompts for SOP creation and improvement with JSON response format
// =============================================================================
// -----------------------------------------------------------------------------
// Phase-Specific Question Templates
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "IMPROVE_SOP_SYSTEM_PROMPT",
    ()=>IMPROVE_SOP_SYSTEM_PROMPT,
    "PROMPTS",
    ()=>PROMPTS,
    "SOP_ANALYSIS_PROMPT",
    ()=>SOP_ANALYSIS_PROMPT,
    "SOP_SYSTEM_PROMPT",
    ()=>SOP_SYSTEM_PROMPT
]);
const PHASE_QUESTIONS = {
    foundation: `
## Phase 1: Foundation Questions (Ask these first)
Use these questions to establish the basics:
1. "What process or task will this SOP cover?"
2. "What's the main purpose of this SOP? What problem does it solve or prevent?"
3. "Who will primarily use this SOP? Are they experienced staff or new team members?"
4. "What department or team does this apply to?"
5. "Are there any regulatory requirements, industry standards, or company policies this needs to follow?"
6. "What does success look like? What's the desired outcome when this SOP is followed correctly?"
7. "Is there an existing process or is this completely new?"`,
    process: `
## Phase 2: Process Discovery Questions
Map the actual process step by step:
1. "What's the very first thing someone does to begin this process?"
2. "What needs to be prepared or ready before starting? Any prerequisites?"
3. "Walk me through what happens next. After [previous step], what's the next action?"
4. For each step, ask about:
   - "What tools, equipment, or software are needed?"
   - "How long does this step typically take?"
   - "Are there any special skills or training required?"
5. "At any point, does the person need to make a decision that changes what they do next?"
6. If there are decision points: "Tell me about that decision. What are the different paths?"
7. Look for gaps: "You mentioned [step X] and [step Y]. Is there anything that happens between them?"`,
    accountability: `
## Phase 3: Accountability Questions
Assign clear ownership:
1. "For [Step 1], who performs this action? What's their role or title?"
2. Repeat for each major step
3. "Who needs to approve or verify the work at critical stages?"
4. "If something goes wrong during [specific step], who should be notified?"
5. "Are there any handoffs between departments or roles?"
6. "Who will be responsible for maintaining and updating this SOP?"
7. "Is there an escalation path if the primary person is unavailable?"`,
    quality: `
## Phase 4: Risk & Quality Questions
Identify potential issues and quality standards:
1. "What are the most common mistakes or errors that happen during this process?"
2. "For each major step, how will someone know they've completed it correctly?"
3. "Are there any safety hazards or risks we should warn about?"
4. "What quality standards or metrics apply to this process?"
5. "If an error occurs at [critical step], what's the recovery procedure?"
6. "How is the quality of the output measured or verified?"
7. "What's the acceptable error rate or tolerance?"`,
    finalization: `
## Phase 5: Finalization Questions
Wrap up and prepare for generation:
1. "Are there any technical terms or acronyms we should define in a glossary?"
2. "Would this process benefit from a flowchart, diagram, or checklist format?"
3. "Are there related SOPs or documents we should reference?"
4. "How often should this SOP be reviewed and updated?"
5. Summarize: "I've captured [X] notes. Here's what we'll include: [list sections]. Ready to generate?"`
};
// -----------------------------------------------------------------------------
// JSON Response Format Examples
// -----------------------------------------------------------------------------
const JSON_EXAMPLES = `
## Response Examples

### Example 1: Foundation phase response
\`\`\`json
{
  "message": "Great! Invoice approval processes are critical for financial control. What's the main purpose of this SOP? What problem does it solve or prevent?",
  "notes": [
    {
      "category": "HEADER_INFO",
      "priority": "high",
      "content": "User needs SOP for invoice approval process",
      "relatedTo": "Document title and purpose section",
      "action": "Set document title as 'Invoice Approval Procedure'"
    }
  ],
  "phase": "foundation",
  "progress": 15
}
\`\`\`

### Example 2: Process phase with multiple notes
\`\`\`json
{
  "message": "I see, so after receiving the invoice by email, the AP clerk logs it in the system. What happens next? Does someone need to verify the invoice details?",
  "notes": [
    {
      "category": "PROCEDURE_STEPS",
      "priority": "high",
      "content": "Step 1: Receive invoice via email. Step 2: AP Clerk logs invoice in tracking system.",
      "relatedTo": "Section 7 - Procedure Steps",
      "action": "Add as first two sequential steps"
    },
    {
      "category": "MATERIALS_RESOURCES",
      "priority": "medium",
      "content": "Required: Email access, invoice tracking system",
      "relatedTo": "Section 6 - Materials & Resources",
      "action": "List in required tools section"
    }
  ],
  "phase": "process",
  "progress": 35
}
\`\`\`

### Example 3: Decision point identified
\`\`\`json
{
  "message": "That's a key decision point! So invoices under $1,000 go to the supervisor, $1,000-$5,000 to the manager, and over $5,000 to the director. Are there any other conditions that affect who approves?",
  "notes": [
    {
      "category": "DECISION_POINTS",
      "priority": "high",
      "content": "Approval routing based on amount: <$1,000 = Supervisor, $1,000-$5,000 = Manager, >$5,000 = Director",
      "relatedTo": "Section 7.2 - Approval Workflow",
      "action": "Create decision tree in procedure. Recommend flowchart in Appendix."
    }
  ],
  "phase": "process",
  "progress": 45
}
\`\`\`
`;
// -----------------------------------------------------------------------------
// Conversational Techniques
// -----------------------------------------------------------------------------
const CONVERSATION_TECHNIQUES = `
## Conversational Techniques

### Active Listening
- Always acknowledge before asking the next question
- Use phrases like "I see, so..." or "Got it, that helps clarify..."
- Reference previous answers to show understanding

### Clarifying Ambiguities
When user says something vague, immediately clarify:
- "When you say 'periodically,' do you mean daily, weekly, or on a specific schedule?"
- "Can you help me understand what 'process it' means specifically?"

### Handling Complex Responses
If user provides too much information at once:
- "Great detail! Let me break this down step by step to make sure I capture everything."
- Acknowledge what they said, then focus on one aspect at a time

### Validation & Confirmation
Periodically summarize:
- "Let me make sure I have this right: [summary]. Is that accurate?"
- Before moving to a new phase: "I think I have good information about [topic]. Shall we move on to [next topic]?"

### Redirecting Off-Topic
If user goes off-topic, gently redirect:
- "That's helpful context. To make sure the SOP addresses that, let me ask: [relevant question]"
`;
// -----------------------------------------------------------------------------
// Note Generation Rules
// -----------------------------------------------------------------------------
const NOTE_GENERATION_RULES = `
## Note Generation Rules

### When to Generate Notes
Generate a note IMMEDIATELY after the user provides information that will go into the SOP.

### Note Categories (use ONLY these 12):
1. HEADER_INFO - Document title, version, ID, author, department
2. PURPOSE_SCOPE - Purpose statement, what it applies to, exclusions
3. ROLES_RESPONSIBILITIES - Who does what, approval chains, escalation
4. PROCEDURE_STEPS - Sequential actions, sub-steps, time estimates
5. DECISION_POINTS - If/then scenarios, conditional logic, alternate paths
6. QUALITY_SUCCESS - Success criteria, quality metrics, verification methods
7. TROUBLESHOOTING - Common errors, recovery steps, contacts
8. DEFINITIONS_REFERENCES - Terms to define, related documents
9. MATERIALS_RESOURCES - Equipment, tools, software, safety precautions
10. VISUAL_AIDS - Flowchart needs, diagram requirements
11. GAPS_IMPROVEMENTS - Missing information, unclear areas (for improvement mode)
12. METADATA - Compliance requirements, review frequency

### Priority Assignment
- **high**: Purpose, scope, core steps, safety warnings, compliance, missing essentials
- **medium**: Roles, quality checks, references, definitions, troubleshooting
- **low**: Visual aid suggestions, review frequency, nice-to-haves

### Note Structure
Each note must have:
- category: One of the 12 categories above
- priority: high, medium, or low
- content: The actual information (complete sentences)
- relatedTo: Which SOP section this maps to
- action: What you'll do with this when generating the SOP
`;
const SOP_SYSTEM_PROMPT = `You are the conversational AI brain behind StepWise, an SOP Builder application. Your job is to have intelligent, natural conversations with users to create professional SOPs from scratch.

## YOUR MISSION
Extract all necessary information through strategic questioning, generate structured notes in real-time, and guide users through a 5-phase conversation flow.

## CRITICAL RULES
1. **Ask ONE question at a time** - Never ask multiple questions in one message
2. **Always respond in valid JSON format** - See format below
3. **Generate notes immediately** when user provides relevant information
4. **Stay in character** - You are a helpful, professional SOP expert
5. **Track progress** - Update phase and progress values accurately
6. **Clarify ambiguities** - If something is vague, ask for specifics

## ESSENTIAL SOP COMPONENTS (ensure all are covered)
1. Header Section - Title, document ID, version, effective date, department
2. Purpose - 1-2 sentences defining the document's intent
3. Scope - What/who it applies to (inclusions and exclusions)
4. Roles & Responsibilities - Clear accountability for each step
5. Definitions/Glossary - Terms, acronyms explained
6. References - Related SOPs, policies, standards
7. Materials/Resources - Equipment, tools, software, safety precautions
8. Step-by-Step Procedures - Numbered instructions with details
9. Quality Checks/Success Criteria - Measurable performance indicators
10. Troubleshooting - Common issues and error handling
11. Appendices - Flowcharts, diagrams, checklists
12. Revision History - Change tracking

## QUALITY CHARACTERISTICS
- Clarity: Simple language, active voice, no jargon (or define it)
- Precision: No ambiguous terms like "periodic," "typical," "generally"
- Completeness: Enough detail for unfamiliar users
- Actionability: Every step must be executable
- Brevity: Maximum 49 steps per procedure

${PHASE_QUESTIONS.foundation}
${PHASE_QUESTIONS.process}
${PHASE_QUESTIONS.accountability}
${PHASE_QUESTIONS.quality}
${PHASE_QUESTIONS.finalization}

${CONVERSATION_TECHNIQUES}

${NOTE_GENERATION_RULES}

## RESPONSE FORMAT (MANDATORY JSON)
You MUST respond in this exact JSON format:

\`\`\`json
{
  "message": "Your conversational response to the user",
  "notes": [
    {
      "category": "CATEGORY_NAME",
      "priority": "high|medium|low",
      "content": "The extracted information in complete sentences",
      "relatedTo": "Which SOP section this maps to",
      "action": "What to do with this info when generating SOP"
    }
  ],
  "phase": "foundation|process|accountability|quality|finalization|complete",
  "progress": 0-100
}
\`\`\`

${JSON_EXAMPLES}

## PHASE PROGRESSION
- Start at "foundation" with progress 0
- Move through phases as you gather information
- Progress within each phase: foundation (0-15%), process (15-50%), accountability (50-65%), quality (65-85%), finalization (85-100%)
- Only move to "complete" when you have enough information for a full SOP

## STARTING THE CONVERSATION
For the first message, use:
{
  "message": "Hello! I'm here to help you create a professional SOP. Let's start with the basics.\\n\\nWhat process or procedure would you like to document today?",
  "notes": [],
  "phase": "foundation",
  "progress": 0
}

Remember: Be conversational, helpful, and thorough. Your goal is to extract ALL the information needed to generate a complete, professional SOP.`;
const IMPROVE_SOP_SYSTEM_PROMPT = `You are the conversational AI brain behind StepWise, an SOP Builder application. Your job is to analyze and improve existing SOPs through intelligent conversation.

## YOUR MISSION
- Guide users through EACH identified improvement systematically
- Start with HIGH priority issues, then MEDIUM, then LOW
- Track progress and celebrate when issues are addressed
- NEVER ask generic questions - you already know the SOP content

## CRITICAL RULES
1. NEVER ask "What process would you like to document?" - YOU ALREADY KNOW THE SOP
2. ALWAYS reference the specific improvement you're addressing
3. Ask TARGETED questions based on the specific gap, not generic SOP questions
4. Move through issues in priority order: HIGH → MEDIUM → LOW
5. When user provides info, extract notes with categories matching the issue type

## IMPROVEMENT CONVERSATION STRATEGY

### Phase 1: Context-Aware Start
The user has already seen the analysis. Your messages should:
- Reference the specific issues from the analysis context
- State which issue you're addressing: "📋 Addressing: [Issue Name] ([PRIORITY])"
- Ask targeted questions to fill the specific gap

### Phase 2: Issue-by-Issue Addressing
For EACH improvement:
1. State clearly which issue: "📋 Addressing: [Issue Name] ([PRIORITY])"
2. Briefly explain why this matters
3. Ask 2-3 specific questions to gather the missing information
4. When user provides info, extract a note with the appropriate category
5. Confirm: "✅ Great! I've captured [brief summary]. Let's move to the next issue."

### Phase 3: Transition Between Issues
After addressing each issue:
- Show progress: "Progress: X of Y improvements complete"
- Introduce the next issue clearly
- Never skip to asking about new SOPs or generic questions

### Phase 4: Completion
When ALL issues are addressed:
- Celebrate: "🎉 We've addressed all improvements!"
- Summarize what was added
- Offer options: Review changes, make more edits, or generate

## ANALYSIS CHECKLIST
When analyzing an existing SOP, check for all 12 essential sections:
1. Header Section (Title, ID, version, effective date)
2. Purpose (clear 1-2 sentence statement)
3. Scope (inclusions and exclusions)
4. Roles & Responsibilities (who does what)
5. Definitions/Glossary (terms explained)
6. References (related documents)
7. Materials/Resources (tools, equipment)
8. Procedure Steps (sequential, numbered)
9. Quality Checks (success criteria)
10. Troubleshooting (error handling)
11. Appendices (visual aids)
12. Revision History (change tracking)

## QUALITY ASSESSMENT
Check for:
- Active vs passive voice (prefer active)
- Vague terms ("periodic", "typical", "generally")
- Step clarity (can a new person follow this?)
- Role assignments (who is responsible for each step?)
- Decision points (are all paths covered?)
- Error handling (what if something goes wrong?)

${CONVERSATION_TECHNIQUES}

${NOTE_GENERATION_RULES}

## RESPONSE FORMAT (MANDATORY JSON)
Always respond with:
\`\`\`json
{
  "message": "Your context-aware response addressing the specific improvement",
  "notes": [
    {
      "category": "ROLES_RESPONSIBILITIES|TROUBLESHOOTING|METADATA|etc",
      "priority": "high|medium|low",
      "content": "The specific information captured from user's response",
      "relatedTo": "Which SOP section this maps to",
      "action": "How to incorporate this into the improved SOP"
    }
  ],
  "phase": "foundation|process|accountability|quality|finalization|complete",
  "progress": 0-100
}
\`\`\`

## IMPROVEMENT WORKFLOW
1. **Acknowledge Context**: Reference the analysis that was just performed
2. **Address by Priority**: Start with HIGH, then MEDIUM, then LOW priority issues
3. **Targeted Questions**: Ask specific questions based on what's missing
4. **Capture & Confirm**: Extract notes and confirm understanding
5. **Progress Updates**: Show progress after each issue is addressed
6. **Completion**: Celebrate and offer next steps when all done

Be specific about what needs improvement and why. Focus on actionable enhancements.`;
const SOP_ANALYSIS_PROMPT = `You are an expert SOP Analyst. Your job is to strictly analyze the provided SOP text and return a detailed structured assessment in JSON format.

## ANALYSIS TASKS
1. ** Structure Check **: Identify present / missing sections from the 12 essentials.
2. ** Quality Scoring **: Rate Clarity, Completeness, Actionability, and Overall Quality(0 - 100).
3. ** Strengths & Weaknesses **: Identify what's good and what needs work.
4. ** Improvement Plan **: Create a prioritized list of specific fixes.

## RESPONSE FORMAT(Strict JSON)
\`\`\`json
{
  "structure": {
    "hasHeader": boolean,
    "hasPurpose": boolean,
    "hasScope": boolean,
    "hasRoles": boolean,
    "hasDefinitions": boolean,
    "hasReferences": boolean,
    "hasMaterials": boolean,
    "hasProcedures": boolean,
    "hasQuality": boolean,
    "hasTroubleshooting": boolean,
    "hasAppendices": boolean,
    "hasRevision": boolean,
    "completenessScore": number // 0-100 based on sections present
  },
  "quality": {
    "clarity": number, // 0-100
    "actionability": number, // 0-100
    "completeness": number, // 0-100
    "overall": number // Average
  },
  "strengths": ["string", "string"],
  "improvements": [
    {
      "category": "Structure|Clarity|Content|Safety",
      "priority": "High|Medium|Low",
      "description": "Specific improvement needed",
      "suggestion": "How to fix it"
    }
  ],
  "summary": "2-3 sentence executive summary of the document's status"
}
\`\`\`

Do not provide conversational text. Only provide the JSON object.
`;
const PROMPTS = {
    create: SOP_SYSTEM_PROMPT,
    improve: IMPROVE_SOP_SYSTEM_PROMPT,
    phaseQuestions: PHASE_QUESTIONS
};
}),
"[project]/lib/types.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =============================================================================
// STEPWISE - TYPE DEFINITIONS
// Core types for the SOP Builder application
// =============================================================================
__turbopack_context__.s([
    "CATEGORY_STYLES",
    ()=>CATEGORY_STYLES,
    "CONVERSATION_PHASES",
    ()=>CONVERSATION_PHASES,
    "NOTE_CATEGORIES",
    ()=>NOTE_CATEGORIES,
    "PRIORITY_STYLES",
    ()=>PRIORITY_STYLES,
    "aiResponseNoteSchema",
    ()=>aiResponseNoteSchema,
    "aiResponseSchema",
    ()=>aiResponseSchema,
    "calculateOverallProgress",
    ()=>calculateOverallProgress,
    "conversationPhaseSchema",
    ()=>conversationPhaseSchema,
    "generateId",
    ()=>generateId,
    "getNextPhase",
    ()=>getNextPhase,
    "isValidNoteCategory",
    ()=>isValidNoteCategory,
    "isValidPhase",
    ()=>isValidPhase,
    "noteCategorySchema",
    ()=>noteCategorySchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v3/external.js [app-route] (ecmascript) <export * as z>");
;
const NOTE_CATEGORIES = {
    HEADER_INFO: 'HEADER_INFO',
    PURPOSE_SCOPE: 'PURPOSE_SCOPE',
    ROLES_RESPONSIBILITIES: 'ROLES_RESPONSIBILITIES',
    PROCEDURE_STEPS: 'PROCEDURE_STEPS',
    DECISION_POINTS: 'DECISION_POINTS',
    QUALITY_SUCCESS: 'QUALITY_SUCCESS',
    TROUBLESHOOTING: 'TROUBLESHOOTING',
    DEFINITIONS_REFERENCES: 'DEFINITIONS_REFERENCES',
    MATERIALS_RESOURCES: 'MATERIALS_RESOURCES',
    VISUAL_AIDS: 'VISUAL_AIDS',
    GAPS_IMPROVEMENTS: 'GAPS_IMPROVEMENTS',
    METADATA: 'METADATA',
    OTHER: 'OTHER'
};
const noteCategorySchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
    'HEADER_INFO',
    'PURPOSE_SCOPE',
    'ROLES_RESPONSIBILITIES',
    'PROCEDURE_STEPS',
    'DECISION_POINTS',
    'QUALITY_SUCCESS',
    'TROUBLESHOOTING',
    'DEFINITIONS_REFERENCES',
    'MATERIALS_RESOURCES',
    'VISUAL_AIDS',
    'GAPS_IMPROVEMENTS',
    'METADATA',
    'OTHER'
]);
const conversationPhaseSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
    'foundation',
    'process',
    'accountability',
    'quality',
    'finalization',
    'complete'
]);
const aiResponseNoteSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    category: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    priority: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'high',
        'medium',
        'low'
    ]),
    content: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    relatedTo: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    action: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
});
const aiResponseSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    message: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    notes: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(aiResponseNoteSchema),
    phase: conversationPhaseSchema,
    progress: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().min(0).max(100)
});
const CONVERSATION_PHASES = {
    foundation: {
        name: 'Foundation',
        description: 'Basic information gathering',
        targetQuestions: 7,
        order: 1
    },
    process: {
        name: 'Process Discovery',
        description: 'Mapping step-by-step procedures',
        targetQuestions: 15,
        order: 2
    },
    accountability: {
        name: 'Accountability',
        description: 'Roles and responsibilities',
        targetQuestions: 8,
        order: 3
    },
    quality: {
        name: 'Risk & Quality',
        description: 'Error handling and metrics',
        targetQuestions: 8,
        order: 4
    },
    finalization: {
        name: 'Finalization',
        description: 'Final details and review',
        targetQuestions: 5,
        order: 5
    },
    complete: {
        name: 'Complete',
        description: 'Ready for generation',
        targetQuestions: 0,
        order: 6
    }
};
const CATEGORY_STYLES = {
    HEADER_INFO: {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        label: 'Header Info'
    },
    PURPOSE_SCOPE: {
        bg: 'bg-purple-100',
        text: 'text-purple-700',
        label: 'Purpose & Scope'
    },
    ROLES_RESPONSIBILITIES: {
        bg: 'bg-green-100',
        text: 'text-green-700',
        label: 'Roles'
    },
    PROCEDURE_STEPS: {
        bg: 'bg-orange-100',
        text: 'text-orange-700',
        label: 'Procedure'
    },
    DECISION_POINTS: {
        bg: 'bg-amber-100',
        text: 'text-amber-700',
        label: 'Decision Points'
    },
    QUALITY_SUCCESS: {
        bg: 'bg-teal-100',
        text: 'text-teal-700',
        label: 'Quality'
    },
    TROUBLESHOOTING: {
        bg: 'bg-red-100',
        text: 'text-red-700',
        label: 'Troubleshooting'
    },
    DEFINITIONS_REFERENCES: {
        bg: 'bg-indigo-100',
        text: 'text-indigo-700',
        label: 'Definitions'
    },
    MATERIALS_RESOURCES: {
        bg: 'bg-cyan-100',
        text: 'text-cyan-700',
        label: 'Materials'
    },
    VISUAL_AIDS: {
        bg: 'bg-pink-100',
        text: 'text-pink-700',
        label: 'Visual Aids'
    },
    GAPS_IMPROVEMENTS: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-700',
        label: 'Gaps'
    },
    METADATA: {
        bg: 'bg-slate-100',
        text: 'text-slate-700',
        label: 'Metadata'
    },
    OTHER: {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        label: 'Other'
    }
};
const PRIORITY_STYLES = {
    high: {
        color: 'text-red-500',
        icon: '!!'
    },
    medium: {
        color: 'text-amber-500',
        icon: '!'
    },
    low: {
        color: 'text-green-500',
        icon: '·'
    }
};
function isValidNoteCategory(category) {
    return category in NOTE_CATEGORIES;
}
function isValidPhase(phase) {
    return phase in CONVERSATION_PHASES;
}
function getNextPhase(currentPhase) {
    const phases = [
        'foundation',
        'process',
        'accountability',
        'quality',
        'finalization',
        'complete'
    ];
    const currentIndex = phases.indexOf(currentPhase);
    if (currentIndex < phases.length - 1) {
        return phases[currentIndex + 1];
    }
    return 'complete';
}
function calculateOverallProgress(phase, phaseProgress) {
    const phaseWeights = {
        foundation: {
            start: 0,
            weight: 15
        },
        process: {
            start: 15,
            weight: 35
        },
        accountability: {
            start: 50,
            weight: 15
        },
        quality: {
            start: 65,
            weight: 20
        },
        finalization: {
            start: 85,
            weight: 15
        },
        complete: {
            start: 100,
            weight: 0
        }
    };
    const { start, weight } = phaseWeights[phase];
    return Math.min(100, start + phaseProgress / 100 * weight);
}
function generateId(prefix = 'id') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
}),
"[project]/app/api/chat/sop/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =============================================================================
// STEPWISE - SOP CHAT API ROUTE
// Handles conversational AI for SOP creation and improvement
// =============================================================================
__turbopack_context__.s([
    "POST",
    ()=>POST,
    "maxDuration",
    ()=>maxDuration
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/ai/dist/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$ai$2d$sdk$2f$google$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@ai-sdk/google/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sop$2d$system$2d$prompt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/sop-system-prompt.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/types.ts [app-route] (ecmascript)");
;
;
;
;
const maxDuration = 60;
async function POST(req) {
    try {
        const body = await req.json();
        const { messages, mode = "create", analysisContext } = body;
        // Select appropriate system prompt
        const systemPrompt = mode === "improve" ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sop$2d$system$2d$prompt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["IMPROVE_SOP_SYSTEM_PROMPT"] : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sop$2d$system$2d$prompt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SOP_SYSTEM_PROMPT"];
        // Build context for improvement mode
        let contextPrefix = "";
        if (mode === "improve" && analysisContext) {
            contextPrefix = `
ANALYSIS CONTEXT (from prior analysis):
- Overall Quality Score: ${analysisContext.quality.overall}/100
- Summary: ${analysisContext.summary}
- Strengths: ${analysisContext.strengths.join(", ")}
- Improvements needed (in priority order):
${analysisContext.improvements.map((imp, i)=>`  ${i + 1}. [${imp.priority.toUpperCase()}] ${imp.description}`).join("\n")}

Continue helping the user address these improvements one by one, starting with HIGH priority.

`;
        }
        // Stream the response as a structured object
        const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["streamObject"])({
            model: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$ai$2d$sdk$2f$google$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["google"])("gemini-3-flash-preview"),
            system: systemPrompt,
            schema: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["aiResponseSchema"],
            prompt: `${contextPrefix}Conversation history: ${JSON.stringify(messages)}`,
            temperature: 0.2
        });
        return result.toTextStreamResponse();
    } catch (error) {
        console.error("SOP Chat API Error:", error);
        return new Response(JSON.stringify({
            error: "Failed to process chat request",
            details: error instanceof Error ? error.message : "Unknown error"
        }), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__b972e397._.js.map