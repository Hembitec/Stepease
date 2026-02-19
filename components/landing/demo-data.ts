// =============================================================================
// Demo Showcase - Script Data
// Pre-scripted conversation for the "Employee Onboarding" demo
// =============================================================================

export interface DemoMessage {
    role: "ai" | "user"
    content: string
}

export interface DemoNote {
    category: string
    label: string
    content: string
    color: string
}

export interface DemoPhase {
    id: string
    name: string
    progress: number
    messages: DemoMessage[]
    notes: DemoNote[]
}

// ---------------------------------------------------------------------------
// Demo Phases — Each phase has a short exchange + extracted notes
// ---------------------------------------------------------------------------

export const DEMO_PHASES: DemoPhase[] = [
    {
        id: "foundation",
        name: "Foundation",
        progress: 15,
        messages: [
            {
                role: "ai",
                content:
                    "Hello! I'm here to help you create a professional SOP. What process would you like to document today?",
            },
            {
                role: "user",
                content:
                    "I need to document our employee onboarding process for new hires in our engineering team.",
            },
            {
                role: "ai",
                content:
                    "Great choice! Employee onboarding is critical for retention. Who is the primary audience for this SOP — HR, hiring managers, or the new hires themselves?",
            },
            {
                role: "user",
                content:
                    "It's mainly for HR coordinators and engineering team leads who run the onboarding.",
            },
        ],
        notes: [
            {
                category: "HEADER_INFO",
                label: "Header Info",
                content: "SOP: Engineering Employee Onboarding Process",
                color: "bg-blue-100 text-blue-700",
            },
            {
                category: "PURPOSE_SCOPE",
                label: "Purpose & Scope",
                content: "Audience: HR coordinators and engineering team leads",
                color: "bg-purple-100 text-purple-700",
            },
        ],
    },
    {
        id: "process",
        name: "Process Discovery",
        progress: 45,
        messages: [
            {
                role: "ai",
                content:
                    "Let's map the process. Walk me through what happens from Day 1 when a new engineer starts. What's the very first step?",
            },
            {
                role: "user",
                content:
                    "First, IT provisions their laptop and accounts. Then HR does a welcome session covering benefits, policies, and team introductions.",
            },
            {
                role: "ai",
                content:
                    "I'm capturing this as a multi-step flow. After the IT setup and HR welcome, what happens next for the engineering-specific onboarding?",
            },
            {
                role: "user",
                content:
                    "Their assigned buddy gives them a codebase walkthrough, sets up their dev environment, and they do their first PR review within the first week.",
            },
        ],
        notes: [
            {
                category: "PROCEDURE_STEPS",
                label: "Procedure",
                content: "Step 1: IT provisions laptop, email, Slack, GitHub access",
                color: "bg-orange-100 text-orange-700",
            },
            {
                category: "PROCEDURE_STEPS",
                label: "Procedure",
                content: "Step 2: HR welcome — benefits, policies, team intro",
                color: "bg-orange-100 text-orange-700",
            },
            {
                category: "PROCEDURE_STEPS",
                label: "Procedure",
                content: "Step 3: Buddy system — codebase walkthrough, dev env setup",
                color: "bg-orange-100 text-orange-700",
            },
            {
                category: "DECISION_POINTS",
                label: "Decision Point",
                content: "First PR review within Week 1 as milestone check",
                color: "bg-amber-100 text-amber-700",
            },
        ],
    },
    {
        id: "accountability",
        name: "Accountability",
        progress: 65,
        messages: [
            {
                role: "ai",
                content:
                    "Who's responsible for each step? For example, who assigns the buddy and ensures IT provisions are done on time?",
            },
            {
                role: "user",
                content:
                    "The engineering manager assigns the buddy. IT gets a ticket from HR 3 days before start date. HR owns the welcome session.",
            },
        ],
        notes: [
            {
                category: "ROLES_RESPONSIBILITIES",
                label: "Roles",
                content: "Engineering Manager → assigns buddy, oversees technical onboarding",
                color: "bg-green-100 text-green-700",
            },
            {
                category: "ROLES_RESPONSIBILITIES",
                label: "Roles",
                content: "HR Coordinator → welcome session, benefits enrollment, IT ticket",
                color: "bg-green-100 text-green-700",
            },
        ],
    },
    {
        id: "quality",
        name: "Risk & Quality",
        progress: 85,
        messages: [
            {
                role: "ai",
                content:
                    "What could go wrong? For example, what happens if the laptop isn't ready on Day 1, or the buddy is unavailable?",
            },
            {
                role: "user",
                content:
                    "If the laptop isn't ready, we have loaner machines. If the buddy is out, the manager steps in. We also do a 30-day check-in survey.",
            },
        ],
        notes: [
            {
                category: "TROUBLESHOOTING",
                label: "Troubleshooting",
                content: "Laptop not ready → use loaner machine from IT pool",
                color: "bg-red-100 text-red-700",
            },
            {
                category: "QUALITY_SUCCESS",
                label: "Quality",
                content: "30-day check-in survey to measure onboarding effectiveness",
                color: "bg-teal-100 text-teal-700",
            },
        ],
    },
    {
        id: "finalization",
        name: "Finalization",
        progress: 100,
        messages: [
            {
                role: "ai",
                content:
                    "Excellent! I've captured 12 structured notes across all categories. Your SOP covers the full onboarding lifecycle. Ready to generate your document!",
            },
        ],
        notes: [],
    },
]

// ---------------------------------------------------------------------------
// Generated SOP Preview — Final result shown after phases complete
// ---------------------------------------------------------------------------

export const GENERATED_SOP_PREVIEW = `# Engineering Employee Onboarding Process

## 1. Purpose & Scope
This SOP defines the standard onboarding process for new engineering team members, ensuring a consistent and welcoming experience from Day 1 through the first 30 days.

## 2. Roles & Responsibilities
| Role | Responsibility |
|------|---------------|
| HR Coordinator | Welcome session, benefits, IT ticket |
| Engineering Manager | Buddy assignment, technical oversight |
| Assigned Buddy | Codebase walkthrough, dev environment |

## 3. Procedure
### Pre-Start (3 days before)
- [ ] HR submits IT provisioning ticket
- [ ] Engineering Manager assigns onboarding buddy
- [ ] HR prepares welcome packet

### Day 1
- [ ] IT delivers laptop with all accounts configured
- [ ] HR conducts welcome session (benefits, policies)
- [ ] Team introductions and workspace tour

### Week 1
- [ ] Buddy conducts codebase walkthrough
- [ ] Dev environment setup and verification
- [ ] First PR review (milestone checkpoint)

## 4. Troubleshooting
- **Laptop not ready** → Use loaner from IT pool
- **Buddy unavailable** → Manager steps in as backup`
