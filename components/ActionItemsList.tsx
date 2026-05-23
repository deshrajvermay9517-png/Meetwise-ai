'use client'
// components/ActionItemsList.tsx
// Renders action items with interactive toggle, optimistic UI updates,
// and a delete button.
import { useState } from 'react'

interface ActionItem {
  id: string
  text: string
  owner: string | null
  due_date: string | null
  priority: 'high' | 'medium' | 'low'
  done: boolean
}

interface ActionItemsListProps {
  items: ActionItem[]
}

const PRIORITY_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  high:   { bg: '#1a0a0a', color: '#c96e6e', border: '#c96e6e33' },
  medium: { bg: '#111',    color: '#666',    border: '#222'      },
  low:    { bg: '#0a180a', color: '#6ec98a', border: '#6ec98a33' },
}

export function ActionItemsList({ items: initialItems }: ActionItemsListProps) {
  const [items, setItems] = useState<ActionItem[]>(initialItems)
  const [pending, setPending] = useState<Set<string>>(new Set())

  async function toggleDone(item: ActionItem) {
    if (pending.has(item.id)) return

    // Optimistic update
    setPending(p => new Set(p).add(item.id))
    setItems(prev =>
      prev.map(i => i.id === item.id ? { ...i, done: !i.done } : i)
    )

    try {
      const res = await fetch(`/api/action-items/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: !item.done }),
      })

      if (!res.ok) {
        // Revert on failure
        setItems(prev =>
          prev.map(i => i.id === item.id ? { ...i, done: item.done } : i)
        )
      }
    } catch {
      // Revert on network error
      setItems(prev =>
        prev.map(i => i.id === item.id ? { ...i, done: item.done } : i)
      )
    } finally {
      setPending(p => { const s = new Set(p); s.delete(item.id); return s })
    }
  }

  async function deleteItem(id: string) {
    if (pending.has(id)) return
    setPending(p => new Set(p).add(id))
    setItems(prev => prev.filter(i => i.id !== id))

    try {
      await fetch(`/api/action-items/${id}`, { method: 'DELETE' })
    } catch {
      // Best effort — page refresh will restore if it failed
    } finally {
      setPending(p => { const s = new Set(p); s.delete(id); return s })
    }
  }

  const open   = items.filter(i => !i.done)
  const closed = items.filter(i => i.done)

  if (items.length === 0) return null

  return (
    <div style={{
      background: '#111',
      border: '1px solid #1f1f1f',
      borderRadius: '10px',
      padding: '1.5rem',
      marginBottom: '1.5rem',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
      }}>
        <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555' }}>
          Action items
        </div>
        <div style={{ fontSize: '0.75rem', color: '#333' }}>
          {closed.length}/{items.length} done
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ background: '#1a1a1a', borderRadius: '4px', height: '3px', marginBottom: '1.25rem', overflow: 'hidden' }}>
        <div style={{
          width: `${items.length ? (closed.length / items.length) * 100 : 0}%`,
          height: '100%',
          background: '#6ec98a',
          borderRadius: '4px',
          transition: 'width 0.3s ease',
        }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {[...open, ...closed].map(action => {
          const ps = PRIORITY_STYLES[action.priority] ?? PRIORITY_STYLES.medium
          const isLoading = pending.has(action.id)

          return (
            <div
              key={action.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                padding: '0.75rem',
                background: '#0d0d0d',
                borderRadius: '6px',
                border: '1px solid #1a1a1a',
                opacity: action.done ? 0.5 : isLoading ? 0.7 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              {/* Checkbox */}
              <button
                onClick={() => toggleDone(action)}
                disabled={isLoading}
                aria-label={action.done ? 'Mark incomplete' : 'Mark complete'}
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  border: `1.5px solid ${action.done ? '#6ec98a' : '#333'}`,
                  background: action.done ? '#6ec98a22' : 'transparent',
                  flexShrink: 0,
                  marginTop: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.6rem',
                  color: '#6ec98a',
                  cursor: isLoading ? 'wait' : 'pointer',
                  padding: 0,
                  transition: 'all 0.15s',
                }}
              >
                {action.done && '✓'}
              </button>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '0.875rem',
                  color: action.done ? '#444' : '#ccc',
                  textDecoration: action.done ? 'line-through' : 'none',
                  lineHeight: 1.5,
                }}>
                  {action.text}
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.3rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  {action.owner && (
                    <span style={{ fontSize: '0.7rem', color: '#444' }}>→ {action.owner}</span>
                  )}
                  {action.due_date && (
                    <span style={{
                      fontSize: '0.7rem',
                      color: !action.done && new Date(action.due_date) < new Date() ? '#c96e6e' : '#444',
                    }}>
                      Due {new Date(action.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  )}
                  <span style={{
                    fontSize: '0.65rem',
                    padding: '0.1rem 0.4rem',
                    borderRadius: '3px',
                    background: ps.bg,
                    color: ps.color,
                    border: `1px solid ${ps.border}`,
                    textTransform: 'capitalize',
                  }}>
                    {action.priority}
                  </span>
                </div>
              </div>

              {/* Delete */}
              <button
                onClick={() => deleteItem(action.id)}
                disabled={isLoading}
                aria-label="Delete action item"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#2a2a2a',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  padding: '0 0.25rem',
                  flexShrink: 0,
                  lineHeight: 1,
                  transition: 'color 0.1s',
                }}
                onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.color = '#c96e6e' }}
                onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.color = '#2a2a2a' }}
              >
                ✕
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
