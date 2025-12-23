(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/types.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =============================================================================
// STEPWISE - TYPE DEFINITIONS
// Core types for the SOP Builder application
// =============================================================================
// -----------------------------------------------------------------------------
// Note Categories - 12 categories as specified in aisop.md
// -----------------------------------------------------------------------------
__turbopack_context__.s([
    "CATEGORY_STYLES",
    ()=>CATEGORY_STYLES,
    "CONVERSATION_PHASES",
    ()=>CONVERSATION_PHASES,
    "NOTE_CATEGORIES",
    ()=>NOTE_CATEGORIES,
    "PRIORITY_STYLES",
    ()=>PRIORITY_STYLES,
    "calculateOverallProgress",
    ()=>calculateOverallProgress,
    "generateId",
    ()=>generateId,
    "getNextPhase",
    ()=>getNextPhase,
    "isValidNoteCategory",
    ()=>isValidNoteCategory,
    "isValidPhase",
    ()=>isValidPhase
]);
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/sop-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SOPProvider",
    ()=>SOPProvider,
    "useSOPContext",
    ()=>useSOPContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// =============================================================================
// STEPWISE - SOP CONTEXT PROVIDER
// Global state management for SOP creation with 5-phase conversation flow
// =============================================================================
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/types.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
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
const SOPContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function SOPProvider({ children }) {
    _s();
    // SOP Library State
    const [sops, setSops] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(MOCK_SOPS);
    const [currentSOP, setCurrentSOP] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Active Session State
    const [session, setSession] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // -------------------------------------------------------------------------
    // SOP CRUD Operations
    // -------------------------------------------------------------------------
    const addSOP = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SOPProvider.useCallback[addSOP]": (sop)=>{
            setSops({
                "SOPProvider.useCallback[addSOP]": (prev)=>[
                        ...prev,
                        sop
                    ]
            }["SOPProvider.useCallback[addSOP]"]);
        }
    }["SOPProvider.useCallback[addSOP]"], []);
    const updateSOP = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SOPProvider.useCallback[updateSOP]": (id, updates)=>{
            setSops({
                "SOPProvider.useCallback[updateSOP]": (prev)=>prev.map({
                        "SOPProvider.useCallback[updateSOP]": (sop)=>sop.id === id ? {
                                ...sop,
                                ...updates,
                                updatedAt: new Date().toISOString()
                            } : sop
                    }["SOPProvider.useCallback[updateSOP]"])
            }["SOPProvider.useCallback[updateSOP]"]);
            // Update currentSOP if it's the one being modified
            if (currentSOP?.id === id) {
                setCurrentSOP({
                    "SOPProvider.useCallback[updateSOP]": (prev)=>prev ? {
                            ...prev,
                            ...updates
                        } : null
                }["SOPProvider.useCallback[updateSOP]"]);
            }
        }
    }["SOPProvider.useCallback[updateSOP]"], [
        currentSOP?.id
    ]);
    const deleteSOP = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SOPProvider.useCallback[deleteSOP]": (id)=>{
            setSops({
                "SOPProvider.useCallback[deleteSOP]": (prev)=>prev.filter({
                        "SOPProvider.useCallback[deleteSOP]": (sop)=>sop.id !== id
                    }["SOPProvider.useCallback[deleteSOP]"])
            }["SOPProvider.useCallback[deleteSOP]"]);
            if (currentSOP?.id === id) {
                setCurrentSOP(null);
            }
        }
    }["SOPProvider.useCallback[deleteSOP]"], [
        currentSOP?.id
    ]);
    // -------------------------------------------------------------------------
    // Note Operations (for saved SOPs)
    // -------------------------------------------------------------------------
    const addNote = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SOPProvider.useCallback[addNote]": (sopId, note)=>{
            setSops({
                "SOPProvider.useCallback[addNote]": (prev)=>prev.map({
                        "SOPProvider.useCallback[addNote]": (sop)=>sop.id === sopId ? {
                                ...sop,
                                notes: [
                                    ...sop.notes,
                                    note
                                ],
                                updatedAt: new Date().toISOString()
                            } : sop
                    }["SOPProvider.useCallback[addNote]"])
            }["SOPProvider.useCallback[addNote]"]);
        }
    }["SOPProvider.useCallback[addNote]"], []);
    const updateNote = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SOPProvider.useCallback[updateNote]": (sopId, noteId, updates)=>{
            setSops({
                "SOPProvider.useCallback[updateNote]": (prev)=>prev.map({
                        "SOPProvider.useCallback[updateNote]": (sop)=>sop.id === sopId ? {
                                ...sop,
                                notes: sop.notes.map({
                                    "SOPProvider.useCallback[updateNote]": (n)=>n.id === noteId ? {
                                            ...n,
                                            ...updates
                                        } : n
                                }["SOPProvider.useCallback[updateNote]"]),
                                updatedAt: new Date().toISOString()
                            } : sop
                    }["SOPProvider.useCallback[updateNote]"])
            }["SOPProvider.useCallback[updateNote]"]);
        }
    }["SOPProvider.useCallback[updateNote]"], []);
    const deleteNote = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SOPProvider.useCallback[deleteNote]": (sopId, noteId)=>{
            setSops({
                "SOPProvider.useCallback[deleteNote]": (prev)=>prev.map({
                        "SOPProvider.useCallback[deleteNote]": (sop)=>sop.id === sopId ? {
                                ...sop,
                                notes: sop.notes.filter({
                                    "SOPProvider.useCallback[deleteNote]": (n)=>n.id !== noteId
                                }["SOPProvider.useCallback[deleteNote]"]),
                                updatedAt: new Date().toISOString()
                            } : sop
                    }["SOPProvider.useCallback[deleteNote]"])
            }["SOPProvider.useCallback[deleteNote]"]);
        }
    }["SOPProvider.useCallback[deleteNote]"], []);
    // -------------------------------------------------------------------------
    // Message Operations (for saved SOPs)
    // -------------------------------------------------------------------------
    const addMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SOPProvider.useCallback[addMessage]": (sopId, message)=>{
            setSops({
                "SOPProvider.useCallback[addMessage]": (prev)=>prev.map({
                        "SOPProvider.useCallback[addMessage]": (sop)=>sop.id === sopId ? {
                                ...sop,
                                chatHistory: [
                                    ...sop.chatHistory,
                                    message
                                ]
                            } : sop
                    }["SOPProvider.useCallback[addMessage]"])
            }["SOPProvider.useCallback[addMessage]"]);
        }
    }["SOPProvider.useCallback[addMessage]"], []);
    // -------------------------------------------------------------------------
    // Session Management
    // -------------------------------------------------------------------------
    const startNewSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SOPProvider.useCallback[startNewSession]": ()=>{
            const newId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateId"])("session");
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
        }
    }["SOPProvider.useCallback[startNewSession]"], []);
    const startImprovementSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SOPProvider.useCallback[startImprovementSession]": (content, analysis)=>{
            const newId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateId"])("session");
            // Create initial notes from analysis improvements
            const improvementNotes = analysis.improvements.map({
                "SOPProvider.useCallback[startImprovementSession].improvementNotes": (imp)=>({
                        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateId"])("note"),
                        category: "GAPS_IMPROVEMENTS",
                        priority: imp.priority.toLowerCase(),
                        content: `${imp.description} - Suggestion: ${imp.suggestion}`,
                        timestamp: new Date().toISOString(),
                        source: "AI Extraction",
                        relatedTo: imp.category,
                        action: "Needs addressing"
                    })
            }["SOPProvider.useCallback[startImprovementSession].improvementNotes"]);
            // Detailed context message for the AI
            const contextMessage = `I need you to help me improve this SOP.
    
ANALYSIS SUMMARY:
${analysis.summary}

STRENGTHS:
${analysis.strengths.map({
                "SOPProvider.useCallback[startImprovementSession]": (s)=>`- ${s}`
            }["SOPProvider.useCallback[startImprovementSession]"]).join("\n")}

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
        }
    }["SOPProvider.useCallback[startImprovementSession]"], []);
    const updateSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SOPProvider.useCallback[updateSession]": (updates)=>{
            setSession({
                "SOPProvider.useCallback[updateSession]": (prev)=>prev ? {
                        ...prev,
                        ...updates
                    } : null
            }["SOPProvider.useCallback[updateSession]"]);
        }
    }["SOPProvider.useCallback[updateSession]"], []);
    const endSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SOPProvider.useCallback[endSession]": ()=>{
            setSession(null);
        }
    }["SOPProvider.useCallback[endSession]"], []);
    // -------------------------------------------------------------------------
    // Session Note Operations
    // -------------------------------------------------------------------------
    const addSessionNote = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SOPProvider.useCallback[addSessionNote]": (note)=>{
            setSession({
                "SOPProvider.useCallback[addSessionNote]": (prev)=>prev ? {
                        ...prev,
                        notes: [
                            ...prev.notes,
                            note
                        ]
                    } : null
            }["SOPProvider.useCallback[addSessionNote]"]);
        }
    }["SOPProvider.useCallback[addSessionNote]"], []);
    const addSessionNotes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SOPProvider.useCallback[addSessionNotes]": (notes)=>{
            if (notes.length === 0) return;
            setSession({
                "SOPProvider.useCallback[addSessionNotes]": (prev)=>prev ? {
                        ...prev,
                        notes: [
                            ...prev.notes,
                            ...notes
                        ]
                    } : null
            }["SOPProvider.useCallback[addSessionNotes]"]);
        }
    }["SOPProvider.useCallback[addSessionNotes]"], []);
    const updateSessionNote = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SOPProvider.useCallback[updateSessionNote]": (noteId, updates)=>{
            setSession({
                "SOPProvider.useCallback[updateSessionNote]": (prev)=>prev ? {
                        ...prev,
                        notes: prev.notes.map({
                            "SOPProvider.useCallback[updateSessionNote]": (n)=>n.id === noteId ? {
                                    ...n,
                                    ...updates
                                } : n
                        }["SOPProvider.useCallback[updateSessionNote]"])
                    } : null
            }["SOPProvider.useCallback[updateSessionNote]"]);
        }
    }["SOPProvider.useCallback[updateSessionNote]"], []);
    const deleteSessionNote = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SOPProvider.useCallback[deleteSessionNote]": (noteId)=>{
            setSession({
                "SOPProvider.useCallback[deleteSessionNote]": (prev)=>prev ? {
                        ...prev,
                        notes: prev.notes.filter({
                            "SOPProvider.useCallback[deleteSessionNote]": (n)=>n.id !== noteId
                        }["SOPProvider.useCallback[deleteSessionNote]"])
                    } : null
            }["SOPProvider.useCallback[deleteSessionNote]"]);
        }
    }["SOPProvider.useCallback[deleteSessionNote]"], []);
    // -------------------------------------------------------------------------
    // Session Message Operations
    // -------------------------------------------------------------------------
    const addSessionMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SOPProvider.useCallback[addSessionMessage]": (message)=>{
            setSession({
                "SOPProvider.useCallback[addSessionMessage]": (prev)=>prev ? {
                        ...prev,
                        messages: [
                            ...prev.messages,
                            message
                        ],
                        questionsAsked: message.role === "ai" ? prev.questionsAsked + 1 : prev.questionsAsked
                    } : null
            }["SOPProvider.useCallback[addSessionMessage]"]);
        }
    }["SOPProvider.useCallback[addSessionMessage]"], []);
    // -------------------------------------------------------------------------
    // Phase Management
    // -------------------------------------------------------------------------
    const setSessionPhase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SOPProvider.useCallback[setSessionPhase]": (phase, progress)=>{
            setSession({
                "SOPProvider.useCallback[setSessionPhase]": (prev)=>prev ? {
                        ...prev,
                        phase,
                        phaseProgress: progress !== undefined ? progress : prev.phaseProgress
                    } : null
            }["SOPProvider.useCallback[setSessionPhase]"]);
        }
    }["SOPProvider.useCallback[setSessionPhase]"], []);
    const advancePhase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SOPProvider.useCallback[advancePhase]": ()=>{
            setSession({
                "SOPProvider.useCallback[advancePhase]": (prev)=>{
                    if (!prev) return null;
                    const nextPhase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNextPhase"])(prev.phase);
                    return {
                        ...prev,
                        phase: nextPhase,
                        phaseProgress: 0
                    };
                }
            }["SOPProvider.useCallback[advancePhase]"]);
        }
    }["SOPProvider.useCallback[advancePhase]"], []);
    // -------------------------------------------------------------------------
    // Session Finalization
    // -------------------------------------------------------------------------
    const finalizeSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SOPProvider.useCallback[finalizeSession]": (title, department)=>{
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
        }
    }["SOPProvider.useCallback[finalizeSession]"], [
        session,
        addSOP
    ]);
    // -------------------------------------------------------------------------
    // Utility Functions
    // -------------------------------------------------------------------------
    const getSessionNotesByCategory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SOPProvider.useCallback[getSessionNotesByCategory]": ()=>{
            if (!session) return {};
            return session.notes.reduce({
                "SOPProvider.useCallback[getSessionNotesByCategory]": (acc, note)=>{
                    if (!acc[note.category]) {
                        acc[note.category] = [];
                    }
                    acc[note.category].push(note);
                    return acc;
                }
            }["SOPProvider.useCallback[getSessionNotesByCategory]"], {});
        }
    }["SOPProvider.useCallback[getSessionNotesByCategory]"], [
        session
    ]);
    const getSessionProgress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SOPProvider.useCallback[getSessionProgress]": ()=>{
            if (!session) return 0;
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateOverallProgress"])(session.phase, session.phaseProgress);
        }
    }["SOPProvider.useCallback[getSessionProgress]"], [
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SOPContext.Provider, {
        value: contextValue,
        children: children
    }, void 0, false, {
        fileName: "[project]/lib/sop-context.tsx",
        lineNumber: 460,
        columnNumber: 5
    }, this);
}
_s(SOPProvider, "BGJd01VV1a6biKazwAraOM4nQ2Y=");
_c = SOPProvider;
function useSOPContext() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(SOPContext);
    if (!context) {
        throw new Error("useSOPContext must be used within a SOPProvider");
    }
    return context;
}
_s1(useSOPContext, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "SOPProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
"[project]/node_modules/@vercel/analytics/dist/next/index.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Analytics",
    ()=>Analytics2
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
// src/nextjs/index.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
// src/nextjs/utils.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
"use client";
;
;
// package.json
var name = "@vercel/analytics";
var version = "1.3.1";
// src/queue.ts
var initQueue = ()=>{
    if (window.va) return;
    window.va = function a(...params) {
        (window.vaq = window.vaq || []).push(params);
    };
};
// src/utils.ts
function isBrowser() {
    return typeof window !== "undefined";
}
function detectEnvironment() {
    try {
        const env = ("TURBOPACK compile-time value", "development");
        if ("TURBOPACK compile-time truthy", 1) {
            return "development";
        }
    } catch (e) {}
    return "production";
}
function setMode(mode = "auto") {
    if (mode === "auto") {
        window.vam = detectEnvironment();
        return;
    }
    window.vam = mode;
}
function getMode() {
    const mode = isBrowser() ? window.vam : detectEnvironment();
    return mode || "production";
}
function isDevelopment() {
    return getMode() === "development";
}
function computeRoute(pathname, pathParams) {
    if (!pathname || !pathParams) {
        return pathname;
    }
    let result = pathname;
    try {
        const entries = Object.entries(pathParams);
        for (const [key, value] of entries){
            if (!Array.isArray(value)) {
                const matcher = turnValueToRegExp(value);
                if (matcher.test(result)) {
                    result = result.replace(matcher, `/[${key}]`);
                }
            }
        }
        for (const [key, value] of entries){
            if (Array.isArray(value)) {
                const matcher = turnValueToRegExp(value.join("/"));
                if (matcher.test(result)) {
                    result = result.replace(matcher, `/[...${key}]`);
                }
            }
        }
        return result;
    } catch (e) {
        return pathname;
    }
}
function turnValueToRegExp(value) {
    return new RegExp(`/${escapeRegExp(value)}(?=[/?#]|$)`);
}
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
// src/generic.ts
var DEV_SCRIPT_URL = "https://va.vercel-scripts.com/v1/script.debug.js";
var PROD_SCRIPT_URL = "/_vercel/insights/script.js";
function inject(props = {
    debug: true
}) {
    var _a;
    if (!isBrowser()) return;
    setMode(props.mode);
    initQueue();
    if (props.beforeSend) {
        (_a = window.va) == null ? void 0 : _a.call(window, "beforeSend", props.beforeSend);
    }
    const src = props.scriptSrc || (isDevelopment() ? DEV_SCRIPT_URL : PROD_SCRIPT_URL);
    if (document.head.querySelector(`script[src*="${src}"]`)) return;
    const script = document.createElement("script");
    script.src = src;
    script.defer = true;
    script.dataset.sdkn = name + (props.framework ? `/${props.framework}` : "");
    script.dataset.sdkv = version;
    if (props.disableAutoTrack) {
        script.dataset.disableAutoTrack = "1";
    }
    if (props.endpoint) {
        script.dataset.endpoint = props.endpoint;
    }
    if (props.dsn) {
        script.dataset.dsn = props.dsn;
    }
    script.onerror = ()=>{
        const errorMessage = isDevelopment() ? "Please check if any ad blockers are enabled and try again." : "Be sure to enable Web Analytics for your project and deploy again. See https://vercel.com/docs/analytics/quickstart for more information.";
        console.log(`[Vercel Web Analytics] Failed to load script from ${src}. ${errorMessage}`);
    };
    if (isDevelopment() && props.debug === false) {
        script.dataset.debug = "false";
    }
    document.head.appendChild(script);
}
function pageview({ route, path }) {
    var _a;
    (_a = window.va) == null ? void 0 : _a.call(window, "pageview", {
        route,
        path
    });
}
// src/react.tsx
function Analytics(props) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Analytics.useEffect": ()=>{
            inject({
                framework: props.framework || "react",
                ...props.route !== void 0 && {
                    disableAutoTrack: true
                },
                ...props
            });
        }
    }["Analytics.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Analytics.useEffect": ()=>{
            if (props.route && props.path) {
                pageview({
                    route: props.route,
                    path: props.path
                });
            }
        }
    }["Analytics.useEffect"], [
        props.route,
        props.path
    ]);
    return null;
}
;
var useRoute = ()=>{
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const path = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const finalParams = {
        ...Object.fromEntries(searchParams.entries()),
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- can be empty in pages router
        ...params || {}
    };
    return {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- can be empty in pages router
        route: params ? computeRoute(path, finalParams) : null,
        path
    };
};
// src/nextjs/index.tsx
function AnalyticsComponent(props) {
    const { route, path } = useRoute();
    return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(Analytics, {
        path,
        route,
        ...props,
        framework: "next"
    });
}
function Analytics2(props) {
    return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: null
    }, /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(AnalyticsComponent, {
        ...props
    }));
}
;
 //# sourceMappingURL=index.mjs.map
}),
"[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
]);

//# sourceMappingURL=_d90abae3._.js.map