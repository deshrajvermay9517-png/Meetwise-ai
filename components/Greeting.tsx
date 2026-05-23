'use client'

export function Greeting({ name }: { name?: string | null }) {
  const hour = new Date().getHours()
  const time = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'
  const first = name?.split(' ')[0]
  return (
    <h1 style={{ fontFamily: '"DM Serif Display", serif', fontSize: '2rem', fontWeight: 400, color: '#f0ede8', margin: 0, letterSpacing: '-0.02em' }}>
      Good {time}{first ? `, ${first}` : ''}.
    </h1>
  )
}
