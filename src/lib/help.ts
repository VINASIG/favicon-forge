import { MAX_FILE_SIZE, MAX_IMAGE_PIXELS, OUTPUT_SIZES } from './generator.ts';

export const description =
  'Create ICO and PNG favicons from PNG, JPG, WebP or SVG logos. Download browser and app icons locally, with no uploads or account.';

export const faviconQuestions = [
  {
    id: 'supported-images',
    question: 'Which images can I use?',
    answer: `Choose a PNG, JPG, WebP or SVG file up to ${String(MAX_FILE_SIZE / (1024 * 1024))} MB and ${String(MAX_IMAGE_PIXELS / 1_000_000)} million decoded pixels. A square image of at least 512 by 512 pixels is recommended. SVG input is rasterized into ICO and PNG output. Simple shapes are easier to recognize at small sizes.`,
    reference: null,
  },
  {
    id: 'package-files',
    question: 'What is in the downloaded package?',
    answer: `The ZIP includes favicon.ico with ${OUTPUT_SIZES.slice(0, 3).join(', ')} pixel images, 16 and 32 pixel PNG browser icons, a 180 pixel Apple touch icon, 192 and 512 pixel app icons, and a separate 512 pixel maskable icon. It also contains site.webmanifest, favicon-snippet.html and README.txt setup instructions.`,
    reference: null,
  },
  {
    id: 'local-processing',
    question: 'Is my logo uploaded to a server?',
    answer:
      'No. Image decoding, resizing and ZIP generation run in your browser. Favicon Forge does not upload your logo or require an account. Creating and downloading the package is free.',
    reference: null,
  },
  {
    id: 'maskable-icon',
    question: 'What is the maskable icon for?',
    answer:
      'Maskable app icons allow a launcher to crop an icon into different shapes. Favicon Forge puts your logo inside a centered safe circle on an opaque white background for this separate icon. The manifest marks it as maskable. Ordinary PNG icons retain transparency when the source logo has it.',
    reference: {
      label: 'MDN guide to maskable app icons',
      href: 'https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/How_to/Define_app_icons#support_masking',
    },
  },
  {
    id: 'favicon-cache',
    question: 'Why is my new favicon not showing?',
    answer:
      'Check that the icon URLs in your page and manifest return the image files, and adjust relative paths for nested pages. Refresh the page and check the browser cache. Google Search needs to recrawl changes and uses one favicon per hostname, so a subdirectory does not get a separate search favicon. Appearance in search results is not guaranteed.',
    reference: {
      label: 'Google Search favicon guidance',
      href: 'https://developers.google.com/search/docs/appearance/favicon-in-search',
    },
  },
] as const;
