# Bubble Tiles development context

## 1. Project overview
Bubble Tiles is a browser-based interactive application for exploring bubble tiles, puzzle-edge tiles, lattice fills, and related tiling patterns. The repository presents it as an experimental companion for geometry work, including building patches, snapping compatible edges, grouping supertiles, styling tiles, and exporting or sharing layouts.

Public app: https://johnrchase.github.io/bubble-tiles/

The repository’s own documentation describes the app as intended for researchers, teachers, students, or makers working with bubble-tile geometry. The mathematical purpose is therefore primarily exploratory and educational rather than a general-purpose drawing application.

## 2. Current development status
- The local working tree is the authoritative v1.6 release candidate.
- GitHub currently reflects the public v1.5 release at the repository remote.
- The local v1.6 work should not be committed, pushed, published, or deployed unless the user explicitly asks.
- The visible version label and release documentation in the current files are v1.6; committing or publishing still requires the user's explicit approval.
- Version 1.6 includes a live bite/bump counter; editable lattice vectors; single-tile custom image fills with upload, clipboard paste, drag-and-drop, anonymous paginated Openverse search and supported media-type filtering; clipped tile text with adjustable font, size, color, bold, and italic styling; corrected view-scaling canvas borders with rounded joins and caps; and an image-filled cloud tiling example. Custom Image and Add Text are available from both the Style toolbar and Style dropdown. New text is screen-horizontal when applied and follows subsequent tile transforms. Image and text styling persist through JSON, duplication, lattice rendering, sharing, and picture export.

## 3. Repository map
### Top-level files
- [index.html](../index.html): the main HTML entry point. It contains the toolbar/menu system, tile tray, SVG canvas structure, modal dialogs for About, Help, Version History, and export, and the guided tutorial panel.
- [app.js](../app.js): the main application logic. It defines tile geometry, renders SVG content, handles interactions, selection, snapping, lattice fills, styling, help/tutorial dialogs, import/export/share behavior, and local UI state.
- [styles.css](../styles.css): the stylesheet for the UI, modals, toolbars, popovers, preview swatches, and tile rendering details.
- [README.md](../README.md): short project overview and a note that the live app is hosted with GitHub Pages.

### Important directories
- [assets](../assets): image and icon assets used for the app UI, fill/textures, and bubble-style previews.
- [examples](../examples): saved example layout JSON files that can be loaded into the app.
- [tools](../tools): small JavaScript utilities for checking specific geometry profiles and related development helpers.
- [docs](./): this development context file and related repository documentation.

### Entry point and application flow
The application is a single-page browser experience. The entry point is [index.html](../index.html), which loads [styles.css](../styles.css) and [app.js](../app.js). The JavaScript code initializes the UI and then manages the canvas, tile objects, and dialogs directly in the browser.

### Asset organization
Assets are organized under [assets](../assets) and include:
- bubble-style and tool icons under [assets/bubble-icons](../assets/bubble-icons)
- food and texture images for fill patterns under [assets](../assets)
- logo images and favicon assets under [assets](../assets)

### Data and configuration files
- [examples](../examples) contains JSON example layouts.
- The app also uses browser-local storage for some UI state and layout persistence, as implemented in [app.js](../app.js).
- No build manifest or dependency file was found in the inspected repository files.

## 4. Runtime and local development
### Static vs build process
The inspected repository appears to be a static website. There is no build configuration, package manifest, or bundler setup in the repository files inspected.

### Verified local-preview procedure
The verified local-preview method is to open [index.html](../index.html) directly in a browser from the repository root. This is consistent with the static-file structure and the absence of a build step.

### Dependencies
No dependency installation step was found in the inspected repository files. The app relies on browser support for standard HTML, CSS, and JavaScript.

### Browser or runtime limitations
No explicit browser requirements were established in the repository files inspected. The app uses SVG and standard DOM APIs, so a modern browser is assumed.

## 5. Architecture
### Major application components
- The HTML provides the shell and the visible UI structure.
- The CSS provides the visual system, including toolbars, menus, dialogs, preview swatches, and the visual treatment of selected/overlapping tiles.
- The JavaScript provides the full runtime and rendering engine.

### State management and persistence
The app maintains tile state, current selection, viewport state, fill/stroke settings, and history in JavaScript variables within [app.js](../app.js). It also uses browser storage keys for some persisted UI/layout behavior. Export and import are implemented through JSON and share-link flows. Pasted canvas images are stored as embedded image data in layout state, so image-containing JSON files, browser saves, and share links can be substantially larger. Copy Share Link therefore requires explicit confirmation when pasted images are present and recommends JSON export as the more reliable transfer method.

