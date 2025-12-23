module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

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
"[project]/lib/types.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v3/external.js [app-ssr] (ecmascript) <export * as z>");
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
const noteCategorySchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
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
const conversationPhaseSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
    'foundation',
    'process',
    'accountability',
    'quality',
    'finalization',
    'complete'
]);
const aiResponseNoteSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    category: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    priority: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'high',
        'medium',
        'low'
    ]),
    content: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    relatedTo: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    action: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
});
const aiResponseSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    message: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    notes: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(aiResponseNoteSchema),
    phase: conversationPhaseSchema,
    progress: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().min(0).max(100)
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
"[project]/lib/sop-context.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SOPProvider",
    ()=>SOPProvider,
    "useSOPContext",
    ()=>useSOPContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
// =============================================================================
// STEPWISE - SOP CONTEXT PROVIDER
// Global state management for SOP creation with 5-phase conversation flow
// =============================================================================
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/types.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
// -----------------------------------------------------------------------------
// Mock Data for Initial State
// -----------------------------------------------------------------------------
const MOCK_SOPS = [
    {
        id: "sop-001",
        title: "Invoice Approval Procedure v2.0",
        department: "Finance",
        status: "complete",
        createdAt: "2025-12-18T10:00:00Z",
        updatedAt: "2025-12-20T08:30:00Z",
        content: `# Invoice Approval Procedure v2.0\n\n**Document ID:** SOP-FIN-001\n**Version:** 2.0\n**Effective Date:** December 20, 2025\n\n## 1. PURPOSE\nThis SOP establishes standardized procedures for invoice approval.\n\n## 2. SCOPE\nApplies to Accounts Payable team and all department managers.\n\n## 3. PROCEDURE\n1. Receive invoice\n2. Verify details\n3. Route for approval\n4. Process payment`,
        notes: [],
        chatHistory: []
    },
    {
        id: "sop-002",
        title: "Employee Onboarding Process",
        department: "HR",
        status: "draft",
        createdAt: "2025-12-19T14:00:00Z",
        updatedAt: "2025-12-19T16:45:00Z",
        content: "# Employee Onboarding Process\n\n*Draft in progress...*",
        notes: [],
        chatHistory: []
    }
];
const SOPContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function SOPProvider({ children }) {
    // SOP Library State
    const [sops, setSops] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(MOCK_SOPS);
    const [currentSOP, setCurrentSOP] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Active Session State
    const [session, setSession] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // -------------------------------------------------------------------------
    // SOP CRUD Operations
    // -------------------------------------------------------------------------
    const addSOP = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((sop)=>{
        setSops((prev)=>[
                ...prev,
                sop
            ]);
    }, []);
    const updateSOP = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id, updates)=>{
        setSops((prev)=>prev.map((sop)=>sop.id === id ? {
                    ...sop,
                    ...updates,
                    updatedAt: new Date().toISOString()
                } : sop));
        // Update currentSOP if it's the one being modified
        if (currentSOP?.id === id) {
            setCurrentSOP((prev)=>prev ? {
                    ...prev,
                    ...updates
                } : null);
        }
    }, [
        currentSOP?.id
    ]);
    const deleteSOP = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id)=>{
        setSops((prev)=>prev.filter((sop)=>sop.id !== id));
        if (currentSOP?.id === id) {
            setCurrentSOP(null);
        }
    }, [
        currentSOP?.id
    ]);
    // -------------------------------------------------------------------------
    // Note Operations (for saved SOPs)
    // -------------------------------------------------------------------------
    const addNote = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((sopId, note)=>{
        setSops((prev)=>prev.map((sop)=>sop.id === sopId ? {
                    ...sop,
                    notes: [
                        ...sop.notes,
                        note
                    ],
                    updatedAt: new Date().toISOString()
                } : sop));
    }, []);
    const updateNote = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((sopId, noteId, updates)=>{
        setSops((prev)=>prev.map((sop)=>sop.id === sopId ? {
                    ...sop,
                    notes: sop.notes.map((n)=>n.id === noteId ? {
                            ...n,
                            ...updates
                        } : n),
                    updatedAt: new Date().toISOString()
                } : sop));
    }, []);
    const deleteNote = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((sopId, noteId)=>{
        setSops((prev)=>prev.map((sop)=>sop.id === sopId ? {
                    ...sop,
                    notes: sop.notes.filter((n)=>n.id !== noteId),
                    updatedAt: new Date().toISOString()
                } : sop));
    }, []);
    // -------------------------------------------------------------------------
    // Message Operations (for saved SOPs)
    // -------------------------------------------------------------------------
    const addMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((sopId, message)=>{
        setSops((prev)=>prev.map((sop)=>sop.id === sopId ? {
                    ...sop,
                    chatHistory: [
                        ...sop.chatHistory,
                        message
                    ]
                } : sop));
    }, []);
    // -------------------------------------------------------------------------
    // Session Management
    // -------------------------------------------------------------------------
    const startNewSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const newId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateId"])("session");
        const newSession = {
            id: newId,
            title: "New SOP",
            messages: [],
            notes: [],
            phase: "foundation",
            phaseProgress: 0,
            questionsAsked: 0,
            createdAt: new Date().toISOString()
        };
        setSession(newSession);
        return newId;
    }, []);
    const startImprovementSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((content, analysis)=>{
        const newId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateId"])("session");
        // Create initial notes from analysis improvements
        const improvementNotes = analysis.improvements.map((imp)=>({
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateId"])("note"),
                category: "GAPS_IMPROVEMENTS",
                priority: imp.priority.toLowerCase(),
                content: `${imp.description} - Suggestion: ${imp.suggestion}`,
                timestamp: new Date().toISOString(),
                source: "AI Extraction",
                relatedTo: imp.category,
                action: "Needs addressing"
            }));
        // Detailed context message for the AI
        const contextMessage = `I need you to help me improve this SOP.
    
ANALYSIS SUMMARY:
${analysis.summary}

STRENGTHS:
${analysis.strengths.map((s)=>`- ${s}`).join("\n")}

CONTENT TO IMPROVE:
${content}`;
        const newSession = {
            id: newId,
            title: "SOP Improvement",
            messages: [
                {
                    id: "context-chk",
                    role: "user",
                    content: contextMessage,
                    timestamp: new Date().toISOString()
                }
            ],
            notes: improvementNotes,
            phase: "foundation",
            phaseProgress: 0,
            questionsAsked: 0,
            createdAt: new Date().toISOString(),
            metadata: {
                mode: "improve",
                originalContent: content,
                analysisResult: analysis
            }
        };
        setSession(newSession);
        return newId;
    }, []);
    const updateSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((updates)=>{
        setSession((prev)=>prev ? {
                ...prev,
                ...updates
            } : null);
    }, []);
    const endSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setSession(null);
    }, []);
    // -------------------------------------------------------------------------
    // Session Note Operations
    // -------------------------------------------------------------------------
    const addSessionNote = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((note)=>{
        setSession((prev)=>prev ? {
                ...prev,
                notes: [
                    ...prev.notes,
                    note
                ]
            } : null);
    }, []);
    const addSessionNotes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((notes)=>{
        if (notes.length === 0) return;
        setSession((prev)=>prev ? {
                ...prev,
                notes: [
                    ...prev.notes,
                    ...notes
                ]
            } : null);
    }, []);
    const updateSessionNote = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((noteId, updates)=>{
        setSession((prev)=>prev ? {
                ...prev,
                notes: prev.notes.map((n)=>n.id === noteId ? {
                        ...n,
                        ...updates
                    } : n)
            } : null);
    }, []);
    const deleteSessionNote = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((noteId)=>{
        setSession((prev)=>prev ? {
                ...prev,
                notes: prev.notes.filter((n)=>n.id !== noteId)
            } : null);
    }, []);
    // -------------------------------------------------------------------------
    // Session Message Operations
    // -------------------------------------------------------------------------
    const addSessionMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((message)=>{
        setSession((prev)=>prev ? {
                ...prev,
                messages: [
                    ...prev.messages,
                    message
                ],
                questionsAsked: message.role === "ai" ? prev.questionsAsked + 1 : prev.questionsAsked
            } : null);
    }, []);
    // -------------------------------------------------------------------------
    // Phase Management
    // -------------------------------------------------------------------------
    const setSessionPhase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((phase, progress)=>{
        setSession((prev)=>prev ? {
                ...prev,
                phase,
                phaseProgress: progress !== undefined ? progress : prev.phaseProgress
            } : null);
    }, []);
    const advancePhase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setSession((prev)=>{
            if (!prev) return null;
            const nextPhase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getNextPhase"])(prev.phase);
            return {
                ...prev,
                phase: nextPhase,
                phaseProgress: 0
            };
        });
    }, []);
    // -------------------------------------------------------------------------
    // Session Finalization
    // -------------------------------------------------------------------------
    const finalizeSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((title, department)=>{
        if (!session) return null;
        const newSOP = {
            id: session.id.replace("session", "sop"),
            title: title || session.title || "Untitled SOP",
            department: department || "General",
            status: "draft",
            createdAt: session.createdAt,
            updatedAt: new Date().toISOString(),
            notes: session.notes,
            chatHistory: session.messages,
            content: ""
        };
        addSOP(newSOP);
        setCurrentSOP(newSOP);
        setSession(null); // End the session
        return newSOP;
    }, [
        session,
        addSOP
    ]);
    // -------------------------------------------------------------------------
    // Utility Functions
    // -------------------------------------------------------------------------
    const getSessionNotesByCategory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!session) return {};
        return session.notes.reduce((acc, note)=>{
            if (!acc[note.category]) {
                acc[note.category] = [];
            }
            acc[note.category].push(note);
            return acc;
        }, {});
    }, [
        session
    ]);
    const getSessionProgress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!session) return 0;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateOverallProgress"])(session.phase, session.phaseProgress);
    }, [
        session
    ]);
    // -------------------------------------------------------------------------
    // Context Value
    // -------------------------------------------------------------------------
    const contextValue = {
        // SOP Library
        sops,
        currentSOP,
        setCurrentSOP,
        addSOP,
        updateSOP,
        deleteSOP,
        // Note Management
        addNote,
        updateNote,
        deleteNote,
        // Message Management
        addMessage,
        // Session Management
        session,
        startNewSession,
        startImprovementSession,
        updateSession,
        endSession,
        // Session Notes
        addSessionNote,
        addSessionNotes,
        updateSessionNote,
        deleteSessionNote,
        // Session Messages
        addSessionMessage,
        // Phase Management
        setSessionPhase,
        advancePhase,
        // Finalization
        finalizeSession,
        // Utilities
        getSessionNotesByCategory,
        getSessionProgress
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SOPContext.Provider, {
        value: contextValue,
        children: children
    }, void 0, false, {
        fileName: "[project]/lib/sop-context.tsx",
        lineNumber: 460,
        columnNumber: 5
    }, this);
}
function useSOPContext() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(SOPContext);
    if (!context) {
        throw new Error("useSOPContext must be used within a SOPProvider");
    }
    return context;
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__f09d1e3c._.js.map