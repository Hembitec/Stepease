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
            {
                category: "METADATA",
                label: "Metadata",
                content: "Departments involved: Engineering, People Operations, IT",
                color: "bg-slate-100 text-slate-700",
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
            {
                category: "MATERIALS_RESOURCES",
                label: "Resources",
                content: "Systems required: laptop image, email, Slack, GitHub, HRIS checklist",
                color: "bg-cyan-100 text-cyan-700",
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
            {
                category: "DEFINITIONS_REFERENCES",
                label: "Definitions",
                content: "Assigned buddy = designated engineer who owns Week 1 technical ramp",
                color: "bg-indigo-100 text-indigo-700",
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
            {
                category: "QUALITY_SUCCESS",
                label: "Quality",
                content: "Success metric: first pull request merged within 7 days of start date",
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
                    "Excellent. I've captured ownership, tooling, quality checks, and fallback paths. Let's review the notes once before I generate the SOP.",
            },
        ],
        notes: [
            {
                category: "METADATA",
                label: "Metadata",
                content: "Review cadence: update this SOP quarterly or after onboarding process changes",
                color: "bg-slate-100 text-slate-700",
            },
        ],
    },
]

// ---------------------------------------------------------------------------
// Generated SOP Preview — Final result shown after phases complete
// ---------------------------------------------------------------------------

export const GENERATED_SOP_PREVIEW = `# Engineering Employee Onboarding Process
**Document ID:** SOP-ENG-001
**Version:** 1.0
**Effective Date:** May 13, 2026
**Document Owner:** Engineering Operations

## 1. Purpose
Standardize how new engineers are onboarded so access, orientation, and technical ramp-up happen on time and in the same order for every hire.

## 2. Scope
Applies to HR coordinators, engineering managers, onboarding buddies, and IT support for all new engineering hires.

## 3. Roles & Responsibilities
| Role | Responsibility |
|------|---------------|
| HR Coordinator | Welcome session, benefits enrollment, IT ticket |
| Engineering Manager | Buddy assignment, milestone oversight |
| Assigned Buddy | Codebase walkthrough, dev environment setup |
| IT Support | Laptop image, account provisioning, loaner fallback |

## 4. Procedure
### Pre-start: 3 days before Day 1
1. HR submits the provisioning ticket with start date, manager, and team.
2. Engineering manager assigns an onboarding buddy and confirms Week 1 availability.
3. IT images the laptop and prepares email, Slack, GitHub, and HRIS access.

### Day 1
- [ ] Deliver the laptop and verify account sign-in.
- [ ] Run the HR welcome session and benefits overview.
- [ ] Introduce the hire to the team and share the first-week checklist.

### Week 1
1. Buddy walks through the codebase, local setup, and pull request process.
2. New hire completes the development environment checklist.
3. Manager reviews the first PR milestone before the end of the week.

## 5. Quality Checks
- [ ] All access requests completed before start date
- [ ] First PR opened within 7 days
- [ ] 30-day onboarding survey collected

## 6. Troubleshooting
| Issue | Possible Cause | Resolution |
|------|---------------|------------|
| Laptop not ready | Imaging delay | Issue a loaner machine from the IT pool |
| Buddy unavailable | PTO or scheduling conflict | Engineering manager steps in as backup |
| Missing GitHub access | Provisioning ticket incomplete | IT verifies group membership and re-runs access sync |

## 7. Revision History
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | May 13, 2026 | Stepease AI | Initial draft generated from structured interview |`
