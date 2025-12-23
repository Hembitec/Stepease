// Mock data for the SOP Builder MVP
import type { SOP, Note, ChatMessage } from "./types"

export const mockSOPs: SOP[] = [
  {
    id: "sop-001",
    title: "Invoice Approval Procedure v2.0",
    department: "Finance",
    status: "complete",
    createdAt: "2025-12-18T10:00:00Z",
    updatedAt: "2025-12-20T08:30:00Z",
    content: `# Invoice Approval Procedure v2.0

**Document ID:** SOP-FIN-001
**Version:** 2.0
**Effective Date:** December 20, 2025
**Department:** Finance - Accounts Payable
**Author:** John Doe
**Approved By:** Jane Smith

---

## 1. PURPOSE

This SOP establishes standardized procedures for invoice approval to ensure financial controls and minimize payment errors.

## 2. SCOPE

**Applies To:** Accounts Payable team and all department managers responsible for approvals

**Exclusions:** Emergency payments, petty cash

## 3. ROLES AND RESPONSIBILITIES

### 3.1 Accounts Payable Clerk
- Receives and logs invoices
- Verifies invoice details
- Routes for approval

### 3.2 Department Manager
- Reviews and approves invoices within authority level
- Escalates invoices over threshold

### 3.3 Finance Director
- Final approval for invoices over $10,000
- Reviews monthly payment reports

## 4. PROCEDURE STEPS

### Step 1: Receive Invoice
- **Responsible:** Accounts Payable Clerk
- **Action:** Open email and download invoice attachment
- **Timeline:** Within 4 business hours of receipt

### Step 2: Verify Invoice Details
- **Responsible:** Accounts Payable Clerk
- **Action:** Check vendor info, amounts, PO matching
- **Quality Check:** All fields complete, no discrepancies

### Step 3: Route for Approval
- **Responsible:** Accounts Payable Clerk
- **Action:** Send to appropriate manager based on amount
- **Timeline:** Same business day

### Step 4: Manager Review
- **Responsible:** Department Manager
- **Action:** Review invoice against budget and PO
- **Timeline:** Within 24 hours

### Step 5: Process Payment
- **Responsible:** Accounts Payable Clerk
- **Action:** Schedule payment per vendor terms
- **Quality Check:** Verify approval received before processing

## 5. QUALITY METRICS

- Invoice processing time: < 3 business days
- Approval turnaround: < 24 hours
- Error rate: < 1%

## 6. TROUBLESHOOTING

| Issue | Solution |
|-------|----------|
| Missing PO | Contact requisitioner for PO number |
| Amount mismatch | Verify with vendor, request correction |
| Manager unavailable | Escalate to backup approver |
`,
    notes: [
      {
        id: "note-001",
        category: "HEADER_INFO",
        priority: "high",
        timestamp: "Message 2",
        source: "User Response",
        content:
          "User confirmed the document title should be 'Invoice Approval Procedure v2.0' for the finance department.",
        relatedTo: "Document Header Section",
        action: "Set title and version in header",
      },
      {
        id: "note-002",
        category: "PURPOSE_SCOPE",
        priority: "high",
        timestamp: "Message 4",
        source: "User Response",
        content:
          "Purpose is to standardize invoice processing and reduce payment errors. Applies to AP team and all managers.",
        relatedTo: "Purpose and Scope sections",
        action: "Define purpose statement and scope boundaries",
      },
      {
        id: "note-003",
        category: "ROLES_RESPONSIBILITIES",
        priority: "high",
        timestamp: "Message 6",
        source: "User Response",
        content:
          "Three key roles: AP Clerk (receives/logs), Manager (approves), Finance Director (final approval over $10k).",
        relatedTo: "Roles section",
        action: "Create role definitions with responsibilities",
      },
      {
        id: "note-004",
        category: "PROCEDURE_STEPS",
        priority: "high",
        timestamp: "Message 8",
        source: "User Response",
        content:
          "Step 3 requires accounts manager approval before proceeding. Must happen within 24 hours. Manager receives email notification.",
        relatedTo: "Step 3 - Approval Process",
        action: "Add approval step with 24hr SLA, email trigger",
      },
      {
        id: "note-005",
        category: "QUALITY_SUCCESS",
        priority: "medium",
        timestamp: "Message 12",
        source: "AI Suggestion",
        content:
          "Recommended quality metrics: processing time < 3 days, approval turnaround < 24 hours, error rate < 1%.",
        relatedTo: "Quality Metrics section",
        action: "Add measurable success criteria",
      },
    ],
    chatHistory: [
      {
        id: "msg-001",
        role: "ai",
        content:
          "Hello! I'm here to help you create a professional SOP. Let's start with the basics. What process or procedure would you like to document?",
        timestamp: "2025-12-18T10:00:00Z",
      },
      {
        id: "msg-002",
        role: "user",
        content: "I need to create an invoice approval SOP for our finance department.",
        timestamp: "2025-12-18T10:01:00Z",
      },
      {
        id: "msg-003",
        role: "ai",
        content:
          "Great! An invoice approval SOP is essential for financial controls. What should be the official title and version for this document?",
        timestamp: "2025-12-18T10:01:30Z",
      },
      {
        id: "msg-004",
        role: "user",
        content: "Let's call it 'Invoice Approval Procedure v2.0'",
        timestamp: "2025-12-18T10:02:00Z",
      },
    ],
  },
  {
    id: "sop-002",
    title: "Employee Onboarding Process",
    department: "HR",
    status: "draft",
    createdAt: "2025-12-19T14:00:00Z",
    updatedAt: "2025-12-19T16:45:00Z",
    content: "# Employee Onboarding Process\n\n*Draft in progress...*",
    notes: [
      {
        id: "note-006",
        category: "HEADER_INFO",
        priority: "high",
        timestamp: "Message 1",
        source: "User Response",
        content: "New employee onboarding SOP for HR department.",
        relatedTo: "Document Header",
        action: "Set document title",
      },
    ],
    chatHistory: [
      {
        id: "msg-005",
        role: "ai",
        content: "Hello! Let's create your onboarding SOP. What's the main goal of this process?",
        timestamp: "2025-12-19T14:00:00Z",
      },
      {
        id: "msg-006",
        role: "user",
        content: "We need to standardize how we onboard new employees in the first week.",
        timestamp: "2025-12-19T14:01:00Z",
      },
    ],
  },
  {
    id: "sop-003",
    title: "IT Asset Management",
    department: "IT",
    status: "complete",
    createdAt: "2025-12-15T09:00:00Z",
    updatedAt: "2025-12-17T11:20:00Z",
    content: "# IT Asset Management\n\n## Purpose\nManage IT assets throughout their lifecycle...",
    notes: [],
    chatHistory: [],
  },
]

