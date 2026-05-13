import {
  Bot,
  Upload,
  Download,
  FileText,
  GitBranch,
  Shield,
  MessageSquare,
  Eye,
  Sparkles,
  Building2,
  Users,
  Clock,
} from "lucide-react"

export const features = [
  {
    icon: Bot,
    title: "Capture the process in one conversation",
    description:
      "Describe the workflow once and Stepease turns it into structured steps, roles, and decision points without a blank page.",
  },
  {
    icon: Upload,
    title: "Turn stale SOPs into current ones fast",
    description:
      "Upload the docs your team already has and get clear gaps, outdated steps, and suggested fixes in minutes.",
  },
  {
    icon: Download,
    title: "Publish where your team already works",
    description: "Export to PDF, Word, or Markdown and move the final SOP into Notion, Confluence, or SharePoint without reformatting.",
  },
  {
    icon: FileText,
    title: "Keep every revision audit-ready",
    description: "Every update is logged with a reason, so approved SOPs stay traceable, reviewable, and easy to defend.",
  },
  {
    icon: GitBranch,
    title: "Update approved SOPs without rewriting",
    description: "Tell Stepease what changed and it rewrites the exact sections that need edits instead of making you start over.",
  },
  {
    icon: Shield,
    title: "Share the final version with confidence",
    description: "Send secure, read-only SOP links to teammates so everyone follows the same source of truth.",
  },
]

export const steps = [
  {
    number: "01",
    title: "Set the scope",
    subtitle: "Start with context",
    description: "Tell Stepease what process you are documenting, who runs it, and where the procedure applies before the interview begins.",
    detail: "Templates, audience, department, and compliance context shape the interview from the first prompt.",
    icon: MessageSquare,
  },
  {
    number: "02",
    title: "Run the interview",
    subtitle: "Answer one question at a time",
    description: "The AI asks focused follow-ups so it can capture steps, ownership, decision points, tools, and failure paths without guessing.",
    detail: "Every answer is turned into structured notes while the conversation is still happening.",
    icon: Bot,
  },
  {
    number: "03",
    title: "Review the notes",
    subtitle: "Verify coverage before writing",
    description: "Open the grouped note review to inspect what was captured, see which SOP sections are covered, and catch missing details before generation.",
    detail: "Notes are grouped by SOP section so the logic can be checked before a draft is created.",
    icon: Eye,
  },
  {
    number: "04",
    title: "Generate and publish",
    subtitle: "Move from draft to final SOP",
    description: "Generate the first draft, review it in preview mode, then export, share, or revise the SOP without starting over.",
    detail: "Preview, markdown, export, share links, and version history stay connected to the same document.",
    icon: Sparkles,
  },
]

export const testimonials = [
  {
    quote:
      "We were spending weeks on SOPs that now take under an hour. The AI asks better questions than our consultants did.",
    author: "Sarah Chen",
    role: "VP of Operations",
    department: "Fintech",
    teamSize: "40-person team",
    location: "Austin",
    outcome: "Weeks → Under 1 hour",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=96&h=96&fit=crop&crop=face",
  },
  {
    quote: "Finally, onboarding docs people actually use. New hires get up to speed in days instead of weeks, and I stop getting the same Slack questions.",
    author: "Marcus Williams",
    role: "Quality Assurance Lead",
    department: "Healthcare",
    teamSize: "Clinical operations",
    location: "Chicago",
    outcome: "Days instead of weeks",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face",
  },
  {
    quote: "Standardizing our compliance procedures used to be a nightmare. Stepease helped us build a central source of truth that our entire team actually follows.",
    author: "Elena Rodriguez",
    role: "Compliance Director",
    department: "Financial services",
    teamSize: "Mid-size firm",
    location: "Miami",
    outcome: "100% policy adoption",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=96&h=96&fit=crop&crop=face",
  },
]

export const useCases = [
  {
    icon: Building2,
    title: "Operations Teams",
    description: "Standardize workflows across departments and locations.",
  },
  {
    icon: Shield,
    title: "Compliance & Quality",
    description: "Meet audit requirements with properly documented procedures.",
  },
  {
    icon: Users,
    title: "HR & Training",
    description: "Create onboarding materials that scale with your team.",
  },
  {
    icon: Clock,
    title: "IT & Security",
    description: "Document incident response and security protocols.",
  },
]

export const faqs = [
  {
    category: "Getting Started",
    q: "How long does it take to create an SOP?",
    a: "Most users complete their first SOP in under 10 minutes. The AI asks targeted questions about your process, extracts the key details, and formats everything into a professional document. No staring at blank pages.",
  },
  {
    category: "Getting Started",
    q: "Can I import my existing documents?",
    a: "Yes. Upload PDFs, Word docs, or plain text. The AI reviews what you have, identifies gaps or outdated steps, and suggests improvements. You keep what works, fix what doesn't.",
  },
  {
    category: "Features",
    q: "What export formats are available?",
    a: "PDF for sharing, Word (.docx) for editing, Markdown for technical teams, and HTML for web publishing. Copy and paste works great too if you use Confluence, Notion, or SharePoint.",
  },
  {
    category: "Features",
    q: "How does the revision workflow work?",
    a: "Once an SOP is approved, it is locked. Need changes? Reopen it, tell the AI what changed (new tool, new step, new person), and it updates the document. Every revision is tracked with a reason and timestamp.",
  },
  {
    category: "Security",
    q: "Is my data secure?",
    a: "All data is encrypted at rest and in transit. We use industry-standard security practices and your documents are private to your workspace. We do not train AI models on your content.",
  },
  {
    category: "Billing",
    q: "Can I change plans or cancel anytime?",
    a: "Yes. Upgrade, downgrade, or cancel whenever you need. If you downgrade, your existing SOPs remain accessible. We will never lock you out of your own work.",
  },
  {
    category: "Billing",
    q: "What happens when I hit my monthly limit?",
    a: "On the Free plan, you will need to wait until next month or upgrade. Paid plans give you a clear monthly allowance. We will warn you at 80% so there are no surprises.",
  },
]
