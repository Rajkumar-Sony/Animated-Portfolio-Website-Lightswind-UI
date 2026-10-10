# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Project Mockup Prompt

Use this workflow when creating premium device mockups for portfolio project cards. First capture real screenshots with Playwright, then use those screenshots as the source for the device screens. Do not ask the image model to invent or redraw the website UI.

### 1. Capture Original Screenshots

Capture one desktop screenshot and one mobile screenshot from the real running project:

```bash
node - <<'NODE'
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });

  const desktop = await browser.newPage({
    viewport: { width: 1536, height: 886 },
    deviceScaleFactor: 2,
  });
  await desktop.goto('PROJECT_URL_HERE', { waitUntil: 'networkidle' });
  await desktop.screenshot({ path: '/tmp/project-desktop.png', fullPage: false });

  const mobile = await browser.newPage({
    viewport: { width: 390, height: 1040 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });
  await mobile.goto('PROJECT_URL_HERE', { waitUntil: 'networkidle' });
  await mobile.screenshot({ path: '/tmp/project-mobile.png', fullPage: false });

  await browser.close();
})();
NODE
```

### 2. Generate The Mockup

Use the generated mockup image only for the physical device scene. Use the Playwright screenshots for the actual screen content:

```text
Create a polished, high-resolution portfolio project device mockup for "[PROJECT_NAME]".

Use only two devices: one Apple-style Mac desktop monitor as the main device and one iPhone-style smartphone beside it. Keep the composition premium, clean, realistic, and suitable for a portfolio project card.

Use the provided original Playwright screenshots as the actual device screen content:
- Use the desktop screenshot on the Mac monitor.
- Use the mobile screenshot on the iPhone.

Important:
- Do not generate, redraw, or invent the website UI.
- Do not replace the UI with a generic dashboard.
- Do not add fake names, fake paragraphs, lorem ipsum, or unrelated charts.
- Preserve the real website screenshot details as much as possible.
- Integrate the screenshots naturally into the devices so they do not look pasted on top.
- Match screen perspective, crop inside the bezels, preserve rounded corners, align to device edges, and add realistic glass reflection, subtle glare, brightness falloff, color-temperature matching, and natural anti-aliasing.
- Keep the device bodies, desk lighting, shadows, and premium mockup style realistic.

The exact project name "[PROJECT_NAME]" should be clearly visible if it already appears in the screenshot. If it is not visible, add it only as a subtle project-card label outside the device screens.
```

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
