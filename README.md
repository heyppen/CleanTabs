<p align="center">
  <img src="https://github.com/heyppen/CleanTabs/blob/main/public/logo.png?raw=true" alt="Logo" width="128"/>
  <br />
  <h1 align="center">CleanTabs</h1>
</p>
<div align="center">
  <p>A browser extension that auto discard / close tabs based on rules.</p>
  <a href="https://chromewebstore.google.com/detail/cleantabs/dhafadjcaeeklhlbbfeomgdgpkafdmig" target="_blank"><img alt="Chrome Web Store Version" src="https://img.shields.io/chrome-web-store/v/dhafadjcaeeklhlbbfeomgdgpkafdmig?color=green"></a>
</div>

# CleanTabs

*CleanTabs* discards (sleep) / closes tabs, **based on rules**, **automatically in the background**.

# Installation

<a href="https://chromewebstore.google.com/detail/cleantabs/dhafadjcaeeklhlbbfeomgdgpkafdmig" target="_blank"><img src="https://github.com/heyppen/CleanTabs/blob/main/doc/chrome-web-store-badge.png?raw=true" alt="Chrome Web Store Badge" height="60px"/></a>

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
> - tabs excluded manually


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

# Recommended rules

> [!TIP]
> Copy these rules to `Rules` -> `Code mode`

## Gentle mode

Discards or close the websites listed in the rules only, the others will not be touched.
```
*://www.google.com/*, 5, discard
*://stackoverflow.com/*, 10, close, true
chrome://newtab/, 1, close
about:blank, 1, close
```

## Aggressive mode

By default, CleanTabs will discard / close any websites, except those marked as `NOP`.
```
*://mail.google.com/*, 1, nop
*://www.youtube.com/*, 1, nop
*, 15, discard, true
```

# Development

Check [WXT Extension FrameWork](https://wxt.dev/). PRs or issues are welcome!
