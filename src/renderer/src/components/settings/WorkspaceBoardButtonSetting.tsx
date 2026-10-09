import type { GlobalSettings } from '../../../../shared/global-settings-types'
import { translate } from '@/i18n/i18n'
import { SearchableSetting } from './SearchableSetting'
import { SettingsSwitchRow } from './SettingsFormControls'
import { getShowWorkspaceBoardButtonEntry } from './appearance-sidebar-search'

type WorkspaceBoardButtonSettingProps = {
  settings: GlobalSettings
  updateSettings: (updates: Partial<GlobalSettings>) => void
}

export function WorkspaceBoardButtonSetting({
  settings,
  updateSettings
}: WorkspaceBoardButtonSettingProps): React.JSX.Element {
  const entry = getShowWorkspaceBoardButtonEntry()
  const enabled = settings.showWorkspaceBoardButton === true

  return (
    <SearchableSetting
      title={entry.title}
      description={entry.description}
      keywords={entry.keywords}
    >
      <SettingsSwitchRow
        label={translate(
          'auto.components.settings.AppearancePane.showWorkspaceBoardButton.title',
          'Show Workspace Board Button'
        )}
        description={translate(
          'auto.components.settings.AppearancePane.showWorkspaceBoardButton.description',
          'Show the Workspace Board shortcut in the sidebar. It remains available from the bottom toolbar.'
        )}
        checked={enabled}
        onChange={() => updateSettings({ showWorkspaceBoardButton: !enabled })}
      />
    </SearchableSetting>
  )
}
