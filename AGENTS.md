# AGENTS.md

## Project scope and sources of truth
- Bubble Tiles is a browser-based mathematical tiling application implemented as static HTML, CSS, and JavaScript.
- The current local working tree is the authoritative implementation for in-progress work. Do not assume the GitHub version is newer than the local files.
- Before substantial feature, interface, release, or architectural work, read [docs/BUBBLE_TILES_DEVELOPMENT_CONTEXT.md](docs/BUBBLE_TILES_DEVELOPMENT_CONTEXT.md).
- Inspect relevant source files before editing them.

## Git and release safety
- Never commit, push, pull, merge, publish, deploy, create a release, change branches, or alter repository settings unless the user explicitly asks.
- Never discard or overwrite existing uncommitted changes.
- Before editing, use safe read-only Git checks such as `git status --short` and `git log` to identify pre-existing changes.
- Do not mix unrelated changes into a task.
- Do not change the visible application version unless explicitly requested.
- If a release version is explicitly changed, update every verified version display and the Version History consistently, while preserving prior entries.

## Change discipline
- Make focused, minimal changes.
- Preserve existing functionality unless removal or replacement is explicitly requested.
- Do not perform broad refactors merely because another structure seems preferable.
- Preserve existing mathematical behavior, terminology, examples, controls, assets, and workflows unless the task requires a change.
- Do not add dependencies, frameworks, build systems, or external services without explicit approval.
- Do not rename or move files unless necessary and explicitly justified.
- Avoid mass formatting or line-ending changes.
- Keep relative paths and filename capitalization correct.

## User interface and documentation
- Whenever functionality, controls, terminology, or workflow changes, update the Help / Tutorial content so it remains accurate.
- Keep Help / Tutorial instructions, tooltips, labels, hover behavior, visual previews, and actual controls consistent.
- Preserve the current preview-based and tooltip-based interface conventions where applicable.
- Check nearby and related controls for regressions after a UI change.
- Maintain accessibility and keyboard behavior already present in the project.

## Testing and definition of done
- Use the verified local-preview method: open [index.html](index.html) directly in a browser.
- The repository does not include a build step or an automated test suite in the inspected files.
- After a code change, as applicable:
  1. Preview the application locally.
  2. Test the specific changed behavior.
  3. Test related controls and nearby workflows.
  4. Check the browser console for errors.
  5. Check for broken asset references or missing files.
  6. Confirm Help / Tutorial accuracy if behavior changed.
  7. Review the final diff for unintended changes.
  8. Report what was tested and any limitations.
- Do not claim a test passed unless it was actually performed.

## Communication
- Before a substantial change, briefly identify the relevant files and proposed approach.
- After editing, summarize the files changed, behavior changed, tests performed, and any unresolved issues.
- Distinguish clearly between pre-existing working-tree changes and changes made for the current task.

## Verified local-preview and deployment notes
- Local preview: opening [index.html](index.html) directly in a browser is the verified local-preview method for this repository.
- Automated checks: no package manifest, build configuration, or test runner was found in the inspected repository files.
- GitHub Pages: [README.md](README.md) states that the live app is hosted with GitHub Pages, but no checked-in workflow or CNAME file was found during inspection, so the exact deployment configuration is uncertain from repository files alone.
