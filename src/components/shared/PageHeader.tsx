interface PageHeaderProps {
  title: string
  subtitle: string
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 p-6 mb-2">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
      <div className="relative">
        <h2 className="text-2xl font-extrabold text-white tracking-tight">{title}</h2>
        <p className="text-sm text-slate-300 mt-1">{subtitle}</p>
      </div>
    </div>
  )
}
