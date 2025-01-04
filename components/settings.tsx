import { useContext } from "react";
import { AppStateContext } from "./providers";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import logo from '/logo.png'
import { browser } from "wxt/browser";
import { ChromeStore, GitHub } from "./icons";


export function Settings() {

  const { settings, setSettings } = useContext(AppStateContext)

  return <div className="flex justify-between px-4 py-2">
    <div>
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


    <div className="h-[320px] w-[200px] flex flex-col gap-2 items-center justify-center border-l pl-8">
      <img src={logo} className="w-16 h-16" />
      <h1 className="tracking-wide font-medium text-[18px]">CleanTabs</h1>
      <p className="text-xs">Version {browser.runtime.getManifest().version}</p>
      <div className="mt-1 flex gap-2">
        <a
          href="https://github.com/heyppen/CleanTabs"
          title="https://github.com/heyppen/CleanTabs"
          target="_blank"
          className="flex items-center"
        >
          <GitHub className="inline-block w-5 h-5" />
        </a>
        <a
          href="https://chromewebstore.google.com/detail/cleantabs/dhafadjcaeeklhlbbfeomgdgpkafdmig"
          title="Chrome Web Store Link"
          target="_blank"
        >
          <ChromeStore className="w-6 h-6" />
        </a>
      </div>
      <div className="h-4"></div>
    </div>
  </div>
}
