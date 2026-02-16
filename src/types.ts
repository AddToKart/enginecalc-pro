export type Motorcycle = {
  id: string
  brand: string
  model: string
  class: string
  cc: number
  cooling: 'Air' | 'Liquid' | 'Air/Oil' | 'Model-specific'
  transmission: string
  platform: string
  status: 'Current' | 'Legacy'
  notes: string
  wikiQuery: string
}
