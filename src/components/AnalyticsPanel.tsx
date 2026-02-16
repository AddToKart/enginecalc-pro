import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { Motorcycle } from '../types'

type Props = {
  brandChartData: Array<{ name: string; count: number }>
  selectedModel: Motorcycle
  selectedPowerHp: number
  selectedTorqueNm: number
  selectedWeightKg: number
}

export default function AnalyticsPanel({
  brandChartData,
  selectedModel,
  selectedPowerHp,
  selectedTorqueNm,
  selectedWeightKg,
}: Props) {
  return (
    <section className="mb-8 grid gap-4 lg:grid-cols-3">
      <article className="tech-panel p-6 lg:col-span-2">
        <div className="mb-6 flex items-center justify-between border-b border-tech-700 pb-4">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-100">Brand Market Share</h2>
              <p className="text-[10px] text-tech-500">Distribution by count</p>
            </div>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={brandChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
              <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="#71717a" fontSize={11} allowDecimals={false} tickLine={false} axisLine={false} dx={-10} />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ backgroundColor: '#121214', borderColor: '#27272a', color: '#f1f5f9', fontSize: '12px' }}
                itemStyle={{ color: '#0ea5e9' }}
              />
              <Bar dataKey="count" fill="#0ea5e9" radius={[2, 2, 0, 0]} maxBarSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="tech-panel relative overflow-hidden p-6">
        <div className="relative z-10 h-full flex flex-col">
            <div className="mb-4 border-b border-tech-700 pb-4">
               <h2 className="text-sm font-bold uppercase tracking-widest text-slate-100">Selected Spec</h2>
            </div>
            
            <div className="mb-6 flex-1">
                <h3 className="text-2xl font-bold text-white font-display uppercase">{selectedModel.model}</h3>
                <p className="text-sm text-primary-400 font-mono tracking-wider">{selectedModel.brand}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                    <span className="bg-tech-800 px-2 py-1 text-xs text-tech-300 border border-tech-600 uppercase tracking-wider">{selectedModel.class}</span>
                    <span className="bg-tech-800 px-2 py-1 text-xs text-tech-300 border border-tech-600 uppercase tracking-wider">{selectedModel.transmission}</span>
                </div>
            </div>

            <ul className="space-y-3 text-sm border-t border-tech-700 pt-4 font-mono">
            <li className="flex justify-between">
                <span className="text-tech-400">Engine</span>
                <strong className="text-slate-200">{selectedModel.cc} cc</strong>
            </li>
            <li className="flex justify-between">
                <span className="text-tech-400">Cooling</span>
                <strong className="text-slate-200 uppercase">{selectedModel.cooling}</strong>
            </li>
            <li className="flex justify-between">
                <span className="text-tech-400">Power</span>
                <strong className="text-primary-400">{selectedPowerHp} hp</strong>
            </li>
            <li className="flex justify-between">
                <span className="text-tech-400">Torque</span>
                <strong className="text-primary-400">{selectedTorqueNm} Nm</strong>
            </li>
            <li className="flex justify-between">
                <span className="text-tech-400">Weight</span>
                <strong className="text-slate-200">{selectedWeightKg} kg</strong>
            </li>
            </ul>
        </div>
        
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 z-0 bg-grid-white/[0.02] pointer-events-none" />
        <div className="absolute -right-20 -top-20 z-0 h-64 w-64 rounded-full bg-primary-500/10 blur-[100px] pointer-events-none"></div>
      </article>
    </section>
  )
}
