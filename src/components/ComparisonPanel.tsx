import { GitCompareArrows } from 'lucide-react'
import { Legend, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { Motorcycle } from '../types'

type RadarDataPoint = {
  metric: string
  A: number
  B: number
}

type Props = {
  motorcycles: Motorcycle[]
  compareAId: string
  compareBId: string
  onCompareAChange: (id: string) => void
  onCompareBChange: (id: string) => void
  compareA: Motorcycle
  compareB: Motorcycle
  radarData: RadarDataPoint[]
  getPowerHp: (bike: Motorcycle) => number
  getTorqueNm: (bike: Motorcycle) => number
  getWeightKg: (bike: Motorcycle) => number
}

export default function ComparisonPanel({
  motorcycles,
  compareAId,
  compareBId,
  onCompareAChange,
  onCompareBChange,
  compareA,
  compareB,
  radarData,
  getPowerHp,
  getTorqueNm,
  getWeightKg,
}: Props) {
  return (
    <section className="tech-panel mb-8 p-6">
      <div className="mb-6 flex items-center justify-between border-b border-tech-700 pb-4">
        <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center border border-primary-500 bg-primary-500/10 text-primary-400">
                <GitCompareArrows size={20} />
            </div>
            <div>
                <h2 className="text-lg font-bold font-display uppercase text-slate-100">Head-to-Head</h2>
                <p className="text-xs text-tech-500 font-mono">Direct specification comparison</p>
            </div>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <div className="border border-tech-700 bg-tech-800/30 p-4 group hover:border-primary-500/50 transition-colors">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-primary-500/80">Challenger A</label>
            <select
            value={compareAId}
            onChange={(event) => onCompareAChange(event.target.value)}
            className="w-full bg-transparent text-lg font-bold text-white outline-none font-display uppercase cursor-pointer"
            >
            {motorcycles.map((model) => (
                <option key={model.id} value={model.id} className="bg-tech-900 text-sm">
                {model.brand} {model.model}
                </option>
            ))}
            </select>
        </div>

        <div className="border border-tech-700 bg-tech-800/30 p-4 group hover:border-accent-400/50 transition-colors">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-accent-400/80">Challenger B</label>
            <select
            value={compareBId}
            onChange={(event) => onCompareBChange(event.target.value)}
            className="w-full bg-transparent text-lg font-bold text-white outline-none font-display uppercase cursor-pointer"
            >
            {motorcycles.map((model) => (
                <option key={model.id} value={model.id} className="bg-tech-900 text-sm">
                {model.brand} {model.model}
                </option>
            ))}
            </select>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="overflow-hidden border border-tech-700 bg-tech-900/50">
          <table className="min-w-full text-sm font-mono">
            <thead className="bg-tech-800 text-xs uppercase tracking-wider text-tech-400">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Metric</th>
                <th className="px-6 py-4 text-left font-semibold text-primary-400">{compareA.model}</th>
                <th className="px-6 py-4 text-left font-semibold text-accent-400">{compareB.model}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-tech-800/50">
              <tr className="hover:bg-tech-800/30 transition-colors">
                <td className="px-6 py-4 font-medium text-tech-400">Displacement</td>
                <td className="px-6 py-4 font-bold text-white">{compareA.cc}cc</td>
                <td className="px-6 py-4 font-bold text-white">{compareB.cc}cc</td>
              </tr>
              <tr className="hover:bg-tech-800/30 transition-colors">
                <td className="px-6 py-4 font-medium text-tech-400">Est. Power</td>
                <td className="px-6 py-4 font-bold text-white">{getPowerHp(compareA)} hp</td>
                <td className="px-6 py-4 font-bold text-white">{getPowerHp(compareB)} hp</td>
              </tr>
              <tr className="hover:bg-tech-800/30 transition-colors">
                <td className="px-6 py-4 font-medium text-tech-400">Est. Torque</td>
                <td className="px-6 py-4 font-bold text-white">{getTorqueNm(compareA)} Nm</td>
                <td className="px-6 py-4 font-bold text-white">{getTorqueNm(compareB)} Nm</td>
              </tr>
              <tr className="hover:bg-tech-800/30 transition-colors">
                <td className="px-6 py-4 font-medium text-tech-400">Weight</td>
                <td className="px-6 py-4 font-bold text-white">{getWeightKg(compareA)} kg</td>
                <td className="px-6 py-4 font-bold text-white">{getWeightKg(compareB)} kg</td>
              </tr>
              <tr className="hover:bg-tech-800/30 transition-colors">
                <td className="px-6 py-4 font-medium text-tech-400">Transmission</td>
                <td className="px-6 py-4 font-bold text-white">{compareA.transmission}</td>
                <td className="px-6 py-4 font-bold text-white">{compareB.transmission}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="h-80 border border-tech-700 bg-tech-900/20 p-4 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-tech-800/20 to-transparent pointer-events-none"></div>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#27272a" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }} />
              <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
              <Radar name={compareA.model} dataKey="A" stroke="#e11d48" strokeWidth={2} fill="#e11d48" fillOpacity={0.2} />
              <Radar name={compareB.model} dataKey="B" stroke="#0ea5e9" strokeWidth={2} fill="#0ea5e9" fillOpacity={0.2} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#f1f5f9', borderRadius: '0px', fontSize: '12px' }}
                itemStyle={{ fontFamily: 'monospace' }}
              />
              <Legend formatter={(value) => <span className="text-tech-400 text-xs font-mono uppercase tracking-wider">{value}</span>} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  )
}
