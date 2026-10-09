import React from 'react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store'
import type { Worktree } from '../../../../shared/worktree/types'
import { getWorkspaceStatus, getWorkspaceStatusVisualMeta } from './workspace-status'

export function WorktreeCardWorkspaceStatusStripe({
  worktree,
  children
}: {
  worktree: Pick<Worktree, 'workspaceStatus'>
  children: React.ReactNode
}): React.JSX.Element {
  const enabled = useAppStore((s) => s.settings?.showWorkspaceStatusOnCards === true)
  const workspaceStatuses = useAppStore((s) => s.workspaceStatuses)

  if (!enabled) {
    return <>{children}</>
  }

  const statusId = getWorkspaceStatus(worktree, workspaceStatuses)
  const status = workspaceStatuses.find((candidate) => candidate.id === statusId) ?? statusId

  return (
    // Why: card insets shrink to 2px in some layouts, so the stripe reserves its own gutter.
    <div className="relative pl-2.5">
      <div
        aria-hidden="true"
        data-worktree-workspace-status-stripe={statusId}
        className={cn(
          'pointer-events-none absolute inset-y-0.5 left-0 w-0.75 rounded-full',
          getWorkspaceStatusVisualMeta(status).swatch
        )}
      />
      {children}
    </div>
  )
}
