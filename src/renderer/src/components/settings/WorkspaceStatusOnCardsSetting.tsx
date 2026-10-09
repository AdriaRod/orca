import type { GlobalSettings } from '../../../../shared/global-settings-types'
import { translate } from '@/i18n/i18n'
import { SearchableSetting } from './SearchableSetting'
import { SettingsSwitchRow } from './SettingsFormControls'
import { getShowWorkspaceStatusOnCardsEntry } from './appearance-sidebar-search'

type WorkspaceStatusOnCardsSettingProps = {
  settings: GlobalSettings
  updateSettings: (updates: Partial<GlobalSettings>) => void
}

export function WorkspaceStatusOnCardsSetting({
  settings,
  updateSettings
}: WorkspaceStatusOnCardsSettingProps): React.JSX.Element {
  const entry = getShowWorkspaceStatusOnCardsEntry()
  const enabled = settings.showWorkspaceStatusOnCards === true

  return (
    <SearchableSetting
      title={entry.title}
      description={entry.description}
      keywords={entry.keywords}
    >
      <SettingsSwitchRow
        label={translate(
          'auto.components.settings.AppearancePane.showWorkspaceStatusOnCards.title',
          'Show Workspace Status on Cards'
        )}
        description={translate(
          'auto.components.settings.AppearancePane.showWorkspaceStatusOnCards.description',
          'Add a stripe in the Workspace Board status color to each workspace card.'
        )}
        checked={enabled}
        onChange={() => updateSettings({ showWorkspaceStatusOnCards: !enabled })}
      />
    </SearchableSetting>
  )
}
