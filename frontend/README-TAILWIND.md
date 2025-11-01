Tailwind/PostCSS editor guidance
================================

This workspace uses Tailwind CSS via PostCSS. If your editor reports
"Unknown at rule @tailwind" or "'font.sans' does not exist in your theme
config", do the following:

1. Ensure the Tailwind CSS IntelliSense extension is installed.
2. Reload the editor window after opening this workspace so `.vscode/settings.json`
   is applied. The workspace settings map `*.css` to `postcss` and disable the
   built-in CSS validator to avoid false positives.
3. The project's `postcss.config.mjs` and `tailwind.config.mjs` are configured
   to expose `fontFamily.sans` as the correct theme key; use `theme('fontFamily.sans')`
   in PostCSS files.

If you still see diagnostics after this, run `npm install` and then run the
build (`npm run build`) to check for real errors — editor diagnostics can
sometimes lag until the workspace reloads.
