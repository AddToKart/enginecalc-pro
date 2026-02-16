import { useState, useMemo } from 'react'
import { Settings } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { DEFAULT_GEARING, getTireCircumference } from '../utils/gearRatio'

export default function GearRatioPanel() {
  const [rpmLimit, setRpmLimit] = useState(12000)
  const [frontSprocket, setFrontSprocket] = useState(DEFAULT_GEARING.sprockets.front)
  const [rearSprocket, setRearSprocket] = useState(DEFAULT_GEARING.sprockets.rear)
  const [gears, setGears] = useState(DEFAULT_GEARING.gearRatios)
  const [primaryRatio] = useState(DEFAULT_GEARING.primaryRatio)
  
  // Tire specs
  const [tireWidth, setTireWidth] = useState(DEFAULT_GEARING.tire.width)
  const [tireAspect, setTireAspect] = useState(DEFAULT_GEARING.tire.aspect)
  const [tireRim, setTireRim] = useState(DEFAULT_GEARING.tire.rim)

  const finalDrive = useMemo(() => rearSprocket / frontSprocket, [frontSprocket, rearSprocket])
  const tireCircumference = useMemo(
    () => getTireCircumference(tireWidth, tireAspect, tireRim),
    [tireWidth, tireAspect, tireRim]
  ) / 1000 // meters

  // Generate chart data
  const chartData = useMemo(() => {
    const data = []
    const step = 1000
    for (let rpm = 0; rpm <= rpmLimit; rpm += step) {
      const point: any = { rpm }
      gears.forEach((gearRatio, index) => {
        const totalRatio = primaryRatio * gearRatio * finalDrive
        const speedKmh = (rpm * tireCircumference * 60) / (totalRatio * 1000)
        point[`gear${index + 1}`] = Math.round(speedKmh * 10) / 10
      })
      data.push(point)
    }
    return data
  }, [rpmLimit, gears, primaryRatio, finalDrive, tireCircumference])

  const topSpeeds = useMemo(() => {
      return gears.map((gear) => {
          const totalRatio = primaryRatio * gear * finalDrive
          const speed = (rpmLimit * tireCircumference * 60) / (totalRatio * 1000)
          return Math.round(speed)
      })
  }, [rpmLimit, gears, primaryRatio, finalDrive, tireCircumference])

  const handleGearChange = (index: number, val: string) => {
      const newGears = [...gears]
      newGears[index] = Number(val) || 0
      setGears(newGears)
  }

  return (
    <section className="tech-panel p-6">
      <div className="mb-6 flex items-center justify-between border-b border-tech-700 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center border border-primary-500 bg-primary-500/10 text-primary-400">
            <Settings size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-100">Transmission Logic</h2>
            <p className="text-[10px] text-tech-500">Gear Ratio & Speed Calculator</p>
          </div>
        </div>
        <div className="text-right">
            <p className="text-[10px] uppercase text-tech-500">Final Drive</p>
            <p className="font-mono text-xl font-bold text-primary-400">{finalDrive.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Controls */}
        <div className="lg:col-span-4 space-y-6">
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="tech-label">Front Sprocket</label>
                  <input type="number" value={frontSprocket} onChange={e => setFrontSprocket(Number(e.target.value))} className="tech-input w-full" />
               </div>
               <div>
                  <label className="tech-label">Rear Sprocket</label>
                  <input type="number" value={rearSprocket} onChange={e => setRearSprocket(Number(e.target.value))} className="tech-input w-full" />
               </div>
            </div>

            <div className="border border-tech-700 bg-tech-800/50 p-4">
               <h3 className="tech-label mb-3 text-accent-400">Gear Ratios</h3>
               <div className="grid grid-cols-2 gap-2">
                   {gears.map((ratio, i) => (
                       <div key={i} className="flex items-center gap-2">
                           <span className="w-4 text-[10px] font-bold text-tech-500">{i+1}</span>
                           <input 
                             type="number" 
                             step="0.01" 
                             value={ratio} 
                             onChange={e => handleGearChange(i, e.target.value)}
                             className="tech-input w-full py-1 text-xs"
                           />
                       </div>
                   ))}
               </div>
            </div>

            <div>
                <label className="tech-label">Rear Tire (Ex: 110/70-17)</label>
                <div className="flex gap-2">
                    <input type="number" value={tireWidth} onChange={e => setTireWidth(Number(e.target.value))} className="tech-input w-1/3" placeholder="W" />
                    <input type="number" value={tireAspect} onChange={e => setTireAspect(Number(e.target.value))} className="tech-input w-1/3" placeholder="A" />
                    <input type="number" value={tireRim} onChange={e => setTireRim(Number(e.target.value))} className="tech-input w-1/3" placeholder="R" />
                </div>
            </div>
            
             <div>
                <label className="tech-label">RPM Limit</label>
                <input 
                    type="range" 
                    min="8000" 
                    max="16000" 
                    step="500" 
                    value={rpmLimit} 
                    onChange={e => setRpmLimit(Number(e.target.value))} 
                    className="w-full h-1 bg-tech-700 accent-primary-500 appearance-none cursor-pointer" 
                />
                <div className="text-right font-mono text-xs text-primary-400 mt-1">{rpmLimit} RPM</div>
            </div>
        </div>

        {/* Chart */}
        <div className="lg:col-span-8 flex flex-col h-[400px]">
           <div className="flex-1 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                        <XAxis dataKey="rpm" stroke="#71717a" fontSize={10} tickFormatter={(val) => `${val/1000}k`} />
                        <YAxis stroke="#71717a" fontSize={10} unit=" km/h" />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#121214', borderColor: '#27272a', fontSize: '12px' }}
                            itemStyle={{ padding: 0 }}
                            labelStyle={{ color: '#a1a1aa', marginBottom: '0.5rem' }}
                        />
                        <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}/>
                        {gears.map((_, i) => (
                            <Line 
                                key={i} 
                                type="monotone" 
                                dataKey={`gear${i+1}`} 
                                stroke={`hsl(${340 - (i * 30)}, 80%, 60%)`} 
                                strokeWidth={2}
                                dot={false}
                                name={`G${i+1}`}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
                
                {/* Max Speed Indicators Overlay */}
                <div className="absolute top-4 right-4 flex flex-col items-end pointer-events-none">
                     <span className="tech-label text-primary-400 mb-2">Theoretical Top Speed</span>
                     <div className="text-3xl font-mono font-bold text-white shadow-black drop-shadow-md">
                         {topSpeeds[topSpeeds.length - 1]} <span className="text-sm font-sans font-normal text-tech-500">km/h</span>
                     </div>
                </div>
           </div>
        </div>
      </div>
    </section>
  )
}
