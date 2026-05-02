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
    title: "Just Talk, We'll Write",
    description:
      "Describe your process like you'd explain it to a colleague. AI captures every detail so you never miss a critical step.",
  },
  {
    icon: Upload,
    title: "Fix Outdated Docs Fast",
    description:
      "Drop your old SOPs and get actionable fixes in minutes so outdated documentation becomes your best one.",
  },
  {
    icon: Download,
    title: "Universal Export",
    description: "One click to PDF, Word, or Markdown. Easily paste into Notion, Confluence, or SharePoint.",
  },
  {
    icon: FileText,
    title: "Activity & Version Control",
    description: "Every action is logged. Revise an approved SOP, provide a reason, and auto-generate linked versions seamlessly.",
  },
  {
    icon: GitBranch,
    title: "Chat-Based Revisions",
    description: "Don't rewrite documents manually. Reopen an approved SOP, tell the AI what changed, and let it update the exact steps for you.",
  },
  {
    icon: Shield,
    title: "Public Viewing & Sharing",
    description: "Generate secure, read-only links to share your final procedures with team members instantly.",
  },
]

export const steps = [
  {
    number: "01",
    title: "Context",
    subtitle: "Define your goal",
    description: "Tell the AI who the SOP is for and what it should achieve. Set the stage for success.",
    icon: MessageSquare,
  },
  {
    number: "02",
    title: "Interview",
    subtitle: "Answer smart questions",
    description: "The AI conducts a structured interview to extract every step, role, and troubleshooting tip.",
    icon: Bot,
  },
  {
    number: "03",
    title: "Review",
    subtitle: "Verify the logic",
    description: "See structured notes in real-time. The AI highlights gaps before writing a single word.",
    icon: Eye,
  },
  {
    number: "04",
    title: "Generate",
    subtitle: "Instant Documentation",
    description: "One click transforms your structured notes into a polished, professional PDF or Word doc.",
    icon: Sparkles,
  },
]

export const statsData = [
  { prefix: "<", value: 10, suffix: " min", label: "Average SOP creation", isTime: true },
  { prefix: "", value: 12, suffix: "+ hrs", label: "Saved per document", isTime: true },
  { prefix: "", value: 500, suffix: "+", label: "Teams trust us", isTime: false },
  { prefix: "", value: 50000, suffix: "+", label: "SOPs created", isTime: false },
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
