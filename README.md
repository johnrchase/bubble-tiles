# Bubble Tiles

An interactive browser app for exploring bubble tiles, puzzle tiles, periodic tilings, and related mathematical patterns.

## Open Bubble Tiles

**[Launch the live app](https://johnrchase.github.io/bubble-tiles/)**

Bubble Tiles runs directly in a modern web browser. A desktop or laptop provides the best experience; no installation is required.

Created by John Chase.

## What's new in version 1.9

- Added a warning before closing, reloading, or navigating away when the current editable layout has unsaved changes
- Added concise mathematical names in the status bar when one recognized tile is selected, including H, P, R, S, and T family prefixes
- Kept the visible tile color unchanged when Reverse One Arc generates a new arc variant
- Reorganized the About dialog and added related research, puzzle, and iOS beta resources
- Updated Paper Figures 3 and 26 and the Hexagonal, Triangular, Square, Soft Tile, and Rhombic Add All reference arrangements from revised source layouts
- Substantially expanded the directly linkable Paper Figures gallery with additional layouts from the working paper
- Increased lattice overscan so ordinary zooming and panning is less likely to expose narrow gaps at viewport edges
- Copy retains editable tiles while also placing a transparent PNG on the system clipboard; Ctrl/Cmd+V prioritizes newer clipboard content copied from other apps
- One or more selected H3A/H3A* tiles can toggle scalable connected-arrow decorations from the right-click menu
- Tiles can use vivid rainbow orientation coloring from the Fill controls, with clearly distinct hues at 60-degree turns

## What's new in version 1.8.1

- Added a preview-free Paper Figures gallery with short slug-based direct links available from each figure's right-click menu
- Expanded and relabeled the Rhombic family, including corrected colors and the 1*, 2A*, and 3* chiral partners
- Corrected H/V reflection so Hexagonal and Rhombic chiral pairs—including edge-preserving Arc-Dual results—switch identity and default color while preserving the reflected geometry

## What's new in version 1.8

- Improved periodic lattice coverage in normal loaded and panned views
- Kept Bubble Style, Fill, Outline, Vertices, and Decompose popovers within narrow browser windows
- Added optional per-tile vertex points with adjustable color and size, plus integral decomposition marks at unit intervals along whole-number edge lengths
- Added a Decompose tool for splitting compatible hexagonal, trapezoidal, rhombic, and Soft Tiles into styled, grouped subtiles while preserving outer arcs
- Refined the Outline button icon and dropdown spacing
- Made new canvas backgrounds pure white by default while preserving saved custom colors
- Added a 4:1 picture-export proportion and an About link to the feedback survey
- Added Hex Pac-Man/triangle and trapezoidal Spike-style periodic examples

## What's new in version 1.7

- Corrected H3B/H3C identities and colors across the Hexagonal and puzzle-style families while preserving the established Soft Tile labels and geometry
- Added hover guidance to tile-family headings and the Tiles and Examples tabs
- Organized the Examples gallery into collapsible thematic sections
- Added Small Frame, six-point star puzzle, SF0/SF3A Soft Tile, and mixed Soft/Rhombic/Triangular periodic tilings
- Improved complex lattice fills so complete motifs near the source tiles and viewport center render before distant copies

## Version 1.6.1 patch

- Tiling Fill now edits an existing lattice when the same complete source-tile set is selected, preventing duplicate lattices for one source set
- Restored reliable donut previews and picture exports and added the Bubble Bubble Tiles example
- Custom Image Fill supports mouse-wheel resizing; the Small frame explains its periodic use; frames accept solid colors but not decorative fills
- Soft Tiles contribute to the live totals as an H0 tile with attached T3 tiles: two bites per point and one bump per non-point

## What's new in version 1.6

- A live status-bar count of all bites and bumps on the canvas
- Editable A and B lattice-vector endpoints for adjusting an existing Tiling Fill
- Custom image fills with upload, clipboard paste, drag-and-drop, anonymous paginated Openverse search with supported media-type filters, positioning, zoom/cropping, attribution, and export support
- Initially horizontal text clipped inside a selected tile with adjustable font, size, color, bold, and italic styling
- Corrected canvas outlines that scale with the view and use clean rounded joins and caps
- A new cloud-image example combining dodecagonal, hexagonal, and square bubble tiles
- A more visual Explore tutorial with staged workspaces, pulsing guidance, task celebrations, and a fading periodic-tiling introduction

## Version 1.5 highlights

- An expanded hands-on Explore tutorial for finite and infinite tilings
- Default drag-box selection and transformable pasted images
- Subdivision-aware snapping and faster, layer-preserving Tiling Fill
- Lattice-aware picture export with adjustable lattice opacity
- Group and multi-tile support for Format Painter
- Refined shared borders and corrected frame geometry
- Marked Penrose Kite and Dart tiles, new unit-edged polygons, and more examples
- Recent JSON reopening and double-click access to Reverse One Arc

## Features

- Bubble, puzzle, soft, polygonal, frame, and Einstein-family tiles
- Snapping, grouping, reflection, rotation, and uniform scaling
- Arc Dual, Reverse One Arc, polygon conversion, compatible tile decomposition, and multiple Bubble Styles
- Tiling Fill tools for testing periodic extensions
- Fill patterns, custom image fills, image textures, outlines, and Format Painter
- Guided tours for finite and infinite tiling investigations
- Built-in examples and mathematical challenges
- Browser save/load, editable JSON layouts, picture export, and share links

## Run locally

Clone or download the repository, then open `index.html` directly in a modern browser. This static app has no dependency installation or build step.

## Repository

Source code: [github.com/johnrchase/bubble-tiles](https://github.com/johnrchase/bubble-tiles)

Public app: [johnrchase.github.io/bubble-tiles](https://johnrchase.github.io/bubble-tiles/)
