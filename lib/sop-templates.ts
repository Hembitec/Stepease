// =============================================================================
// SOP Templates — Industry-standard starter templates
// Each template pre-seeds the AI conversation with context so it asks
// smarter, more targeted follow-up questions.
// =============================================================================

export interface SOPTemplate {
    id: string
    title: string
    description: string
    industry: string
    icon: string // Lucide icon name
    color: string // Tailwind color class
    /** First user message sent automatically when the template is selected */
    starterPrompt: string
    /** Suggested title for the session */
    suggestedTitle: string
    /** Key sections the AI should focus on */
    focusAreas: string[]
}

export const SOP_TEMPLATES: SOPTemplate[] = [
    // ───────────────────────────────────────────────────────────────────────────
    // 1. Employee Onboarding
    // ───────────────────────────────────────────────────────────────────────────
    {
        id: "employee-onboarding",
        title: "Employee Onboarding",
        description:
            "New hire orientation, first-day checklist, IT setup, compliance training, and mentor assignment.",
        industry: "Human Resources",
        icon: "UserPlus",
        color: "bg-blue-50 text-blue-600",
        suggestedTitle: "Employee Onboarding Procedure",
        focusAreas: [
            "HEADER_INFO",
            "PURPOSE_SCOPE",
            "ROLES_RESPONSIBILITIES",
            "PROCEDURE_STEPS",
            "MATERIALS_RESOURCES",
            "QUALITY_SUCCESS",
        ],
        starterPrompt:
            `I need to create an SOP for onboarding new employees. It should cover:
- Pre-arrival preparation (IT access, workspace setup, welcome kit)
- Day-one orientation (introductions, company overview, safety briefing)
- First-week training schedule (role-specific training, compliance modules)
- Mentor/buddy assignment and check-in cadence
- 30/60/90 day milestone check-ins
- Paperwork and compliance requirements (tax forms, NDAs, policy acknowledgments)

The SOP should clearly define who is responsible for each step (HR, IT, hiring manager, buddy), include timelines, and specify success criteria for a fully onboarded employee.`,
    },

    // ───────────────────────────────────────────────────────────────────────────
    // 2. Incident Response (IT)
    // ───────────────────────────────────────────────────────────────────────────
    {
        id: "incident-response",
        title: "IT Incident Response",
        description:
            "Severity classification, escalation paths, containment, root cause analysis, and post-incident review.",
        industry: "Information Technology",
        icon: "ShieldAlert",
        color: "bg-red-50 text-red-600",
        suggestedTitle: "IT Incident Response Procedure",
        focusAreas: [
            "HEADER_INFO",
            "PURPOSE_SCOPE",
            "ROLES_RESPONSIBILITIES",
            "PROCEDURE_STEPS",
            "DECISION_POINTS",
            "TROUBLESHOOTING",
            "DEFINITIONS_REFERENCES",
        ],
        starterPrompt:
            `I need to create an SOP for IT incident response. It should cover:
- Incident detection and initial triage
- Severity classification (P1 Critical, P2 High, P3 Medium, P4 Low) with clear definitions
- Escalation matrix — who to contact at each severity level and response time SLAs
- Containment and mitigation steps
- Communication protocols (internal stakeholders, affected users, management)
- Root cause analysis (RCA) process using the 5-Whys or fishbone method
- Post-incident review meeting and documentation
- Lessons learned and preventive action tracking

It should reference ITIL best practices and clearly define roles for: first responder, incident commander, technical lead, and communications lead.`,
    },

    // ───────────────────────────────────────────────────────────────────────────
    // 3. Quality Inspection (Manufacturing)
    // ───────────────────────────────────────────────────────────────────────────
    {
        id: "quality-inspection",
        title: "Quality Inspection",
        description:
            "Incoming material checks, in-process inspection, final product audit, and non-conformance handling.",
        industry: "Manufacturing",
        icon: "ClipboardCheck",
        color: "bg-emerald-50 text-emerald-600",
        suggestedTitle: "Quality Inspection Procedure",
        focusAreas: [
            "HEADER_INFO",
            "PURPOSE_SCOPE",
            "PROCEDURE_STEPS",
            "QUALITY_SUCCESS",
            "MATERIALS_RESOURCES",
            "TROUBLESHOOTING",
            "DEFINITIONS_REFERENCES",
        ],
        starterPrompt:
            `I need to create an SOP for quality inspection in a manufacturing environment. It should cover:
- Incoming raw material inspection (sampling plan, acceptance criteria, AQL levels)
- In-process quality checks at critical control points
- Final product inspection and testing before shipment
- Measurement tools and calibration requirements
- Non-conformance reporting (NCR) and disposition process (rework, reject, concession)
- Record-keeping and traceability requirements
- Statistical process control (SPC) data collection

The SOP should align with ISO 9001:2015 requirements and clearly define acceptable quality limits, inspector qualifications, and escalation paths for out-of-spec results.`,
    },

    // ───────────────────────────────────────────────────────────────────────────
    // 4. Patient Intake (Healthcare)
    // ───────────────────────────────────────────────────────────────────────────
    {
        id: "patient-intake",
        title: "Patient Intake & Registration",
        description:
            "Patient identification, insurance verification, consent forms, medical history collection, and triage.",
        industry: "Healthcare",
        icon: "HeartPulse",
        color: "bg-pink-50 text-pink-600",
        suggestedTitle: "Patient Intake and Registration Procedure",
        focusAreas: [
            "HEADER_INFO",
            "PURPOSE_SCOPE",
            "ROLES_RESPONSIBILITIES",
            "PROCEDURE_STEPS",
            "DECISION_POINTS",
            "MATERIALS_RESOURCES",
            "QUALITY_SUCCESS",
            "DEFINITIONS_REFERENCES",
        ],
        starterPrompt:
            `I need to create an SOP for patient intake and registration at a healthcare facility. It should cover:
- Patient identification and verification (two-identifier protocol)
- Insurance verification and pre-authorization checks
- Consent forms and HIPAA acknowledgment collection
- Medical history and current medications documentation
- Allergy recording and flagging in the EHR system
- Initial triage and vital signs assessment
- Wait time communication and patient flow management
- Handling walk-ins vs. scheduled appointments
- Special considerations for minors, elderly, and non-English-speaking patients

The SOP must comply with HIPAA privacy regulations, Joint Commission standards, and CMS requirements. Clearly define roles for front desk staff, nursing staff, and registration coordinators.`,
    },

    // ───────────────────────────────────────────────────────────────────────────
    // 5. Change Management (IT / DevOps)
    // ───────────────────────────────────────────────────────────────────────────
    {
        id: "change-management",
        title: "Change Management",
        description:
            "Change request submission, risk assessment, approval workflow, implementation, and rollback planning.",
        industry: "IT / DevOps",
        icon: "GitBranch",
        color: "bg-violet-50 text-violet-600",
        suggestedTitle: "Change Management Procedure",
        focusAreas: [
            "HEADER_INFO",
            "PURPOSE_SCOPE",
            "ROLES_RESPONSIBILITIES",
            "PROCEDURE_STEPS",
            "DECISION_POINTS",
            "QUALITY_SUCCESS",
            "TROUBLESHOOTING",
        ],
        starterPrompt:
            `I need to create an SOP for IT change management. It should cover:
- Change request (CR) submission with required information fields
- Change categorization (Standard, Normal, Emergency)
- Risk assessment and impact analysis scoring
- Change Advisory Board (CAB) review and approval workflow
- Implementation planning with a maintenance window schedule
- Pre-implementation checklist and readiness verification
- Rollback plan and rollback criteria (when to trigger)
- Post-implementation verification and testing
- Change closure and documentation

The SOP should align with ITIL Change Management best practices. Define roles for: change requester, change manager, CAB members, implementation team, and change owner.`,
    },

    // ───────────────────────────────────────────────────────────────────────────
    // 6. Customer Complaint Handling
    // ───────────────────────────────────────────────────────────────────────────
    {
        id: "customer-complaint",
        title: "Customer Complaint Handling",
        description:
            "Complaint intake, classification, investigation, corrective actions, and customer follow-up.",
        industry: "Customer Service",
        icon: "MessageSquareWarning",
        color: "bg-amber-50 text-amber-600",
        suggestedTitle: "Customer Complaint Handling Procedure",
        focusAreas: [
            "HEADER_INFO",
            "PURPOSE_SCOPE",
            "ROLES_RESPONSIBILITIES",
            "PROCEDURE_STEPS",
            "DECISION_POINTS",
            "QUALITY_SUCCESS",
            "TROUBLESHOOTING",
        ],
        starterPrompt:
            `I need to create an SOP for handling customer complaints. It should cover:
- Complaint intake and logging (phone, email, in-person, social media channels)
- Complaint classification by severity and type (product, service, billing, safety)
- Acknowledgment timelines (e.g., respond within 24 hours)
- Investigation process and root cause determination
- Corrective and preventive action (CAPA) assignment
- Escalation criteria and escalation paths
- Customer communication templates and follow-up cadence
- Resolution approval authority by complaint severity level
- Complaint closure and customer satisfaction verification
- Trend analysis and monthly reporting

Define who is responsible at each step: frontline agent, team lead, quality manager, and department head.`,
    },

    // ───────────────────────────────────────────────────────────────────────────
    // 7. Data Backup & Recovery (IT)
    // ───────────────────────────────────────────────────────────────────────────
    {
        id: "data-backup",
        title: "Data Backup & Recovery",
        description:
            "Backup schedules, storage locations, retention policies, recovery testing, and disaster recovery.",
        industry: "Information Technology",
        icon: "DatabaseBackup",
        color: "bg-cyan-50 text-cyan-600",
        suggestedTitle: "Data Backup and Recovery Procedure",
        focusAreas: [
            "HEADER_INFO",
            "PURPOSE_SCOPE",
            "PROCEDURE_STEPS",
            "MATERIALS_RESOURCES",
            "QUALITY_SUCCESS",
            "TROUBLESHOOTING",
            "DEFINITIONS_REFERENCES",
        ],
        starterPrompt:
            `I need to create an SOP for data backup and recovery. It should cover:
- Backup types (full, incremental, differential) and when each is used
- Backup schedules and frequency for each system tier (Tier 1 critical, Tier 2 important, Tier 3 standard)
- Storage locations (on-premise, off-site, cloud) and the 3-2-1 backup rule
- Retention policies by data classification
- Backup verification and integrity checks
- Recovery Time Objective (RTO) and Recovery Point Objective (RPO) for each system tier
- Step-by-step recovery procedures for different failure scenarios
- Disaster recovery (DR) drills and testing schedule
- Failed backup alerting, monitoring, and troubleshooting
- Encryption and access control for backup media

Define roles for: system administrators, backup operators, security team, and DR coordinator.`,
    },

    // ───────────────────────────────────────────────────────────────────────────
    // 8. Safety & Emergency Evacuation
    // ───────────────────────────────────────────────────────────────────────────
    {
        id: "emergency-evacuation",
        title: "Emergency Evacuation",
        description:
            "Fire/earthquake response, evacuation routes, assembly points, headcount, and all-clear procedures.",
        industry: "Health & Safety",
        icon: "Siren",
        color: "bg-orange-50 text-orange-600",
        suggestedTitle: "Emergency Evacuation Procedure",
        focusAreas: [
            "HEADER_INFO",
            "PURPOSE_SCOPE",
            "ROLES_RESPONSIBILITIES",
            "PROCEDURE_STEPS",
            "DECISION_POINTS",
            "MATERIALS_RESOURCES",
            "VISUAL_AIDS",
        ],
        starterPrompt:
            `I need to create an SOP for emergency evacuation at our facility. It should cover:
- Types of emergencies triggering evacuation (fire, earthquake, chemical spill, active threat, severe weather)
- Alarm activation procedures and types of alarms
- Evacuation routes (primary and secondary) for each floor/area
- Assembly point locations and headcount procedures
- Floor warden and fire marshal roles and responsibilities
- Assistance for persons with disabilities or mobility limitations
- Visitors and contractor evacuation protocols
- Communication chain (internal alert, 911 call, management notification)
- Building sweep procedures before all-clear
- All-clear signals and re-entry authorization process
- Post-evacuation debrief and incident documentation
- Evacuation drill schedule (minimum quarterly) and performance metrics

Include references to OSHA requirements and local fire code regulations. The SOP should include a visual floor plan with marked exits and assembly points.`,
    },
]