### Rendering approach
The app renders geometries as SVG elements. The tile definitions include geometric vertices and SVG path data. Pasted bitmap images are represented as bounded SVG image objects so they can share selection, grouping, layering, and transform workflows while remaining excluded from snapping and Bubble operations. The code draws tiles, lattice copies, selection overlays, snap previews, and export previews in SVG layers.

### Event handling
The app relies on DOM event handling for pointer interactions, keyboard shortcuts, menu interactions, modal dialogs, and toolbar actions. The main script wires listeners for selection, dragging, transformations, export, and style UI actions. Ctrl/Cmd+V directly uses the app's internal tile clipboard when it contains a copied selection; with no internal tile selection waiting, the browser paste event remains available for pasted images.

### Import/export/save/load behavior
The repository implements JSON export/import, browser-local save/load, share-link generation, and picture export. The File menu also caches and lists up to five recently imported or drag-dropped JSON layouts for reopening during the current browser session; it does not retain local file access across sessions. These flows are present in the HTML and JavaScript UI and are described in the Help dialog.

### Mathematical and geometric systems
The app is built around bubble-tile geometry, polygon-to-bubble conversions, lattice fills, snapping, overlap detection, edge-decoration profiles, and transformations such as rotation and reflection. The geometry logic is implemented directly in [app.js](../app.js), including specific tile families and profile functions. In addition to equal-length edge matching, snapping recognizes compatible whole-number edge subdivisions: a shorter edge can occupy each exact subdivision of a longer edge whose effective scaled length is an integer multiple, regardless of which tile is being dragged. The Other tray includes exact golden-ratio Penrose Kite and Dart definitions with circular P2 matching-rule arcs. Their long edges use the app's standard unit length and their short edges measure 1/φ, making the long edges compatible with the Penrose rhombs. Both lengths snap to like-length edges; the colored arcs remain a visual matching rule rather than restricting geometrically valid snaps. The green circles and dart's red circle have radius 1/(2φ), while the kite's red circle has radius 1-1/(2φ). Those radii make the red and green circles tangent within each tile and make the kite/dart red arcs meet across a correctly matched unit edge. The Other tray also includes filled regular 5/2, 6/2, and 8/2 stellation outlines scaled so every boundary segment is one unit, a 45-45-90 triangle with sides 1, 1, and √2, the corresponding tangram parallelogram made from two such triangles, and a unit-edged 45-degree rhombus. The regular n-gon feature uses an in-app validated 3-to-120-side chooser instead of the browser's unreliable prompt dialog. These tiles are excluded from Bubble operations. Custom scale input uses a restricted arithmetic parser rather than JavaScript evaluation and reports invalid expressions through native field validation. The Examples tray uses full-width clickable rows with a lazy-rendered square preview and title; descriptions remain hover tooltips. Loading an example leaves the canvas with no tiles selected. Finite-layout thumbnails render the complete saved arrangement, while lattice thumbnails naturally show the saved seed/prototile motif without virtual copies. Thumbnail strokes use a separate thin preview width. Lattice rendering is capped at 2,500 visible ghost tiles to prevent detailed fills from overwhelming the browser. Curved shared-border profiles are measured once per distinct local SVG path and cached; lattice copies transform those cached samples mathematically instead of forcing repeated browser geometry measurements. Picture-export previews and generated SVG/raster exports include visible copies from active lattice fills and apply the selected lattice-copy opacity to each complete ghost tile. The five-entry Recent JSON Files session list includes both imported and exported layouts.

## 6. Important user-interface systems
### Main tools and controls
The UI includes menus for File, View, Edit, Transform, Bubble, Lattice, Style, and About. The toolbar and menu structure are defined in [index.html](../index.html) and bound to behavior in [app.js](../app.js).

The lower-right status bar reports global bite and bump totals for placed canvas tiles whose definitions contain bubble or puzzle-edge directions. Polygonal tiles, frames, pasted images, and virtual lattice copies do not contribute. The count follows changes such as adding, deleting, loading, Arc Dual, and Reverse One Arc.

Existing lattice fills can be adjusted with Edit Lattice. The tool exposes draggable A and B vector endpoints at the source motif's center, updates valid repeat vectors and virtual copies while dragging, commits both changes when the tool is closed, and restores the entry-state vectors when canceled with Escape. If multiple fills exist, selecting one of a fill's source tiles identifies the fill to edit.

### Fill styles
Fill styles are selected from a set of pattern options and include solid fills, dotted/crosshatched/striped patterns, and image-based fills such as cookie, Oreo, donut, clouds, marble, and wood. The current interface exposes previews for these options.

