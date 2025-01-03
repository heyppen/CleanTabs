<p align="center">
  <img src="https://github.com/heyppen/CleanTabs/blob/main/public/logo.png?raw=true" alt="Logo" width="128"/>
  <br />
  <h1 align="center">CleanTabs</h1>
</p>
<p align="center">
  A browser extension that auto discard / close tabs based on rules.
</p>

# About

**CleanTabs** discards (sleep) / closes tabs, **based on rules**, **automatically in the background**.

# Installation

# How CleanTabs works?

At every minute, **CleanTabs** will iterate over all tabs of all windows: 

If 
- `tab.url` matches `<URL Pattern>`
- leaving duration exceeds `<Inactive minutes>`
- not `Disabeld`

**CleanTabs** will perform `<Action>` on this tab.

> [!NOTE]
> These tabs will not be discarded or closed:
> - focused tab in every window
> - pinned or grouped tabs if disabled in settings
> - excluded manually


# Rule

A rule includes:

- `URL Pattern`
- `Inactive minutes`
- `Action`
- `→Stash`
- `Disabled`


## URL Pattern

Examples:

- `*`: all urls
- `https://www.google.com*`: all url that starts with `https://www.google.com`
- `*://*.google.com/*`: `https://docs.google.com/`, `http://mail.google.com/mail/u/0`

## Inactive minutes

`Inactive = Now - <Last switch to this tab>`. 


## Action
- `NOP`: Does nothing. Can be used to exclude some website.
- `Discard`: Discards a tab from memory. Discarded tabs are still visible on the tab strip and are reloaded when activated. See [Chrome Doc](https://developer.chrome.com/docs/extensions/reference/api/tabs#method-discard).
- `Close`: Just close. If  `→Stash` enabled, this tab will be saved in Stash.

# Development

Check [WXT Extension FrameWork](https://wxt.dev/).

PRs or issues are welcome!
