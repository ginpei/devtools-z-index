# DevTools z-index

[![Build Status](https://travis-ci.org/ginpei/devtools-z-index.svg?branch=master)](https://travis-ci.org/ginpei/devtools-z-index) [![Greenkeeper badge](https://badges.greenkeeper.io/ginpei/devtools-z-index.svg)](https://greenkeeper.io/)

→ [日本語の紹介記事](https://ginpen.com/2018/06/20/devtools-z-index/)

**Stop `z-index: 999999` !!**

This adds "z-index" sub-pane of Elements panel for Chrome, "z-index" panel for Firefox.

### Install

[![Download from Chrome Web Store](doc/ChromeWebStore_BadgeWBorder_v2_206x58.png)](https://chrome.google.com/webstore/detail/bcnpmhefiohkpmjacfoanhbjhikegmoe/)
[![Download Firefox add-ons](doc/AMO-button_1.png)](https://addons.mozilla.org/en-US/firefox/addon/devtools-z-index/)

## What for?

You may be shocked by finding how large numbers are used in your page. Unconsidered large numbers would be killed by another larger numbers, and those larger numbers also killed by much-larger numbers like war. That sucks.

This extension offers a table that helps reduce those numbers. You can keep your CSS code clean, maintainable and peaceful.

**No more `z-index: 2147483647` !!**

## Chrome extension

https://chrome.google.com/webstore/detail/bcnpmhefiohkpmjacfoanhbjhikegmoe/

![z-index pane in Elements panel, where you can find all elements with z-index](doc/screenshot.png)

![Click a selector to inspect the element in Elements panel](doc/video-500x337.gif)

## Firefox add-on

https://addons.mozilla.org/en-US/firefox/addon/devtools-z-index/

![z-index panel where you can find all elements with z-index](doc/screenshot-firefox-500.png)

Since Firefox doesn't allow us to add nice Inspector (Elements) panel's pane, I added it as a panel.

## Code snippet

Basic idea was in [Twitter](https://twitter.com/ginpei_jp/status/1006312787813908480) and Gist.

https://gist.github.com/ginpei/073ab5d4679356f29585a9ae02277012

```js
((document, limit) => {
  const data = Array.from(document.querySelectorAll('*'))
    .map((el) => ({zIndex: Number(getComputedStyle(el).zIndex), element: el }))
    .filter(({ zIndex }) => !isNaN(zIndex))
    .sort((r1, r2) => r2.zIndex - r1.zIndex)
    .slice(0, limit);
  console.table(data);
})(document, 50);
```

## Future feature

Honestly, I'm not planning to update since I felt satisfied tough, it would be fun to add following features.

- Fix: it finds a wrong element when some elements have the same selector (because it searches only by selector)
- Show useful information like stacking context
- Show something if an element's z-index is specified by style attribute
- Ability to update z-index for preview, like DevTools Style sub-pane
- Set better icon somehow

## Dev

### Development for Chrome

1. Open Extensions page
   - `chrome://extensions/`
2. Turn on "Developer mode" switch at the top right
3. Press "Load unpacked" button
4. Select `extension/` directory on this project
5. You'll see your extension card on the page
6. Close and open your DevTools to load
7. To reload your updates:
   1. Modify code and resources
   2. Press a reload button on your extension card
8. If your extension throws errors:
   1. You'll see a Error button on your extension card

### Development for Firefox

- [Temporary installation in Firefox | Firefox Extension Workshop](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/)

1. Open Firefox debug page: [`about:debugging#/runtime/this-firefox`](about:debugging#/runtime/this-firefox)
2. Click "Load Temporary Add-on" button under "Temporary Extensions"
3. Select the `manifest.json`
4. It should be loaded

### Publish for Chrome

1. Prepare a zip file to upload
   1. Make sure `zip` is installed
      1. `apt install zip` for WSL
   2. Run `npm run build`
   3. You will get a file `extension.zip` in the project root directory
2. Come to [Chrome Web Store - Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
3. Select your extension
4. Left side panel &gt; Build &gt; Package
5. Press "Upload new package" button at top right
6. Upload the `extension.zip`
7. You'll be navigated to the "Store listing" page
8.  In need, update fields there and press "Save draft"
9.  Press "Submit for review", and proceed the steps

### Publish for Chrome

1. Make sure `zip` is installed
2. Come to [Add-on Developer Hub &lt; Manage My Submissions](https://addons.mozilla.org/en-CA/developers/addons)
3. Select your extension
4. Press "Upload New Version" link button on left side, and proceed the steps
5. Upload the `extension.zip`
6. Continue submission steps

## License

- MIT

## Contact

- Ginpei Takanashi
- Twitter [@ginpei_en](http://twitter.com/ginpei_en)
- GitHub [@ginpei](https://github.com/ginpei/) / [devtools-z-index](https://github.com/ginpei/devtools-z-index)
- [Ginpei.info](https://ginpei.info/)