### Border styles
The app supports stroke color, stroke style (solid, dashed, dotted, or none), and stroke width. These are exposed through the Style UI and preview grids. Live canvas and lattice strokes scale with the SVG view and tile transforms; tray thumbnails retain their separate compact non-scaling strokes. Rounded joins and per-edge caps avoid miter spikes at curved vertices. Shared-border suppression compares sampled transformed edge profiles, not just common endpoints, so distinct inward/outward curves that enclose a lens retain both outlines.

### Visual previews
Preview-based UI is a major part of the design. The app includes preview grids for fill patterns, stroke styles, and edge decorations, using CSS-based previews and some image-based previews from [assets](../assets).

### Tooltips and hover interactions
Buttons and controls use title attributes for tooltips. Some UI elements also update dynamic titles in the JavaScript layer, especially around style-popover availability and tool behavior.

### Help / Tutorial
The repository contains a Help modal and a guided tutorial panel. The content is embedded directly in [index.html](../index.html), with the tutorial logic implemented in [app.js](../app.js). Guided Tutorial offers a Quick Tool Tour and an event-driven Explore Bubble Tiles course. The exploration opens with a complete R3/H2B periodic tiling whose virtual copies fade back to reveal its source motif, then begins a finite frame-filling investigation. It later loads a prepared two-triangle workspace for Tiling Fill and its opacity/locate/clear controls, resets the canvas to one centered, selected H2A tile for Arc Dual, and listens for actual Reverse One Arc and sequential polygon-to-bubble challenge actions. Tutorial targets use pulsing yellow highlights; multi-action steps advance the highlight to the next required control and stop highlighting completed controls. Each task step launches one pointer-transparent, self-removing full-screen confetti burst when its state first changes from incomplete to complete, while preserving the green completion message; reduced-motion preferences suppress both pulse and confetti animation. It snapshots the current canvas before opening a fresh tutorial workspace and offers to keep the tutorial result or restore the prior canvas on exit. The app also uses local storage to remember whether the guided tutorial has been seen.

### Version label and Version History
The visible application version is v1.6 in the current files, and Version History is shown in the modal content in [index.html](../index.html). The version display and historical entries are part of the user-facing UI and should be kept consistent when release-version changes are requested.

### Keyboard and pointer behavior
The Help content and UI indicate support for default blank-canvas drag box selection, Space-drag or Ctrl/Cmd-drag panning, wheel zooming, keyboard shortcuts, nudge operations, and double-click activation of Reverse One Arc on eligible bubble tiles. These behaviors are implemented in the main JavaScript logic.

## 7. Established project decisions supplied by the project owner
The following project decisions are reflected in the repository and should be honored by future work:
- Help / Tutorial content must be updated whenever functionality or workflow changes.
- Tooltips and visual previews are preferred over redundant text-only dropdown lists where the current interface follows that design.
- Existing functionality should be preserved unless a change is specifically requested.
- Version numbers should not be advanced casually.
- A version release should update both the visible version label and the Version History.
- Git operations and publication require explicit user approval.

## 8. Deployment
The repository is configured for GitHub Pages from the GitHub repository settings:
- Source: Deploy from a branch
- Branch: main
- Publishing folder: / (root)
- Public URL: https://johnrchase.github.io/bubble-tiles/
- No custom domain is configured

Because the site is published from the repository root on the main branch, pushing a commit to main will automatically trigger GitHub Pages deployment for the current repository root contents. Agents must not push to main unless the user explicitly approves publishing the current working version.

## 9. Testing checklist
Use this checklist for practical verification in this repository:
1. Open [index.html](../index.html) in a browser and confirm the main UI appears.
2. Test a basic workflow such as adding a tile, selecting it, and moving it.
3. Test related controls near the change, such as transform tools, style pickers, and lattice tools if applicable.
4. Check the browser console for errors.
5. Verify that referenced assets under [assets](../assets) are present and load correctly.
6. If Help / Tutorial content changed, verify that the modal text still matches the actual controls and behavior.
7. If a version label or release-related change is made, verify both the visible label and the Version History content consistently.
8. Review the final diff for unintended or unrelated modifications.

## 10. Current concerns and technical debt
### Definite observations
- The main application logic is concentrated in [app.js](../app.js), which is very large and carries most of the application behavior.
- Help/Version History content is embedded directly in [index.html](../index.html), which is workable but less data-driven than a separate content structure.
- No automated build or test workflow was found in the inspected repository files.

### Possible maintainability concerns
- The interface includes many repeated UI patterns and a large amount of inline behavior in the JavaScript, which may make future maintenance more involved.
- The project relies heavily on manual verification through browser interaction rather than an automated test suite.

## 11. Guidance for future sessions
- The source code in the current local working tree is authoritative for current behavior.
- This context document may become stale and should be updated when architecture, workflow, release status, or deployment configuration materially changes.
- Future agents should verify claims against current files before acting.
