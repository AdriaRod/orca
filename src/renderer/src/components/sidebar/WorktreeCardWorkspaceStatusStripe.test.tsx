// @vitest-environment happy-dom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { WorkspaceStatusDefinition } from '../../../../shared/worktree/types'
import { DEFAULT_WORKSPACE_STATUSES } from './workspace-status'

const mocks = vi.hoisted(() => {
  const state: Record<string, unknown> = {}
  return { state }
})

vi.mock('@/store', () => ({
  useAppStore: (selector: (state: Record<string, unknown>) => unknown) => selector(mocks.state)
}))

import { WorktreeCardWorkspaceStatusStripe } from './WorktreeCardWorkspaceStatusStripe'

const STATUSES: WorkspaceStatusDefinition[] = [
  { id: 'todo', label: 'Todo', color: 'zinc' },
  { id: 'in-progress', label: 'In progress', color: 'blue' },
  { id: 'blocked', label: 'Blocked', color: 'rose' }
]

function setState(
  enabled: boolean,
  statuses: readonly WorkspaceStatusDefinition[] = STATUSES
): void {
  mocks.state = {
    settings: { showWorkspaceStatusOnCards: enabled },
    workspaceStatuses: statuses
  }
}

const mountedRoots: Root[] = []

async function renderStripe(workspaceStatus: string | undefined): Promise<HTMLDivElement> {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = createRoot(container)
  mountedRoots.push(root)
  await act(async () => {
    root.render(
      <WorktreeCardWorkspaceStatusStripe worktree={{ workspaceStatus }}>
        <span data-testid="card-content">content</span>
      </WorktreeCardWorkspaceStatusStripe>
    )
  })
  return container
}

function getStripe(container: ParentNode): Element | null {
  return container.querySelector('[data-worktree-workspace-status-stripe]')
}

describe('WorktreeCardWorkspaceStatusStripe', () => {
  beforeEach(() => {
    setState(true)
  })

  afterEach(async () => {
    await act(async () => {
      for (const root of mountedRoots.splice(0)) {
        root.unmount()
      }
    })
    document.body.innerHTML = ''
  })

  it('leaves the card content unwrapped while the setting is off', async () => {
    setState(false)
    const container = await renderStripe('blocked')

    expect(getStripe(container)).toBeNull()
    expect(container.firstElementChild?.getAttribute('data-testid')).toBe('card-content')
  })

  it("paints the stripe with the worktree's status color", async () => {
    const container = await renderStripe('blocked')

    expect(getStripe(container)?.className).toContain('bg-rose-500')
    expect(getStripe(container)?.getAttribute('data-worktree-workspace-status-stripe')).toBe(
      'blocked'
    )
    expect(container.querySelector('[data-testid="card-content"]')).not.toBeNull()
  })

  it('falls back to the default status for worktrees without a known status', async () => {
    const unset = await renderStripe(undefined)
    expect(getStripe(unset)?.getAttribute('data-worktree-workspace-status-stripe')).toBe(
      'in-progress'
    )
    expect(getStripe(unset)?.className).toContain('bg-blue-500')

    const removed = await renderStripe('deleted-status')
    expect(getStripe(removed)?.getAttribute('data-worktree-workspace-status-stripe')).toBe(
      'in-progress'
    )
  })

  it('uses the built-in status colors when a status has no custom color', async () => {
    setState(true, DEFAULT_WORKSPACE_STATUSES)
    const container = await renderStripe('in-review')

    expect(getStripe(container)?.className).toMatch(/\bbg-\S+/)
    expect(getStripe(container)?.className).not.toContain('bg-muted-foreground')
  })

  it('hides the decorative stripe from assistive technology', async () => {
    const container = await renderStripe('todo')

    expect(getStripe(container)?.getAttribute('aria-hidden')).toBe('true')
  })
})
