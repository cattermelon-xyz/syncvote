# How it works?

There are 2 folders:

- chrome-extension
- react-chrome-app

Code will written in `react-chrome-app` and bundled in to `chrome-extension\content.js`

To build, run `yarn pack-extension`

To test, please open Chrome, go to `chrome://extensions/` and press 'Load unpacked' then choose the `chrome-extension` directory.
