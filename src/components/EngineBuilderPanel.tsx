import { useState, useMemo } from 'react'
import { Wrench, RotateCcw, Factory } from 'lucide-react'
import { MOTORCYCLE_SPECS, CATALOG_PARTS } from '../data/parts'
import { calculateDisplacement, estimatePower } from '../utils/engineBuilder'

export default function EngineBuilderPanel() {
  const [selectedBikeId, setSelectedBikeId] = useState<keyof typeof MOTORCYCLE_SPECS>('honda-click-125i')
  
  // Custom Specs state
  const [customBore, setCustomBore] = useState<number>(MOTORCYCLE_SPECS[selectedBikeId].stockBore)
  const [customStroke, setCustomStroke] = useState<number>(MOTORCYCLE_SPECS[selectedBikeId].stockStroke)
  const [selectedBlockId, setSelectedBlockId] = useState<string>('stock')
  const [selectedCamId, setSelectedCamId] = useState<string>('stock')
  
  // CVT State
  const [rollerWeight, setRollerWeight] = useState<number>(MOTORCYCLE_SPECS[selectedBikeId].stockRollerWeight)
  
  const bike = MOTORCYCLE_SPECS[selectedBikeId]
  const isScooter = bike.type === 'scooter'

  // Update defaults when bike changes
  useMemo(() => {
     setCustomBore(MOTORCYCLE_SPECS[selectedBikeId].stockBore)
     setCustomStroke(MOTORCYCLE_SPECS[selectedBikeId].stockStroke)
     setRollerWeight(MOTORCYCLE_SPECS[selectedBikeId].stockRollerWeight)
     setSelectedBlockId('stock')
     setSelectedCamId('stock')
  }, [selectedBikeId])

  const displacement = useMemo(() => {
      return calculateDisplacement(customBore, customStroke)
  }, [customBore, customStroke])

  const estimatedPower = useMemo(() => {
      const type = customBore > bike.stockBore ? 'street' : 'stock'
      let basePower = estimatePower(displacement, type)
      
      // Cam bonus
      if (selectedCamId === 'jvt-s1-cam') basePower += 1.5
      if (selectedCamId === 'mtrt-evo-cam') basePower += 3.2
      
      return basePower.toFixed(1)
  }, [displacement, customBore, bike.stockBore, selectedCamId])

  const percentGain = useMemo(() => {
      const stockCc = calculateDisplacement(bike.stockBore, bike.stockStroke)
      return Math.round(((displacement - stockCc) / stockCc) * 100);
  }, [displacement, bike])

  const handlePartSelect = (partId: string) => {
      if (partId === 'stock') {
          setCustomBore(bike.stockBore)
          setSelectedBlockId('stock')
          return
      }
      
      const part = CATALOG_PARTS.find(p => p.id === partId)
      if (part && part.type === 'block' && part.specs.bore) {
          setCustomBore(part.specs.bore)
          setSelectedBlockId(partId)
      }
  }

  return (
    <section className="tech-panel p-6 mb-8">
      <div className="mb-6 flex items-center justify-between border-b border-tech-700 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center border border-primary-500 bg-primary-500/10 text-primary-400">
            <Wrench size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold font-display uppercase tracking-widest text-slate-100">Engine Lab</h2>
            <p className="text-[10px] text-tech-500 font-mono">Virtual Dyno & Build Planner</p>
          </div>
        </div>
        
        <div className="text-right">
            <p className="text-[10px] uppercase text-tech-500">Projected Power</p>
            <p className="font-mono text-xl font-bold text-accent-400 flex items-center justify-end gap-2">
                {estimatedPower} <span className="text-xs text-tech-500">HP</span>
            </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left: Configuration */}
        <div className="lg:col-span-5 space-y-6">
            
            {/* Bike Selector */}
            <div className="border border-tech-700 bg-tech-800/30 p-4">
                <label className="tech-label mb-2 flex items-center gap-2">
                    <Factory size={12} className="text-primary-400"/> Base Platform
                </label>
                <select 
                    value={selectedBikeId}
                    onChange={(e) => setSelectedBikeId(e.target.value as any)}
                    className="w-full bg-tech-900 text-white font-rajdhani uppercase text-lg font-bold outline-none border-b border-tech-700 focus:border-primary-500 py-2"
                >
                    {Object.entries(MOTORCYCLE_SPECS).map(([key, val]) => (
                        <option key={key} value={key}>{val.name}</option>
                    ))}
                </select>
                <div className="mt-2 text-xs text-tech-500 font-mono flex gap-4">
                    <span>Stock: {bike.stockBore}mm x {bike.stockStroke}mm</span>
                    <span>{calculateDisplacement(bike.stockBore, bike.stockStroke)}cc</span>
                </div>
            </div>

            {/* Cylinder Block Selection */}
            <div className="border border-tech-700 bg-tech-800/30 p-4">
               <label className="tech-label mb-2 text-primary-400">Step 1: Bore Up Kit (Block)</label>
               <div className="space-y-2">
                   <div 
                        onClick={() => handlePartSelect('stock')}
                        className={`cursor-pointer p-2 border ${selectedBlockId === 'stock' ? 'border-primary-500 bg-primary-500/10' : 'border-tech-700 hover:border-tech-500'} transition-all`}
                   >
                       <div className="flex justify-between items-center">
                           <span className="text-sm font-bold text-slate-200">Stock Cylinder</span>
                           <span className="text-xs font-mono text-tech-500">{bike.stockBore}mm</span>
                       </div>
                   </div>
                   
                   {CATALOG_PARTS.filter(p => p.type === 'block').map(part => (
                       <div 
                            key={part.id}
                            onClick={() => handlePartSelect(part.id)}
                            className={`cursor-pointer p-2 border ${selectedBlockId === part.id ? 'border-primary-500 bg-primary-500/10' : 'border-tech-700 hover:border-tech-500'} transition-all`}
                       >
                           <div className="flex justify-between items-center">
                               <div>
                                   <span className="text-sm font-bold text-slate-200 block">{part.brand} {part.specs.bore}mm</span>
                                   <span className="text-[10px] text-tech-400">{part.name}</span>
                               </div>
                               <div className="text-right">
                                   <span className="text-xs font-mono text-accent-400 block">{part.priceRange}</span>
                                   <span className="text-[10px] text-tech-500">+{Math.round(((part.specs.bore! - bike.stockBore)/bike.stockBore)*100)}% Area</span>
                               </div>
                           </div>
                       </div>
                   ))}
               </div>
            </div>

            {/* Camshaft Selection */}
            <div className="border border-tech-700 bg-tech-800/30 p-4">
               <label className="tech-label mb-2 text-accent-400">Step 2: Performance Camshaft</label>
               <div className="space-y-2">
                   <div 
                        onClick={() => setSelectedCamId('stock')}
                        className={`cursor-pointer p-2 border ${selectedCamId === 'stock' ? 'border-accent-500 bg-accent-500/10' : 'border-tech-700 hover:border-tech-500'} transition-all`}
                   >
                       <div className="flex justify-between items-center">
                           <span className="text-sm font-bold text-slate-200">Stock Camshaft</span>
                           <span className="text-xs font-mono text-tech-500">Standard Lift</span>
                       </div>
                   </div>
                   
                   {CATALOG_PARTS.filter(p => p.type === 'cam').map(part => (
                       <div 
                            key={part.id}
                            onClick={() => setSelectedCamId(part.id)}
                            className={`cursor-pointer p-2 border ${selectedCamId === part.id ? 'border-accent-500 bg-accent-500/10' : 'border-tech-700 hover:border-tech-500'} transition-all`}
                       >
                           <div className="flex justify-between items-center">
                               <div>
                                   <span className="text-sm font-bold text-slate-200 block">{part.brand} {part.name}</span>
                                   <span className="text-[10px] text-tech-400">Lift: {part.specs.lift}</span>
                               </div>
                               <div className="text-right">
                                   <span className="text-xs font-mono text-primary-400 block">{part.priceRange}</span>
                                   <span className="text-[10px] text-tech-500">{part.id === 'mtrt-evo-cam' ? 'Race Spec' : 'Touring'}</span>
                               </div>
                           </div>
                       </div>
                   ))}
               </div>
            </div>

            {/* Manual Override */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="tech-label">Custom Bore (mm)</label>
                   <input 
                        type="number" 
                        value={customBore} 
                        onChange={e => {setCustomBore(Number(e.target.value)); setSelectedBlockId('custom');}} 
                        className="tech-input w-full text-primary-400 font-bold" 
                   />
                </div>
                <div>
                   <label className="tech-label">Stroke (mm)</label>
                   <input 
                        type="number" 
                        value={customStroke} 
                        onChange={e => {setCustomStroke(Number(e.target.value));}} 
                        className="tech-input w-full" 
                   />
                </div>
            </div>

        </div>

        {/* Right: Results & Visualization */}
        <div className="lg:col-span-7 space-y-6">
            
            {/* Main Stats Display */}
            <div className="grid grid-cols-2 gap-4">
                <div className="tech-panel p-4 bg-tech-800 flex flex-col justify-center items-center">
                    <span className="text-tech-500 text-xs uppercase tracking-widest mb-1">Total Displacement</span>
                    <span className="text-4xl font-mono font-bold text-white relative">
                        {displacement}
                        <span className="text-sm text-tech-500 absolute -right-6 top-0">cc</span>
                    </span>
                    {percentGain > 0 && (
                        <span className="text-xs font-bold text-accent-400 mt-2">+{percentGain}% vs Stock</span>
                    )}
                </div>
                
                <div className="tech-panel p-4 bg-tech-800 flex flex-col justify-center items-center relative overflow-hidden">
                     <div className="absolute inset-0 bg-primary-500/5 z-0"></div>
                     <span className="text-tech-500 text-xs uppercase tracking-widest mb-1 z-10">Est. Power Output</span>
                     <span className="text-4xl font-mono font-bold text-primary-400 z-10">
                        {estimatedPower}
                        <span className="text-sm text-tech-500 absolute -right-8 top-0">HP</span>
                     </span>
                     <span className="text-[10px] text-tech-600 mt-2 z-10">*Approximate dyno value</span>
                </div>
            </div>

            {/* Visualization Graphic */}
            <div className="tech-panel p-6 h-64 relative flex items-center justify-center border-t-2 border-primary-500">
                <div className="absolute inset-0 bg-grid-white/[0.03] pointer-events-none" />
                
                {/* Visual Representation of Cylinder */}
                <div className="relative">
                    {/* Stock Outline */}
                    <div 
                        className="border-2 border-dashed border-tech-600 rounded-full flex items-center justify-center opacity-50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        style={{ width: `${bike.stockBore * 2.5}px`, height: `${bike.stockBore * 2.5}px` }}
                    ></div>
                    
                    {/* New Bore */}
                    <div 
                        className="rounded-full bg-primary-500/20 border-2 border-primary-500 flex items-center justify-center shadow-[0_0_30px_rgba(225,29,72,0.3)] transition-all duration-500"
                        style={{ width: `${customBore * 2.5}px`, height: `${customBore * 2.5}px` }}
                    >
                        <div className="text-center">
                            <span className="block text-xs font-bold text-primary-200">{customBore}mm</span>
                            <span className="block text-[10px] text-primary-400/70">Piston</span>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-4 right-4 text-right">
                    <p className="text-xs text-tech-400">Simulated Setup:</p>
                    <p className="font-mono text-sm font-bold text-white">
                        {customBore}mm x {customStroke}mm
                    </p>
                    {customStroke > bike.stockStroke && (
                        <p className="text-xs text-accent-400">+{(customStroke - bike.stockStroke).toFixed(1)}mm Stroker</p>
                    )}
                </div>
            </div>

            {/* CVT Section (If Scooter) */}
            {isScooter && (
                <div className="border border-tech-700 bg-tech-800/30 p-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                        <RotateCcw size={48} />
                    </div>
                    <label className="tech-label mb-2 text-accent-400 flex items-center gap-2">
                        <RotateCcw size={14}/> CVT Tuning (Roller Weights)
                    </label>
                    <div className="flex gap-4 items-center">
                        <div className="flex-1">
                             <input 
                                type="range" 
                                min="7" 
                                max="20" 
                                step="0.5" 
                                value={rollerWeight} 
                                onChange={e => setRollerWeight(Number(e.target.value))}
                                className="w-full h-1 bg-tech-700 accent-accent-500 appearance-none cursor-pointer"
                             />
                             <div className="flex justify-between text-[10px] text-tech-500 mt-1 font-mono">
                                 <span>7g (Drag)</span>
                                 <span>20g (Top)</span>
                             </div>
                        </div>
                        <div className="w-20 text-center border border-tech-600 bg-tech-900 p-2 rounded">
                            <span className="block text-xl font-bold text-white">{rollerWeight}g</span>
                            <span className="text-[10px] text-tech-400">per roller</span>
                        </div>
                    </div>
                    <div className="mt-4 p-2 bg-tech-900/50 border border-tech-700/50 rounded text-xs text-slate-300">
                        {rollerWeight < 10 ? 
                            "🚀 Aggressive acceleration. High RPM engagement. Good for drag racing." :
                         rollerWeight > 14 ? 
                            "🛣️ Touring setup. Lower RPM cruising. Better top speed potential." :
                            "⚖️ Balanced street setup. Good for daily riding."
                        }
                    </div>
                </div>
            )}

            {/* Stage Recommendation */}
            <div className={`mt-4 p-4 border ${percentGain > 20 ? 'border-primary-500 bg-primary-500/10' : 'border-tech-700 bg-tech-900/50'}`}>
                <h3 className="tech-label mb-2">Build Classification</h3>
                <p className="text-sm font-bold text-white mb-2">
                    {percentGain < 8 ? 'Stage 1: Bolt-ons (Stock Engine)' : 
                     percentGain < 25 ? 'Stage 2: Sports / Touring (Bore Up)' : 
                     'Stage 3: Competition / Open (Full Build)'}
                </p>
                <p className="text-xs text-tech-400 font-mono">
                    {percentGain < 8 ? 'Recommended: Exhaust, Aftermarket ECU/tune, Air filter, CVT tuning.' :
                     percentGain < 25 ? 'Recommended: Camshaft upgrade, Injector resizing, Oil cooling support.' :
                     'Required: Forged internals, Big valves, Porting, High-flow cooling system.'}
                </p>
            </div>

        </div>
      </div>
    </section>
  )
}