export const categoryColors: Record<string, { bg: string; text: string; label: string }> = {
  HEADER_INFO: { bg: "bg-blue-100", text: "text-blue-700", label: "Header Info" },
  PURPOSE_SCOPE: { bg: "bg-purple-100", text: "text-purple-700", label: "Purpose & Scope" },
  ROLES_RESPONSIBILITIES: { bg: "bg-green-100", text: "text-green-700", label: "Roles" },
  PROCEDURE_STEPS: { bg: "bg-orange-100", text: "text-orange-700", label: "Procedure" },
  DECISION_POINTS: { bg: "bg-amber-100", text: "text-amber-700", label: "Decision Points" },
  QUALITY_SUCCESS: { bg: "bg-teal-100", text: "text-teal-700", label: "Quality" },
  TROUBLESHOOTING: { bg: "bg-red-100", text: "text-red-700", label: "Troubleshooting" },
  DEFINITIONS_REFERENCES: { bg: "bg-indigo-100", text: "text-indigo-700", label: "Definitions" },
  MATERIALS_RESOURCES: { bg: "bg-cyan-100", text: "text-cyan-700", label: "Materials" },
  VISUAL_AIDS: { bg: "bg-pink-100", text: "text-pink-700", label: "Visual Aids" },
  GAPS_IMPROVEMENTS: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Gaps" },
  METADATA: { bg: "bg-slate-100", text: "text-slate-700", label: "Metadata" },
  OTHER: { bg: "bg-gray-100", text: "text-gray-700", label: "Other" },
}

export const priorityColors: Record<string, string> = {
  high: "text-red-500",
  medium: "text-amber-500",
  low: "text-green-500",
}

export const priorityIcons: Record<string, string> = {
  high: "!!",
  medium: "!",
  low: "·",
}
