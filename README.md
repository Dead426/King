# Kadence Blocks Image Switching Hero

This repo contains a simple "image switching" hero effect you can use with
Kadence Blocks in WordPress.

The effect is built from:

- `kadence-hero-switching.css` (layout + slide styles)
- `kadence-hero-switching.js` (automatic image switching)

## What this gives you

- Multiple hero images stacked in one spot
- Automatic switching every few seconds
- Smooth right-to-left slide transition
- Optional manual dots
- Supports multiple hero sections on the same page

## 1) Build the hero in Kadence Blocks

In the block editor:

1. Add a **Row Layout** block for your hero section.
2. In the Row Layout "Advanced" settings, add this class:
   - `kb-hero-switch`
3. Add your hero text (heading/subheading/button) as normal.
4. Add a container for the switching images (for example a Group block),
   then set class:
   - `kb-switch-media`
5. In that image container, add 2 or more **Image** blocks.
6. Give each image block this class:
   - `kb-switch-image`

Optional:

- Add another empty block (for example a Group block) where you want the dots,
  and give it class:
  - `kb-switch-dots`

## 2) Add the CSS

Copy contents of `kadence-hero-switching.css` into:

- **Appearance > Customize > Additional CSS**, or
- Your child theme stylesheet.

## 3) Add the JS

Copy contents of `kadence-hero-switching.js` into:

- A header/footer code plugin (site-wide), or
- Your child theme JS bundle.

Make sure the script loads on pages where the hero exists.

## 4) Tuning options

In `kadence-hero-switching.js`, you can adjust:

- `intervalMs` (default 3200) for switch speed
- `slideMs` (default 800) for transition speed

In `kadence-hero-switching.css`, you can adjust:

- hero min-height
- image max-width
- dot size/colors

## Notes

- If only one image is present, switching is disabled automatically.
- Users with reduced-motion preference get no auto animation.
