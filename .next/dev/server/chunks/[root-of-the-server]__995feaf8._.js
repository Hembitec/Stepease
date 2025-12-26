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
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/lib/file-processors.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "processPDF",
    ()=>processPDF,
    "processText",
    ()=>processText,
    "processWord",
    ()=>processWord
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mammoth$2f$lib$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/mammoth/lib/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$parse$2f$dist$2f$pdf$2d$parse$2f$esm$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/pdf-parse/dist/pdf-parse/esm/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$parse$2f$dist$2f$pdf$2d$parse$2f$esm$2f$PDFParse$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/pdf-parse/dist/pdf-parse/esm/PDFParse.js [app-route] (ecmascript)");
;
;
/**
 * Clean text by removing excessive whitespace and normalizing content
 */ function cleanText(text) {
    return text.replace(/\r\n/g, "\n").replace(/\t/g, "  ").replace(/\n{3,}/g, "\n\n") // Max 2 newlines
    .trim();
}
async function processPDF(buffer) {
    try {
        // Create PDFParse instance with the buffer data
        const pdfParser = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$parse$2f$dist$2f$pdf$2d$parse$2f$esm$2f$PDFParse$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PDFParse"]({
            data: buffer
        });
        // Extract text and info from the PDF
        const textResult = await pdfParser.getText();
        const infoResult = await pdfParser.getInfo();
        const content = cleanText(textResult.text);
        // Clean up resources
        await pdfParser.destroy();
        return {
            content,
            metadata: {
                pageCount: infoResult.total,
                charCount: content.length,
                wordCount: content.split(/\s+/).length,
                title: infoResult.info?.Title
            }
        };
    } catch (error) {
        console.error("PDF Processing Error:", error);
        throw new Error("Failed to process PDF file");
    }
}
async function processWord(buffer) {
    try {
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mammoth$2f$lib$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].extractRawText({
            buffer
        });
        const content = cleanText(result.value);
        return {
            content,
            metadata: {
                charCount: content.length,
                wordCount: content.split(/\s+/).length
            }
        };
    } catch (error) {
        console.error("Word Processing Error:", error);
        throw new Error("Failed to process Word document");
    }
}
async function processText(buffer) {
    try {
        const content = cleanText(buffer.toString("utf-8"));
        return {
            content,
            metadata: {
                charCount: content.length,
                wordCount: content.split(/\s+/).length
            }
        };
    } catch (error) {
        console.error("Text Processing Error:", error);
        throw new Error("Failed to process text file");
    }
}
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
"[project]/lib/sop-analyzer.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "analyzeSOPText",
    ()=>analyzeSOPText
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/ai/dist/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$ai$2d$sdk$2f$google$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@ai-sdk/google/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v3/external.js [app-route] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sop$2d$system$2d$prompt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/sop-system-prompt.ts [app-route] (ecmascript)");
;
;
;
;
const analysisResultSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    structure: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        hasHeader: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean(),
        hasPurpose: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean(),
        hasScope: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean(),
        hasRoles: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean(),
        hasDefinitions: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean(),
        hasReferences: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean(),
        hasMaterials: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean(),
        hasProcedures: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean(),
        hasQuality: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean(),
        hasTroubleshooting: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean(),
        hasAppendices: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean(),
        hasRevision: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean(),
        completenessScore: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number()
    }),
    quality: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        clarity: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
        actionability: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
        completeness: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
        overall: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number()
    }),
    strengths: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()),
    improvements: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        category: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            "Structure",
            "Clarity",
            "Content",
            "Safety"
        ]),
        priority: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            "High",
            "Medium",
            "Low"
        ]),
        description: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
        suggestion: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
    })),
    summary: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
});
async function analyzeSOPText(text) {
    try {
        const { object } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["generateObject"])({
            model: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$ai$2d$sdk$2f$google$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["google"])("gemini-3-flash-preview"),
            schema: analysisResultSchema,
            system: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sop$2d$system$2d$prompt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SOP_ANALYSIS_PROMPT"],
            prompt: `Please analyze the following SOP text:\n\n${text}`,
            temperature: 0.2
        });
        return object;
    } catch (error) {
        console.error("SOP Analysis Error:", error);
        throw new Error("Failed to analyze SOP content");
    }
}
}),
"[project]/app/api/analyze-sop/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "maxDuration",
    ()=>maxDuration
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$file$2d$processors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/file-processors.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sop$2d$analyzer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/sop-analyzer.ts [app-route] (ecmascript)");
;
;
const maxDuration = 60 // Allow up to 60 seconds for processing
;
async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get("file");
        if (!file) {
            return new Response("No file provided", {
                status: 400
            });
        }
        // Convert File to Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        // Process file based on type
        let processedFile;
        if (file.type === "application/pdf") {
            processedFile = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$file$2d$processors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["processPDF"])(buffer);
        } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.name.endsWith(".docx")) {
            processedFile = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$file$2d$processors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["processWord"])(buffer);
        } else if (file.type === "text/plain" || file.name.endsWith(".md") || file.name.endsWith(".txt")) {
            processedFile = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$file$2d$processors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["processText"])(buffer);
        } else {
            return new Response("Unsupported file type", {
                status: 400
            });
        }
        // Analyze content
        const analysis = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sop$2d$analyzer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["analyzeSOPText"])(processedFile.content);
        return Response.json({
            processedFile,
            analysis
        });
    } catch (error) {
        console.error("Analysis API Error:", error);
        return new Response(JSON.stringify({
            error: "Failed to process file",
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

//# sourceMappingURL=%5Broot-of-the-server%5D__995feaf8._.js.map