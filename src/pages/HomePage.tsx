import { Link } from 'react-router-dom'
import { Calendar, BarChart3, RotateCcw, FlaskConical, Globe } from 'lucide-react'

const workflows = [
  {
    to: '/monthly',
    icon: Calendar,
    title: 'Monthly GEO Cycle',
    description: 'Run a full monthly diagnostic: signal analysis, artifact generation, deployment plan, and sprint actions.',
    inputs: 'Client GEO Snapshot + Monthly Change Log',
  },
  {
    to: '/quarterly',
    icon: BarChart3,
    title: 'Quarterly Authority Review',
    description: 'Deep authority analysis with citation opportunities, entity mapping, and content expansion planning.',
    inputs: 'Client GEO Snapshot + Authority Snapshot',
  },
  {
    to: '/annual',
    icon: RotateCcw,
    title: 'Annual GEO Reset',
    description: 'Full category precision review, entity definition, positioning improvements, and knowledge graph mapping.',
    inputs: 'Client GEO Snapshot + Website Excerpts',
  },
  {
    to: '/generate-tests',
    icon: FlaskConical,
    title: 'Generate AI Tests',
    description: 'Produce test prompts to check visibility on ChatGPT, Claude, and Gemini.',
    inputs: 'Client GEO Snapshot',
  },
  {
    to: '/website-extract',
    icon: Globe,
    title: 'Website Extract',
    description: 'Analyze pasted website content to extract categories, audience, differentiators, and missing trust signals.',
    inputs: 'Pasted website content',
  },
]

export function HomePage() {
  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-text">GEO Runner</h2>
        <p className="text-text-muted mt-2">
          Systematically improve your clients' visibility and recommendation probability
          on AI platforms: ChatGPT, Claude, and Gemini.
        </p>
        <div className="flex justify-center gap-6 mt-4">
          <div className="text-center">
            <div className="text-sm font-medium text-chatgpt">ChatGPT</div>
            <div className="text-xs text-text-muted">Comparisons, Authority</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-gemini">Gemini</div>
            <div className="text-xs text-text-muted">GBP, Schema, Reviews</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-claude">Claude</div>
            <div className="text-xs text-text-muted">Entity Clarity, Credibility</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workflows.map((w) => (
          <Link
            key={w.to}
            to={w.to}
            className="block p-5 rounded-xl border border-border bg-surface hover:border-primary/30 hover:shadow-sm transition-all"
          >
            <w.icon size={24} className="text-primary mb-3" />
            <h3 className="font-semibold text-sm text-text">{w.title}</h3>
            <p className="text-xs text-text-muted mt-1">{w.description}</p>
            <p className="text-xs text-primary mt-3 font-medium">Inputs: {w.inputs}</p>
          </Link>
        ))}
      </div>

      <div className="bg-surface border border-border rounded-lg p-4 text-center">
        <p className="text-xs text-text-muted">
          This tool is stateless. No client data is stored. Paste your Client GEO Snapshot each run
          and save results externally.
        </p>
      </div>
    </div>
  )
}
