import { lazy, Suspense, useMemo, useState, useEffect } from 'react'
import { Bike, Search } from 'lucide-react'
import type { Motorcycle } from './types'
import { motorcycles } from './data/motorcycles'
import {
  estimatePowerHp,
  estimateTorqueNm,
  estimateWeightKg,
} from './utils/engine'
import ModelExplorerTable from './components/ModelExplorerTable'

const AnalyticsPanel = lazy(() => import('./components/AnalyticsPanel'))
const ComparisonPanel = lazy(() => import('./components/ComparisonPanel'))
const GearRatioPanel = lazy(() => import('./components/GearRatioPanel'))
const EngineBuilderPanel = lazy(() => import('./components/EngineBuilderPanel'))

function App() {
  const [query, setQuery] = useState('')
  const [brand, setBrand] = useState('All')
  const [bikeClass, setBikeClass] = useState('All')
  const [maxCc, setMaxCc] = useState(200)
  const [selected, setSelected] = useState<Motorcycle | null>(motorcycles[0])

  const [compareAId, setCompareAId] = useState(motorcycles[0].id)
  const [compareBId, setCompareBId] = useState(motorcycles[1].id)

  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const brands = useMemo(() => ['All', ...new Set(motorcycles.map((m) => m.brand))], [])
  const classes = useMemo(() => ['All', ...new Set(motorcycles.map((m) => m.class))], [])

  const filtered = useMemo(() => {
    return motorcycles
      .filter((m) => m.cc <= maxCc)
      .filter((m) => (brand === 'All' ? true : m.brand === brand))
      .filter((m) => (bikeClass === 'All' ? true : m.class === bikeClass))
      .filter((m) => {
        const q = query.trim().toLowerCase()
        if (!q) {
          return true
        }
        return (
          m.model.toLowerCase().includes(q) ||
          m.brand.toLowerCase().includes(q) ||
          m.platform.toLowerCase().includes(q) ||
          m.notes.toLowerCase().includes(q)
        )
      })
      .sort((first, second) => first.brand.localeCompare(second.brand) || first.cc - second.cc)
  }, [brand, bikeClass, maxCc, query])

  const selectedModel = selected ?? filtered[0] ?? motorcycles[0]

  const compareA = motorcycles.find((m) => m.id === compareAId) ?? motorcycles[0]
  const compareB = motorcycles.find((m) => m.id === compareBId) ?? motorcycles[1]

  const totalByBrand = useMemo(() => {
    return filtered.reduce<Record<string, number>>((accumulator, item) => {
      accumulator[item.brand] = (accumulator[item.brand] || 0) + 1
      return accumulator
    }, {})
  }, [filtered])

  const brandChartData = useMemo(
    () => Object.entries(totalByBrand).map(([name, count]) => ({ name, count })),
    [totalByBrand],
  )

  const avgCc = useMemo(
    () => (filtered.length ? Math.round(filtered.reduce((sum, m) => sum + m.cc, 0) / filtered.length) : 0),
    [filtered],
  )

  const avgHp = useMemo(() => {
    if (!filtered.length) {
      return 0
    }
    return Number((filtered.reduce((sum, m) => sum + estimatePowerHp(m), 0) / filtered.length).toFixed(1))
  }, [filtered])

  const estimatedHpById = useMemo(
    () =>
      filtered.reduce<Record<string, number>>((accumulator, bike) => {
        accumulator[bike.id] = estimatePowerHp(bike)
        return accumulator
      }, {}),
    [filtered],
  )

  const radarData = useMemo(() => {
    const aHp = estimatePowerHp(compareA)
    const bHp = estimatePowerHp(compareB)
    const aTq = estimateTorqueNm(compareA)
    const bTq = estimateTorqueNm(compareB)
    const aWt = estimateWeightKg(compareA)
    const bWt = estimateWeightKg(compareB)

    const agilityA = Math.round(220 - aWt)
    const agilityB = Math.round(220 - bWt)

    return [
      { metric: 'Power', A: aHp, B: bHp },
      { metric: 'Torque', A: aTq, B: bTq },
      { metric: 'Displacement', A: compareA.cc, B: compareB.cc },
      { metric: 'Agility', A: agilityA, B: agilityB },
    ]
  }, [compareA, compareB])

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header 
          className={`tech-panel sticky top-4 z-50 mb-8 flex flex-wrap items-center justify-between gap-4 bg-tech-900/90 backdrop-blur-md border-primary-500/20 shadow-lg shadow-primary-500/5 transition-all duration-300 ease-in-out ${
            scrolled ? 'p-3 md:p-4' : 'p-4 md:p-6'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center border border-primary-500 bg-primary-500/10 text-primary-400 font-display font-bold text-xl transition-all duration-300 ${
              scrolled ? 'h-8 w-8' : 'h-10 w-10'
            }`}>
              <Bike size={scrolled ? 18 : 24} className="transition-all duration-300" />
            </div>
            <div>
              <h1 className={`font-bold tracking-tight text-white font-display uppercase transition-all duration-300 ${
                scrolled ? 'text-xl' : 'text-2xl sm:text-3xl'
              }`}>
                EngineCalc <span className="text-primary-500">Pro</span>
              </h1>
              <p className={`text-xs font-mono text-tech-500 tracking-wider transition-all duration-300 ${
                scrolled ? 'h-0 opacity-0 overflow-hidden mt-0' : 'mt-1 h-auto opacity-100'
              }`}>
                High-Performance Research Platform
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 border border-primary-500/20 bg-primary-500/10 px-4 py-2 text-xs font-bold text-primary-400 font-mono tracking-widest uppercase">
            <div className="h-2 w-2 animate-pulse rounded-full bg-primary-500"></div>
            <span>{filtered.length} models active</span>
          </div>
        </header>

        <section className="tech-panel mb-8 grid gap-4 p-6 md:grid-cols-12 animate-fade-in-up">
          <label className="md:col-span-4 group hover:border-primary-500/30 transition-colors">
            <span className="tech-label mb-2 flex items-center gap-2">
              <Search size={12} /> Search Model
            </span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search model, brand, platform..."
              className="tech-input w-full px-4 py-3"
            />
          </label>

          <label className="md:col-span-2">
            <span className="tech-label mb-2 block">Brand</span>
            <select
              value={brand}
              onChange={(event) => setBrand(event.target.value)}
              className="tech-input w-full px-4 py-3 appearance-none cursor-pointer"
            >
              {brands.map((item) => (
                <option key={item} value={item} className="bg-tech-900">
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="md:col-span-2">
            <span className="tech-label mb-2 block">Class</span>
            <select
              value={bikeClass}
              onChange={(event) => setBikeClass(event.target.value)}
              className="tech-input w-full px-4 py-3 appearance-none cursor-pointer"
            >
              {classes.map((item) => (
                <option key={item} value={item} className="bg-tech-900">
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="md:col-span-4">
            <span className="tech-label mb-2 flex items-center justify-between">
              <span>Max Displacement</span>
              <strong className="text-primary-400 font-mono">{maxCc}cc</strong>
            </span>
            <input
              type="range"
              min={90}
              max={200}
              value={maxCc}
              onChange={(event) => setMaxCc(Number(event.target.value))}
              className="h-1 w-full cursor-pointer appearance-none bg-tech-700 accent-primary-500"
            />
          </label>
        </section>

        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-fade-in-up delay-100 fill-mode-backwards" style={{ animationDelay: '100ms' }}>
          {[
            { label: 'Models in Scope', value: filtered.length, sub: 'Total' },
            { label: 'Avg Displacement', value: `${avgCc}cc`, sub: 'Capacity' },
            { label: 'Avg Power', value: `${avgHp} hp`, sub: 'Performance' },
            { label: 'Selected Model', value: selectedModel.model, sub: selectedModel.brand, highlight: true },
          ].map((stat, i) => (
            <article key={i} className={`tech-panel p-6 relative overflow-hidden group hover:border-primary-500/30 transition-colors ${stat.highlight ? 'border-primary-500/40 bg-primary-500/5' : ''}`}>
              <div className="relative z-10">
                <p className="tech-label">{stat.label}</p>
                <p className={`mt-2 text-3xl font-bold tracking-tight font-rajdhani ${stat.highlight ? 'text-primary-400' : 'text-slate-100'}`}>{stat.value}</p>
                <p className="mt-1 text-xs text-tech-500 font-mono">{stat.sub}</p>
              </div>
              {stat.highlight && (
                <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-primary-500/10 blur-2xl"></div>
              )}
            </article>
          ))}
        </section>

        <Suspense
          fallback={<section className="mb-8 h-72 animate-pulse border border-tech-700 bg-tech-800/50" />}
        >
          <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <AnalyticsPanel
              brandChartData={brandChartData}
              selectedModel={selectedModel}
              selectedPowerHp={estimatePowerHp(selectedModel)}
              selectedTorqueNm={estimateTorqueNm(selectedModel)}
              selectedWeightKg={estimateWeightKg(selectedModel)}
            />
          </div>
        </Suspense>

        <Suspense
            fallback={<section className="mb-8 h-96 animate-pulse border border-tech-700 bg-tech-800/50" />}
        >
            <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <EngineBuilderPanel />
            </div>
        </Suspense>

        <Suspense
          fallback={<section className="mb-8 h-96 animate-pulse border border-tech-700 bg-tech-800/50" />}
        >
          <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <GearRatioPanel />
          </div>
        </Suspense>
        
        <Suspense
          fallback={<section className="mb-8 h-96 animate-pulse border border-tech-700 bg-tech-800/50" />}
        >
          <div className="animate-fade-in-up" style={{ animationDelay: '500ms' }}>
            <ComparisonPanel
              motorcycles={motorcycles}
              compareAId={compareAId}
              compareBId={compareBId}
              onCompareAChange={setCompareAId}
              onCompareBChange={setCompareBId}
              compareA={compareA}
              compareB={compareB}
              radarData={radarData}
              getPowerHp={estimatePowerHp}
              getTorqueNm={estimateTorqueNm}
              getWeightKg={estimateWeightKg}
            />
          </div>
        </Suspense>

        <div className="animate-fade-in-up" style={{ animationDelay: '600ms' }}>
          <ModelExplorerTable
            models={filtered}
            selectedId={selectedModel.id}
            estimatedHpById={estimatedHpById}
            onSelect={setSelected}
          />
        </div>
      </div>
    </main>
  )
}

export default App
