import { useContext } from "react";
import { AppStateContext } from "./providers";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";


export function Settings() {

  const { settings, setSettings } = useContext(AppStateContext)

  return <div className="px-4 py-2">
    <h1 className="font-semibold text-base mb-4">Settings</h1>

    <div className="px-1 flex flex-col gap-4">

      <div className="flex items-center gap-2">
        <Switch
          id="ClosePinTab"
          className="w-8 h-4"
          checked={settings.ClosePinTab}
          onCheckedChange={(checked) => {
            setSettings(
              {
                ...settings,
                ClosePinTab: checked,
              },
              { toStorage: true }
            )
          }}
        />
        <Label htmlFor="ClosePinTab">Pinned tabs can be closed</Label>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          id="CloseTabInGroup"
          className="w-8 h-4"
          checked={settings.CloseTabInGroup}
          onCheckedChange={(checked) => {
            setSettings(
              {
                ...settings,
                CloseTabInGroup: checked,
              },
              { toStorage: true }
            )
          }}
        />
        <Label htmlFor="CloseTabInGroup">Tabs in group can be closed</Label>
      </div>
    </div>
  </div>
}
