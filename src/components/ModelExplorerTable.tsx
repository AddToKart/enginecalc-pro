import { memo } from 'react'
import type { Motorcycle } from '../types'

type RowProps = {
  motorcycle: Motorcycle
  selectedId: string
  estimatedHp: number
  onSelect: (motorcycle: Motorcycle) => void
}

const ModelRow = memo(function ModelRow({ motorcycle, selectedId, estimatedHp, onSelect }: RowProps) {
  return (
    <tr
      onClick={() => onSelect(motorcycle)}
      className={`cursor-pointer transition-all duration-200 hover:bg-white/5 ${
        selectedId === motorcycle.id ? 'bg-emerald-500/10 hover:bg-emerald-500/20' : ''
      }`}
    >
      <td className="px-6 py-4 font-bold text-white">{motorcycle.brand}</td>
      <td className={`px-6 py-4 font-medium transition-colors ${selectedId === motorcycle.id ? 'text-emerald-400' : 'text-slate-300'}`}>{motorcycle.model}</td>
      <td className="px-6 py-4 text-slate-400">{motorcycle.class}</td>
      <td className="px-6 py-4 font-mono text-slate-300">{motorcycle.cc}</td>
      <td className="px-6 py-4 text-slate-400">{motorcycle.cooling}</td>
      <td className="px-6 py-4 font-mono text-emerald-300">{estimatedHp}</td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
            motorcycle.status === 'Current'
              ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
              : 'border-amber-500/20 bg-amber-500/10 text-amber-400'
          }`}
        >
          {motorcycle.status}
        </span>
      </td>
    </tr>
  )
})

type Props = {
  models: Motorcycle[]
  selectedId: string
  estimatedHpById: Record<string, number>
  onSelect: (motorcycle: Motorcycle) => void
}

export default function ModelExplorerTable({ models, selectedId, estimatedHpById, onSelect }: Props) {
  return (
    <section className="glass-panel rounded-2xl p-6">
      <div className="mb-6 flex items-center justify-between">
         <h2 className="text-lg font-bold text-slate-100">Model Explorer</h2>
         <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Interactive Data Table</span>
      </div>
      <div className="overflow-x-auto rounded-xl border border-white/5 bg-slate-900/40 backdrop-blur-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-900/80 text-xs font-bold uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-6 py-4 text-left">Brand</th>
              <th className="px-6 py-4 text-left">Model</th>
              <th className="px-6 py-4 text-left">Class</th>
              <th className="px-6 py-4 text-left">CC</th>
              <th className="px-6 py-4 text-left">Cooling</th>
              <th className="px-6 py-4 text-left">Est. HP</th>
              <th className="px-6 py-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {models.map((motorcycle) => (
              <ModelRow
                key={motorcycle.id}
                motorcycle={motorcycle}
                selectedId={selectedId}
                estimatedHp={estimatedHpById[motorcycle.id] ?? 0}
                onSelect={onSelect}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}