window.addEventListener("DOMContentLoaded", () => {
  const SVG_NS = "http://www.w3.org/2000/svg";
  const STORAGE_KEY = "bubbleTilesPrototypeLayoutV1";
  const MAX_HISTORY = 100;
  const SNAP_DISTANCE = 34;
  const SIDE_LENGTH = 80;

  const svg = document.getElementById("canvas");
  const tilesLayer = document.getElementById("tilesLayer");
  const latticeLayer = document.getElementById("latticeLayer");
  const latticePreview = document.getElementById("latticePreview");
  const snapPreview = document.getElementById("snapPreview");
  const selectionBox = document.getElementById("selectionBox");
  const rotationHandle = document.getElementById("rotationHandle");
  const rotationHandleLine = document.getElementById("rotationHandleLine");
  const rotationHandleCircle = document.getElementById("rotationHandleCircle");
  const status = document.getElementById("status");
  const latticeHint = document.getElementById("latticeHint");
  const snapToggle = document.getElementById("snapToggle");
  const overlapToggle = document.getElementById("overlapToggle");
  const importJsonFile = document.getElementById("importJsonFile");
  const appShell = document.getElementById("appShell");
  const fileMenu = document.getElementById("fileMenu");
  const tileTray = document.getElementById("tileTray");
  const toggleTrayButton = document.getElementById("toggleTray");
  const trayContent = document.querySelector(".tray-content");
  const collapsedTrayIcons = document.getElementById("collapsedTrayIcons");
  const trayDragGhost = document.getElementById("trayDragGhost");
  const contextMenu = document.getElementById("contextMenu");
  const aboutButton = document.getElementById("aboutButton");
  const aboutModal = document.getElementById("aboutModal");
  const closeAboutButton = document.getElementById("closeAbout");
  const helpButton = document.getElementById("helpButton");
  const helpModal = document.getElementById("helpModal");
  const closeHelpButton = document.getElementById("closeHelp");
  const versionHistoryButton = document.getElementById("versionHistoryButton");
  const versionHistoryModal = document.getElementById("versionHistoryModal");
  const closeVersionHistoryButton = document.getElementById("closeVersionHistory");
  const guidedTutorialButton = document.getElementById("guidedTutorialButton");
  const guidedTutorialPanel = document.getElementById("guidedTutorialPanel");
  const guidedTutorialTitle = document.getElementById("guidedTutorialTitle");
  const guidedTutorialText = document.getElementById("guidedTutorialText");
  const guidedTutorialProgress = document.getElementById("guidedTutorialProgress");
  const guidedBackButton = document.getElementById("guidedBack");
  const guidedNextButton = document.getElementById("guidedNext");
  const guidedDoneButton = document.getElementById("guidedDone");
  const exportPictureModal = document.getElementById("exportPictureModal");
  const closeExportPictureButton = document.getElementById("closeExportPicture");
  const exportAreaPreview = document.getElementById("exportAreaPreview");
  const exportPreviewContent = document.getElementById("exportPreviewContent");
  const exportAreaRect = document.getElementById("exportAreaRect");
  const exportPictureFormat = document.getElementById("exportPictureFormat");
  const exportAspectRatio = document.getElementById("exportAspectRatio");
  const downloadExportPictureButton = document.getElementById("downloadExportPicture");

  const buttons = {
    undo: document.getElementById("undo"),
    redo: document.getElementById("redo"),
    copySelected: document.getElementById("copySelected"),
    pasteClipboard: document.getElementById("pasteClipboard"),
    reset: document.getElementById("reset"),
    rotateLeft: document.getElementById("rotateLeft"),
    rotateRight: document.getElementById("rotateRight"),
    reflectHorizontal: document.getElementById("reflectHorizontal"),
    reflectVertical: document.getElementById("reflectVertical"),
    arcDual: document.getElementById("arcDual"),
    rotateDegrees: document.getElementById("rotateDegrees"),
    selectAll: document.getElementById("selectAll"),
    groupSelected: document.getElementById("groupSelected"),
    ungroupSelected: document.getElementById("ungroupSelected"),
    sendToBottom: document.getElementById("sendToBottom"),
    moveDown: document.getElementById("moveDown"),
    moveUp: document.getElementById("moveUp"),
    bringToTop: document.getElementById("bringToTop"),
    latticeFill: document.getElementById("latticeFill"),
    clearLattice: document.getElementById("clearLattice"),
    locateLatticeParents: document.getElementById("locateLatticeParents"),
    duplicate: document.getElementById("duplicate"),
    deleteSelected: document.getElementById("deleteSelected"),
    zoomIn: document.getElementById("zoomIn"),
    zoomOut: document.getElementById("zoomOut"),
    resetView: document.getElementById("resetView"),
    fullScreen: document.getElementById("fullScreen"),
    saveLayout: document.getElementById("saveLayout"),
    loadLayout: document.getElementById("loadLayout"),
    exportJson: document.getElementById("exportJson"),
    importJson: document.getElementById("importJson"),
    copyShareLink: document.getElementById("copyShareLink"),
    downloadSvg: document.getElementById("downloadSvg"),
    downloadPng: document.getElementById("downloadPng"),
    exportPicture: document.getElementById("exportPicture"),
    printPdf: document.getElementById("printPdf"),
    shapeFillButton: document.getElementById("shapeFillButton"),
    shapeFillPanel: document.getElementById("shapeFillPanel"),
    shapeOutlineButton: document.getElementById("shapeOutlineButton"),
    shapeOutlinePanel: document.getElementById("shapeOutlinePanel"),
    fillColorPicker: document.getElementById("fillColorPicker"),
    fillPatternPicker: document.getElementById("fillPatternPicker"),
    fillOpacityPicker: document.getElementById("fillOpacityPicker"),
    strokeColorPicker: document.getElementById("strokeColorPicker"),
    strokeStylePicker: document.getElementById("strokeStylePicker"),
    strokeWidthPicker: document.getElementById("strokeWidthPicker"),
    canvasColorPicker: document.getElementById("canvasColorPicker"),
    latticeOpacity: document.getElementById("latticeOpacity"),
    trayTilesTab: document.getElementById("trayTilesTab"),
    trayExamplesTab: document.getElementById("trayExamplesTab"),
    tilesPanel: document.getElementById("tilesPanel"),
    examplesPanel: document.getElementById("examplesPanel"),
    examplesList: document.getElementById("examplesList"),
    menuRotateDegrees: document.getElementById("menuRotateDegrees"),
    menuLatticeOpacity: document.getElementById("menuLatticeOpacity"),
    menuFillColorPicker: document.getElementById("menuFillColorPicker"),
    menuFillPatternPicker: document.getElementById("menuFillPatternPicker"),
    menuFillOpacityPicker: document.getElementById("menuFillOpacityPicker"),
    menuStrokeColorPicker: document.getElementById("menuStrokeColorPicker"),
    menuStrokeStylePicker: document.getElementById("menuStrokeStylePicker"),
    menuStrokeWidthPicker: document.getElementById("menuStrokeWidthPicker"),
    menuCanvasColorPicker: document.getElementById("menuCanvasColorPicker"),
    menuSnapToggle: document.getElementById("menuSnapToggle"),
    menuOverlapToggle: document.getElementById("menuOverlapToggle")
  };

  function normalizeAngle(degrees) {
    return ((((degrees + 180) % 360) + 360) % 360) - 180;
  }

  function regularPolygonVertices(sides, sideLength, startAngleDegrees) {
    const radius = sideLength / (2 * Math.sin(Math.PI / sides));
    const vertices = [];

    for (let i = 0; i < sides; i += 1) {
      const angle = (startAngleDegrees + 360 * i / sides) * Math.PI / 180;
      vertices.push({
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle)
      });
    }

    return vertices;
  }

  function pointsFromVertices(vertices) {
    return vertices
      .map(vertex => `${Number(vertex.x.toFixed(2))},${Number(vertex.y.toFixed(2))}`)
      .join(" ");
  }

  function makeRegularTile(label, color, sides, startAngleDegrees) {
    const vertices = regularPolygonVertices(sides, SIDE_LENGTH, startAngleDegrees);
    const radius = SIDE_LENGTH / (2 * Math.sin(Math.PI / sides));

    return {
      label,
      color,
      sides,
      sideLength: SIDE_LENGTH,
      radius,
      startAngleDegrees,
      vertices,
      points: pointsFromVertices(vertices)
    };
  }

  function bubbleTilePath(vertices, bites) {
    const arcRadius = SIDE_LENGTH;
    const commands = [];

    commands.push(`M ${vertices[0].x.toFixed(3)} ${vertices[0].y.toFixed(3)}`);

    for (let i = 0; i < vertices.length; i += 1) {
      const next = vertices[(i + 1) % vertices.length];
      const isBite = bites[i] === 1;

      /*
        The six vertices lie on a circle of radius SIDE_LENGTH. For each edge,
        one of the two 60-degree arcs is the outside arc and the other is the
        inverted "bite" arc.
      */
      const sweep = isBite ? 0 : 1;

      commands.push(
        `A ${arcRadius} ${arcRadius} 0 0 ${sweep} ${next.x.toFixed(3)} ${next.y.toFixed(3)}`
      );
    }

    commands.push("Z");
    return commands.join(" ");
  }

  function puzzleTilePath(vertices, bites) {
    const commands = [];

    /*
      Jigsaw edge profile adapted from John's Inkscape SVG edge.
      The normalized coordinates below trace one exact horizontal socket
      profile; tab/blank is generated by flipping the normal direction.
    */
    const edgeCubics = [
      [[0.0000, 0.0000], [0.3110, 0.0428], [0.3458, 0.0376]],
      [[0.3806, 0.0325], [0.4120, 0.0177], [0.4216, -0.0094]],
      [[0.4312, -0.0364], [0.3886, -0.0974], [0.3900, -0.1626]],
      [[0.3914, -0.2278], [0.4301, -0.2418], [0.4437, -0.2514]],
      [[0.4573, -0.2610], [0.5000, -0.2608], [0.5000, -0.2608]],
      [[0.5000, -0.2608], [0.5427, -0.2610], [0.5563, -0.2514]],
      [[0.5699, -0.2418], [0.6086, -0.2278], [0.6100, -0.1626]],
      [[0.6114, -0.0974], [0.5688, -0.0364], [0.5784, -0.0094]],
      [[0.5880, 0.0177], [0.6194, 0.0325], [0.6542, 0.0377]],
      [[0.6890, 0.0428], [1.0000, 0.0000], [1.0000, 0.0000]]
    ];

    commands.push(`M ${vertices[0].x.toFixed(3)} ${vertices[0].y.toFixed(3)}`);

    for (let i = 0; i < vertices.length; i += 1) {
      const start = vertices[i];
      const end = vertices[(i + 1) % vertices.length];

      const dx = end.x - start.x;
      const dy = end.y - start.y;

      const midpoint = {
        x: (start.x + end.x) / 2,
        y: (start.y + end.y) / 2
      };

      const midpointLength = Math.hypot(midpoint.x, midpoint.y) || 1;
      const outward = {
        x: midpoint.x / midpointLength,
        y: midpoint.y / midpointLength
      };

      // Original profile is a socket; flip it for a tab.
      const sign = bites[i] === 1 ? 1 : -1;
      const normalScale = vertices.length === 3 ? 0.78 : 1.0;

      function profilePoint(pair) {
        const t = pair[0];
        const normal = pair[1] * SIDE_LENGTH * normalScale * sign;

        return {
          x: start.x + dx * t + outward.x * normal,
          y: start.y + dy * t + outward.y * normal
        };
      }

      edgeCubics.forEach(cubic => {
        const c1 = profilePoint(cubic[0]);
        const c2 = profilePoint(cubic[1]);
        const p = profilePoint(cubic[2]);

        commands.push(`C ${c1.x.toFixed(3)} ${c1.y.toFixed(3)}, ${c2.x.toFixed(3)} ${c2.y.toFixed(3)}, ${p.x.toFixed(3)} ${p.y.toFixed(3)}`);
      });
    }

    commands.push("Z");
    return commands.join(" ");
  }

  function makePuzzleTile(bubbleLabel, color, sides, startAngleDegrees, bites) {
    const base = makeRegularTile("", color, sides, startAngleDegrees);

    return {
      ...base,
      bubbleLabel,
      bites,
      path: puzzleTilePath(base.vertices, bites),
      isPuzzleTile: true
    };
  }

  function makeArcBubbleTile(bubbleLabel, color, sides, startAngleDegrees, bites) {
    const base = makeRegularTile("", color, sides, startAngleDegrees);

    return {
      ...base,
      bubbleLabel,
      bites,
      path: bubbleTilePath(base.vertices, bites)
    };
  }

  function makeBubbleTile(bubbleLabel, color, bites) {
    return {
      ...makeArcBubbleTile(bubbleLabel, color, 6, -90, bites),
      defaultRotation: 30
    };
  }

  function roundedRectanglePath(width, height, radius) {
    const x = -width / 2;
    const y = -height / 2;
    const right = width / 2;
    const bottom = height / 2;

    return [
      `M ${x + radius} ${y}`,
      `H ${right - radius}`,
      `Q ${right} ${y} ${right} ${y + radius}`,
      `V ${bottom - radius}`,
      `Q ${right} ${bottom} ${right - radius} ${bottom}`,
      `H ${x + radius}`,
      `Q ${x} ${bottom} ${x} ${bottom - radius}`,
      `V ${y + radius}`,
      `Q ${x} ${y} ${x + radius} ${y}`,
      "Z"
    ].join(" ");
  }

  function transformLocalPoint(point, translation, rotation = 0) {
    const rotated = rotatePoint(point, rotation);

    return {
      x: rotated.x + translation.x,
      y: rotated.y + translation.y
    };
  }

  function transformedBubblePath(tileType, x, y, rotation = 0) {
    const definition = tileDefinitions[tileType];
    const vertices = definition.vertices.map(vertex => transformLocalPoint(vertex, { x, y }, rotation));
    const bites = definition.bites || [];
    const arcRadius = SIDE_LENGTH;
    const commands = [];

    commands.push(`M ${vertices[0].x.toFixed(3)} ${vertices[0].y.toFixed(3)}`);

    for (let i = 0; i < vertices.length; i += 1) {
      const next = vertices[(i + 1) % vertices.length];
      const sweep = bites[i] === 1 ? 0 : 1;

      commands.push(`A ${arcRadius} ${arcRadius} 0 0 ${sweep} ${next.x.toFixed(3)} ${next.y.toFixed(3)}`);
    }

    commands.push("Z");
    return commands.join(" ");
  }

  function transformedSocketEdges(tileType, x, y, rotation = 0) {
    const definition = tileDefinitions[tileType];

    if (!definition || !Array.isArray(definition.vertices)) return [];

    return definition.vertices.map((vertex, index) => {
      const next = definition.vertices[(index + 1) % definition.vertices.length];

      return {
        start: transformLocalPoint(vertex, { x, y }, rotation),
        end: transformLocalPoint(next, { x, y }, rotation),
        index,
        bite: definition.bites ? definition.bites[index] : null,
        isBubbleEdge: Array.isArray(definition.bites),
        isFrameSocket: true
      };
    });
  }

  function centeredVertices(vertices) {
    const center = vertices.reduce((sum, vertex) => ({
      x: sum.x + vertex.x,
      y: sum.y + vertex.y
    }), { x: 0, y: 0 });

    center.x /= vertices.length;
    center.y /= vertices.length;

    return vertices.map(vertex => ({
      x: vertex.x - center.x,
      y: vertex.y - center.y
    }));
  }

  function radiusFromVertices(vertices) {
    return Math.max(...vertices.map(vertex => Math.hypot(vertex.x, vertex.y)));
  }

  function makeCustomPolygonTile(label, color, rawVertices) {
    const vertices = centeredVertices(rawVertices);

    return {
      label: "",
      bubbleLabel: label,
      color,
      sides: vertices.length,
      sideLength: SIDE_LENGTH,
      radius: radiusFromVertices(vertices),
      startAngleDegrees: 0,
      vertices,
      points: pointsFromVertices(vertices)
    };
  }

  function makeCompoundPathTile(label, color, path, rawVertices, radiusOverride = null) {
    const vertices = centeredVertices(rawVertices);
    const rawCenter = rawVertices.reduce((sum, vertex) => ({ x: sum.x + vertex.x, y: sum.y + vertex.y }), { x: 0, y: 0 });
    rawCenter.x /= rawVertices.length;
    rawCenter.y /= rawVertices.length;

    const centeredPath = path.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_match, xValue, yValue) => {
      const x = Number(xValue) - rawCenter.x;
      const y = Number(yValue) - rawCenter.y;
      return x.toFixed(3) + "," + y.toFixed(3);
    });

    return {
      label: "",
      bubbleLabel: label,
      color,
      sides: vertices.length,
      sideLength: SIDE_LENGTH,
      radius: radiusOverride || radiusFromVertices(vertices),
      startAngleDegrees: 0,
      vertices,
      path: centeredPath
    };
  }

  function makePolyominoTile(label, color, cells) {
    const size = 44;
    const pathParts = [];

    cells.forEach(cell => {
      const x = cell[0] * size;
      const y = cell[1] * size;
      pathParts.push(`M ${x},${y} H ${x + size} V ${y + size} H ${x} Z`);
    });

    const minX = Math.min(...cells.map(cell => cell[0] * size));
    const maxX = Math.max(...cells.map(cell => (cell[0] + 1) * size));
    const minY = Math.min(...cells.map(cell => cell[1] * size));
    const maxY = Math.max(...cells.map(cell => (cell[1] + 1) * size));

    const tile = makeCompoundPathTile(label, color, pathParts.join(" "), [
      { x: minX, y: minY }, { x: maxX, y: minY }, { x: maxX, y: maxY }, { x: minX, y: maxY }
    ]);
    tile.isPolyomino = true;
    return tile;
  }

  function makeRhombTile(label, color, acuteAngleDegrees) {
    const side = SIDE_LENGTH;
    const angle = acuteAngleDegrees * Math.PI / 180;

    const rawVertices = [
      { x: 0, y: 0 },
      { x: side, y: 0 },
      { x: side + side * Math.cos(angle), y: side * Math.sin(angle) },
      { x: side * Math.cos(angle), y: side * Math.sin(angle) }
    ];

    return makeCustomPolygonTile(label, color, rawVertices);
  }

  function makePenroseKiteTile() {
    const phi = (1 + Math.sqrt(5)) / 2;
    const shortSide = SIDE_LENGTH;
    const longSide = phi * shortSide;

    const x = longSide * Math.sin(36 * Math.PI / 180);
    const topHeight = longSide * Math.cos(36 * Math.PI / 180);
    const bottomHeight = shortSide * Math.cos(72 * Math.PI / 180);

    return makeCustomPolygonTile("Penrose Kite", "#f4c542", [
      { x: 0, y: -topHeight },
      { x, y: 0 },
      { x: 0, y: bottomHeight },
      { x: -x, y: 0 }
    ]);
  }

  function makePenroseDartTile() {
    const phi = (1 + Math.sqrt(5)) / 2;
    const shortSide = SIDE_LENGTH;
    const longSide = phi * shortSide;

    const x = longSide * Math.sin(18 * Math.PI / 180);
    const topHeight = longSide * Math.cos(18 * Math.PI / 180);
    const notchHeight = shortSide * Math.cos(36 * Math.PI / 180);

    return makeCustomPolygonTile("Penrose Dart", "#8ecae6", [
      { x: 0, y: -topHeight },
      { x, y: 0 },
      { x: 0, y: -notchHeight },
      { x: -x, y: 0 }
    ]);
  }

  function makeMonotileTile(label, color, a, b, curve) {
    /*
      Hat/Turtle/Spectre family construction based on Christian Lawson-Perfect's
      monotile.js generator. The 14 edge vectors use parameters a and b; curve = 0
      gives the straight-edged polygonal members, and curve > 0 curves each edge.
    */
    const scale = SIDE_LENGTH;
    const c = Math.cos(Math.PI / 3);
    const s = Math.sin(Math.PI / 3);

    const moves = [
      [c * b, s * b],
      [b, 0],
      [0, a],
      [s * a, c * a],
      [c * b, -s * b],
      [-c * b, -s * b],
      [s * a, -c * a],
      [0, -a],
      [0, -a],
      [-s * a, -c * a],
      [-c * b, s * b],
      [-b, 0],
      [0, a],
      [-s * a, c * a]
    ].map(move => [move[0] * scale, move[1] * scale]);

    let x = 0;
    let y = 0;
    const rawVertices = [{ x, y }];
    const segments = [];

    function twiddle(dx, dy) {
      const nx = dy;
      const ny = -dx;

      return {
        c1: { x: -curve * nx + dx / 2, y: -curve * ny + dy / 2 },
        c2: { x: curve * nx + dx / 2, y: curve * ny + dy / 2 },
        end: { x: dx, y: dy }
      };
    }

    moves.forEach(move => {
      const dx = move[0];
      const dy = move[1];
      const controls = twiddle(dx, dy);

      segments.push({
        c1: { x: x + controls.c1.x, y: y + controls.c1.y },
        c2: { x: x + controls.c2.x, y: y + controls.c2.y },
        end: { x: x + controls.end.x, y: y + controls.end.y }
      });

      x += dx;
      y += dy;
      rawVertices.push({ x, y });
    });

    const verticesForCenter = rawVertices.slice(0, -1);
    const center = verticesForCenter.reduce((sum, vertex) => ({
      x: sum.x + vertex.x,
      y: sum.y + vertex.y
    }), { x: 0, y: 0 });

    center.x /= verticesForCenter.length;
    center.y /= verticesForCenter.length;

    const vertices = verticesForCenter.map(vertex => ({
      x: vertex.x - center.x,
      y: vertex.y - center.y
    }));

    const commands = [`M ${vertices[0].x.toFixed(3)} ${vertices[0].y.toFixed(3)}`];

    segments.forEach(segment => {
      commands.push(
        `C ${(segment.c1.x - center.x).toFixed(3)} ${(segment.c1.y - center.y).toFixed(3)}, ${(segment.c2.x - center.x).toFixed(3)} ${(segment.c2.y - center.y).toFixed(3)}, ${(segment.end.x - center.x).toFixed(3)} ${(segment.end.y - center.y).toFixed(3)}`
      );
    });

    commands.push("Z");

    return {
      label: "",
      bubbleLabel: label,
      color,
      sides: vertices.length,
      sideLength: SIDE_LENGTH,
      radius: radiusFromVertices(vertices),
      startAngleDegrees: 0,
      vertices,
      points: pointsFromVertices(vertices),
      path: commands.join(" "),
      isAperiodicMonotile: true
    };
  }

  function makeFrameTile(label, width, height, sockets) {
    const outer = roundedRectanglePath(width, height, 18);
    const holePaths = sockets.map(socket => transformedBubblePath(socket.tileType, socket.x, socket.y, socket.rotation || 0));
    const snapEdgesLocal = sockets.flatMap(socket => transformedSocketEdges(socket.tileType, socket.x, socket.y, socket.rotation || 0));

    return {
      label: "",
      bubbleLabel: label,
      color: "#c7aa72",
      sides: 4,
      sideLength: SIDE_LENGTH,
      radius: Math.hypot(width / 2, height / 2),
      startAngleDegrees: 0,
      vertices: [
        { x: -width / 2, y: -height / 2 },
        { x: width / 2, y: -height / 2 },
        { x: width / 2, y: height / 2 },
        { x: -width / 2, y: height / 2 }
      ],
      path: [outer, ...holePaths].join(" "),
      fillRule: "evenodd",
      snapEdgesLocal,
      isFrame: true
    };
  }

  function makeExactFrameTile(label, color, width, height, path, snapEdgesLocal) {
    return {
      label: "",
      bubbleLabel: label,
      color,
      sides: 4,
      sideLength: SIDE_LENGTH,
      radius: Math.hypot(width / 2, height / 2),
      startAngleDegrees: 0,
      vertices: [
        { x: -width / 2, y: -height / 2 },
        { x: width / 2, y: -height / 2 },
        { x: width / 2, y: height / 2 },
        { x: -width / 2, y: height / 2 }
      ],
      path,
      fillRule: "evenodd",
      snapEdgesLocal,
      isFrame: true,
      isExactSvgFrame: true
    };
  }

  function hexSocketGrid(radius, tileTypes) {
    const offsets = [
      { q: 0, r: 0 }
    ];

    for (let ring = 1; ring <= radius; ring += 1) {
      let q = -ring;
      let r = 0;
      const directions = [
        { q: 1, r: -1 },
        { q: 1, r: 0 },
        { q: 0, r: 1 },
        { q: -1, r: 1 },
        { q: -1, r: 0 },
        { q: 0, r: -1 }
      ];

      directions.forEach(direction => {
        for (let step = 0; step < ring; step += 1) {
          offsets.push({ q, r });
          q += direction.q;
          r += direction.r;
        }
      });
    }

    return offsets.slice(0, tileTypes.length).map((offset, index) => ({
      tileType: tileTypes[index],
      x: 138 * offset.q + 69 * offset.r,
      y: 120 * offset.r,
      rotation: 0
    }));
  }

  const tileDefinitions = {
    // Old prototype placeholders kept only so older saved JSON layouts still load.
    H2A: makeRegularTile("", "#f4c542", 6, -90),
    H5: makeRegularTile("", "#8ecae6", 6, -90),

    // Hexagonal bubble tiles. 1 = inverted arc / bite, 0 = outside arc.
    B0: makeBubbleTile("0", "#f6f2e6", [0, 0, 0, 0, 0, 0]),
    B1: makeBubbleTile("1", "#fed000", [1, 0, 0, 0, 0, 0]),
    B2A: makeBubbleTile("2A", "#fe9113", [1, 1, 0, 0, 0, 0]),
    B2B: makeBubbleTile("2B", "#fe3028", [1, 0, 0, 1, 0, 0]),
    B2C: makeBubbleTile("2C", "#fe66c0", [1, 0, 1, 0, 0, 0]),
    B3A: makeBubbleTile("3A", "#d2c1a8", [1, 1, 0, 1, 0, 0]),
    B3ASTAR: makeBubbleTile("3A*", "#6c6c6c", [1, 1, 0, 0, 1, 0]),
    B3B: makeBubbleTile("3B", "#f6b42e", [1, 1, 1, 0, 0, 0]),
    B3C: makeBubbleTile("3C", "#da9640", [1, 0, 1, 0, 1, 0]),
    B4A: makeBubbleTile("4A", "#91bd0d", [1, 1, 1, 1, 0, 0]),
    B4B: makeBubbleTile("4B", "#0cbd98", [1, 1, 0, 1, 1, 0]),
    B4C: makeBubbleTile("4C", "#42cdf0", [1, 1, 1, 0, 1, 0]),
    B5: makeBubbleTile("5", "#768fcf", [1, 1, 1, 1, 1, 0]),
    B6: makeBubbleTile("6", "#905f7b", [1, 1, 1, 1, 1, 1]),

    // Triangular bubble tiles.
    T0: makeArcBubbleTile("0", "#f2eddd", 3, -90, [0, 0, 0]),
    T1: makeArcBubbleTile("1", "#ffd21f", 3, -90, [1, 0, 0]),
    T2: makeArcBubbleTile("2", "#819ad6", 3, -90, [1, 1, 0]),
    T3: makeArcBubbleTile("3", "#9b6a86", 3, -90, [1, 1, 1]),

    // Square bubble tiles.
    Q0: makeArcBubbleTile("0", "#f2eddd", 4, -135, [0, 0, 0, 0]),
    Q1: makeArcBubbleTile("1", "#ffd21f", 4, -135, [1, 0, 0, 0]),
    Q2A: makeArcBubbleTile("2A", "#ff8f17", 4, -135, [1, 1, 0, 0]),
    Q2B: makeArcBubbleTile("2B", "#ff302b", 4, -135, [1, 0, 1, 0]),
    Q3: makeArcBubbleTile("3", "#819ad6", 4, -135, [1, 1, 1, 0]),
    Q4: makeArcBubbleTile("4", "#9b6a86", 4, -135, [1, 1, 1, 1]),

    // Puzzle-piece variants of the bubble tiles.
    PH0: makePuzzleTile("0", "#f6f2e6", 6, -90, [0, 0, 0, 0, 0, 0]),
    PH1: makePuzzleTile("1", "#fed000", 6, -90, [1, 0, 0, 0, 0, 0]),
    PH2A: makePuzzleTile("2A", "#fe9113", 6, -90, [1, 1, 0, 0, 0, 0]),
    PH2B: makePuzzleTile("2B", "#fe3028", 6, -90, [1, 0, 0, 1, 0, 0]),
    PH2C: makePuzzleTile("2C", "#fe66c0", 6, -90, [1, 0, 1, 0, 0, 0]),
    PH3A: makePuzzleTile("3A", "#d2c1a8", 6, -90, [1, 1, 0, 1, 0, 0]),
    PH3ASTAR: makePuzzleTile("3A*", "#6c6c6c", 6, -90, [1, 1, 0, 0, 1, 0]),
    PH3B: makePuzzleTile("3B", "#f6b42e", 6, -90, [1, 1, 1, 0, 0, 0]),
    PH3C: makePuzzleTile("3C", "#da9640", 6, -90, [1, 0, 1, 0, 1, 0]),
    PH4A: makePuzzleTile("4A", "#91bd0d", 6, -90, [1, 1, 1, 1, 0, 0]),
    PH4B: makePuzzleTile("4B", "#0cbd98", 6, -90, [1, 1, 0, 1, 1, 0]),
    PH4C: makePuzzleTile("4C", "#42cdf0", 6, -90, [1, 1, 1, 0, 1, 0]),
    PH5: makePuzzleTile("5", "#768fcf", 6, -90, [1, 1, 1, 1, 1, 0]),
    PH6: makePuzzleTile("6", "#905f7b", 6, -90, [1, 1, 1, 1, 1, 1]),

    PT0: makePuzzleTile("0", "#f2eddd", 3, -90, [0, 0, 0]),
    PT1: makePuzzleTile("1", "#ffd21f", 3, -90, [1, 0, 0]),
    PT2: makePuzzleTile("2", "#819ad6", 3, -90, [1, 1, 0]),
    PT3: makePuzzleTile("3", "#9b6a86", 3, -90, [1, 1, 1]),

    PQ0: makePuzzleTile("0", "#f2eddd", 4, -135, [0, 0, 0, 0]),
    PQ1: makePuzzleTile("1", "#ffd21f", 4, -135, [1, 0, 0, 0]),
    PQ2A: makePuzzleTile("2A", "#ff8f17", 4, -135, [1, 1, 0, 0]),
    PQ2B: makePuzzleTile("2B", "#ff302b", 4, -135, [1, 0, 1, 0]),
    PQ3: makePuzzleTile("3", "#819ad6", 4, -135, [1, 1, 1, 0]),
    PQ4: makePuzzleTile("4", "#9b6a86", 4, -135, [1, 1, 1, 1]),

    // Polyominoes.
    TET_I: makePolyominoTile("I tetromino", "#1f9bd7", [[0,0],[1,0],[2,0],[3,0]]),
    TET_O: makePolyominoTile("O tetromino", "#ffb703", [[0,0],[1,0],[0,1],[1,1]]),
    TET_T: makePolyominoTile("T tetromino", "#d91e8f", [[0,0],[1,0],[2,0],[1,1]]),
    TET_L: makePolyominoTile("L tetromino", "#ff8f17", [[0,0],[0,1],[0,2],[1,2]]),
    TET_S: makePolyominoTile("S tetromino", "#76b947", [[1,0],[2,0],[0,1],[1,1]]),

    PENT_F: makePolyominoTile("F pentomino", "#0aa36d", [[1,0],[2,0],[0,1],[1,1],[1,2]]),
    PENT_I: makePolyominoTile("I pentomino", "#0aa3c7", [[0,0],[1,0],[2,0],[3,0],[4,0]]),
    PENT_L: makePolyominoTile("L pentomino", "#1f9bd7", [[0,0],[0,1],[0,2],[0,3],[1,3]]),
    PENT_N: makePolyominoTile("N pentomino", "#733fbe", [[0,0],[1,0],[1,1],[2,1],[3,1]]),
    PENT_P: makePolyominoTile("P pentomino", "#4f62d8", [[0,0],[1,0],[0,1],[1,1],[0,2]]),
    PENT_T: makePolyominoTile("T pentomino", "#d91e8f", [[0,0],[1,0],[2,0],[1,1],[1,2]]),
    PENT_U: makePolyominoTile("U pentomino", "#ff8f17", [[0,0],[2,0],[0,1],[1,1],[2,1]]),
    PENT_V: makePolyominoTile("V pentomino", "#2aa833", [[0,0],[0,1],[0,2],[1,2],[2,2]]),
    PENT_W: makePolyominoTile("W pentomino", "#7a43c1", [[0,0],[0,1],[1,1],[1,2],[2,2]]),
    PENT_X: makePolyominoTile("X pentomino", "#b12cc4", [[1,0],[0,1],[1,1],[2,1],[1,2]]),
    PENT_Y: makePolyominoTile("Y pentomino", "#ef3b24", [[0,0],[0,1],[0,2],[0,3],[1,1]]),
    PENT_Z: makePolyominoTile("Z pentomino", "#ff4f1f", [[0,0],[1,0],[1,1],[1,2],[2,2]]),

    // Assorted shape sandbox.
    SH_TRAP: makeCustomPolygonTile("Trapezoid", "#ef4b2a", [{x:-80,y:34.641},{x:80,y:34.641},{x:40,y:-34.641},{x:-40,y:-34.641}]),
    SH_PARA: makeCustomPolygonTile("Parallelogram", "#2398e5", [{x:-60,y:-34.641},{x:20,y:-34.641},{x:60,y:34.641},{x:-20,y:34.641}]),
    SH_RHOMBUS: makeRhombTile("Rhombus", "#b6c90f", 60),
    SH_RECT: makeCustomPolygonTile("Rectangle", "#1f9bd7", [{x:-80,y:-40},{x:80,y:-40},{x:80,y:40},{x:-80,y:40}]),
    SH_RIGHT_TRI: makeCustomPolygonTile("Right triangle", "#42b63f", [{x:-40,y:-40},{x:40,y:-40},{x:-40,y:40}]),
    SH_SMALL_TRI: makeRegularTile("", "#ff8f17", 3, -90),
    SH_CHEVRON: makeCustomPolygonTile("Chevron", "#ef4b2a", [{x:-80,y:-69.282},{x:0,y:-69.282},{x:80,y:0},{x:0,y:69.282},{x:-80,y:69.282},{x:-40,y:0}]),
    SH_KITE: makeCustomPolygonTile("Kite", "#8e54d6", [{x:0,y:-80},{x:40,y:0},{x:0,y:80},{x:-40,y:0}]),
    SH_DART: makeCustomPolygonTile("Dart", "#06a7a9", [{x:0,y:-80},{x:69.282,y:40},{x:0,y:0},{x:-69.282,y:40}]),

    // Aperiodic playground tiles.
    PRTHICK: makeRhombTile("Penrose Thick Rhomb", "#ffb703", 72),
    PRTHIN: makeRhombTile("Penrose Thin Rhomb", "#90be6d", 36),
    PKITE: makePenroseKiteTile(),
    PDART: makePenroseDartTile(),
    HAT: makeMonotileTile("Hat / Einstein", "#f08080", 1, Math.sqrt(3), 0),
    TURTLE: makeMonotileTile("Turtle", "#b388eb", Math.sqrt(3), 1, 0),
    SPECTRE: makeMonotileTile("Spectre", "#48cae4", 1, 1, 0.45),

    // Regular polygon sandbox tiles.
    TRI: makeRegularTile("", "#f08080", 3, -90),
    SQUARE: makeRegularTile("", "#90be6d", 4, -45),
    PENT: makeRegularTile("", "#b388eb", 5, -90),
    HEX: makeRegularTile("", "#ffb703", 6, -90),
    HEPT: makeRegularTile("", "#48cae4", 7, -90),
    OCT: makeRegularTile("", "#f8961e", 8, -112.5)
  };

  // Exact frame guide tiles extracted from the uploaded CorelDRAW SVG frame file.
  // The path outlines are scaled so the frame sockets use the same side length as the app's bubble tiles.
  Object.assign(tileDefinitions, {
    FMINI: makeExactFrameTile("Mini Frame", "#c7aa72", 497.54, 554.957, "M -243.802 -277.478 H 243.802 Q 248.77 -277.478 248.77 -267.119 V 267.119 Q 248.77 277.478 243.802 277.478 H -243.802 Q -248.77 277.478 -248.77 267.119 V -267.119 Q -248.77 -277.478 -243.802 -277.478 Z M -48.084 216.772 C -23.331 202.481 7.164 202.481 31.916 216.772 C 56.669 202.48 71.917 176.07 71.917 147.488 C 96.67 133.199 127.166 133.199 151.918 147.489 C 176.67 133.198 191.918 106.788 191.918 78.206 C 167.167 63.915 151.919 37.505 151.919 8.924 C 176.671 -5.367 191.919 -31.777 191.919 -60.358 C 167.167 -74.65 151.919 -101.059 151.919 -129.641 C 127.167 -143.931 96.671 -143.931 71.918 -129.64 C 47.166 -143.932 31.918 -170.341 31.918 -198.923 C 7.166 -213.213 -23.33 -213.213 -48.082 -198.922 C -48.082 -170.341 -63.33 -143.931 -88.082 -129.64 C -112.836 -143.93 -143.331 -143.93 -168.083 -129.64 C -168.084 -101.059 -183.332 -74.649 -208.084 -60.358 C -208.085 -31.776 -192.837 -5.366 -168.085 8.925 C -168.085 37.506 -183.333 63.916 -208.085 78.207 C -208.085 106.789 -192.837 133.199 -168.085 147.49 C -143.332 133.199 -112.837 133.199 -88.085 147.49 C -88.084 176.071 -72.837 202.48 -48.084 216.772 Z", [
      { start: { x: -48.084, y: 216.772 }, end: { x: 31.916, y: 216.772 }, index: 0, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: 31.917, y: 216.771 }, end: { x: 71.917, y: 147.488 }, index: 1, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: 71.918, y: 147.489 }, end: { x: 151.918, y: 147.489 }, index: 2, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: 151.918, y: 147.489 }, end: { x: 191.918, y: 78.206 }, index: 3, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: 191.919, y: 78.206 }, end: { x: 151.919, y: 8.924 }, index: 4, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: 151.919, y: 8.924 }, end: { x: 191.919, y: -60.358 }, index: 5, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: 191.919, y: -60.358 }, end: { x: 151.919, y: -129.641 }, index: 6, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: 151.919, y: -129.64 }, end: { x: 71.918, y: -129.64 }, index: 7, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: 71.918, y: -129.64 }, end: { x: 31.918, y: -198.923 }, index: 8, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: 31.918, y: -198.922 }, end: { x: -48.082, y: -198.922 }, index: 9, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: -48.082, y: -198.922 }, end: { x: -88.082, y: -129.64 }, index: 10, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: -88.083, y: -129.64 }, end: { x: -168.083, y: -129.64 }, index: 11, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: -168.084, y: -129.64 }, end: { x: -208.084, y: -60.358 }, index: 12, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: -208.085, y: -60.358 }, end: { x: -168.085, y: 8.925 }, index: 13, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: -168.085, y: 8.924 }, end: { x: -208.085, y: 78.207 }, index: 14, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: -208.085, y: 78.207 }, end: { x: -168.085, y: 147.49 }, index: 15, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: -168.085, y: 147.49 }, end: { x: -88.085, y: 147.49 }, index: 16, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: -88.084, y: 147.489 }, end: { x: -48.084, y: 216.772 }, index: 17, bite: null, isBubbleEdge: false, isFrameSocket: true }
    ]),

    F13: makeExactFrameTile("13 Tile Frame", "#c7aa72", 712.9, 594.083, "M -349.331 -297.041 H 349.331 Q 356.45 -297.041 356.45 -285.952 V 285.952 Q 356.45 297.041 349.331 297.041 H -349.331 Q -356.45 297.041 -356.45 285.952 V -285.952 Q -356.45 -297.041 -349.331 -297.041 Z M -161.882 233.132 C -186.632 218.843 -201.878 192.435 -201.878 163.857 C -226.632 178.123 -257.125 178.12 -281.873 163.829 C -281.871 135.251 -297.114 108.842 -321.863 94.549 C -321.86 65.971 -306.611 39.565 -281.86 25.278 C -306.613 10.987 -321.857 -15.422 -321.856 -44.001 C -321.854 -72.579 -306.606 -98.985 -281.855 -113.272 C -257.107 -98.982 -226.614 -98.98 -201.863 -113.267 C -201.848 -141.837 -186.6 -168.243 -161.848 -182.53 C -137.098 -196.817 -106.606 -196.813 -81.858 -182.522 C -81.863 -211.097 -66.617 -237.505 -41.867 -251.795 C -17.116 -237.506 13.376 -237.505 38.126 -251.795 C 38.111 -223.203 53.366 -196.801 78.121 -182.52 C 102.879 -168.219 133.372 -168.217 158.123 -182.503 C 158.12 -153.925 173.364 -127.516 198.112 -113.224 C 222.868 -127.498 253.361 -127.496 278.11 -113.204 C 278.107 -84.625 293.352 -58.217 318.1 -43.926 C 293.349 -29.638 278.101 -3.232 278.097 25.347 C 278.094 53.925 293.339 80.333 318.087 94.626 C 293.337 108.913 278.088 135.318 278.085 163.897 C 253.338 149.596 222.846 149.592 198.094 163.879 C 198.081 192.441 182.835 218.848 158.085 233.138 C 133.335 247.428 102.843 247.427 78.093 233.139 C 78.093 204.56 62.846 178.153 38.096 163.864 C 13.347 178.151 -17.146 178.148 -41.895 163.857 C -41.895 192.439 -57.141 218.846 -81.891 233.135 C -106.64 218.844 -137.133 218.844 -161.883 233.133 Z", [
      { start: { x: -161.882, y: 233.132 }, end: { x: -201.878, y: 163.857 }, index: 0, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: -201.881, y: 163.836 }, end: { x: -281.873, y: 163.829 }, index: 1, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: -281.873, y: 163.828 }, end: { x: -321.863, y: 94.549 }, index: 2, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: -321.863, y: 94.549 }, end: { x: -281.86, y: 25.278 }, index: 3, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: -281.865, y: 25.278 }, end: { x: -321.856, y: -44.001 }, index: 4, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: -321.857, y: -43.999 }, end: { x: -281.855, y: -113.272 }, index: 5, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: -281.856, y: -113.273 }, end: { x: -201.863, y: -113.267 }, index: 6, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: -201.851, y: -113.258 }, end: { x: -161.848, y: -182.53 }, index: 7, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: -161.85, y: -182.529 }, end: { x: -81.858, y: -182.522 }, index: 8, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: -81.863, y: -182.52 }, end: { x: -41.867, y: -251.795 }, index: 9, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: -41.866, y: -251.795 }, end: { x: 38.126, y: -251.795 }, index: 10, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: 38.101, y: -251.781 }, end: { x: 78.121, y: -182.52 }, index: 11, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: 78.131, y: -182.51 }, end: { x: 158.123, y: -182.503 }, index: 12, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: 158.123, y: -182.503 }, end: { x: 198.112, y: -113.224 }, index: 13, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: 198.118, y: -113.211 }, end: { x: 278.11, y: -113.204 }, index: 14, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: 278.11, y: -113.204 }, end: { x: 318.1, y: -43.926 }, index: 15, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: 318.1, y: -43.925 }, end: { x: 278.097, y: 25.347 }, index: 16, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: 278.097, y: 25.347 }, end: { x: 318.087, y: 94.626 }, index: 17, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: 318.087, y: 94.626 }, end: { x: 278.085, y: 163.897 }, index: 18, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: 278.086, y: 163.888 }, end: { x: 198.094, y: 163.879 }, index: 19, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: 198.08, y: 163.862 }, end: { x: 158.085, y: 233.138 }, index: 20, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: 158.085, y: 233.138 }, end: { x: 78.093, y: 233.139 }, index: 21, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: 78.093, y: 233.139 }, end: { x: 38.096, y: 163.864 }, index: 22, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: 38.097, y: 163.865 }, end: { x: -41.895, y: 163.857 }, index: 23, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: -41.894, y: 163.86 }, end: { x: -81.891, y: 233.135 }, index: 24, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: -81.891, y: 233.134 }, end: { x: -161.883, y: 233.133 }, index: 25, bite: null, isBubbleEdge: false, isFrameSocket: true }
    ]),

    FLARGE: makeExactFrameTile("Large Frame", "#c7aa72", 719.629, 808.933, "M -335.375 -404.467 H 335.375 Q 359.814 -404.467 359.814 -382.14 V 382.14 Q 359.814 404.467 335.375 404.467 H -335.375 Q -359.814 404.467 -359.814 382.14 V -382.14 Q -359.814 -404.467 -335.375 -404.467 Z M -85.933 278.801 C -110.993 293.025 -141.737 292.8 -166.586 278.21 C -166.375 249.395 -181.552 222.658 -206.398 208.068 C -231.247 193.479 -261.991 193.253 -287.051 207.478 C -286.84 178.664 -302.017 151.924 -326.866 137.335 C -301.806 123.111 -286.239 96.598 -286.028 67.783 C -310.876 53.193 -326.054 26.455 -325.843 -2.359 C -300.783 -16.584 -285.216 -43.097 -285.007 -71.912 C -284.795 -100.726 -299.973 -127.465 -324.822 -142.055 C -299.762 -156.279 -284.195 -182.792 -283.983 -211.608 C -259.135 -197.018 -228.39 -196.792 -203.33 -211.016 C -203.119 -239.83 -187.552 -266.343 -162.494 -280.568 C -137.645 -265.978 -106.9 -265.752 -81.842 -279.976 C -56.782 -294.201 -41.215 -320.714 -41.004 -349.529 C -16.156 -334.939 14.589 -334.713 39.649 -348.937 C 39.437 -320.124 54.615 -293.385 79.463 -278.797 C 104.523 -293.021 135.268 -292.795 160.116 -278.206 C 159.905 -249.391 175.083 -222.654 199.931 -208.064 C 224.779 -193.474 255.523 -193.248 280.583 -207.472 C 280.373 -178.658 295.55 -151.919 320.399 -137.329 C 295.339 -123.104 279.772 -96.592 279.562 -67.778 C 304.411 -53.188 319.588 -26.449 319.378 2.364 C 294.318 16.588 278.751 43.101 278.538 71.916 C 278.327 100.73 293.504 127.469 318.353 142.059 C 293.294 156.283 277.726 182.796 277.515 211.611 C 252.666 197.021 221.922 196.795 196.863 211.021 C 196.651 239.835 181.084 266.348 156.025 280.572 C 131.176 265.982 100.432 265.757 75.371 279.983 C 50.312 294.207 34.745 320.72 34.533 349.535 C 9.686 334.945 -21.059 334.719 -46.119 348.944 C -45.908 320.13 -61.086 293.391 -85.933 278.801 Z", [
      { start: { x: -85.933, y: 278.801 }, end: { x: -166.586, y: 278.21 }, index: 0, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: -166.586, y: 278.21 }, end: { x: -206.398, y: 208.068 }, index: 1, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: -206.398, y: 208.068 }, end: { x: -287.051, y: 207.478 }, index: 2, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: -287.051, y: 207.478 }, end: { x: -326.866, y: 137.335 }, index: 3, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: -326.866, y: 137.335 }, end: { x: -286.028, y: 67.783 }, index: 4, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: -286.028, y: 67.783 }, end: { x: -325.843, y: -2.359 }, index: 5, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: -325.843, y: -2.359 }, end: { x: -285.007, y: -71.912 }, index: 6, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: -285.007, y: -71.912 }, end: { x: -324.822, y: -142.055 }, index: 7, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: -324.822, y: -142.055 }, end: { x: -283.983, y: -211.608 }, index: 8, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: -283.983, y: -211.608 }, end: { x: -203.33, y: -211.016 }, index: 9, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: -203.33, y: -211.016 }, end: { x: -162.494, y: -280.568 }, index: 10, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: -162.494, y: -280.568 }, end: { x: -81.842, y: -279.976 }, index: 11, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: -81.842, y: -279.976 }, end: { x: -41.004, y: -349.529 }, index: 12, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: -41.004, y: -349.529 }, end: { x: 39.649, y: -348.937 }, index: 13, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: 39.649, y: -348.937 }, end: { x: 79.463, y: -278.797 }, index: 14, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: 79.463, y: -278.797 }, end: { x: 160.116, y: -278.206 }, index: 15, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: 160.116, y: -278.206 }, end: { x: 199.931, y: -208.064 }, index: 16, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: 199.931, y: -208.064 }, end: { x: 280.583, y: -207.472 }, index: 17, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: 280.583, y: -207.472 }, end: { x: 320.399, y: -137.329 }, index: 18, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: 320.399, y: -137.329 }, end: { x: 279.562, y: -67.778 }, index: 19, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: 279.562, y: -67.778 }, end: { x: 319.378, y: 2.364 }, index: 20, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: 319.378, y: 2.364 }, end: { x: 278.538, y: 71.916 }, index: 21, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: 278.538, y: 71.916 }, end: { x: 318.353, y: 142.059 }, index: 22, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: 318.353, y: 142.059 }, end: { x: 277.515, y: 211.611 }, index: 23, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: 277.515, y: 211.611 }, end: { x: 196.863, y: 211.021 }, index: 24, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: 196.863, y: 211.021 }, end: { x: 156.025, y: 280.572 }, index: 25, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: 156.025, y: 280.572 }, end: { x: 75.371, y: 279.983 }, index: 26, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: 75.371, y: 279.983 }, end: { x: 34.533, y: 349.535 }, index: 27, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: 34.533, y: 349.535 }, end: { x: -46.119, y: 348.944 }, index: 28, bite: null, isBubbleEdge: false, isFrameSocket: true },
      { start: { x: -46.119, y: 348.944 }, end: { x: -85.933, y: 278.801 }, index: 29, bite: null, isBubbleEdge: false, isFrameSocket: true }
    ])
  });


  function arcPath(cx, cy, r, startDegrees, endDegrees) {
    const startRadians = startDegrees * Math.PI / 180;
    const endRadians = endDegrees * Math.PI / 180;
    const start = {
      x: cx + r * Math.cos(startRadians),
      y: cy + r * Math.sin(startRadians)
    };
    const end = {
      x: cx + r * Math.cos(endRadians),
      y: cy + r * Math.sin(endRadians)
    };
    const largeArc = Math.abs(endDegrees - startDegrees) > 180 ? 1 : 0;
    const sweep = endDegrees > startDegrees ? 1 : 0;

    return `M ${start.x.toFixed(3)} ${start.y.toFixed(3)} A ${r} ${r} 0 ${largeArc} ${sweep} ${end.x.toFixed(3)} ${end.y.toFixed(3)}`;
  }

  function addPenroseMarkings() {
    if (tileDefinitions.PRTHICK) {
      tileDefinitions.PRTHICK.decorations = [
        { d: "M -44 -38 Q 0 -72 44 -38" },
        { d: "M -30 34 Q 0 10 30 34" }
      ];
    }

    if (tileDefinitions.PRTHIN) {
      tileDefinitions.PRTHIN.decorations = [
        { d: "M -35 -48 Q 0 -80 35 -48" },
        { d: "M -20 28 Q 0 8 20 28" }
      ];
    }

    if (tileDefinitions.PKITE) {
      tileDefinitions.PKITE.decorations = [
        { d: "M -54 -52 Q 0 -94 54 -52" },
        { d: "M -28 34 Q 0 8 28 34" }
      ];
    }

    if (tileDefinitions.PDART) {
      tileDefinitions.PDART.decorations = [
        { d: "M -48 -48 Q 0 -92 48 -48" },
        { d: "M -25 -6 Q 0 -32 25 -6" }
      ];
    }
  }

  addPenroseMarkings();


  function tileDisplayName(tileType) {
    const names = {
      H2A: "H2A",
      H5: "H5",
      B0: "bubble tile 0",
      B1: "bubble tile 1",
      B2A: "bubble tile 2A",
      B2B: "bubble tile 2B",
      B2C: "bubble tile 2C",
      B3A: "bubble tile 3A",
      B3ASTAR: "bubble tile 3A*",
      B3B: "bubble tile 3B",
      B3C: "bubble tile 3C",
      B4A: "bubble tile 4A",
      B4B: "bubble tile 4B",
      B4C: "bubble tile 4C",
      B5: "bubble tile 5",
      B6: "bubble tile 6",
      T0: "triangular bubble tile 0",
      T1: "triangular bubble tile 1",
      T2: "triangular bubble tile 2",
      T3: "triangular bubble tile 3",
      Q0: "square bubble tile 0",
      Q1: "square bubble tile 1",
      Q2A: "square bubble tile 2A",
      Q2B: "square bubble tile 2B",
      Q3: "square bubble tile 3",
      Q4: "square bubble tile 4",
      PH0: "hexagonal puzzle tile 0",
      PH1: "hexagonal puzzle tile 1",
      PH2A: "hexagonal puzzle tile 2A",
      PH2B: "hexagonal puzzle tile 2B",
      PH2C: "hexagonal puzzle tile 2C",
      PH3A: "hexagonal puzzle tile 3A",
      PH3ASTAR: "hexagonal puzzle tile 3A*",
      PH3B: "hexagonal puzzle tile 3B",
      PH3C: "hexagonal puzzle tile 3C",
      PH4A: "hexagonal puzzle tile 4A",
      PH4B: "hexagonal puzzle tile 4B",
      PH4C: "hexagonal puzzle tile 4C",
      PH5: "hexagonal puzzle tile 5",
      PH6: "hexagonal puzzle tile 6",
      PT0: "triangular puzzle tile 0",
      PT1: "triangular puzzle tile 1",
      PT2: "triangular puzzle tile 2",
      PT3: "triangular puzzle tile 3",
      PQ0: "square puzzle tile 0",
      PQ1: "square puzzle tile 1",
      PQ2A: "square puzzle tile 2A",
      PQ2B: "square puzzle tile 2B",
      PQ3: "square puzzle tile 3",
      PQ4: "square puzzle tile 4",
      FMINI: "Mini Frame",
      F13: "13 Tile Frame",
      FLARGE: "Large Frame",
      PRTHICK: "Penrose thick rhomb",
      PRTHIN: "Penrose thin rhomb",
      PKITE: "Penrose kite",
      PDART: "Penrose dart",
      HAT: "Hat / Einstein monotile",
      TURTLE: "Turtle monotile",
      SPECTRE: "Spectre monotile",
      TET_I: "I tetromino",
      TET_O: "O tetromino",
      TET_T: "T tetromino",
      TET_L: "L tetromino",
      TET_S: "S tetromino",
      PENT_F: "F pentomino",
      PENT_I: "I pentomino",
      PENT_L: "L pentomino",
      PENT_N: "N pentomino",
      PENT_P: "P pentomino",
      PENT_T: "T pentomino",
      PENT_U: "U pentomino",
      PENT_V: "V pentomino",
      PENT_W: "W pentomino",
      PENT_X: "X pentomino",
      PENT_Y: "Y pentomino",
      PENT_Z: "Z pentomino",
      SH_TRAP: "trapezoid",
      SH_PARA: "parallelogram",
      SH_RHOMBUS: "rhombus",
      SH_RECT: "rectangle",
      SH_RIGHT_TRI: "right triangle",
      SH_SMALL_TRI: "small triangle",
      SH_CHEVRON: "chevron",
      SH_KITE: "kite",
      SH_DART: "dart",
      TRI: "triangle",
      SQUARE: "square",
      PENT: "pentagon",
      HEX: "hexagon",
      HEPT: "heptagon",
      OCT: "octagon"
    };

    return names[tileType] || tileType;
  }

  function createTileIconSvg(tileType, className = "bubble-icon-svg") {
    const definition = tileDefinitions[tileType];

    if (!definition) return null;

    const iconSvg = document.createElementNS(SVG_NS, "svg");
    iconSvg.setAttribute("class", className);

    const viewRadius = Math.max(108, (definition.radius || 108) + (definition.isFrame ? 30 : 12));

    iconSvg.setAttribute("viewBox", `${-viewRadius} ${-viewRadius} ${2 * viewRadius} ${2 * viewRadius}`);
    iconSvg.setAttribute("aria-hidden", "true");

    let shape;

    if (definition.path) {
      shape = document.createElementNS(SVG_NS, "path");
      shape.setAttribute("d", definition.path);
    } else {
      shape = document.createElementNS(SVG_NS, "polygon");
      shape.setAttribute("points", definition.points);
    }

    setShapePaint(shape, (typeof state !== "undefined" ? state : (typeof tileState !== "undefined" ? tileState : null)), definition);

    if (definition.fillRule) {
      shape.setAttribute("fill-rule", definition.fillRule);
    }

    iconSvg.appendChild(shape);
    appendTileDecorations(iconSvg, definition);

    return iconSvg;
  }

  function populateBubbleTrayIcons() {
    document.querySelectorAll("[data-bubble-icon]").forEach(slot => {
      const tileType = slot.dataset.bubbleIcon;
      const iconSvg = createTileIconSvg(tileType);

      if (!iconSvg) return;

      slot.innerHTML = "";
      slot.appendChild(iconSvg);
    });
  }

  const initialViewBox = { x: 0, y: 0, width: 1000, height: 700 };
  let viewBox = { ...initialViewBox };

  let tiles = {};
  let groups = {};
  let creationOrder = [];
  let groupCreationOrder = [];
  let selected = new Set();
  let nextTileNumber = 1;
  let nextGroupNumber = 1;
  let nextNewTileOffset = 0;

  let drag = null;
  let rotation = null;
  let pan = null;
  let boxSelect = null;
  let ctrlTilePan = null;
  let paletteDrag = null;

  let history = [];
  let historyIndex = -1;
  let restoringHistory = false;

  let clipboard = null;
  let clipboardPasteCount = 0;
  let spacePanMode = false;
  let overlapWarningFrameRequest = null;
  let overlapComputationCache = null;

  let latticeFills = [];
  let nextLatticeNumber = 1;
  let activeLatticeBuilder = null;
  let latticeDrag = null;

  let canvasBackgroundColor = "#fafafa";
  let latticeCopyOpacity = 0.62;
  let exportArea = { x: 0, y: 0, width: 1000, height: 700 };
  let exportAreaDrag = null;

  let placementHintsSuppressed = false;
  let hasShown13FrameHint = false;
  let hasShown3AHint = false;
  let hasShownOverlapHint = false;
  let temporaryHintTimer = null;
  let latticeParentFlashTimer = null;
  let patternInstanceNumber = 1;

  const FOOD_FILL_IMAGES = {
    cookie: "assets/food-cookie.png",
    oreo: "assets/food-oreo.png",
    donut: "assets/food-donut-sprinkle.png",
    donutChocolate: "assets/food-donut-chocolate.png",
    donutGlazed: "assets/food-donut-glazed.png"
  };

  let guidedTutorialStep = 0;

  const builtinExamples = [{"id":"one-of-each-frame-solution","title":"One-of-Each Frame Solution","description":"A one-of-each solution for the 13 Tile Frame. This is one of 1500 solutions.","tags":["frames","hexagonal bubble tiles"],"layout":{"version":2,"tiles":[{"id":"tile1","tileType":"F13","x":250,"y":180,"rotation":0,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile2","tileType":"B0","x":128.144,"y":66.757,"rotation":-29.995,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile3","tileType":"B1","x":128.13,"y":343.851,"rotation":150.006,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile4","tileType":"B2A","x":488.1,"y":136.067,"rotation":30.005,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile5","tileType":"B2B","x":368.102,"y":205.306,"rotation":-149.994,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile6","tileType":"B2C","x":368.086,"y":343.87,"rotation":-149.994,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile7","tileType":"B3ASTAR","x":248.138,"y":136.049,"rotation":30.005,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile9","tileType":"B3B","x":8.151,"y":135.993,"rotation":-29.994,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile10","tileType":"B3C","x":8.137,"y":274.557,"rotation":-29.994,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile11","tileType":"B4A","x":368.144,"y":66.778,"rotation":-29.995,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile12","tileType":"B4B","x":128.144,"y":205.287,"rotation":-29.994,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile13","tileType":"B4C","x":248.137,"y":274.581,"rotation":-149.994,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile14","tileType":"B5","x":248.15,"y":-2.515,"rotation":-29.995,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile15","tileType":"B6","x":488.094,"y":274.601,"rotation":-29.994,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3}],"groups":[],"canvasBackgroundColor":"#fafafa","latticeCopyOpacity":0.62,"latticeFills":[]}},{"id":"mixed-bubble-tile-lattice-h4b-t1","title":"Mixed Bubble Tile Lattice H4B/T1","description":"A lattice-fill example combining H4B with triangular T1 bubble tiles.","tags":["lattice","mixed bubble tiles"],"layout":{"version":4,"canvasBackgroundColor":"#fafafa","latticeCopyOpacity":1,"tiles":[{"id":"tile53","tileType":"B4B","x":250,"y":180,"rotation":30,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile54","tileType":"T1","x":330,"y":226.188,"rotation":120,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile55","tileType":"T1","x":250,"y":272.376,"rotation":-60,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile56","tileType":"T1","x":330,"y":133.812,"rotation":-60,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3}],"groups":[],"latticeFills":[{"id":"lattice1","sourceIds":["tile55","tile53","tile54","tile56"],"vectorA":{"x":-80,"y":-138.564},"vectorB":{"x":160,"y":0}}]}},{"id":"square-bubble-tile-lattice-s3-s0","title":"Square Bubble Tile Lattice S3/S0","description":"A compact square bubble tile lattice using the S3/S0 pairing.","tags":["lattice","square bubble tiles"],"layout":{"version":3,"canvasBackgroundColor":"#fafafa","tiles":[{"id":"tile30","tileType":"PQ1","x":791.913,"y":699.925,"rotation":90,"flipX":1,"flipY":-1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile31","tileType":"PQ4","x":871.913,"y":699.925,"rotation":0,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile32","tileType":"PQ1","x":951.913,"y":699.925,"rotation":0,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3}],"groups":[{"id":"group4","children":["tile30","tile31","tile32"]}],"latticeFills":[{"id":"lattice1","sourceIds":["tile30","tile31","tile32"],"vectorA":{"x":240,"y":0},"vectorB":{"x":-80,"y":-80}}],"latticeCopyOpacity":0.62}},{"id":"hex-puzzle-spiral-h1-h5","title":"Hex Puzzle Spiral H1/H5","description":"A large spiral patch built from hexagonal puzzle tiles H1 and H5.","tags":["hexagonal puzzle tiles","spiral"],"layout":{"version":3,"canvasBackgroundColor":"#ffffff","tiles":[{"id":"tile5","tileType":"PH5","x":497.933,"y":357.228,"rotation":0,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile7","tileType":"PH5","x":428.651,"y":237.228,"rotation":-120,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile9","tileType":"PH5","x":359.369,"y":117.228,"rotation":-180,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile10","tileType":"PH1","x":359.369,"y":357.228,"rotation":0,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile18","tileType":"PH1","x":290.087,"y":237.228,"rotation":120,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile19","tileType":"PH5","x":220.805,"y":117.228,"rotation":120,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile20","tileType":"PH1","x":151.523,"y":237.228,"rotation":60,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile21","tileType":"PH5","x":82.241,"y":117.228,"rotation":120,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile22","tileType":"PH5","x":220.805,"y":357.228,"rotation":-180,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile23","tileType":"PH5","x":290.087,"y":477.228,"rotation":120,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile24","tileType":"PH5","x":428.651,"y":477.228,"rotation":60,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile27","tileType":"PH1","x":82.241,"y":357.228,"rotation":0,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile28","tileType":"PH1","x":151.523,"y":477.228,"rotation":-60,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile29","tileType":"PH1","x":220.805,"y":597.228,"rotation":-60,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile30","tileType":"PH1","x":359.369,"y":597.228,"rotation":-120,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile31","tileType":"PH1","x":497.933,"y":597.228,"rotation":-120,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile32","tileType":"PH1","x":567.215,"y":477.228,"rotation":-180,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile33","tileType":"PH1","x":636.497,"y":357.228,"rotation":-180,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile34","tileType":"PH1","x":567.215,"y":237.228,"rotation":120,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile35","tileType":"PH1","x":497.933,"y":117.228,"rotation":120,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile36","tileType":"PH1","x":428.651,"y":-2.772,"rotation":120,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile37","tileType":"PH1","x":290.087,"y":-2.772,"rotation":60,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile38","tileType":"PH1","x":151.523,"y":-2.772,"rotation":60,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile39","tileType":"PH1","x":12.959,"y":-2.772,"rotation":60,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile40","tileType":"PH5","x":12.959,"y":237.228,"rotation":60,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile41","tileType":"PH5","x":-56.323,"y":357.228,"rotation":60,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile42","tileType":"PH5","x":12.959,"y":477.228,"rotation":0,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile43","tileType":"PH5","x":82.241,"y":597.228,"rotation":0,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile44","tileType":"PH1","x":-56.323,"y":117.228,"rotation":0,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile45","tileType":"PH1","x":-125.605,"y":237.228,"rotation":0,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile46","tileType":"PH1","x":-194.887,"y":357.228,"rotation":0,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile47","tileType":"PH1","x":-125.605,"y":477.228,"rotation":-60,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile48","tileType":"PH1","x":-56.323,"y":597.228,"rotation":-60,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile49","tileType":"PH1","x":12.959,"y":717.228,"rotation":-60,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile50","tileType":"PH5","x":151.523,"y":717.228,"rotation":0,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile51","tileType":"PH5","x":290.087,"y":717.228,"rotation":-60,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile52","tileType":"PH5","x":428.651,"y":717.228,"rotation":-60,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile53","tileType":"PH5","x":567.215,"y":717.228,"rotation":-60,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile54","tileType":"PH5","x":636.497,"y":597.228,"rotation":-120,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile55","tileType":"PH5","x":705.779,"y":477.228,"rotation":-120,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile56","tileType":"PH1","x":82.241,"y":837.228,"rotation":-60,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile57","tileType":"PH1","x":220.805,"y":837.228,"rotation":-120,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile58","tileType":"PH1","x":359.369,"y":837.228,"rotation":-120,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile59","tileType":"PH1","x":497.933,"y":837.228,"rotation":-120,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile60","tileType":"PH1","x":636.497,"y":837.228,"rotation":-120,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile61","tileType":"PH1","x":705.779,"y":717.228,"rotation":180,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile62","tileType":"PH1","x":775.061,"y":597.228,"rotation":180,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile63","tileType":"PH5","x":775.061,"y":837.228,"rotation":-120,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile64","tileType":"PH5","x":844.343,"y":717.228,"rotation":-120,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile65","tileType":"PH5","x":775.061,"y":357.228,"rotation":-120,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile66","tileType":"PH5","x":705.779,"y":237.228,"rotation":-180,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile67","tileType":"PH5","x":636.497,"y":117.228,"rotation":180,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile68","tileType":"PH5","x":567.215,"y":-2.772,"rotation":-180,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile69","tileType":"PH1","x":844.343,"y":477.228,"rotation":180,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile70","tileType":"PH1","x":913.625,"y":357.228,"rotation":-180,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile71","tileType":"PH1","x":844.343,"y":237.228,"rotation":120,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile72","tileType":"PH1","x":775.061,"y":117.228,"rotation":120,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile73","tileType":"PH1","x":705.779,"y":-2.772,"rotation":120,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile74","tileType":"PH5","x":497.933,"y":-122.772,"rotation":-180,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile75","tileType":"PH1","x":636.497,"y":-122.772,"rotation":120,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile76","tileType":"PH5","x":359.369,"y":-122.772,"rotation":120,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile77","tileType":"PH5","x":220.805,"y":-122.772,"rotation":120,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile78","tileType":"PH5","x":82.241,"y":-122.772,"rotation":120,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile79","tileType":"PH5","x":-56.323,"y":-122.772,"rotation":120,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile80","tileType":"PH5","x":-125.605,"y":-2.772,"rotation":60,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile81","tileType":"PH5","x":-194.887,"y":117.228,"rotation":60,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile82","tileType":"PH5","x":-264.169,"y":237.228,"rotation":60,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile83","tileType":"PH5","x":-333.451,"y":357.228,"rotation":60,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile84","tileType":"PH5","x":-264.169,"y":477.228,"rotation":0,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile85","tileType":"PH5","x":-194.887,"y":597.228,"rotation":0,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile86","tileType":"PH5","x":-125.605,"y":717.228,"rotation":0,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile87","tileType":"PH5","x":12.959,"y":957.228,"rotation":0,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile88","tileType":"PH5","x":-56.323,"y":837.228,"rotation":0,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile89","tileType":"PH5","x":151.523,"y":957.228,"rotation":-60,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile90","tileType":"PH5","x":290.087,"y":957.228,"rotation":-60,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile91","tileType":"PH5","x":428.651,"y":957.228,"rotation":-60,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile92","tileType":"PH5","x":567.215,"y":957.228,"rotation":-60,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile93","tileType":"PH5","x":705.779,"y":957.228,"rotation":-60,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile94","tileType":"PH5","x":913.625,"y":597.228,"rotation":-120,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile95","tileType":"PH5","x":982.907,"y":477.228,"rotation":-120,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile96","tileType":"PH5","x":1052.189,"y":357.228,"rotation":-120,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile97","tileType":"PH5","x":982.907,"y":237.228,"rotation":180,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile98","tileType":"PH5","x":913.625,"y":117.228,"rotation":180,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile99","tileType":"PH5","x":844.343,"y":-2.772,"rotation":180,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile100","tileType":"PH5","x":775.061,"y":-122.772,"rotation":180,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile101","tileType":"PH5","x":705.779,"y":-242.772,"rotation":180,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile102","tileType":"PH1","x":567.215,"y":-242.772,"rotation":120,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile103","tileType":"PH1","x":428.651,"y":-242.772,"rotation":60,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile104","tileType":"PH1","x":290.087,"y":-242.772,"rotation":60,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile105","tileType":"PH1","x":151.523,"y":-242.772,"rotation":60,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile106","tileType":"PH1","x":12.959,"y":-242.772,"rotation":60,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile107","tileType":"PH1","x":-125.605,"y":-242.772,"rotation":60,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile108","tileType":"PH1","x":-194.887,"y":-122.772,"rotation":0,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile109","tileType":"PH1","x":-264.169,"y":-2.772,"rotation":0,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile110","tileType":"PH1","x":-333.451,"y":117.228,"rotation":0,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile111","tileType":"PH1","x":-402.733,"y":237.228,"rotation":0,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3},{"id":"tile112","tileType":"PH1","x":-472.015,"y":357.228,"rotation":0,"flipX":1,"flipY":1,"fillColor":null,"strokeColor":null,"fillPattern":"solid","strokeStyle":"solid","strokeWidth":3}],"groups":[],"latticeFills":[],"latticeCopyOpacity":0.62}},{"id":"spectre-cluster","title":"Spectre Cluster","description":"A starter cluster made with Spectre monotiles.","tags":["monotiles","spectre"],"layout":{"version":2,"tiles":[{"id":"tile4","tileType":"SPECTRE","x":228.855,"y":318.234,"rotation":0,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile5","tileType":"SPECTRE","x":629.456,"y":234.571,"rotation":-180,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile6","tileType":"SPECTRE","x":440.174,"y":183.853,"rotation":-180,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile7","tileType":"SPECTRE","x":459.873,"y":685.425,"rotation":-60,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile8","tileType":"SPECTRE","x":237.687,"y":567.516,"rotation":-120,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile9","tileType":"SPECTRE","x":15.65,"y":451.699,"rotation":60,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile10","tileType":"SPECTRE","x":449.155,"y":435.227,"rotation":120,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile11","tileType":"SPECTRE","x":671.342,"y":553.135,"rotation":60,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile12","tileType":"SPECTRE","x":784.452,"y":385.384,"rotation":90,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3}],"groups":[],"canvasBackgroundColor":"#fafafa","latticeCopyOpacity":0.62,"latticeFills":[]}},{"id":"mixed-bubble-tile-lattice-full-set","title":"Mixed Bubble Tile Lattice Full Set","description":"A large lattice using the full hexagonal bubble family together with triangular bubble tiles.","tags":["lattice","mixed bubble tiles"],"layout":{"version":4,"canvasBackgroundColor":"#fafafa","latticeCopyOpacity":1,"tiles":[{"id":"tile1","tileType":"B0","x":-533.07,"y":380.406,"rotation":30,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile2","tileType":"B1","x":-373.07,"y":380.406,"rotation":30,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile3","tileType":"B2A","x":-213.07,"y":380.406,"rotation":30,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile4","tileType":"B2B","x":426.93,"y":380.406,"rotation":90,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile5","tileType":"B2C","x":106.93,"y":380.406,"rotation":30,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile6","tileType":"B3A","x":266.93,"y":380.406,"rotation":30,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile7","tileType":"B3ASTAR","x":-53.07,"y":380.406,"rotation":-30,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile8","tileType":"B3B","x":-613.07,"y":518.971,"rotation":30,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile9","tileType":"B3C","x":-453.07,"y":518.971,"rotation":30,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile10","tileType":"B4A","x":-293.07,"y":518.971,"rotation":30,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile11","tileType":"B4B","x":-133.07,"y":518.971,"rotation":30,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile12","tileType":"B4C","x":26.93,"y":518.971,"rotation":30,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile13","tileType":"B5","x":186.93,"y":518.971,"rotation":30,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile14","tileType":"B6","x":346.93,"y":518.971,"rotation":30,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile16","tileType":"T1","x":-533.07,"y":472.783,"rotation":-60,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile17","tileType":"T2","x":-533.07,"y":565.159,"rotation":0,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile18","tileType":"T3","x":26.93,"y":426.595,"rotation":0,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile21","tileType":"T2","x":-53.07,"y":565.159,"rotation":0,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile22","tileType":"T2","x":-373.07,"y":565.159,"rotation":0,"flipX":-1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile24","tileType":"T0","x":106.93,"y":565.159,"rotation":120,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile25","tileType":"T0","x":106.93,"y":472.783,"rotation":60,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile26","tileType":"T1","x":-213.07,"y":565.159,"rotation":120,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile27","tileType":"T1","x":266.93,"y":472.783,"rotation":-60,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile30","tileType":"T2","x":-453.07,"y":334.218,"rotation":60,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile33","tileType":"T1","x":-133.07,"y":334.218,"rotation":60,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile35","tileType":"T1","x":26.93,"y":334.218,"rotation":60,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile36","tileType":"T2","x":186.93,"y":426.595,"rotation":120,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile37","tileType":"T2","x":186.93,"y":334.218,"rotation":-60,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile38","tileType":"T1","x":346.93,"y":426.595,"rotation":0,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile40","tileType":"T1","x":-293.07,"y":334.218,"rotation":60,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile41","tileType":"T0","x":346.93,"y":334.218,"rotation":-180,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile42","tileType":"T1","x":266.93,"y":565.159,"rotation":120,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile43","tileType":"T2","x":426.93,"y":472.783,"rotation":-60,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile44","tileType":"T2","x":426.93,"y":565.159,"rotation":0,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile45","tileType":"T2","x":506.93,"y":334.218,"rotation":60,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile48","tileType":"T2","x":506.93,"y":426.595,"rotation":0,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile49","tileType":"T1","x":-53.07,"y":472.783,"rotation":-60,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile50","tileType":"T1","x":-213.07,"y":472.783,"rotation":-60,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile51","tileType":"T1","x":-133.07,"y":426.595,"rotation":120,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile52","tileType":"T3","x":-293.07,"y":426.595,"rotation":0,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile53","tileType":"T3","x":-453.07,"y":426.595,"rotation":0,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile54","tileType":"T2","x":-373.07,"y":472.783,"rotation":180,"flipX":-1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3}],"groups":[{"id":"group1","children":["tile1","tile2","tile3","tile4","tile5","tile6","tile7","tile8","tile9","tile10","tile11","tile12","tile13","tile14","tile16","tile17","tile18","tile21","tile22","tile24","tile25","tile26","tile27","tile30","tile33","tile35","tile36","tile37","tile38","tile40","tile41","tile42","tile43","tile44","tile45","tile48","tile49","tile50","tile51","tile52","tile53","tile54"]}],"latticeFills":[{"id":"lattice1","sourceIds":["tile1","tile2","tile3","tile4","tile5","tile6","tile7","tile8","tile9","tile10","tile11","tile12","tile13","tile14","tile16","tile17","tile18","tile21","tile22","tile24","tile25","tile26","tile27","tile30","tile33","tile35","tile36","tile37","tile38","tile40","tile41","tile42","tile43","tile44","tile45","tile48","tile49","tile50","tile51","tile52","tile53","tile54"],"vectorA":{"x":-80,"y":277.128},"vectorB":{"x":1120,"y":0}}]}},{"id":"hex-bubble-tile-lattice-h0-h4c","title":"Hex Bubble Tile Lattice H0/H4C","description":"A four-tile lattice seed using one H0 tile and three H4C tiles.","tags":["lattice","hexagonal bubble tiles"],"layout":{"version":4,"canvasBackgroundColor":"#fafafa","latticeCopyOpacity":1,"tiles":[{"id":"tile275","tileType":"B0","x":2038.866,"y":-293.565,"rotation":0,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile276","tileType":"B4C","x":1969.584,"y":-413.565,"rotation":60,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile277","tileType":"B4C","x":1900.302,"y":-293.565,"rotation":-180,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile278","tileType":"B4C","x":1969.584,"y":-173.565,"rotation":-60,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3}],"groups":[{"id":"group72","children":["tile275","tile276","tile277","tile278"]}],"latticeFills":[{"id":"lattice1","sourceIds":["tile275","tile276","tile277","tile278"],"vectorA":{"x":138.564,"y":-240},"vectorB":{"x":-138.564,"y":-240}}]}},{"id":"hex-bubble-tile-lattice-h1-h5","title":"Hex Bubble Tile Lattice H1/H5","description":"A two-tile lattice seed using the dual pair H1 and H5.","tags":["lattice","hexagonal bubble tiles"],"layout":{"version":4,"canvasBackgroundColor":"#fafafa","latticeCopyOpacity":1,"tiles":[{"id":"tile27","tileType":"B1","x":602.171,"y":498.507,"rotation":-30,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile28","tileType":"B5","x":722.171,"y":429.225,"rotation":30,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3}],"groups":[{"id":"group13","children":["tile27","tile28"]}],"latticeFills":[{"id":"lattice1","sourceIds":["tile27","tile28"],"vectorA":{"x":240,"y":-138.564},"vectorB":{"x":0,"y":-138.564}}]}},{"id":"regular-polygon-lattice-tri-square-hex","title":"Regular Polygon Lattice","description":"A colored lattice made from regular triangles, squares, and hexagons.","tags":["lattice","regular polygons"],"layout":{"version":4,"canvasBackgroundColor":"#fafafa","latticeCopyOpacity":1,"tiles":[{"id":"tile1","tileType":"HEX","x":573.967,"y":429.523,"rotation":0,"flipX":1,"flipY":1,"fillColor":"#9db5fb","fillPattern":"solid","strokeColor":"#000000","strokeStyle":"solid","strokeWidth":3.5},{"id":"tile2","tileType":"SQUARE","x":519.326,"y":334.882,"rotation":-30,"flipX":1,"flipY":1,"fillColor":"#9ffb9d","fillPattern":"solid","strokeColor":"#000000","strokeStyle":"solid","strokeWidth":3.5},{"id":"tile3","tileType":"TRI","x":573.967,"y":303.335,"rotation":60,"flipX":1,"flipY":1,"fillColor":"#fea9fb","fillPattern":"solid","strokeColor":"#000000","strokeStyle":"solid","strokeWidth":3.5},{"id":"tile7","tileType":"TRI","x":683.249,"y":366.429,"rotation":120,"flipX":1,"flipY":1,"fillColor":"#fea9fb","fillPattern":"solid","strokeColor":"#000000","strokeStyle":"solid","strokeWidth":3.5},{"id":"tile8","tileType":"SQUARE","x":628.608,"y":334.882,"rotation":-60,"flipX":1,"flipY":1,"fillColor":"#9ffb9d","fillPattern":"solid","strokeColor":"#000000","strokeStyle":"solid","strokeWidth":3.5},{"id":"tile9","tileType":"SQUARE","x":683.249,"y":429.523,"rotation":-90,"flipX":1,"flipY":1,"fillColor":"#9ffb9d","fillPattern":"solid","strokeColor":"#000000","strokeStyle":"solid","strokeWidth":3.5}],"groups":[{"id":"group1","children":["tile1","tile2","tile3","tile7","tile8","tile9"]}],"latticeFills":[{"id":"lattice1","sourceIds":["tile1","tile2","tile3","tile7","tile8","tile9"],"vectorA":{"x":218.564,"y":0},"vectorB":{"x":109.282,"y":189.282}}]}},{"id":"large-frame-styled-design","title":"Large Frame Styled Design","description":"A styled large-frame design with a dark background, thicker strokes, and patterned fills.","tags":["frames","style","hexagonal bubble tiles"],"layout":{"version":4,"canvasBackgroundColor":"#000000","latticeCopyOpacity":0.6,"tiles":[{"id":"tile1","tileType":"FLARGE","x":588.476,"y":203.133,"rotation":0,"flipX":1,"flipY":1,"fillColor":"#eade5d","fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":5},{"id":"tile4","tileType":"B4C","x":587.619,"y":-76.816,"rotation":-89.581,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"diagonal","strokeColor":null,"strokeStyle":"solid","strokeWidth":5},{"id":"tile5","tileType":"B4C","x":343.975,"y":62.234,"rotation":-149.58,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"diagonal","strokeColor":null,"strokeStyle":"solid","strokeWidth":5},{"id":"tile6","tileType":"B4C","x":341.607,"y":341.054,"rotation":150.42,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"diagonal","strokeColor":null,"strokeStyle":"solid","strokeWidth":5},{"id":"tile7","tileType":"B4C","x":582.864,"y":483.09,"rotation":90.42,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"diagonal","strokeColor":null,"strokeStyle":"solid","strokeWidth":5},{"id":"tile8","tileType":"B4C","x":826.507,"y":344.036,"rotation":30.42,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"diagonal","strokeColor":null,"strokeStyle":"solid","strokeWidth":5},{"id":"tile9","tileType":"B4C","x":827.897,"y":64.643,"rotation":-29.579,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"diagonal","strokeColor":null,"strokeStyle":"solid","strokeWidth":5},{"id":"tile11","tileType":"B3ASTAR","x":464.479,"y":-6.167,"rotation":-29.58,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"diagonal","strokeColor":null,"strokeStyle":"solid","strokeWidth":5},{"id":"tile12","tileType":"B3ASTAR","x":827.856,"y":204.91,"rotation":90.421,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"diagonal","strokeColor":null,"strokeStyle":"solid","strokeWidth":5},{"id":"tile13","tileType":"B3ASTAR","x":706.003,"y":412.438,"rotation":150.42,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"diagonal","strokeColor":null,"strokeStyle":"solid","strokeWidth":5},{"id":"tile14","tileType":"B3ASTAR","x":463.375,"y":412.93,"rotation":-149.58,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"diagonal","strokeColor":null,"strokeStyle":"solid","strokeWidth":5},{"id":"tile15","tileType":"B3ASTAR","x":342.622,"y":202.494,"rotation":-89.58,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"diagonal","strokeColor":null,"strokeStyle":"solid","strokeWidth":5},{"id":"tile16","tileType":"B3ASTAR","x":707.109,"y":-6.658,"rotation":30.419,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"diagonal","strokeColor":null,"strokeStyle":"solid","strokeWidth":5},{"id":"tile17","tileType":"B3C","x":707.018,"y":273.877,"rotation":30.42,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"diagonal","strokeColor":null,"strokeStyle":"solid","strokeWidth":5},{"id":"tile18","tileType":"B3C","x":464.391,"y":274.37,"rotation":30.42,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"diagonal","strokeColor":null,"strokeStyle":"solid","strokeWidth":5},{"id":"tile19","tileType":"B3C","x":586.605,"y":61.744,"rotation":30.419,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"diagonal","strokeColor":null,"strokeStyle":"solid","strokeWidth":5},{"id":"tile20","tileType":"B5","x":463.127,"y":134.093,"rotation":-29.58,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"diagonal","strokeColor":null,"strokeStyle":"solid","strokeWidth":6},{"id":"tile21","tileType":"B5","x":708.033,"y":135.317,"rotation":90.42,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"diagonal","strokeColor":null,"strokeStyle":"solid","strokeWidth":6},{"id":"tile22","tileType":"B5","x":586.514,"y":342.279,"rotation":-149.58,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"diagonal","strokeColor":null,"strokeStyle":"solid","strokeWidth":6},{"id":"tile23","tileType":"B0","x":584.896,"y":205.97,"rotation":30.42,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"diagonal","strokeColor":null,"strokeStyle":"solid","strokeWidth":6}],"groups":[],"latticeFills":[]}},{"id":"triangular-puzzle-tile-lattice","title":"Triangular Puzzle Tile Lattice","description":"A lattice-fill example using all four triangular puzzle tile types.","tags":["lattice","triangular puzzle tiles"],"layout":{"version":4,"canvasBackgroundColor":"#fafafa","latticeCopyOpacity":1,"tiles":[{"id":"tile5","tileType":"PT0","x":170.918,"y":-136.028,"rotation":-60,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile6","tileType":"PT1","x":130.918,"y":-112.934,"rotation":0,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile7","tileType":"PT2","x":170.918,"y":-182.216,"rotation":120,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile8","tileType":"PT3","x":210.918,"y":-112.934,"rotation":0,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile13","tileType":"PT0","x":90.918,"y":-182.216,"rotation":120,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile14","tileType":"PT1","x":130.918,"y":-205.31,"rotation":-180,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile15","tileType":"PT2","x":90.918,"y":-136.028,"rotation":-60,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3},{"id":"tile16","tileType":"PT3","x":50.918,"y":-205.31,"rotation":-180,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"solid","strokeColor":null,"strokeStyle":"solid","strokeWidth":3}],"groups":[{"id":"group3","children":["tile5","tile6","tile7","tile8"]},{"id":"group4","children":["tile13","tile14","tile15","tile16"]},{"id":"group6","children":["group3","group4"]}],"latticeFills":[{"id":"lattice1","sourceIds":["tile5","tile6","tile7","tile8","tile13","tile14","tile15","tile16"],"vectorA":{"x":160,"y":0},"vectorB":{"x":-80,"y":-138.564}}]}},{"id":"cookie-and-oreo-lattice","title":"Cookie and Oreo Lattice H4B/H1","description":"A food-fill lattice using chocolate chip cookie and Oreo hexagonal bubble tiles.","tags":["food fills","lattice","hexagonal bubble tiles"],"layout":{"version":4,"canvasBackgroundColor":"#fafafa","latticeCopyOpacity":1,"tiles":[{"id":"tile8","tileType":"B4B","x":641.335,"y":188.908,"rotation":-90,"flipX":1,"flipY":-1,"fillColor":null,"fillPattern":"cookie","fillOpacity":1,"strokeColor":"#030303","strokeStyle":"solid","strokeWidth":10},{"id":"tile9","tileType":"B4B","x":761.335,"y":119.626,"rotation":-150,"flipX":1,"flipY":-1,"fillColor":null,"fillPattern":"cookie","fillOpacity":1,"strokeColor":"#030303","strokeStyle":"solid","strokeWidth":10},{"id":"tile10","tileType":"B4B","x":881.335,"y":188.908,"rotation":-90,"flipX":1,"flipY":-1,"fillColor":null,"fillPattern":"cookie","fillOpacity":1,"strokeColor":"#030303","strokeStyle":"solid","strokeWidth":10},{"id":"tile11","tileType":"B4B","x":1121.335,"y":327.472,"rotation":-90,"flipX":1,"flipY":-1,"fillColor":null,"fillPattern":"cookie","fillOpacity":1,"strokeColor":"#030303","strokeStyle":"solid","strokeWidth":10},{"id":"tile14","tileType":"B4B","x":1241.335,"y":396.754,"rotation":30,"flipX":-1,"flipY":-1,"fillColor":null,"fillPattern":"cookie","fillOpacity":1,"strokeColor":"#030303","strokeStyle":"solid","strokeWidth":10},{"id":"tile15","tileType":"B4B","x":1001.335,"y":258.19,"rotation":90,"flipX":-1,"flipY":-1,"fillColor":null,"fillPattern":"cookie","fillOpacity":1,"strokeColor":"#030303","strokeStyle":"solid","strokeWidth":10},{"id":"tile16","tileType":"B4B","x":1241.335,"y":258.19,"rotation":90,"flipX":-1,"flipY":-1,"fillColor":null,"fillPattern":"cookie","fillOpacity":1,"strokeColor":"#030303","strokeStyle":"solid","strokeWidth":10},{"id":"tile17","tileType":"B4B","x":881.335,"y":50.344,"rotation":30,"flipX":-1,"flipY":-1,"fillColor":null,"fillPattern":"cookie","fillOpacity":1,"strokeColor":"#030303","strokeStyle":"solid","strokeWidth":10},{"id":"tile6","tileType":"B1","x":641.335,"y":327.472,"rotation":-150,"flipX":-1,"flipY":-1,"fillColor":null,"fillPattern":"oreo","fillOpacity":1,"strokeColor":"#030303","strokeStyle":"solid","strokeWidth":10},{"id":"tile7","tileType":"B1","x":761.335,"y":258.19,"rotation":90,"flipX":-1,"flipY":-1,"fillColor":null,"fillPattern":"oreo","fillOpacity":1,"strokeColor":"#030303","strokeStyle":"solid","strokeWidth":10},{"id":"tile12","tileType":"B1","x":1001.335,"y":119.626,"rotation":-90,"flipX":-1,"flipY":-1,"fillColor":null,"fillPattern":"oreo","fillOpacity":1,"strokeColor":"#030303","strokeStyle":"solid","strokeWidth":10},{"id":"tile13","tileType":"B1","x":1121.335,"y":188.908,"rotation":30,"flipX":-1,"flipY":-1,"fillColor":null,"fillPattern":"oreo","fillOpacity":1,"strokeColor":"#030303","strokeStyle":"solid","strokeWidth":10}],"groups":[],"latticeFills":[{"id":"lattice1","sourceIds":["tile6","tile7","tile8","tile9","tile10","tile11","tile12","tile13","tile14","tile15","tile16","tile17"],"vectorA":{"x":0,"y":277.128},"vectorB":{"x":-720,"y":0}}]}},{"id":"donut-trio-lattice","title":"Donut Trio Lattice H2B/H4A/3A","description":"A black-background lattice using the sprinkle, chocolate, and glazed donut fills.","tags":["food fills","donuts","lattice"],"layout":{"version":4,"canvasBackgroundColor":"#000000","latticeCopyOpacity":1,"tiles":[{"id":"tile7","tileType":"B2B","x":333.445,"y":261.796,"rotation":30,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"donut","fillOpacity":1,"strokeColor":"#000000","strokeStyle":"solid","strokeWidth":5},{"id":"tile8","tileType":"B4A","x":453.445,"y":331.078,"rotation":150,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"donutChocolate","fillOpacity":1,"strokeColor":"#000000","strokeStyle":"solid","strokeWidth":5},{"id":"tile9","tileType":"B3A","x":333.445,"y":400.36,"rotation":-90,"flipX":1,"flipY":1,"fillColor":null,"fillPattern":"donutGlazed","fillOpacity":1,"strokeColor":"#000000","strokeStyle":"solid","strokeWidth":5}],"groups":[{"id":"group1","children":["tile7","tile8","tile9"]}],"latticeFills":[{"id":"lattice1","sourceIds":["tile7","tile8","tile9"],"vectorA":{"x":120,"y":-207.846},"vectorB":{"x":240,"y":0}}]}}];

  function defaultStrokeColor() {
    return "#222222";
  }

  function defaultStrokeWidth() {
    return 3;
  }

  function foodFillColor(pattern) {
    if (pattern === "cookie") return "#d7a15f";
    if (pattern === "oreo") return "#27201f";
    if (pattern === "donut") return "#d49a55";
    if (pattern === "donutChocolate") return "#6b4027";
    if (pattern === "donutGlazed") return "#e8dcc8";
    return null;
  }

  function isFoodFillPattern(pattern) {
    return ["cookie", "oreo", "donut", "donutChocolate", "donutGlazed"].includes(pattern);
  }

  function tileFillColor(tileState, definition) {
    const pattern = tileFillPattern(tileState);
    if (["donut", "donutChocolate", "donutGlazed"].includes(pattern)) return "none";
    const foodColor = foodFillColor(pattern);

    if (foodColor) return foodColor;

    return tileState && tileState.fillColor ? tileState.fillColor : definition.color;
  }

  function tileFillPattern(tileState) {
    return tileState && tileState.fillPattern ? tileState.fillPattern : "solid";
  }

  function tileStrokeColor(tileState) {
    return tileState && tileState.strokeColor ? tileState.strokeColor : defaultStrokeColor();
  }

  function tileStrokeStyle(tileState) {
    return tileState && tileState.strokeStyle ? tileState.strokeStyle : "solid";
  }

  function tileStrokeWidth(tileState) {
    const width = tileState && Number.isFinite(Number(tileState.strokeWidth)) ? Number(tileState.strokeWidth) : defaultStrokeWidth();
    return Math.max(0, width);
  }

  function tileFillOpacity(tileState) {
    const value = tileState && Number.isFinite(Number(tileState.fillOpacity)) ? Number(tileState.fillOpacity) : 1;
    return Math.max(0.05, Math.min(1, value));
  }

  function formatDegreeValue(value) {
    const num = Number(value);
    if (!Number.isFinite(num)) return "15°";
    const rounded = Math.round(num * 100) / 100;
    return `${rounded}°`;
  }

  function formatMenuDegreeValue(value) {
    const num = Number(value);
    if (!Number.isFinite(num)) return "15°";
    const rounded = Math.round(num * 100) / 100;
    return `${rounded}°`;
  }

  function parseDegreeValue(raw) {
    if (typeof raw === "number" && Number.isFinite(raw)) return raw;
    const match = String(raw || "").match(/-?\d+(?:\.\d+)?/);
    if (!match) return 15;
    const num = Number(match[0]);
    return Number.isFinite(num) ? num : 15;
  }

  function getRotateStepDegrees() {
    return parseDegreeValue(buttons.rotateDegrees ? buttons.rotateDegrees.value : 15);
  }

  function normalizeRotationDegreeControls(source = null) {
    const value = source ? parseDegreeValue(source.value) : getRotateStepDegrees();
    if (buttons.rotateDegrees) buttons.rotateDegrees.value = formatDegreeValue(value);
    if (buttons.menuRotateDegrees) buttons.menuRotateDegrees.value = formatMenuDegreeValue(value);
    return value;
  }

  function strokeDashArrayForStyle(style, width) {
    if (style === "dashed") return `${Math.max(6, width * 3)} ${Math.max(4, width * 2)}`;
    if (style === "dotted") return `0 ${Math.max(5, width * 2.2)}`;
    return "";
  }

  function setShapePaint(shape, tileState, definition) {
    /*
      Use presentation attributes for export-friendly SVG, and CSS variables
      for the live canvas. The CSS variables prevent selected/lattice styling
      from accidentally overriding the user's stroke choices.
    */
    const fill = tileFillColor(tileState, definition);
    const stroke = tileStrokeColor(tileState);
    const strokeStyle = tileStrokeStyle(tileState);
    const strokeWidth = tileStrokeWidth(tileState);
    const dashArray = strokeDashArrayForStyle(strokeStyle, strokeWidth);
    const lineCap = strokeStyle === "dotted" ? "round" : "butt";

    shape.setAttribute("fill", fill);

    shape.style.setProperty("--tile-fill", fill);
    shape.style.setProperty("--tile-stroke", stroke);
    shape.style.setProperty("--tile-stroke-width", String(strokeWidth));
    shape.style.setProperty("--tile-stroke-dasharray", dashArray || "none");
    shape.style.setProperty("--tile-stroke-linecap", lineCap);
    shape.style.opacity = String(tileFillOpacity(tileState));
    shape.setAttribute("opacity", String(tileFillOpacity(tileState)));

    if (strokeStyle === "none" || strokeWidth <= 0) {
      shape.setAttribute("stroke", "none");
      shape.setAttribute("stroke-width", "0");
      shape.setAttribute("stroke-dasharray", "none");
      shape.setAttribute("stroke-linecap", lineCap);

      shape.style.setProperty("--tile-stroke", "none");
      shape.style.setProperty("--tile-stroke-width", "0");
      shape.style.setProperty("--tile-stroke-dasharray", "none");
      shape.style.setProperty("--tile-stroke-linecap", lineCap);
    shape.style.opacity = String(tileFillOpacity(tileState));
    shape.setAttribute("opacity", String(tileFillOpacity(tileState)));
      return;
    }

    shape.setAttribute("stroke", stroke);
    shape.setAttribute("stroke-width", String(strokeWidth));
    shape.setAttribute("stroke-dasharray", dashArray || "none");
    shape.setAttribute("stroke-linecap", lineCap);
  }

  function appendTileDecorations(parent, definition) {
    if (!definition || !Array.isArray(definition.decorations)) return;

    definition.decorations.forEach(decoration => {
      const path = document.createElementNS(SVG_NS, "path");
      path.setAttribute("class", decoration.className || "penrose-decoration");
      path.setAttribute("d", decoration.d);
      parent.appendChild(path);
    });
  }

  function createShapeForDefinition(definition) {
    let shape;

    if (definition.path) {
      shape = document.createElementNS(SVG_NS, "path");
      shape.setAttribute("d", definition.path);
    } else {
      shape = document.createElementNS(SVG_NS, "polygon");
      shape.setAttribute("points", definition.points);
    }

    if (definition.fillRule) {
      shape.setAttribute("fill-rule", definition.fillRule);
    }

    return shape;
  }


  function appendTileHitArea(parent, definition) {
    const hitArea = createShapeForDefinition(definition);
    hitArea.setAttribute("class", "tile-hit-area");
    hitArea.setAttribute("fill", "#ffffff");
    hitArea.setAttribute("fill-opacity", "0.001");
    hitArea.setAttribute("stroke", "none");
    hitArea.setAttribute("pointer-events", "all");
    parent.appendChild(hitArea);
  }

  function appendFillPattern(parent, definition, tileState, uniquePrefix) {
    const pattern = tileFillPattern(tileState);

    if (!pattern || pattern === "solid") return;

    const radius = Math.max(120, (definition.radius || SIDE_LENGTH) + 22);
    const clipId = "clip-" + uniquePrefix + "-" + (patternInstanceNumber++);

    const defs = document.createElementNS(SVG_NS, "defs");
    const clipPath = document.createElementNS(SVG_NS, "clipPath");
    clipPath.setAttribute("id", clipId);
    clipPath.appendChild(createShapeForDefinition(definition));
    defs.appendChild(clipPath);
    parent.appendChild(defs);

    const overlay = document.createElementNS(SVG_NS, "g");
    overlay.setAttribute("clip-path", `url(#${clipId})`);
    overlay.setAttribute("pointer-events", "none");
    overlay.setAttribute("opacity", isFoodFillPattern(pattern) ? "1" : "0.34");

    const stroke = tileStrokeColor(tileState);
    const spacing = 18;

    function addLine(x1, y1, x2, y2, lineStroke = stroke, width = 2.2) {
      const line = document.createElementNS(SVG_NS, "line");
      line.setAttribute("x1", x1);
      line.setAttribute("y1", y1);
      line.setAttribute("x2", x2);
      line.setAttribute("y2", y2);
      line.setAttribute("stroke", lineStroke);
      line.setAttribute("stroke-width", String(width));
      line.setAttribute("stroke-linecap", "round");
      overlay.appendChild(line);
    }

    function addCircle(cx, cy, r, fill, circleStroke = null, width = 0) {
      const circle = document.createElementNS(SVG_NS, "circle");
      circle.setAttribute("cx", cx);
      circle.setAttribute("cy", cy);
      circle.setAttribute("r", r);
      circle.setAttribute("fill", fill);

      if (circleStroke) {
        circle.setAttribute("stroke", circleStroke);
        circle.setAttribute("stroke-width", String(width));
      }

      overlay.appendChild(circle);
    }

    function addPath(d, fill, pathStroke = null, width = 0) {
      const path = document.createElementNS(SVG_NS, "path");
      path.setAttribute("d", d);
      path.setAttribute("fill", fill);

      if (pathStroke) {
        path.setAttribute("stroke", pathStroke);
        path.setAttribute("stroke-width", String(width));
        path.setAttribute("stroke-linejoin", "round");
        path.setAttribute("stroke-linecap", "round");
      }

      overlay.appendChild(path);
    }

    function addDots() {
      for (let x = -radius; x <= radius; x += spacing) {
        for (let y = -radius; y <= radius; y += spacing) {
          addCircle(x, y, 2.4, stroke);
        }
      }
    }

    function addCookieChips() {
      const chips = [
        [-62, -48, 8], [-18, -68, 6.5], [42, -54, 7.5],
        [-82, 2, 6.5], [-24, -6, 8], [48, -12, 6],
        [-52, 46, 7], [8, 38, 6.5], [72, 48, 8],
        [18, 78, 5.5]
      ];

      chips.forEach(([cx, cy, r]) => addCircle(cx, cy, r, "#4f2f1c"));
      addCircle(-4, -2, radius * 0.70, "none", "rgba(255,255,255,0.16)", 4);
    }

    function addOreoCream() {
      addCircle(0, 0, radius * 0.55, "#f8f5ec", "#15110f", 3.5);
      addCircle(0, 0, radius * 0.31, "#f8f5ec", "#6a5d55", 1.6);
      addCircle(0, 0, radius * 0.07, "#6a5d55");

      const detailStroke = "#f0e9d8";
      for (let angle = 0; angle < 360; angle += 45) {
        const radians = angle * Math.PI / 180;
        const x1 = Math.cos(radians) * radius * 0.36;
        const y1 = Math.sin(radians) * radius * 0.36;
        const x2 = Math.cos(radians) * radius * 0.50;
        const y2 = Math.sin(radians) * radius * 0.50;
        addLine(x1, y1, x2, y2, detailStroke, 2);
      }

      for (let angle = 22.5; angle < 360; angle += 45) {
        const radians = angle * Math.PI / 180;
        addCircle(Math.cos(radians) * radius * 0.43, Math.sin(radians) * radius * 0.43, 3.2, "#6a5d55");
      }
    }

    function addFoodImage(foodKey) {
      const href = FOOD_FILL_IMAGES[foodKey];
      if (!href) return false;
      const image = document.createElementNS(SVG_NS, "image");
      image.setAttribute("href", href);
      image.setAttributeNS("http://www.w3.org/1999/xlink", "href", href);
      image.setAttribute("x", String(-radius));
      image.setAttribute("y", String(-radius));
      image.setAttribute("width", String(radius * 2));
      image.setAttribute("height", String(radius * 2));
      image.setAttribute("preserveAspectRatio", "xMidYMid slice");
      overlay.appendChild(image);
      return true;
    }

    if (isFoodFillPattern(pattern)) {
      addFoodImage(pattern);
      parent.appendChild(overlay);
      return;
    }

    if (pattern === "dots") {
      addDots();
    } else if (pattern === "diagonal") {
      for (let offset = -2 * radius; offset <= 2 * radius; offset += spacing) {
        addLine(offset, -radius, offset + 2 * radius, radius);
      }
    } else if (pattern === "crosshatch") {
      for (let offset = -2 * radius; offset <= 2 * radius; offset += spacing) {
        addLine(offset, -radius, offset + 2 * radius, radius);
        addLine(offset, radius, offset + 2 * radius, -radius);
      }
    } else if (pattern === "horizontal") {
      for (let y = -radius; y <= radius; y += spacing) {
        addLine(-radius, y, radius, y);
      }
    }

    parent.appendChild(overlay);
  }

  function applyCanvasBackground() {
    svg.style.backgroundColor = canvasBackgroundColor;

    if (buttons.canvasColorPicker) {
      buttons.canvasColorPicker.value = canvasBackgroundColor;
    }
  }

  function applyLatticeOpacity() {
    if (buttons.latticeOpacity) {
      const opacity = Number(buttons.latticeOpacity.value);
      if (Number.isFinite(opacity)) {
        latticeCopyOpacity = opacity;
      }
    }

    document.body.style.setProperty("--lattice-copy-opacity", String(latticeCopyOpacity));
  }

  function showLatticeHint(message) {
    if (!latticeHint) return;
    latticeHint.textContent = message;
    latticeHint.hidden = false;
  }

  function hideLatticeHint() {
    if (!latticeHint) return;
    latticeHint.hidden = true;
  }

  function showTemporaryHint(message, duration = 9000) {
    if (!latticeHint || activeLatticeBuilder) return;

    if (temporaryHintTimer) {
      clearTimeout(temporaryHintTimer);
      temporaryHintTimer = null;
    }

    latticeHint.textContent = message;
    latticeHint.hidden = false;

    temporaryHintTimer = setTimeout(() => {
      if (!activeLatticeBuilder) {
        hideLatticeHint();
      }

      temporaryHintTimer = null;
    }, duration);
  }

  function maybeShowPlacementHint(tileType) {
    if (placementHintsSuppressed) return;

    if (tileType === "F13" && !hasShown13FrameHint) {
      hasShown13FrameHint = true;
      showTemporaryHint("13 Tile Frame note: this frame uses one member of the chiral 3A pair at a time. It does not use both 3A and 3A* together in the same frame. If a 3A tile seems mirrored, use Flip to switch to 3A*.");
      return;
    }

    if (["B3A", "B3ASTAR", "PH3A", "PH3ASTAR"].includes(tileType) && !hasShown3AHint) {
      hasShown3AHint = true;
      showTemporaryHint("3A / 3A* note: these tiles are chiral mirror partners. The reflection of 3A is 3A*, and the reflection of 3A* is 3A. Use Flip H or Flip V to switch between them.");
    }
  }

  function setStatus(message) {
    status.textContent = message;
  }

  function orderedTileIds() {
    return creationOrder.filter(id => tiles[id]);
  }

  function selectedIds() {
    return Array.from(selected).filter(id => tiles[id]);
  }

  function isGroupId(entityId) {
    return Boolean(groups[entityId]);
  }

  function entityExists(entityId) {
    return Boolean(tiles[entityId] || groups[entityId]);
  }

  function getEntityParent(entityId) {
    if (tiles[entityId]) return tiles[entityId].parent || null;
    if (groups[entityId]) return groups[entityId].parent || null;
    return null;
  }

  function setEntityParent(entityId, parentId) {
    if (tiles[entityId]) {
      tiles[entityId].parent = parentId;
    } else if (groups[entityId]) {
      groups[entityId].parent = parentId;
    }
  }

  function leafTileIdsForEntity(entityId) {
    if (tiles[entityId]) return [entityId];
    if (!groups[entityId]) return [];

    return groups[entityId].children.flatMap(childId => leafTileIdsForEntity(childId));
  }

  function outermostEntityForTile(tileId) {
    let entityId = tileId;
    let parentId = getEntityParent(entityId);

    while (parentId && entityExists(parentId)) {
      entityId = parentId;
      parentId = getEntityParent(entityId);
    }

    return entityId;
  }

  function topLevelEntities() {
    const entities = [];

    groupCreationOrder.forEach(groupId => {
      if (groups[groupId] && !groups[groupId].parent) entities.push(groupId);
    });

    creationOrder.forEach(tileId => {
      if (tiles[tileId] && !tiles[tileId].parent) entities.push(tileId);
    });

    return entities;
  }

  function selectedEntitiesForGrouping() {
    const selectedLeaves = new Set(selectedIds());
    const entities = [];

    function collect(entityId) {
      const leaves = leafTileIdsForEntity(entityId);

      if (leaves.length > 0 && leaves.every(tileId => selectedLeaves.has(tileId))) {
        entities.push(entityId);
        return;
      }

      if (groups[entityId]) {
        groups[entityId].children.forEach(collect);
      } else if (tiles[entityId] && selectedLeaves.has(entityId)) {
        entities.push(entityId);
      }
    }

    topLevelEntities().forEach(collect);

    const representedLeaves = new Set(entities.flatMap(entityId => leafTileIdsForEntity(entityId)));
    selectedLeaves.forEach(tileId => {
      if (!representedLeaves.has(tileId)) entities.push(tileId);
    });

    return Array.from(new Set(entities)).filter(entityExists);
  }

  function removeEntityFromParent(entityId) {
    const parentId = getEntityParent(entityId);

    if (parentId && groups[parentId]) {
      groups[parentId].children = groups[parentId].children.filter(childId => childId !== entityId);
    }

    setEntityParent(entityId, null);
  }

  function createGroupFromEntities(entityIds) {
    const children = entityIds.filter(entityExists);

    if (children.length === 0) return null;

    const groupId = "group" + nextGroupNumber;
    nextGroupNumber += 1;

    groups[groupId] = {
      id: groupId,
      children: children,
      parent: null
    };

    groupCreationOrder.push(groupId);

    children.forEach(childId => {
      removeEntityFromParent(childId);
      setEntityParent(childId, groupId);
    });

    return groupId;
  }

  function selectEntity(entityId) {
    selectMany(leafTileIdsForEntity(entityId));
  }

  function toggleEntitySelection(entityId) {
    const leaves = leafTileIdsForEntity(entityId);

    if (leaves.length === 0) return;

    const allSelected = leaves.every(tileId => selected.has(tileId));

    if (allSelected) {
      leaves.forEach(tileId => selected.delete(tileId));
    } else {
      leaves.forEach(tileId => selected.add(tileId));
    }

    updateSelectionClasses();
    updateRotationHandle();

    const count = selectedIds().length;
    setStatus(`${count} tile${count === 1 ? "" : "s"} selected.`);
  }


  function svgPoint(event) {
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    return point.matrixTransform(svg.getScreenCTM().inverse());
  }

  function distance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.hypot(dx, dy);
  }

  function midpoint(a, b) {
    return {
      x: (a.x + b.x) / 2,
      y: (a.y + b.y) / 2
    };
  }

  function rotatePoint(point, degrees) {
    const radians = degrees * Math.PI / 180;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    return {
      x: point.x * cos - point.y * sin,
      y: point.x * sin + point.y * cos
    };
  }

  function rotateAround(point, center, degrees) {
    const relative = {
      x: point.x - center.x,
      y: point.y - center.y
    };
    const rotated = rotatePoint(relative, degrees);
    return {
      x: center.x + rotated.x,
      y: center.y + rotated.y
    };
  }

  function angleFromCenter(point, center) {
    return Math.atan2(point.y - center.y, point.x - center.x) * 180 / Math.PI;
  }

  function angleBetweenPoints(a, b) {
    return Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
  }

  function groupCenter(ids) {
    const valid = ids.filter(id => tiles[id]);
    if (valid.length === 0) return { x: 0, y: 0 };

    let x = 0;
    let y = 0;
    valid.forEach(id => {
      x += tiles[id].x;
      y += tiles[id].y;
    });

    return { x: x / valid.length, y: y / valid.length };
  }

  function groupRadius(ids, center) {
    let radius = 0;

    ids.forEach(id => {
      if (!tiles[id]) return;

      const definition = tileDefinitions[tiles[id].tileType];
      const tileRadius = definition ? definition.radius : 80;
      radius = Math.max(radius, distance(center, tiles[id]) + tileRadius);
    });

    return Math.max(radius, 50);
  }

  function currentLayoutBounds() {
    const ids = orderedTileIds();
    if (ids.length === 0) return null;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    ids.forEach(id => {
      const state = tiles[id];
      const definition = state ? tileDefinitions[state.tileType] : null;
      if (!state || !definition) return;

      const radius = Number.isFinite(definition.radius) ? definition.radius : 80;
      minX = Math.min(minX, state.x - radius);
      maxX = Math.max(maxX, state.x + radius);
      minY = Math.min(minY, state.y - radius);
      maxY = Math.max(maxY, state.y + radius);
    });

    if (!Number.isFinite(minX) || !Number.isFinite(minY) || !Number.isFinite(maxX) || !Number.isFinite(maxY)) {
      return null;
    }

    return { minX, minY, maxX, maxY };
  }

  function boundsForLayoutData(layoutData) {
    if (!layoutData || !Array.isArray(layoutData.tiles) || layoutData.tiles.length === 0) return null;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    layoutData.tiles.forEach(tile => {
      const definition = tileDefinitions[tile.tileType];
      const x = Number(tile.x);
      const y = Number(tile.y);

      if (!definition || !Number.isFinite(x) || !Number.isFinite(y)) return;

      const radius = Number.isFinite(definition.radius) ? definition.radius : 80;
      minX = Math.min(minX, x - radius);
      maxX = Math.max(maxX, x + radius);
      minY = Math.min(minY, y - radius);
      maxY = Math.max(maxY, y + radius);
    });

    if (!Number.isFinite(minX) || !Number.isFinite(minY) || !Number.isFinite(maxX) || !Number.isFinite(maxY)) {
      return null;
    }

    return { minX, minY, maxX, maxY };
  }

  function boundsForTileIds(ids) {
    const uniqueIds = [...new Set(ids)].filter(id => tiles[id]);

    if (uniqueIds.length === 0) return null;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    uniqueIds.forEach(id => {
      const state = tiles[id];
      const definition = state ? tileDefinitions[state.tileType] : null;
      if (!state || !definition) return;

      const radius = Number.isFinite(definition.radius) ? definition.radius : 80;
      minX = Math.min(minX, state.x - radius);
      maxX = Math.max(maxX, state.x + radius);
      minY = Math.min(minY, state.y - radius);
      maxY = Math.max(maxY, state.y + radius);
    });

    if (!Number.isFinite(minX) || !Number.isFinite(minY) || !Number.isFinite(maxX) || !Number.isFinite(maxY)) {
      return null;
    }

    return { minX, minY, maxX, maxY };
  }

  function fitViewToBounds(bounds, padding = 90) {
    if (!bounds) return false;

    const centerX = (bounds.minX + bounds.maxX) / 2;
    const centerY = (bounds.minY + bounds.maxY) / 2;
    let width = Math.max(220, bounds.maxX - bounds.minX + padding * 2);
    let height = Math.max(160, bounds.maxY - bounds.minY + padding * 2);
    const aspect = initialViewBox.width / initialViewBox.height;

    if (width / height > aspect) {
      height = width / aspect;
    } else {
      width = height * aspect;
    }

    const maxSize = 5000;
    if (width > maxSize || height > maxSize) {
      const scale = maxSize / Math.max(width, height);
      width *= scale;
      height *= scale;
    }

    viewBox = {
      x: centerX - width / 2,
      y: centerY - height / 2,
      width,
      height
    };

    updateViewBox();
    return true;
  }

  function fitViewToTileIds(ids, padding = 140) {
    return fitViewToBounds(boundsForTileIds(ids), padding);
  }

  function latticeParentIds() {
    const ids = new Set();

    latticeFills.forEach(fill => {
      if (!fill || !Array.isArray(fill.sourceIds)) return;

      fill.sourceIds.forEach(id => {
        if (tiles[id]) ids.add(id);
      });
    });

    return [...ids];
  }

  function flashTiles(ids, className = "lattice-parent-flash", duration = 1600) {
    const uniqueIds = [...new Set(ids)].filter(id => tiles[id]);

    if (latticeParentFlashTimer) {
      clearTimeout(latticeParentFlashTimer);
      latticeParentFlashTimer = null;
    }

    document.querySelectorAll("." + className).forEach(element => {
      element.classList.remove(className);
    });

    uniqueIds.forEach(id => {
      const tile = getTileElement(id);
      if (tile) {
        // Restart the animation if Locate Parents is clicked repeatedly.
        tile.classList.remove(className);
        void tile.offsetWidth;
        tile.classList.add(className);
      }
    });

    latticeParentFlashTimer = setTimeout(() => {
      uniqueIds.forEach(id => {
        const tile = getTileElement(id);
        if (tile) tile.classList.remove(className);
      });

      latticeParentFlashTimer = null;
    }, duration);
  }

  function locateLatticeParents() {
    const ids = latticeParentIds();

    if (ids.length === 0) {
      setStatus("No lattice source tiles to locate.");
      return;
    }

    if (!fitViewToTileIds(ids, 150)) {
      setStatus("Could not locate lattice source tiles.");
      return;
    }

    flashTiles(ids);
    setStatus("Located " + ids.length + " lattice source tile" + (ids.length === 1 ? "" : "s") + ".");
  }

  function fitViewToCurrentLayout() {
    const bounds = currentLayoutBounds();

    if (!bounds) {
      viewBox = { ...initialViewBox };
      updateViewBox();
      return;
    }

    const padding = 90;
    const centerX = (bounds.minX + bounds.maxX) / 2;
    const centerY = (bounds.minY + bounds.maxY) / 2;
    let width = Math.max(220, bounds.maxX - bounds.minX + padding * 2);
    let height = Math.max(160, bounds.maxY - bounds.minY + padding * 2);
    const aspect = initialViewBox.width / initialViewBox.height;

    if (width / height > aspect) {
      height = width / aspect;
    } else {
      width = height * aspect;
    }

    const maxSize = 5000;
    if (width > maxSize || height > maxSize) {
      const scale = maxSize / Math.max(width, height);
      width *= scale;
      height *= scale;
    }

    viewBox = {
      x: centerX - width / 2,
      y: centerY - height / 2,
      width,
      height
    };

    updateViewBox();
  }

  function cloneLayoutData(layoutData) {
    return JSON.parse(JSON.stringify(layoutData));
  }

  function exampleById(exampleId) {
    return builtinExamples.find(example => example.id === exampleId) || null;
  }

  function switchTrayTab(tabName) {
    const showExamples = tabName === "examples";

    if (buttons.trayTilesTab) {
      buttons.trayTilesTab.classList.toggle("active", !showExamples);
      buttons.trayTilesTab.setAttribute("aria-selected", showExamples ? "false" : "true");
    }

    if (buttons.trayExamplesTab) {
      buttons.trayExamplesTab.classList.toggle("active", showExamples);
      buttons.trayExamplesTab.setAttribute("aria-selected", showExamples ? "true" : "false");
    }

    if (buttons.tilesPanel) {
      buttons.tilesPanel.hidden = showExamples;
    }

    if (buttons.examplesPanel) {
      buttons.examplesPanel.hidden = !showExamples;
    }
  }

  function loadExample(exampleId) {
    const example = exampleById(exampleId);

    if (!example) {
      setStatus("Example not found.");
      return;
    }

    try {
      loadLayoutData(cloneLayoutData(example.layout));
      fitViewToCurrentLayout();
      recordHistory();
      setStatus("Loaded example: " + example.title + ".");
    } catch (error) {
      setStatus("Could not load example.");
    }
  }

  function nextInsertedGroupId() {
    const groupId = "group" + nextGroupNumber;
    nextGroupNumber += 1;
    return groupId;
  }

  function insertLayoutData(layoutData) {
    const data = cloneLayoutData(layoutData);
    const bounds = boundsForLayoutData(data);
    const targetCenter = {
      x: viewBox.x + viewBox.width / 2,
      y: viewBox.y + viewBox.height / 2
    };
    const sourceCenter = bounds ? {
      x: (bounds.minX + bounds.maxX) / 2,
      y: (bounds.minY + bounds.maxY) / 2
    } : { x: 0, y: 0 };
    const offset = {
      x: targetCenter.x - sourceCenter.x,
      y: targetCenter.y - sourceCenter.y
    };

    const tileIdMap = {};
    const groupIdMap = {};
    const newTileIds = [];

    placementHintsSuppressed = true;

    if (Array.isArray(data.tiles)) {
      data.tiles.forEach(tile => {
        if (!tileDefinitions[tile.tileType]) return;

        const x = Number(tile.x);
        const y = Number(tile.y);
        const tileRotation = Number(tile.rotation || 0);
        if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(tileRotation)) return;

        const newId = addPlacedTile(tile.tileType, x + offset.x, y + offset.y, tileRotation);
        tileIdMap[tile.id] = newId;
        newTileIds.push(newId);

        tiles[newId].flipX = tile.flipX === -1 ? -1 : 1;
        tiles[newId].flipY = tile.flipY === -1 ? -1 : 1;
        tiles[newId].fillColor = typeof tile.fillColor === "string" ? tile.fillColor : null;
        tiles[newId].fillPattern = typeof tile.fillPattern === "string" ? tile.fillPattern : "solid";
        tiles[newId].fillOpacity = Number.isFinite(Number(tile.fillOpacity)) ? Math.max(0.05, Math.min(1, Number(tile.fillOpacity))) : 1;
        tiles[newId].strokeColor = typeof tile.strokeColor === "string" ? tile.strokeColor : null;
        tiles[newId].strokeStyle = typeof tile.strokeStyle === "string" ? tile.strokeStyle : "solid";
        tiles[newId].strokeWidth = Number.isFinite(Number(tile.strokeWidth)) ? Number(tile.strokeWidth) : defaultStrokeWidth();

        updateTileAppearance(newId);
        updateTileTransform(newId);
      });
    }

    if (Array.isArray(data.groups)) {
      data.groups.forEach(groupData => {
        if (!groupData || !groupData.id || !Array.isArray(groupData.children)) return;

        const mappedChildren = groupData.children
          .map(childId => tileIdMap[childId] || groupIdMap[childId])
          .filter(Boolean);

        if (mappedChildren.length === 0) return;

        const newGroupId = nextInsertedGroupId();
        groupIdMap[groupData.id] = newGroupId;

        groups[newGroupId] = {
          id: newGroupId,
          children: mappedChildren,
          parent: null
        };

        groupCreationOrder.push(newGroupId);
        mappedChildren.forEach(childId => setEntityParent(childId, newGroupId));
      });
    }

    if (Array.isArray(data.latticeFills)) {
      data.latticeFills.forEach(fill => {
        if (!fill || !Array.isArray(fill.sourceIds) || !fill.vectorA) return;

        const sourceIds = fill.sourceIds.map(sourceId => tileIdMap[sourceId]).filter(id => tiles[id]);
        if (sourceIds.length === 0) return;

        latticeFills.push({
          id: "lattice" + nextLatticeNumber++,
          sourceIds,
          vectorA: {
            x: Number(fill.vectorA.x) || 0,
            y: Number(fill.vectorA.y) || 0
          },
          vectorB: fill.vectorB ? {
            x: Number(fill.vectorB.x) || 0,
            y: Number(fill.vectorB.y) || 0
          } : null
        });
      });
    }

    placementHintsSuppressed = false;

    selectMany(newTileIds);
    renderLatticeFills();
    updateOverlapWarnings({ focusIds: newTileIds });
    recordHistory();

    return newTileIds.length;
  }

  function insertExample(exampleId) {
    const example = exampleById(exampleId);

    if (!example) {
      setStatus("Example not found.");
      return;
    }

    try {
      const insertedCount = insertLayoutData(example.layout);

      if (insertedCount === 0) {
        setStatus("Could not insert example.");
        return;
      }

      setStatus("Inserted example: " + example.title + ".");
    } catch (error) {
      placementHintsSuppressed = false;
      setStatus("Could not insert example.");
    }
  }

  function renderExampleList() {
    if (!buttons.examplesList) return;

    buttons.examplesList.innerHTML = "";

    builtinExamples.forEach(example => {
      const card = document.createElement("div");
      card.className = "example-card";

      const title = document.createElement("div");
      title.className = "example-card-title";

      const icon = document.createElement("span");
      icon.className = "example-card-icon";
      icon.textContent = "▦";

      const titleText = document.createElement("span");
      titleText.textContent = example.title;

      title.appendChild(icon);
      title.appendChild(titleText);

      const description = document.createElement("p");
      description.className = "example-card-description";
      description.textContent = example.description;

      const meta = document.createElement("div");
      meta.className = "example-card-meta";

      (example.tags || []).forEach(tag => {
        const tagSpan = document.createElement("span");
        tagSpan.className = "example-tag";
        tagSpan.textContent = tag;
        meta.appendChild(tagSpan);
      });

      const actions = document.createElement("div");
      actions.className = "example-card-actions";

      const loadButton = document.createElement("button");
      loadButton.type = "button";
      loadButton.textContent = "Load";
      loadButton.title = "Replace the current canvas with this example";
      loadButton.addEventListener("click", () => loadExample(example.id));

      const insertButton = document.createElement("button");
      insertButton.type = "button";
      insertButton.textContent = "Insert";
      insertButton.title = "Insert this example into the current canvas";
      insertButton.addEventListener("click", () => insertExample(example.id));

      actions.appendChild(loadButton);
      actions.appendChild(insertButton);

      card.appendChild(title);
      card.appendChild(description);
      card.appendChild(meta);
      card.appendChild(actions);

      buttons.examplesList.appendChild(card);
    });
  }

  function getTileElement(id) {
    return document.getElementById(id);
  }

  function worldVerticesForTile(id) {
    const state = tiles[id];
    const definition = tileDefinitions[state.tileType];

    return definition.vertices.map(vertex => {
      const reflected = {
        x: vertex.x * (state.flipX || 1),
        y: vertex.y * (state.flipY || 1)
      };
      const rotated = rotatePoint(reflected, state.rotation);
      return {
        x: state.x + rotated.x,
        y: state.y + rotated.y
      };
    });
  }

  function worldEdgesForTile(id) {
    const state = tiles[id];
    const definition = tileDefinitions[state.tileType];

    if (Array.isArray(definition.snapEdgesLocal)) {
      return definition.snapEdgesLocal.map(edge => ({
        ...edge,
        start: localPointToWorld(id, edge.start),
        end: localPointToWorld(id, edge.end)
      }));
    }

    const vertices = worldVerticesForTile(id);
    const edges = [];

    for (let i = 0; i < vertices.length; i += 1) {
      edges.push({
        start: vertices[i],
        end: vertices[(i + 1) % vertices.length],
        index: i,
        bite: definition.bites ? definition.bites[i] : null,
        isBubbleEdge: Array.isArray(definition.bites)
      });
    }

    return edges;
  }

  function edgesAreCompatible(anchorEdge, fixedEdge) {
    if (anchorEdge.isFrameSocket || fixedEdge.isFrameSocket) {
      if (anchorEdge.isBubbleEdge && fixedEdge.isBubbleEdge) {
        return anchorEdge.bite === fixedEdge.bite;
      }

      return true;
    }

    if (anchorEdge.isBubbleEdge && fixedEdge.isBubbleEdge) {
      return anchorEdge.bite !== fixedEdge.bite;
    }

    return true;
  }

  function tileWindingSign(tileId) {
    const state = tiles[tileId];

    if (!state) return 1;

    return (state.flipX || 1) * (state.flipY || 1);
  }

  function tileTransformString(x, y, rotation, flipX = 1, flipY = 1) {
    return `translate(${x} ${y}) rotate(${rotation}) scale(${flipX} ${flipY})`;
  }

  function localPointToWorld(tileId, point) {
    const state = tiles[tileId];

    if (!state) return { x: point.x, y: point.y };

    const reflected = {
      x: point.x * (state.flipX || 1),
      y: point.y * (state.flipY || 1)
    };

    const rotated = rotatePoint(reflected, state.rotation);

    return {
      x: state.x + rotated.x,
      y: state.y + rotated.y
    };
  }

  function worldPointToLocal(tileId, point) {
    const state = tiles[tileId];

    if (!state) return { x: point.x, y: point.y };

    const translated = {
      x: point.x - state.x,
      y: point.y - state.y
    };

    const unrotated = rotatePoint(translated, -state.rotation);

    return {
      x: unrotated.x / (state.flipX || 1),
      y: unrotated.y / (state.flipY || 1)
    };
  }

  function svgLocalPoint(point) {
    const svgPointObject = svg.createSVGPoint();
    svgPointObject.x = point.x;
    svgPointObject.y = point.y;
    return svgPointObject;
  }

  function pointInPolygon(point, vertices) {
    let inside = false;

    for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i, i += 1) {
      const xi = vertices[i].x;
      const yi = vertices[i].y;
      const xj = vertices[j].x;
      const yj = vertices[j].y;

      const intersects =
        (yi > point.y) !== (yj > point.y) &&
        point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi;

      if (intersects) inside = !inside;
    }

    return inside;
  }

  function shapeContainsLocalPoint(tileId, point) {
    const tile = getTileElement(tileId);
    const state = tiles[tileId];
    const definition = state ? tileDefinitions[state.tileType] : null;

    if (!tile || !state || !definition) return false;

    const shape = tile.querySelector("path, polygon");

    if (shape && typeof shape.isPointInFill === "function") {
      try {
        const localPoint = svgLocalPoint(point);

        if (!shape.isPointInFill(localPoint)) return false;

        if (typeof shape.isPointInStroke === "function" && shape.isPointInStroke(localPoint)) {
          return false;
        }

        return true;
      } catch (error) {
        // Fall through to polygon approximation.
      }
    }

    return pointInPolygon(point, definition.vertices);
  }

  function cachedOverlapSamples(tileId, kind, builder) {
    if (!overlapComputationCache) {
      return builder();
    }

    const key = kind + ":" + tileId;

    if (overlapComputationCache.has(key)) {
      return overlapComputationCache.get(key);
    }

    const value = builder();
    overlapComputationCache.set(key, value);
    return value;
  }

  function overlapSamplePointsForTile(tileId) {
    return cachedOverlapSamples(tileId, "interior", () => {
      const state = tiles[tileId];
      const definition = state ? tileDefinitions[state.tileType] : null;

      if (!state || !definition) return [];

      const radius = definition.radius || SIDE_LENGTH;
      const samples = [];
      const gridSize = definition.isFrame ? 9 : 11;
      const min = -radius * 0.96;
      const max = radius * 0.96;

      for (let row = 0; row < gridSize; row += 1) {
        for (let col = 0; col < gridSize; col += 1) {
          const point = {
            x: min + (max - min) * col / (gridSize - 1),
            y: min + (max - min) * row / (gridSize - 1)
          };

          if (shapeContainsLocalPoint(tileId, point)) {
            samples.push(localPointToWorld(tileId, point));
          }
        }
      }

      if (shapeContainsLocalPoint(tileId, { x: 0, y: 0 })) {
        samples.push(localPointToWorld(tileId, { x: 0, y: 0 }));
      }

      return samples;
    });
  }

  function boundarySamplePointsForTile(tileId) {
    return cachedOverlapSamples(tileId, "boundary", () => {
      const tile = getTileElement(tileId);
      const shape = tile ? tile.querySelector("path, polygon") : null;
      const points = [];

      if (!shape) return points;

      if (typeof shape.getTotalLength === "function" && typeof shape.getPointAtLength === "function") {
        try {
          const totalLength = shape.getTotalLength();
          const state = tiles[tileId];
          const definition = state ? tileDefinitions[state.tileType] : null;
          const sampleCount = definition && definition.isFrame ? 80 : 44;

          for (let i = 0; i < sampleCount; i += 1) {
            const point = shape.getPointAtLength(totalLength * i / sampleCount);
            points.push(localPointToWorld(tileId, { x: point.x, y: point.y }));
          }

          return points;
        } catch (error) {
          // Fall through to vertex samples.
        }
      }

      const state = tiles[tileId];
      const definition = state ? tileDefinitions[state.tileType] : null;

      if (definition && Array.isArray(definition.vertices)) {
        definition.vertices.forEach(vertex => points.push(localPointToWorld(tileId, vertex)));
      }

      return points;
    });
  }

  function tilesOverlap(tileIdA, tileIdB) {
    const stateA = tiles[tileIdA];
    const stateB = tiles[tileIdB];

    if (!stateA || !stateB) return false;

    const definitionA = tileDefinitions[stateA.tileType];
    const definitionB = tileDefinitions[stateB.tileType];

    if (!definitionA || !definitionB) return false;

    if (definitionA.isFrame || definitionB.isFrame) {
      if (definitionA.isFrame && definitionB.isFrame) return false;

      const frameId = definitionA.isFrame ? tileIdA : tileIdB;
      const otherId = definitionA.isFrame ? tileIdB : tileIdA;
      const otherDefinition = definitionA.isFrame ? definitionB : definitionA;
      const frameDefinition = definitionA.isFrame ? definitionA : definitionB;

      if (distance(tiles[frameId], tiles[otherId]) > (frameDefinition.radius || SIDE_LENGTH) + (otherDefinition.radius || SIDE_LENGTH) + 2) {
        return false;
      }

      const otherSamples = [
        ...overlapSamplePointsForTile(otherId),
        ...boundarySamplePointsForTile(otherId)
      ];

      for (const worldPoint of otherSamples) {
        if (shapeContainsLocalPoint(frameId, worldPointToLocal(frameId, worldPoint))) {
          return true;
        }
      }

      /*
        Also sample the frame boundary. This catches a tile crossing the edge
        of the frame material even when none of the tile's coarse interior
        sample points happen to land in the wood/material area.
      */
      const frameBoundarySamples = boundarySamplePointsForTile(frameId);

      for (const worldPoint of frameBoundarySamples) {
        if (shapeContainsLocalPoint(otherId, worldPointToLocal(otherId, worldPoint))) {
          return true;
        }
      }

      return false;
    }

    const centerDistance = distance(stateA, stateB);
    const radiusA = definitionA.radius || SIDE_LENGTH;
    const radiusB = definitionB.radius || SIDE_LENGTH;

    if (centerDistance > radiusA + radiusB + 2) return false;

    const samplesA = [
      ...overlapSamplePointsForTile(tileIdA),
      ...boundarySamplePointsForTile(tileIdA)
    ];

    for (const worldPoint of samplesA) {
      if (shapeContainsLocalPoint(tileIdB, worldPointToLocal(tileIdB, worldPoint))) {
        return true;
      }
    }

    const samplesB = [
      ...overlapSamplePointsForTile(tileIdB),
      ...boundarySamplePointsForTile(tileIdB)
    ];

    for (const worldPoint of samplesB) {
      if (shapeContainsLocalPoint(tileIdA, worldPointToLocal(tileIdA, worldPoint))) {
        return true;
      }
    }

    return false;
  }

  function clearOverlapWarnings() {
    document.querySelectorAll(".tile.overlapping").forEach(tile => {
      tile.classList.remove("overlapping");
    });
  }

  function tileWorldBounds(tileId) {
    const state = tiles[tileId];
    const definition = state ? tileDefinitions[state.tileType] : null;

    if (!state || !definition) {
      return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
    }

    /*
      Radius-based bounds are intentionally conservative. They are fast,
      rotation-proof, and safe for curved / puzzle / frame shapes.
    */
    const radius = (definition.radius || SIDE_LENGTH) + 8;

    return {
      minX: state.x - radius,
      minY: state.y - radius,
      maxX: state.x + radius,
      maxY: state.y + radius
    };
  }

  function boundsMayOverlap(boundsA, boundsB) {
    return (
      boundsA.maxX >= boundsB.minX &&
      boundsA.minX <= boundsB.maxX &&
      boundsA.maxY >= boundsB.minY &&
      boundsA.minY <= boundsB.maxY
    );
  }

  function potentialOverlapPairs(tileIds) {
    const cellSize = 240;
    const grid = new Map();
    const boundsByTileId = {};
    const pairs = new Set();

    function cellKey(x, y) {
      return x + "," + y;
    }

    tileIds.forEach(tileId => {
      const bounds = tileWorldBounds(tileId);
      boundsByTileId[tileId] = bounds;

      const minCellX = Math.floor(bounds.minX / cellSize);
      const maxCellX = Math.floor(bounds.maxX / cellSize);
      const minCellY = Math.floor(bounds.minY / cellSize);
      const maxCellY = Math.floor(bounds.maxY / cellSize);

      for (let cellX = minCellX; cellX <= maxCellX; cellX += 1) {
        for (let cellY = minCellY; cellY <= maxCellY; cellY += 1) {
          const key = cellKey(cellX, cellY);

          if (!grid.has(key)) {
            grid.set(key, []);
          }

          grid.get(key).push(tileId);
        }
      }
    });

    grid.forEach(cellTileIds => {
      for (let i = 0; i < cellTileIds.length; i += 1) {
        for (let j = i + 1; j < cellTileIds.length; j += 1) {
          const tileIdA = cellTileIds[i];
          const tileIdB = cellTileIds[j];

          if (!boundsMayOverlap(boundsByTileId[tileIdA], boundsByTileId[tileIdB])) {
            continue;
          }

          const pair = tileIdA < tileIdB ? tileIdA + "|" + tileIdB : tileIdB + "|" + tileIdA;
          pairs.add(pair);
        }
      }
    });

    return Array.from(pairs).map(pair => pair.split("|"));
  }

  function scheduleOverlapWarnings() {
    if (!overlapToggle || !overlapToggle.checked) {
      clearOverlapWarnings();
      return;
    }

    if (overlapWarningFrameRequest !== null) return;

    overlapWarningFrameRequest = requestAnimationFrame(() => {
      overlapWarningFrameRequest = null;
      updateOverlapWarnings();
    });
  }

  function updateOverlapWarnings(options = {}) {
    clearOverlapWarnings();

    if (!overlapToggle || !overlapToggle.checked) return;

    const tileIds = orderedTileIds();
    const focusIds = options.focusIds || selectedIds();
    const focusSet = new Set(focusIds);
    const useFocusedCheck = tileIds.length > 75 && focusSet.size > 0 && focusSet.size < tileIds.length;

    let candidatePairs = potentialOverlapPairs(tileIds);

    if (useFocusedCheck) {
      candidatePairs = candidatePairs.filter(pair => focusSet.has(pair[0]) || focusSet.has(pair[1]));
    }

    const overlappingIds = new Set();
    overlapComputationCache = new Map();

    try {
      candidatePairs.forEach(pair => {
        const tileIdA = pair[0];
        const tileIdB = pair[1];

        if (tilesOverlap(tileIdA, tileIdB)) {
          overlappingIds.add(tileIdA);
          overlappingIds.add(tileIdB);
        }
      });
    } finally {
      overlapComputationCache = null;
    }

    overlappingIds.forEach(tileId => {
      const tile = getTileElement(tileId);
      if (tile) tile.classList.add("overlapping");
    });

    if (useFocusedCheck) {
      setStatus("Overlap checked selected tiles against nearby neighbors.");
    } else if (candidatePairs.length > 350) {
      setStatus("Overlap checked nearby pairs only for speed.");
    }
  }

  function updateTileTransform(id) {
    const tile = getTileElement(id);
    const state = tiles[id];
    if (!tile || !state) return;
    tile.setAttribute(
      "transform",
      tileTransformString(state.x, state.y, state.rotation, state.flipX || 1, state.flipY || 1)
    );
  }

  function updateAllTileTransforms() {
    Object.keys(tiles).forEach(updateTileTransform);
    updateRotationHandle();
  }

  function bringTileToFront(id) {
    const tile = getTileElement(id);
    if (tile) tilesLayer.appendChild(tile);
    svg.appendChild(rotationHandle);
  }

  function bringSelectionToFront() {
    selectedIds().forEach(id => {
      const tile = getTileElement(id);
      if (tile) tilesLayer.appendChild(tile);
    });
    svg.appendChild(rotationHandle);
  }

  function syncTileLayerOrder() {
    creationOrder = creationOrder.filter(id => tiles[id]);

    creationOrder.forEach(id => {
      const tile = getTileElement(id);
      if (tile) tilesLayer.appendChild(tile);
    });

    svg.appendChild(rotationHandle);
  }

  function selectedIdsInLayerOrder() {
    const selectedSet = new Set(selectedIds());
    return orderedTileIds().filter(id => selectedSet.has(id));
  }

  function updateLayerOrder(action) {
    const selectedSet = new Set(selectedIds());

    if (selectedSet.size === 0) {
      setStatus("Select tiles before changing layer order.");
      return;
    }

    let order = orderedTileIds();
    const before = order.join("|");

    if (action === "top") {
      const moving = order.filter(id => selectedSet.has(id));
      order = order.filter(id => !selectedSet.has(id)).concat(moving);
    } else if (action === "bottom") {
      const moving = order.filter(id => selectedSet.has(id));
      order = moving.concat(order.filter(id => !selectedSet.has(id)));
    } else if (action === "up") {
      for (let index = order.length - 2; index >= 0; index -= 1) {
        if (selectedSet.has(order[index]) && !selectedSet.has(order[index + 1])) {
          const temp = order[index + 1];
          order[index + 1] = order[index];
          order[index] = temp;
        }
      }
    } else if (action === "down") {
      for (let index = 1; index < order.length; index += 1) {
        if (selectedSet.has(order[index]) && !selectedSet.has(order[index - 1])) {
          const temp = order[index - 1];
          order[index - 1] = order[index];
          order[index] = temp;
        }
      }
    }

    if (order.join("|") === before) {
      setStatus("Selected tile" + (selectedSet.size === 1 ? " is" : "s are") + " already at that layer position.");
      return;
    }

    creationOrder = order;
    syncTileLayerOrder();
    updateSelectionClasses();
    updateRotationHandle();
    hideSnapPreview();
    recordHistory();

    const actionText = {
      top: "Brought selected tile" + (selectedSet.size === 1 ? "" : "s") + " to top.",
      bottom: "Sent selected tile" + (selectedSet.size === 1 ? "" : "s") + " to bottom.",
      up: "Moved selected tile" + (selectedSet.size === 1 ? "" : "s") + " up.",
      down: "Moved selected tile" + (selectedSet.size === 1 ? "" : "s") + " down."
    };

    setStatus(actionText[action] || "Updated layer order.");
  }

  function bringSelectedToTop() {
    updateLayerOrder("top");
  }

  function sendSelectedToBottom() {
    updateLayerOrder("bottom");
  }

  function moveSelectedUpLayer() {
    updateLayerOrder("up");
  }

  function moveSelectedDownLayer() {
    updateLayerOrder("down");
  }

  function showContextMenu(x, y) {
    if (!contextMenu) return;

    contextMenu.hidden = false;

    const menuWidth = contextMenu.offsetWidth || 178;
    const menuHeight = contextMenu.offsetHeight || 260;
    const margin = 8;
    const left = Math.min(x, window.innerWidth - menuWidth - margin);
    const top = Math.min(y, window.innerHeight - menuHeight - margin);

    contextMenu.style.left = Math.max(margin, left) + "px";
    contextMenu.style.top = Math.max(margin, top) + "px";
  }

  function hideContextMenu() {
    if (contextMenu) contextMenu.hidden = true;
  }

  function handleContextAction(action) {
    const actions = {
      copy: copySelectedToClipboard,
      paste: pasteClipboard,
      duplicate: duplicateSelected,
      delete: deleteSelected,
      bringToTop: bringSelectedToTop,
      moveUp: moveSelectedUpLayer,
      moveDown: moveSelectedDownLayer,
      sendToBottom: sendSelectedToBottom
    };

    if (actions[action]) actions[action]();
  }

  function updateSelectionClasses() {
    document.querySelectorAll(".tile").forEach(tile => tile.classList.remove("selected"));
    selectedIds().forEach(id => {
      const tile = getTileElement(id);
      if (tile) tile.classList.add("selected");
    });
  }

  function updateRotationHandle() {
    const ids = selectedIds();
    if (ids.length === 0) {
      rotationHandle.style.display = "none";
      return;
    }

    const center = groupCenter(ids);
    const innerRadius = groupRadius(ids, center);
    const handleDistance = innerRadius + 45;

    rotationHandleLine.setAttribute("x1", "0");
    rotationHandleLine.setAttribute("y1", -innerRadius);
    rotationHandleLine.setAttribute("x2", "0");
    rotationHandleLine.setAttribute("y2", -handleDistance);
    rotationHandleCircle.setAttribute("cx", "0");
    rotationHandleCircle.setAttribute("cy", -handleDistance);

    const handleRotation = ids.length === 1 ? tiles[ids[0]].rotation : 0;
    rotationHandle.setAttribute("transform", `translate(${center.x} ${center.y}) rotate(${handleRotation})`);
    rotationHandle.style.display = "block";
  }

  function selectOnly(id) {
    selected = new Set();
    if (tiles[id]) selected.add(id);
    updateSelectionClasses();
    updateRotationHandle();
  }

  function selectMany(ids) {
    selected = new Set(ids.filter(id => tiles[id]));
    updateSelectionClasses();
    updateRotationHandle();
  }

  function toggleSelection(id) {
    if (!tiles[id]) return;
    if (selected.has(id)) selected.delete(id);
    else selected.add(id);
    updateSelectionClasses();
    updateRotationHandle();
    const count = selectedIds().length;
    setStatus(`${count} tile${count === 1 ? "" : "s"} selected.`);
  }

  function clearSelection() {
    selected = new Set();
    updateSelectionClasses();
    updateRotationHandle();
    hideSnapPreview();
  }

  function selectMostRecent() {
    for (let i = creationOrder.length - 1; i >= 0; i -= 1) {
      const id = creationOrder[i];
      if (tiles[id]) {
        selectEntity(outermostEntityForTile(id));
        return;
      }
    }
    clearSelection();
  }

  function createTileElement(id, tileType) {
    const definition = tileDefinitions[tileType];
    const group = document.createElementNS(SVG_NS, "g");
    group.setAttribute("id", id);
    group.setAttribute("class", "tile");
    group.dataset.tileId = id;

    let shape;

    if (definition.path) {
      shape = document.createElementNS(SVG_NS, "path");
      shape.setAttribute("d", definition.path);
    } else {
      shape = document.createElementNS(SVG_NS, "polygon");
      shape.setAttribute("points", definition.points);
    }

    appendTileHitArea(group, definition);
    setShapePaint(shape, (typeof state !== "undefined" ? state : (typeof tileState !== "undefined" ? tileState : null)), definition);

    if (definition.fillRule) {
      shape.setAttribute("fill-rule", definition.fillRule);
    }

    group.appendChild(shape);
    appendFillPattern(group, definition, (typeof state !== "undefined" ? state : (typeof tileState !== "undefined" ? tileState : null)), group.getAttribute("id") || "tile");
    appendTileDecorations(group, definition);

    if (definition.label) {
      const text = document.createElementNS(SVG_NS, "text");
      text.setAttribute("x", "0");
      text.setAttribute("y", "0");
      text.textContent = definition.label;
      group.appendChild(text);
    }

    addTilePointerEvents(group);
    return group;
  }

  function updateTileAppearance(id) {
    const group = getTileElement(id);
    const state = tiles[id];

    if (!group || !state) return;

    const definition = tileDefinitions[state.tileType];

    if (!definition) return;

    group.innerHTML = "";

    let shape;

    if (definition.path) {
      shape = document.createElementNS(SVG_NS, "path");
      shape.setAttribute("d", definition.path);
    } else {
      shape = document.createElementNS(SVG_NS, "polygon");
      shape.setAttribute("points", definition.points);
    }

    appendTileHitArea(group, definition);
    setShapePaint(shape, (typeof state !== "undefined" ? state : (typeof tileState !== "undefined" ? tileState : null)), definition);

    if (definition.fillRule) {
      shape.setAttribute("fill-rule", definition.fillRule);
    }

    group.appendChild(shape);
    appendFillPattern(group, definition, (typeof state !== "undefined" ? state : (typeof tileState !== "undefined" ? tileState : null)), group.getAttribute("id") || "tile");
    appendTileDecorations(group, definition);

    if (definition.label) {
      const text = document.createElementNS(SVG_NS, "text");
      text.setAttribute("x", "0");
      text.setAttribute("y", "0");
      text.textContent = definition.label;
      group.appendChild(text);
    }
  }

  function addPlacedTile(tileType, x, y, tileRotation = 0, idToUse = null) {
    const id = idToUse || "tile" + nextTileNumber;

    const tileNumberMatch = String(id).match(/^tile(\d+)$/);
    if (tileNumberMatch) {
      nextTileNumber = Math.max(nextTileNumber, Number(tileNumberMatch[1]) + 1);
    } else {
      nextTileNumber += 1;
    }

    tiles[id] = { tileType, x, y, rotation: tileRotation, flipX: 1, flipY: 1, fillColor: null, fillPattern: "solid", fillOpacity: 1, strokeColor: null, strokeStyle: "solid", strokeWidth: defaultStrokeWidth(), parent: null };
    creationOrder.push(id);

    const tile = createTileElement(id, tileType);
    tilesLayer.appendChild(tile);
    updateTileTransform(id);
    selectOnly(id);
    maybeShowPlacementHint(tileType);
    return id;
  }

  function defaultRotationForTileType(tileType) {
    const definition = tileDefinitions[tileType];
    return definition && Number.isFinite(definition.defaultRotation) ? definition.defaultRotation : 0;
  }

  function addTileFromPalette(tileType) {
    const x = 250 + nextNewTileOffset;
    const y = 180 + nextNewTileOffset;
    addPlacedTile(tileType, x, y, defaultRotationForTileType(tileType));
    recordRecentTraySet(tileSetForTileType(tileType));

    nextNewTileOffset += 35;
    if (nextNewTileOffset > 210) nextNewTileOffset = 0;

    hideSnapPreview();
    recordHistory();
    setStatus("Added " + tileDisplayName(tileType) + ".");
  }

  function addTilePointerEvents(tileElement) {
    tileElement.addEventListener("pointerdown", event => {
      if (rotation) return;
      event.stopPropagation();

      const id = tileElement.dataset.tileId;

      const clickedEntityId = outermostEntityForTile(id);
      const clickedEntityLeaves = leafTileIdsForEntity(clickedEntityId);

      if (event.ctrlKey || event.metaKey) {
        ctrlTilePan = {
          entityId: clickedEntityId,
          startClient: { x: event.clientX, y: event.clientY },
          startViewBox: { ...viewBox },
          moved: false
        };

        tileElement.setPointerCapture(event.pointerId);
        hideSnapPreview();
        return;
      }

      if (event.shiftKey) {
        toggleEntitySelection(clickedEntityId);
        hideSnapPreview();
        return;
      }

      if (!clickedEntityLeaves.every(tileId => selected.has(tileId))) selectEntity(clickedEntityId);
      else {
        updateRotationHandle();
      }

      hideSnapPreview();

      const ids = selectedIds();
      const start = {};
      ids.forEach(tileId => {
        start[tileId] = { x: tiles[tileId].x, y: tiles[tileId].y };
      });

      drag = {
        ids,
        mouse: svgPoint(event),
        start
      };

      tileElement.setPointerCapture(event.pointerId);
    });

    tileElement.addEventListener("pointermove", event => {
      if (ctrlTilePan) {
        const rect = svg.getBoundingClientRect();
        const dxPixels = event.clientX - ctrlTilePan.startClient.x;
        const dyPixels = event.clientY - ctrlTilePan.startClient.y;

        if (Math.abs(dxPixels) > 3 || Math.abs(dyPixels) > 3) {
          ctrlTilePan.moved = true;
          svg.classList.add("panning");

          viewBox.x = ctrlTilePan.startViewBox.x - dxPixels * viewBox.width / rect.width;
          viewBox.y = ctrlTilePan.startViewBox.y - dyPixels * viewBox.height / rect.height;
          updateViewBox();
          setStatus("Ctrl-dragging to pan.");
        }

        return;
      }

      if (!drag || drag.ids.length === 0) return;

      const mouse = svgPoint(event);
      const dx = mouse.x - drag.mouse.x;
      const dy = mouse.y - drag.mouse.y;

      drag.ids.forEach(id => {
        tiles[id].x = drag.start[id].x + dx;
        tiles[id].y = drag.start[id].y + dy;
        updateTileTransform(id);
      });

      updateRotationHandle();
      updateSnapPreview(drag.ids);
    });

    tileElement.addEventListener("pointerup", () => {
      if (ctrlTilePan) {
        if (ctrlTilePan.moved) {
          setStatus("Panned view.");
        } else {
          toggleEntitySelection(ctrlTilePan.entityId);
        }

        ctrlTilePan = null;
        svg.classList.remove("panning");
        return;
      }

      finishDrag();
    });

    tileElement.addEventListener("pointercancel", () => {
      ctrlTilePan = null;
      svg.classList.remove("panning");
      finishDrag();
    });
  }

  function finishDrag() {
    if (!drag) return;
    commitSnap(drag.ids);
    drag = null;
    hideSnapPreview();
    updateRotationHandle();
    recordHistory();
  }

  function transformedPreview(ids, center, rotationDelta, translation) {
    return ids.filter(id => tiles[id]).map(id => {
      const state = tiles[id];
      const movedCenter = rotateAround({ x: state.x, y: state.y }, center, rotationDelta);

      return {
        id,
        tileType: state.tileType,
        x: movedCenter.x + translation.x,
        y: movedCenter.y + translation.y,
        rotation: state.rotation + rotationDelta,
        flipX: state.flipX || 1,
        flipY: state.flipY || 1
      };
    });
  }

  function findSnapCandidate(movingIds) {
    if (!snapToggle.checked) return null;

    const ids = movingIds.filter(id => tiles[id]);
    if (ids.length === 0) return null;

    const movingSet = new Set(ids);
    const fixedIds = Object.keys(tiles).filter(id => !movingSet.has(id));
    if (fixedIds.length === 0) return null;

    const center = groupCenter(ids);
    let best = null;
    let bestScore = Infinity;

    ids.forEach(anchorId => {
      const anchorState = tiles[anchorId];
      const anchorDefinition = tileDefinitions[anchorState.tileType];
      const angleTolerance = 180 / anchorDefinition.sides + 7;
      const anchorEdges = worldEdgesForTile(anchorId);

      fixedIds.forEach(fixedId => {
        const fixedEdges = worldEdgesForTile(fixedId);

        anchorEdges.forEach(anchorEdge => {
          const anchorAngle = angleBetweenPoints(anchorEdge.start, anchorEdge.end);
          const anchorMidpoint = midpoint(anchorEdge.start, anchorEdge.end);

          fixedEdges.forEach(fixedEdge => {
            if (!edgesAreCompatible(anchorEdge, fixedEdge)) return;

            /*
              Edge-to-edge snap:

              Normally two unreflected tiles meet with opposite edge directions.
              But a reflected tile has reversed winding. In that case, the same
              visual edge match uses the same edge direction rather than the
              reversed direction. This restores snapping after a single Flip H/V.
            */
            const anchorWinding = tileWindingSign(anchorId);
            const fixedWinding = tileWindingSign(fixedId);

            const orientationChoices = fixedEdge.isFrameSocket
              ? [
                  { targetStart: fixedEdge.start, targetEnd: fixedEdge.end },
                  { targetStart: fixedEdge.end, targetEnd: fixedEdge.start }
                ]
              : [
                  {
                    targetStart: anchorWinding === fixedWinding ? fixedEdge.end : fixedEdge.start,
                    targetEnd: anchorWinding === fixedWinding ? fixedEdge.start : fixedEdge.end
                  }
                ];

            orientationChoices.forEach(choice => {
              const targetStart = choice.targetStart;
              const targetEnd = choice.targetEnd;
              const targetAngle = angleBetweenPoints(targetStart, targetEnd);
              const rotationDelta = normalizeAngle(targetAngle - anchorAngle);

              if (Math.abs(rotationDelta) > angleTolerance) return;

              const rotatedAnchorStart = rotateAround(anchorEdge.start, center, rotationDelta);
              const rotatedAnchorEnd = rotateAround(anchorEdge.end, center, rotationDelta);
              const rotatedAnchorMidpoint = rotateAround(anchorMidpoint, center, rotationDelta);
              const fixedMidpoint = midpoint(fixedEdge.start, fixedEdge.end);

              const translation = {
                x: targetStart.x - rotatedAnchorStart.x,
                y: targetStart.y - rotatedAnchorStart.y
              };

              const translatedAnchorEnd = {
                x: rotatedAnchorEnd.x + translation.x,
                y: rotatedAnchorEnd.y + translation.y
              };

              const endError = distance(translatedAnchorEnd, targetEnd);

              if (endError > 2.75) return;

              const translationDistance = distance(rotatedAnchorMidpoint, fixedMidpoint);

              if (translationDistance > SNAP_DISTANCE) return;

              const score = translationDistance + Math.abs(rotationDelta) * 0.35;

              if (score < bestScore) {
                bestScore = score;
                best = {
                  ids,
                  anchorId,
                  fixedId,
                  center,
                  rotationDelta,
                  translation,
                  previewTiles: transformedPreview(ids, center, rotationDelta, translation)
                };
              }
            });
          });
        });
      });
    });

    return best;
  }

  function showSnapPreview(candidate) {
    snapPreview.innerHTML = "";

    if (!candidate || !candidate.previewTiles.length) {
      hideSnapPreview();
      return;
    }

    candidate.previewTiles.forEach(tile => {
      const definition = tileDefinitions[tile.tileType];
      const group = document.createElementNS(SVG_NS, "g");
      group.setAttribute(
        "transform",
        tileTransformString(tile.x, tile.y, tile.rotation, tile.flipX || 1, tile.flipY || 1)
      );

      let shape;

      if (definition.path) {
        shape = document.createElementNS(SVG_NS, "path");
        shape.setAttribute("d", definition.path);
      } else {
        shape = document.createElementNS(SVG_NS, "polygon");
        shape.setAttribute("points", definition.points);
      }

      if (definition.fillRule) {
        shape.setAttribute("fill-rule", definition.fillRule);
      }

      group.appendChild(shape);

      if (definition.label) {
        const text = document.createElementNS(SVG_NS, "text");
        text.setAttribute("x", "0");
        text.setAttribute("y", "0");
        text.textContent = definition.label;
        group.appendChild(text);
      }

      snapPreview.appendChild(group);
    });

    snapPreview.style.display = "block";
  }

  function updateSnapPreview(ids) {
    const candidate = findSnapCandidate(ids);
    showSnapPreview(candidate);
    return candidate;
  }

  function hideSnapPreview() {
    snapPreview.style.display = "none";
    snapPreview.innerHTML = "";
  }

  function applyGroupTransform(ids, center, rotationDelta, translation) {
    ids.forEach(id => {
      if (!tiles[id]) return;

      const state = tiles[id];
      const movedCenter = rotateAround({ x: state.x, y: state.y }, center, rotationDelta);

      state.x = movedCenter.x + translation.x;
      state.y = movedCenter.y + translation.y;
      state.rotation = normalizeAngle(state.rotation + rotationDelta);

      updateTileTransform(id);
    });

    updateRotationHandle();
  }

  function commitSnap(ids) {
    const candidate = findSnapCandidate(ids);
    if (!candidate) return false;

    applyGroupTransform(candidate.ids, candidate.center, candidate.rotationDelta, candidate.translation);
    setStatus("Snapped selected tile" + (candidate.ids.length === 1 ? "" : "s") + ".");
    return true;
  }

  function rotateTilesAsGroup(ids, angleDelta) {
    const validIds = ids.filter(id => tiles[id]);
    if (validIds.length === 0) return;

    const center = groupCenter(validIds);
    applyGroupTransform(validIds, center, angleDelta, { x: 0, y: 0 });
  }

  function rotateSelected(angleDelta) {
    const ids = selectedIds();
    if (ids.length === 0) return;
    rotateTilesAsGroup(ids, angleDelta);
    hideSnapPreview();
    recordHistory();
    setStatus("Rotated selected tile" + (ids.length === 1 ? "" : "s") + " as a unit.");
  }

  function rotationStepDegrees() {
    const value = getRotateStepDegrees();
    return Number.isFinite(value) ? value : 15;
  }

  function rotateSelectedByInput() {
    const angleDelta = getRotateStepDegrees();

    if (!Number.isFinite(angleDelta)) {
      setStatus("Enter a valid rotation angle.");
      return;
    }

    rotateSelected(angleDelta);
  }

  function reflectSelected(axis) {
    const ids = selectedIds();
    if (ids.length === 0) return;

    /*
      Reflect the selected object as a single unit.

      Flip H mirrors centers left/right across a vertical mirror line through
      the selection center. Flip V mirrors centers up/down across a horizontal
      mirror line. Each tile also gets a true SVG reflection using scale(-1,1)
      or scale(1,-1), so chiral bubble tiles and odd polygons actually mirror
      instead of merely rotating into a lookalike position.
    */
    const center = groupCenter(ids);

    ids.forEach(id => {
      const state = tiles[id];
      const wasChiralThree = state.tileType === "B3A" || state.tileType === "B3ASTAR";

      if (axis === "horizontal") {
        state.x = center.x - (state.x - center.x);

        if (wasChiralThree) {
          state.tileType = state.tileType === "B3A" ? "B3ASTAR" : "B3A";
          state.rotation = normalizeAngle(-state.rotation + 120);
          updateTileAppearance(id);
        } else {
          state.rotation = normalizeAngle(-state.rotation);
          state.flipX = -(state.flipX || 1);
        }
      } else {
        state.y = center.y - (state.y - center.y);

        if (wasChiralThree) {
          state.tileType = state.tileType === "B3A" ? "B3ASTAR" : "B3A";
          state.rotation = normalizeAngle(-state.rotation - 60);
          updateTileAppearance(id);
        } else {
          state.rotation = normalizeAngle(-state.rotation);
          state.flipY = -(state.flipY || 1);
        }
      }

      updateTileTransform(id);
    });

    updateRotationHandle();
    hideSnapPreview();
    recordHistory();

    if (axis === "horizontal") {
      setStatus("Flipped selected tile" + (ids.length === 1 ? "" : "s") + " horizontally as a unit.");
    } else {
      setStatus("Flipped selected tile" + (ids.length === 1 ? "" : "s") + " vertically as a unit.");
    }
  }

  function moveSelected(dx, dy) {
    const ids = selectedIds();
    if (ids.length === 0) return;

    ids.forEach(id => {
      tiles[id].x += dx;
      tiles[id].y += dy;
      updateTileTransform(id);
    });

    updateRotationHandle();
    hideSnapPreview();
    recordHistory();
    setStatus("Nudged selected tile" + (ids.length === 1 ? "" : "s") + ".");
  }

  function copyEntitySnapshot(entityId) {
    if (tiles[entityId]) {
      const state = tiles[entityId];

      return {
        kind: "tile",
        tileType: state.tileType,
        x: state.x,
        y: state.y,
        rotation: state.rotation,
        flipX: state.flipX || 1,
        flipY: state.flipY || 1,
        fillColor: state.fillColor || null,
        fillPattern: state.fillPattern || "solid",
        fillOpacity: tileFillOpacity(state),
        strokeColor: state.strokeColor || null,
        strokeStyle: state.strokeStyle || "solid",
        strokeWidth: tileStrokeWidth(state)
      };
    }

    if (groups[entityId]) {
      return {
        kind: "group",
        children: groups[entityId].children
          .map(childId => copyEntitySnapshot(childId))
          .filter(Boolean)
      };
    }

    return null;
  }

  function pasteEntitySnapshot(snapshot, dx, dy) {
    if (!snapshot) return null;

    if (snapshot.kind === "tile") {
      const newTileId = addPlacedTile(
        snapshot.tileType,
        snapshot.x + dx,
        snapshot.y + dy,
        snapshot.rotation
      );

      tiles[newTileId].flipX = snapshot.flipX === -1 ? -1 : 1;
      tiles[newTileId].flipY = snapshot.flipY === -1 ? -1 : 1;
      tiles[newTileId].fillColor = snapshot.fillColor || null;
      tiles[newTileId].fillPattern = snapshot.fillPattern || "solid";
      tiles[newTileId].fillOpacity = Number.isFinite(Number(snapshot.fillOpacity)) ? Math.max(0.05, Math.min(1, Number(snapshot.fillOpacity))) : 1;
      tiles[newTileId].strokeColor = snapshot.strokeColor || null;
      tiles[newTileId].strokeStyle = snapshot.strokeStyle || "solid";
      tiles[newTileId].strokeWidth = Number.isFinite(Number(snapshot.strokeWidth)) ? Number(snapshot.strokeWidth) : defaultStrokeWidth();
      updateTileAppearance(newTileId);
      updateTileTransform(newTileId);

      return newTileId;
    }

    if (snapshot.kind === "group" && Array.isArray(snapshot.children)) {
      const childEntityIds = snapshot.children
        .map(child => pasteEntitySnapshot(child, dx, dy))
        .filter(Boolean);

      if (childEntityIds.length === 0) return null;

      return createGroupFromEntities(childEntityIds);
    }

    return null;
  }

  function copySelectedToClipboard() {
    const entityIds = selectedEntitiesForGrouping();

    if (entityIds.length === 0) {
      setStatus("Nothing selected to copy.");
      return;
    }

    clipboard = {
      entities: entityIds
        .map(entityId => copyEntitySnapshot(entityId))
        .filter(Boolean)
    };

    clipboardPasteCount = 0;

    const tileCount = entityIds.flatMap(entityId => leafTileIdsForEntity(entityId)).length;
    setStatus("Copied " + tileCount + " tile" + (tileCount === 1 ? "" : "s") + ".");
  }

  function pasteClipboard() {
    if (!clipboard || !Array.isArray(clipboard.entities) || clipboard.entities.length === 0) {
      setStatus("Clipboard is empty.");
      return;
    }

    clipboardPasteCount += 1;

    const offset = 45 * clipboardPasteCount;
    const newEntityIds = clipboard.entities
      .map(snapshot => pasteEntitySnapshot(snapshot, offset, offset))
      .filter(Boolean);

    const pastedTileIds = newEntityIds.flatMap(entityId => leafTileIdsForEntity(entityId));

    selectMany(pastedTileIds);
    hideSnapPreview();
    recordHistory();

    setStatus("Pasted " + pastedTileIds.length + " tile" + (pastedTileIds.length === 1 ? "" : "s") + ".");
  }

  function duplicateEntity(entityId, dx, dy) {
    if (tiles[entityId]) {
      const state = tiles[entityId];
      const newId = addPlacedTile(state.tileType, state.x + dx, state.y + dy, state.rotation);
      tiles[newId].flipX = state.flipX || 1;
      tiles[newId].flipY = state.flipY || 1;
      tiles[newId].fillColor = state.fillColor || null;
      tiles[newId].fillPattern = state.fillPattern || "solid";
      tiles[newId].fillOpacity = tileFillOpacity(state);
      tiles[newId].strokeColor = state.strokeColor || null;
      tiles[newId].strokeStyle = state.strokeStyle || "solid";
      tiles[newId].strokeWidth = tileStrokeWidth(state);
      updateTileAppearance(newId);
      updateTileTransform(newId);
      return newId;
    }

    if (!groups[entityId]) return null;

    const duplicatedChildren = groups[entityId].children
      .map(childId => duplicateEntity(childId, dx, dy))
      .filter(Boolean);

    return createGroupFromEntities(duplicatedChildren);
  }

  function duplicateSelected() {
    const ids = selectedIds();
    if (ids.length === 0) return;

    const entityIds = selectedEntitiesForGrouping();
    const newEntityIds = entityIds
      .map(entityId => duplicateEntity(entityId, 45, 45))
      .filter(Boolean);

    selectMany(newEntityIds.flatMap(entityId => leafTileIdsForEntity(entityId)));
    hideSnapPreview();
    recordHistory();
    setStatus("Duplicated selected tile" + (ids.length === 1 ? "" : "s") + ".");
  }

  function deleteEntity(entityId) {
    if (tiles[entityId]) {
      removeEntityFromParent(entityId);
      const tile = getTileElement(entityId);
      if (tile) tile.remove();
      delete tiles[entityId];
      return;
    }

    if (!groups[entityId]) return;

    removeEntityFromParent(entityId);
    [...groups[entityId].children].forEach(deleteEntity);
    delete groups[entityId];
  }

  function deleteSelected() {
    const ids = selectedIds();
    if (ids.length === 0) return;

    selectedEntitiesForGrouping().forEach(deleteEntity);

    creationOrder = creationOrder.filter(id => tiles[id]);
    groupCreationOrder = groupCreationOrder.filter(id => groups[id]);
    hideSnapPreview();
    selectMostRecent();
    recordHistory();
    setStatus("Deleted selected tile" + (ids.length === 1 ? "" : "s") + ".");
  }

  function rotatedBitesMatch(targetBites, candidateBites, rotationSteps) {
    const sides = targetBites.length;

    for (let index = 0; index < sides; index += 1) {
      const candidateIndex = (index - rotationSteps + sides) % sides;

      if (targetBites[index] !== candidateBites[candidateIndex]) {
        return false;
      }
    }

    return true;
  }

  function arcDualFamilies() {
    return [
      tileCollections.hex,
      tileCollections.tri,
      tileCollections.square,
      tileCollections.hexPuzzle,
      tileCollections.triPuzzle,
      tileCollections.squarePuzzle
    ];
  }

  function findArcDualForTileType(tileType) {
    const definition = tileDefinitions[tileType];

    if (!definition || !Array.isArray(definition.bites)) return null;

    const targetBites = definition.bites.map(value => value === 1 ? 0 : 1);

    for (const family of arcDualFamilies()) {
      if (!family.includes(tileType)) continue;

      for (const candidateType of family) {
        const candidateDefinition = tileDefinitions[candidateType];

        if (!candidateDefinition || !Array.isArray(candidateDefinition.bites)) continue;
        if (candidateDefinition.bites.length !== targetBites.length) continue;

        const sides = targetBites.length;

        for (let rotationSteps = 0; rotationSteps < sides; rotationSteps += 1) {
          if (rotatedBitesMatch(targetBites, candidateDefinition.bites, rotationSteps)) {
            return {
              tileType: candidateType,
              rotationDelta: rotationSteps * 360 / sides
            };
          }
        }
      }
    }

    return null;
  }

  function applyArcDualToSelection() {
    const ids = selectedIds();

    if (ids.length === 0) {
      setStatus("Select bubble or puzzle tiles before using Arc Dual.");
      return;
    }

    let changedCount = 0;

    ids.forEach(id => {
      const state = tiles[id];
      if (!state) return;

      const dual = findArcDualForTileType(state.tileType);
      if (!dual) return;

      state.tileType = dual.tileType;
      state.rotation = normalizeAngle(state.rotation + dual.rotationDelta);

      // Arc Dual should adopt the new tile's default fill color.
      state.fillColor = null;

      updateTileAppearance(id);
      updateTileTransform(id);
      changedCount += 1;
    });

    if (changedCount === 0) {
      setStatus("Arc Dual only applies to bubble and puzzle tiles.");
      return;
    }

    hideSnapPreview();
    recordHistory();
    setStatus("Applied Arc Dual to " + changedCount + " tile" + (changedCount === 1 ? "" : "s") + ".");
  }

  function groupSelected() {
    const ids = selectedIds();

    if (ids.length < 2) {
      setStatus("Select at least two tiles to group.");
      return;
    }

    const entityIds = selectedEntitiesForGrouping();

    if (entityIds.length < 2) {
      setStatus("Select at least two separate items to group.");
      return;
    }

    const groupId = createGroupFromEntities(entityIds);

    if (!groupId) return;

    selectEntity(groupId);
    hideSnapPreview();
    recordHistory();
    setStatus("Grouped " + ids.length + " tile" + (ids.length === 1 ? "" : "s") + ".");
  }

  function ungroupSelected() {
    const entityIds = selectedEntitiesForGrouping().filter(entityId => groups[entityId]);

    if (entityIds.length === 0) {
      setStatus("Select a group to ungroup.");
      return;
    }

    entityIds.forEach(groupId => {
      if (!groups[groupId]) return;

      const parentId = groups[groupId].parent;
      const children = [...groups[groupId].children];

      if (parentId && groups[parentId]) {
        const index = groups[parentId].children.indexOf(groupId);
        if (index >= 0) {
          groups[parentId].children.splice(index, 1, ...children);
        }
      }

      children.forEach(childId => setEntityParent(childId, parentId || null));
      delete groups[groupId];
    });

    groupCreationOrder = groupCreationOrder.filter(id => groups[id]);
    updateRotationHandle();
    hideSnapPreview();
    recordHistory();
    setStatus("Ungrouped selected group" + (entityIds.length === 1 ? "" : "s") + ".");
  }

  rotationHandle.addEventListener("pointerdown", event => {
    const ids = selectedIds();
    if (ids.length === 0) return;

    event.preventDefault();
    event.stopPropagation();

    const center = groupCenter(ids);
    const startStates = {};
    ids.forEach(id => {
      startStates[id] = {
        x: tiles[id].x,
        y: tiles[id].y,
        rotation: tiles[id].rotation,
        flipX: tiles[id].flipX || 1,
        flipY: tiles[id].flipY || 1
      };
    });

    rotation = {
      ids,
      center,
      startAngle: angleFromCenter(svgPoint(event), center),
      startStates
    };

    hideSnapPreview();
    rotationHandle.setPointerCapture(event.pointerId);
  });

  rotationHandle.addEventListener("pointermove", event => {
    if (!rotation) return;

    event.preventDefault();
    event.stopPropagation();

    const currentAngle = angleFromCenter(svgPoint(event), rotation.center);
    let angleDelta = currentAngle - rotation.startAngle;
    if (event.shiftKey) angleDelta = Math.round(angleDelta / 15) * 15;

    rotation.ids.forEach(id => {
      const start = rotation.startStates[id];
      if (!start || !tiles[id]) return;

      const movedCenter = rotateAround({ x: start.x, y: start.y }, rotation.center, angleDelta);

      tiles[id].x = movedCenter.x;
      tiles[id].y = movedCenter.y;
      tiles[id].rotation = normalizeAngle(start.rotation + angleDelta);
      tiles[id].flipX = start.flipX || 1;
      tiles[id].flipY = start.flipY || 1;
      updateTileTransform(id);
    });

    updateRotationHandle();
    const candidate = updateSnapPreview(rotation.ids);
    setStatus(candidate ? "Edge snap preview available. Release to commit." : "Rotating selection as a unit.");
  });

  rotationHandle.addEventListener("pointerup", event => {
    if (!rotation) return;

    event.preventDefault();
    event.stopPropagation();

    commitSnap(rotation.ids);
    rotation = null;
    hideSnapPreview();
    updateRotationHandle();
    recordHistory();
    setStatus("Finished rotating selection.");
  });

  rotationHandle.addEventListener("pointercancel", () => {
    rotation = null;
    hideSnapPreview();
    updateRotationHandle();
  });

  function updateViewBox() {
    svg.setAttribute("viewBox", `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`);
    renderLatticeFills();
  }

  function toggleFullScreen() {
    const target = document.documentElement;

    if (!document.fullscreenElement) {
      if (target.requestFullscreen) {
        target.requestFullscreen()
          .then(() => {
            showTemporaryHint("Press Esc to exit full screen", 6000);
            setStatus("Entered full screen.");
          })
          .catch(() => {
            setStatus("Full screen is not available in this browser.");
          });
      } else {
        setStatus("Full screen is not available in this browser.");
      }

      return;
    }

    if (document.exitFullscreen) {
      document.exitFullscreen();
      setStatus("Exited full screen.");
    }
  }

  function resetView() {
    viewBox = { ...initialViewBox };
    updateViewBox();
    setStatus("Reset view.");
  }

  function zoomAtPoint(point, factor) {
    const newWidth = viewBox.width * factor;
    const newHeight = viewBox.height * factor;
    if (newWidth < 150 || newWidth > 5000) return;

    const rx = (point.x - viewBox.x) / viewBox.width;
    const ry = (point.y - viewBox.y) / viewBox.height;

    viewBox.x = point.x - rx * newWidth;
    viewBox.y = point.y - ry * newHeight;
    viewBox.width = newWidth;
    viewBox.height = newHeight;
    updateViewBox();
  }

  function zoomAtCenter(factor) {
    zoomAtPoint({
      x: viewBox.x + viewBox.width / 2,
      y: viewBox.y + viewBox.height / 2
    }, factor);
  }

  svg.addEventListener("wheel", event => {
    event.preventDefault();
    zoomAtPoint(svgPoint(event), event.deltaY < 0 ? 0.9 : 1.1);
    hideSnapPreview();
  }, { passive: false });

  function selectionRectangleFromPoints(a, b) {
    return {
      x1: Math.min(a.x, b.x),
      y1: Math.min(a.y, b.y),
      x2: Math.max(a.x, b.x),
      y2: Math.max(a.y, b.y)
    };
  }

  function updateSelectionBox(rect) {
    selectionBox.setAttribute("x", rect.x1);
    selectionBox.setAttribute("y", rect.y1);
    selectionBox.setAttribute("width", rect.x2 - rect.x1);
    selectionBox.setAttribute("height", rect.y2 - rect.y1);
    selectionBox.style.display = "block";
  }

  function hideSelectionBox() {
    selectionBox.style.display = "none";
  }

  function tileIntersectsRectangle(id, rect) {
    if (!tiles[id]) return false;

    const vertices = worldVerticesForTile(id);
    const center = { x: tiles[id].x, y: tiles[id].y };

    const tileMinX = Math.min(...vertices.map(vertex => vertex.x), center.x);
    const tileMaxX = Math.max(...vertices.map(vertex => vertex.x), center.x);
    const tileMinY = Math.min(...vertices.map(vertex => vertex.y), center.y);
    const tileMaxY = Math.max(...vertices.map(vertex => vertex.y), center.y);

    return (
      tileMaxX >= rect.x1 &&
      tileMinX <= rect.x2 &&
      tileMaxY >= rect.y1 &&
      tileMinY <= rect.y2
    );
  }

  function finishBoxSelection() {
    if (!boxSelect) return;

    const rect = selectionRectangleFromPoints(boxSelect.start, boxSelect.current);
    const matches = orderedTileIds().filter(id => tileIntersectsRectangle(id, rect));

    selectMany(matches);
    hideSelectionBox();

    const count = matches.length;
    setStatus("Box selected " + count + " tile" + (count === 1 ? "" : "s") + ".");

    boxSelect = null;
  }

  function latticePointerVector(event) {
    if (!latticeDrag) return { x: 0, y: 0 };

    const current = svgPoint(event);

    return {
      x: current.x - latticeDrag.start.x,
      y: current.y - latticeDrag.start.y
    };
  }

  svg.addEventListener("pointerdown", event => {
    if (!activeLatticeBuilder || event.button !== 0) return;

    event.preventDefault();
    event.stopPropagation();

    latticeDrag = {
      start: svgPoint(event)
    };

    svg.setPointerCapture(event.pointerId);
    setStatus(activeLatticeBuilder.phase === "A"
      ? "Dragging vector A. Release to set it."
      : "Dragging vector B. Release to create lattice."
    );
  }, true);

  svg.addEventListener("pointermove", event => {
    if (!activeLatticeBuilder || !latticeDrag) return;

    event.preventDefault();
    event.stopPropagation();

    const rawVector = latticePointerVector(event);
    const vector = snappedLatticeVector(activeLatticeBuilder.sourceIds, rawVector);

    updateLatticePreview(vector);
  }, true);

  svg.addEventListener("pointerup", event => {
    if (!activeLatticeBuilder || !latticeDrag) return;

    event.preventDefault();
    event.stopPropagation();

    const rawVector = latticePointerVector(event);
    const vector = snappedLatticeVector(activeLatticeBuilder.sourceIds, rawVector);
    latticeDrag = null;

    if (vectorLength(vector) < 15) {
      setStatus("Lattice vector is too small. Drag farther.");
      clearLatticePreview();
      return;
    }

    if (activeLatticeBuilder.phase === "A") {
      activeLatticeBuilder.vectorA = {
        x: Number(vector.x.toFixed(3)),
        y: Number(vector.y.toFixed(3))
      };
      activeLatticeBuilder.phase = "B";
      updateLatticePreview(activeLatticeBuilder.vectorA);
      showLatticeHint("Lattice Fill step 2: now drag a second ghost copy in a different direction to define vector B. Release to fill the visible plane. Hit Esc to cancel.");
      setStatus("Vector A set. Now drag a second ghost copy to define vector B.");
      return;
    }

    finalizeLatticeFill(vector);
  }, true);

  svg.addEventListener("pointercancel", event => {
    if (!activeLatticeBuilder) return;

    latticeDrag = null;
    clearLatticePreview();
    showLatticeHint(activeLatticeBuilder.phase === "A"
      ? "Lattice Fill step 1: drag a ghost copy into the first repeat position to set vector A. Hit Esc to cancel."
      : "Lattice Fill step 2: drag a ghost copy in a different direction to set vector B. Hit Esc to cancel.");
    setStatus("Lattice Fill drag canceled.");
  }, true);

  function startPan(event) {
    pan = {
      startClient: { x: event.clientX, y: event.clientY },
      startViewBox: { ...viewBox },
      moved: false
    };

    svg.classList.add("panning");
    svg.setPointerCapture(event.pointerId);
  }

  svg.addEventListener("pointerdown", event => {
    if (event.button !== 0) return;

    const tileElement = event.target.closest ? event.target.closest(".tile") : null;

    if (spacePanMode) {
      event.preventDefault();
      event.stopPropagation();

      startPan(event);
      setStatus("Space-dragging to pan.");
      return;
    }

    if (!(event.ctrlKey || event.metaKey)) return;

    if (tileElement) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    startPan(event);
    setStatus("Ctrl-dragging to pan.");
  }, true);

  svg.addEventListener("pointerdown", event => {
    if (event.button !== 0 || event.target !== svg) return;

    if (event.shiftKey) {
      const start = svgPoint(event);
      boxSelect = {
        start,
        current: start
      };

      updateSelectionBox(selectionRectangleFromPoints(start, start));
      svg.setPointerCapture(event.pointerId);
      setStatus("Drag to select tiles.");
      return;
    }

    startPan(event);
  });

  svg.addEventListener("pointermove", event => {
    if (boxSelect) {
      boxSelect.current = svgPoint(event);
      updateSelectionBox(selectionRectangleFromPoints(boxSelect.start, boxSelect.current));
      return;
    }

    if (!pan) return;

    const rect = svg.getBoundingClientRect();
    const dxPixels = event.clientX - pan.startClient.x;
    const dyPixels = event.clientY - pan.startClient.y;

    if (Math.abs(dxPixels) > 2 || Math.abs(dyPixels) > 2) pan.moved = true;

    viewBox.x = pan.startViewBox.x - dxPixels * viewBox.width / rect.width;
    viewBox.y = pan.startViewBox.y - dyPixels * viewBox.height / rect.height;
    updateViewBox();
  });

  svg.addEventListener("pointerup", () => {
    if (boxSelect) {
      finishBoxSelection();
      return;
    }

    if (!pan) return;

    if (!pan.moved) {
      clearSelection();
      setStatus("Cleared selection.");
    } else {
      setStatus("Panned view.");
    }

    pan = null;
    svg.classList.remove("panning");
  });

  svg.addEventListener("pointercancel", () => {
    boxSelect = null;
    ctrlTilePan = null;
    hideSelectionBox();
    pan = null;
    svg.classList.remove("panning");
  });

  svg.addEventListener("contextmenu", event => {
    event.preventDefault();

    const tileElement = event.target.closest ? event.target.closest(".tile") : null;

    if (tileElement) {
      const tileId = tileElement.dataset.tileId;
      const entityId = outermostEntityForTile(tileId);

      if (!leafTileIdsForEntity(entityId).every(id => selected.has(id))) {
        selectEntity(entityId);
      }
    }

    showContextMenu(event.clientX, event.clientY);
  });

  if (contextMenu) {
    contextMenu.addEventListener("click", event => {
      const button = event.target.closest ? event.target.closest("button[data-context-action]") : null;

      if (!button) return;

      event.preventDefault();
      event.stopPropagation();
      handleContextAction(button.dataset.contextAction);
      hideContextMenu();
    });
  }

  document.addEventListener("click", event => {
    if (contextMenu && !contextMenu.hidden && !contextMenu.contains(event.target)) {
      hideContextMenu();
    }
  });

  document.addEventListener("scroll", hideContextMenu, true);
  window.addEventListener("blur", hideContextMenu);

  function serializeLayout() {
    return {
      version: 4,
      canvasBackgroundColor,
      latticeCopyOpacity,
      tiles: orderedTileIds().map(id => ({
        id,
        tileType: tiles[id].tileType,
        x: Number(tiles[id].x.toFixed(3)),
        y: Number(tiles[id].y.toFixed(3)),
        rotation: Number(tiles[id].rotation.toFixed(3)),
        flipX: tiles[id].flipX || 1,
        flipY: tiles[id].flipY || 1,
        fillColor: tiles[id].fillColor || null,
        fillPattern: tiles[id].fillPattern || "solid",
        fillOpacity: Number(tileFillOpacity(tiles[id]).toFixed(2)),
        strokeColor: tiles[id].strokeColor || null,
        strokeStyle: tiles[id].strokeStyle || "solid",
        strokeWidth: Number(tileStrokeWidth(tiles[id]).toFixed(2))
      })),
      groups: groupCreationOrder
        .filter(id => groups[id])
        .map(id => ({
          id,
          children: [...groups[id].children]
        })),
      latticeFills: latticeFills.map(fill => ({
        id: fill.id,
        sourceIds: [...fill.sourceIds],
        vectorA: {
          x: Number(fill.vectorA.x.toFixed(3)),
          y: Number(fill.vectorA.y.toFixed(3))
        },
        vectorB: fill.vectorB ? {
          x: Number(fill.vectorB.x.toFixed(3)),
          y: Number(fill.vectorB.y.toFixed(3))
        } : null
      }))
    };
  }

  function loadLayoutData(data) {
    if (!data || !Array.isArray(data.tiles)) {
      throw new Error("Layout must have a tiles array.");
    }

    placementHintsSuppressed = true;

    tilesLayer.innerHTML = "";
    tiles = {};
    groups = {};
    creationOrder = [];
    groupCreationOrder = [];
    selected = new Set();
    nextTileNumber = 1;
    nextGroupNumber = 1;
    nextNewTileOffset = 0;
    canvasBackgroundColor = typeof data.canvasBackgroundColor === "string" ? data.canvasBackgroundColor : "#fafafa";
    applyCanvasBackground();

    latticeCopyOpacity = Number.isFinite(Number(data.latticeCopyOpacity)) ? Number(data.latticeCopyOpacity) : 0.62;
    if (buttons.latticeOpacity) buttons.latticeOpacity.value = String(latticeCopyOpacity);
    applyLatticeOpacity();

    latticeFills = [];
    nextLatticeNumber = 1;
    activeLatticeBuilder = null;
    latticeDrag = null;
    if (latticeLayer) latticeLayer.innerHTML = "";
    clearLatticePreview();
    drag = null;
    rotation = null;
    boxSelect = null;

    data.tiles.forEach((tile, index) => {
      if (!tileDefinitions[tile.tileType]) return;

      const x = Number(tile.x);
      const y = Number(tile.y);
      const tileRotation = Number(tile.rotation || 0);
      if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(tileRotation)) return;

      const tileId = tile.id || "tile" + (index + 1);
      const addedTileId = addPlacedTile(tile.tileType, x, y, tileRotation, tileId);
      tiles[addedTileId].flipX = tile.flipX === -1 ? -1 : 1;
      tiles[addedTileId].flipY = tile.flipY === -1 ? -1 : 1;
      tiles[addedTileId].fillColor = typeof tile.fillColor === "string" ? tile.fillColor : null;
      tiles[addedTileId].fillPattern = typeof tile.fillPattern === "string" ? tile.fillPattern : "solid";
      tiles[addedTileId].fillOpacity = Number.isFinite(Number(tile.fillOpacity)) ? Math.max(0.05, Math.min(1, Number(tile.fillOpacity))) : 1;
      tiles[addedTileId].strokeColor = typeof tile.strokeColor === "string" ? tile.strokeColor : null;
      tiles[addedTileId].strokeStyle = typeof tile.strokeStyle === "string" ? tile.strokeStyle : "solid";
      tiles[addedTileId].strokeWidth = Number.isFinite(Number(tile.strokeWidth)) ? Number(tile.strokeWidth) : defaultStrokeWidth();
      updateTileAppearance(addedTileId);
      updateTileTransform(addedTileId);
    });

    placementHintsSuppressed = false;

    if (Array.isArray(data.groups)) {
      data.groups.forEach(groupData => {
        if (!groupData || !groupData.id || !Array.isArray(groupData.children)) return;

        const validChildren = groupData.children.filter(entityExists);
        if (validChildren.length === 0) return;

        groups[groupData.id] = {
          id: groupData.id,
          children: validChildren,
          parent: null
        };

        groupCreationOrder.push(groupData.id);

        const groupNumberMatch = String(groupData.id).match(/^group(\d+)$/);
        if (groupNumberMatch) {
          nextGroupNumber = Math.max(nextGroupNumber, Number(groupNumberMatch[1]) + 1);
        }
      });

      groupCreationOrder.forEach(groupId => {
        if (!groups[groupId]) return;

        groups[groupId].children = groups[groupId].children.filter(entityExists);
        groups[groupId].children.forEach(childId => setEntityParent(childId, groupId));
      });
    }

    if (Array.isArray(data.latticeFills)) {
      data.latticeFills.forEach(fill => {
        if (!fill || !Array.isArray(fill.sourceIds) || !fill.vectorA) return;

        const sourceIds = fill.sourceIds.filter(id => tiles[id]);

        if (sourceIds.length === 0) return;

        const vectorA = {
          x: Number(fill.vectorA.x),
          y: Number(fill.vectorA.y)
        };

        const vectorB = fill.vectorB ? {
          x: Number(fill.vectorB.x),
          y: Number(fill.vectorB.y)
        } : null;

        if (!Number.isFinite(vectorA.x) || !Number.isFinite(vectorA.y)) return;
        if (vectorB && (!Number.isFinite(vectorB.x) || !Number.isFinite(vectorB.y))) return;

        const latticeId = fill.id || "lattice" + nextLatticeNumber;

        latticeFills.push({
          id: latticeId,
          sourceIds,
          vectorA,
          vectorB
        });

        const latticeMatch = String(latticeId).match(/^lattice(\d+)$/);
        if (latticeMatch) {
          nextLatticeNumber = Math.max(nextLatticeNumber, Number(latticeMatch[1]) + 1);
        }
      });
    }

    hideSnapPreview();
    hideSelectionBox();
    updateAllTileTransforms();
    selectMostRecent();
    updateOverlapWarnings();
  }

  function escapeXml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function buildExportPatternLines(definition, tile, clipId) {
    const pattern = tileFillPattern(tile);

    if (!pattern || pattern === "solid") return [];

    const radius = Math.max(120, (definition.radius || SIDE_LENGTH) + 22);
    const stroke = tileStrokeColor(tile);
    const spacing = 18;
    const lines = [];

    lines.push(`    <defs><clipPath id="${escapeXml(clipId)}">`);

    if (definition.path) {
      const fillRule = definition.fillRule ? ` fill-rule="${escapeXml(definition.fillRule)}"` : "";
      lines.push(`      <path d="${escapeXml(definition.path)}"${fillRule}/>`);      
    } else {
      lines.push(`      <polygon points="${escapeXml(definition.points)}"/>`);
    }

    lines.push("    </clipPath></defs>");
    lines.push(`    <g clip-path="url(#${escapeXml(clipId)})" opacity="${isFoodFillPattern(pattern) ? 1 : 0.34}">`);

    function addLine(x1, y1, x2, y2, lineStroke = stroke, width = 2.2) {
      lines.push(`      <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${escapeXml(lineStroke)}" stroke-width="${width}" stroke-linecap="round"/>`);
    }

    function addCircle(cx, cy, r, fill, circleStroke = null, width = 0) {
      const strokeAttrs = circleStroke ? ` stroke="${escapeXml(circleStroke)}" stroke-width="${width}"` : "";
      lines.push(`      <circle cx="${cx}" cy="${cy}" r="${r}" fill="${escapeXml(fill)}"${strokeAttrs}/>`);
    }

    function addPath(d, fill, pathStroke = null, width = 0) {
      const strokeAttrs = pathStroke ? ` stroke="${escapeXml(pathStroke)}" stroke-width="${width}" stroke-linejoin="round" stroke-linecap="round"` : "";
      lines.push(`      <path d="${escapeXml(d)}" fill="${escapeXml(fill)}"${strokeAttrs}/>`);
    }

    function addCookieChips() {
      [
        [-62, -48, 8], [-18, -68, 6.5], [42, -54, 7.5],
        [-82, 2, 6.5], [-24, -6, 8], [48, -12, 6],
        [-52, 46, 7], [8, 38, 6.5], [72, 48, 8],
        [18, 78, 5.5]
      ].forEach(([cx, cy, r]) => addCircle(cx, cy, r, "#4f2f1c"));
      addCircle(-4, -2, radius * 0.70, "none", "rgba(255,255,255,0.16)", 4);
    }

    function addOreoCream() {
      addCircle(0, 0, radius * 0.55, "#f8f5ec", "#15110f", 3.5);
      addCircle(0, 0, radius * 0.31, "#f8f5ec", "#6a5d55", 1.6);
      addCircle(0, 0, radius * 0.07, "#6a5d55");

      const detailStroke = "#f0e9d8";
      for (let angle = 0; angle < 360; angle += 45) {
        const radians = angle * Math.PI / 180;
        addLine(
          Math.cos(radians) * radius * 0.36,
          Math.sin(radians) * radius * 0.36,
          Math.cos(radians) * radius * 0.50,
          Math.sin(radians) * radius * 0.50,
          detailStroke,
          2
        );
      }

      for (let angle = 22.5; angle < 360; angle += 45) {
        const radians = angle * Math.PI / 180;
        addCircle(Math.cos(radians) * radius * 0.43, Math.sin(radians) * radius * 0.43, 3.2, "#6a5d55");
      }
    }

    function addFoodImageMarkup(foodKey) {
      const href = FOOD_FILL_IMAGES[foodKey];
      if (!href) return;
      lines.push(`      <image href="${escapeXml(href)}" x="${-radius}" y="${-radius}" width="${radius * 2}" height="${radius * 2}" preserveAspectRatio="xMidYMid slice"/>`);
    }

    if (isFoodFillPattern(pattern)) {
      addFoodImageMarkup(pattern);
    } else if (pattern === "dots") {
      for (let x = -radius; x <= radius; x += spacing) {
        for (let y = -radius; y <= radius; y += spacing) {
          addCircle(x, y, 2.4, stroke);
        }
      }
    } else if (pattern === "diagonal") {
      for (let offset = -2 * radius; offset <= 2 * radius; offset += spacing) {
        addLine(offset, -radius, offset + 2 * radius, radius);
      }
    } else if (pattern === "crosshatch") {
      for (let offset = -2 * radius; offset <= 2 * radius; offset += spacing) {
        addLine(offset, -radius, offset + 2 * radius, radius);
        addLine(offset, radius, offset + 2 * radius, -radius);
      }
    } else if (pattern === "horizontal") {
      for (let y = -radius; y <= radius; y += spacing) {
        addLine(-radius, y, radius, y);
      }
    }

    lines.push("    </g>");
    return lines;
  }

  function buildExportSVGString(area = null) {
    const exportBounds = area || { x: 0, y: 0, width: 1000, height: 700 };
    const lines = [];
    lines.push('<?xml version="1.0" encoding="UTF-8"?>');
    lines.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${exportBounds.x} ${exportBounds.y} ${exportBounds.width} ${exportBounds.height}">`);
    lines.push(`  <rect x="${exportBounds.x}" y="${exportBounds.y}" width="${exportBounds.width}" height="${exportBounds.height}" fill="${escapeXml(canvasBackgroundColor)}"/>`);

    const exportedTiles = [
      ...latticeCopiesForCurrentView(),
      ...serializeLayout().tiles
    ];

    exportedTiles.forEach(tile => {
      const definition = tileDefinitions[tile.tileType];
      if (!definition) return;

      const transform = tileTransformString(tile.x, tile.y, tile.rotation, tile.flipX || 1, tile.flipY || 1);
      lines.push(`  <g transform="${escapeXml(transform)}">`);

      if (definition.path) {
        const fillRule = definition.fillRule ? ` fill-rule="${escapeXml(definition.fillRule)}"` : "";
        lines.push(`    <path d="${escapeXml(definition.path)}" fill="${escapeXml(tileFillColor(tile, definition))}"${fillRule} stroke="${escapeXml(tileStrokeStyle(tile) === "none" ? "none" : tileStrokeColor(tile))}" stroke-width="${tileStrokeStyle(tile) === "none" ? 0 : tileStrokeWidth(tile)}"${strokeDashArrayForStyle(tileStrokeStyle(tile), tileStrokeWidth(tile)) ? ` stroke-dasharray="${escapeXml(strokeDashArrayForStyle(tileStrokeStyle(tile), tileStrokeWidth(tile)))}"` : ""}/>`);
        lines.push(...buildExportPatternLines(definition, tile, "exportPattern" + Math.random().toString(36).slice(2)));
      } else {
        lines.push(`    <polygon points="${escapeXml(definition.points)}" fill="${escapeXml(tileFillColor(tile, definition))}" stroke="${escapeXml(tileStrokeStyle(tile) === "none" ? "none" : tileStrokeColor(tile))}" stroke-width="${tileStrokeStyle(tile) === "none" ? 0 : tileStrokeWidth(tile)}"${strokeDashArrayForStyle(tileStrokeStyle(tile), tileStrokeWidth(tile)) ? ` stroke-dasharray="${escapeXml(strokeDashArrayForStyle(tileStrokeStyle(tile), tileStrokeWidth(tile)))}"` : ""}/>`);
        lines.push(...buildExportPatternLines(definition, tile, "exportPattern" + Math.random().toString(36).slice(2)));
      }

      if (Array.isArray(definition.decorations)) {
        definition.decorations.forEach(decoration => {
          lines.push(`    <path d="${escapeXml(decoration.d)}" fill="none" stroke="#ffffff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>`);
        });
      }

      if (definition.label) {
        lines.push(`    <text x="0" y="0" font-family="Arial, sans-serif" font-size="14" font-weight="bold" text-anchor="middle" dominant-baseline="middle">${escapeXml(definition.label)}</text>`);
      }

      lines.push("  </g>");
    });

    lines.push("</svg>");
    return lines.join("\n");
  }

  function normalizedExportArea(area) {
    const x = Math.min(area.x, area.x + area.width);
    const y = Math.min(area.y, area.y + area.height);
    const width = Math.abs(area.width);
    const height = Math.abs(area.height);

    return {
      x: Number(x.toFixed(3)),
      y: Number(y.toFixed(3)),
      width: Number(Math.max(1, width).toFixed(3)),
      height: Number(Math.max(1, height).toFixed(3))
    };
  }

  function selectedExportAspect() {
    if (!exportAspectRatio || exportAspectRatio.value === "free") return null;

    const parts = exportAspectRatio.value.split(":").map(Number);

    if (parts.length !== 2 || !parts[0] || !parts[1]) return null;

    return parts[0] / parts[1];
  }

  function constrainAreaToAspect(start, current) {
    const aspect = selectedExportAspect();

    if (!aspect) {
      return {
        x: start.x,
        y: start.y,
        width: current.x - start.x,
        height: current.y - start.y
      };
    }

    const dx = current.x - start.x;
    const dy = current.y - start.y;
    const signX = dx < 0 ? -1 : 1;
    const signY = dy < 0 ? -1 : 1;

    let width = Math.abs(dx);
    let height = Math.abs(dy);

    if (width / Math.max(height, 1) > aspect) {
      width = height * aspect;
    } else {
      height = width / aspect;
    }

    return {
      x: start.x,
      y: start.y,
      width: width * signX,
      height: height * signY
    };
  }

  function fitExportAreaToAspect() {
    const aspect = selectedExportAspect();

    if (!aspect) {
      updateExportAreaRect();
      return;
    }

    const current = normalizedExportArea(exportArea);
    let width = current.width;
    let height = current.height;

    if (width / height > aspect) {
      width = height * aspect;
    } else {
      height = width / aspect;
    }

    exportArea = {
      x: current.x + (current.width - width) / 2,
      y: current.y + (current.height - height) / 2,
      width,
      height
    };

    updateExportAreaRect();
  }

  function updateExportAreaRect() {
    const area = normalizedExportArea(exportArea);
    exportAreaRect.setAttribute("x", area.x);
    exportAreaRect.setAttribute("y", area.y);
    exportAreaRect.setAttribute("width", area.width);
    exportAreaRect.setAttribute("height", area.height);
  }

  function renderExportPicturePreview() {
    exportAreaPreview.setAttribute("viewBox", `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`);
    exportPreviewContent.innerHTML = "";

    const background = document.createElementNS(SVG_NS, "rect");
    background.setAttribute("x", viewBox.x);
    background.setAttribute("y", viewBox.y);
    background.setAttribute("width", viewBox.width);
    background.setAttribute("height", viewBox.height);
    background.setAttribute("fill", canvasBackgroundColor);
    exportPreviewContent.appendChild(background);

    const previewTiles = [
      ...latticeCopiesForCurrentView(),
      ...serializeLayout().tiles
    ];

    previewTiles.forEach(tileState => {
      const group = createStaticTileElement(tileState, "export-preview-tile");
      if (group) exportPreviewContent.appendChild(group);
    });

    updateExportAreaRect();
  }

  function exportPreviewPoint(event) {
    const point = exportAreaPreview.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    return point.matrixTransform(exportAreaPreview.getScreenCTM().inverse());
  }

  function openExportPictureModal() {
    exportArea = {
      x: viewBox.x + viewBox.width * 0.08,
      y: viewBox.y + viewBox.height * 0.08,
      width: viewBox.width * 0.84,
      height: viewBox.height * 0.84
    };

    exportPictureModal.hidden = false;
    renderExportPicturePreview();
    fitExportAreaToAspect();
    setStatus("Opened Export Picture.");
  }

  function closeExportPictureModal() {
    exportPictureModal.hidden = true;
    exportAreaDrag = null;
    setStatus("Closed Export Picture.");
  }

  function downloadRasterExport(format, area) {
    const svgString = buildExportSVGString(area);
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const image = new Image();

    image.addEventListener("load", () => {
      const aspect = area.width / area.height;
      const maxDimension = 2400;
      let width;
      let height;

      if (aspect >= 1) {
        width = maxDimension;
        height = Math.max(1, Math.round(maxDimension / aspect));
      } else {
        height = maxDimension;
        width = Math.max(1, Math.round(maxDimension * aspect));
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d");
      context.fillStyle = canvasBackgroundColor;
      context.fillRect(0, 0, width, height);
      context.drawImage(image, 0, 0, width, height);

      URL.revokeObjectURL(url);

      const mimeType = format === "jpg" ? "image/jpeg" : "image/png";
      const filename = format === "jpg" ? "bubble-tiles-export.jpg" : "bubble-tiles-export.png";

      canvas.toBlob(outputBlob => {
        if (!outputBlob) {
          setStatus("Could not export image.");
          return;
        }

        const outputUrl = URL.createObjectURL(outputBlob);
        const link = document.createElement("a");
        link.href = outputUrl;
        link.download = filename;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(outputUrl);
        setStatus("Downloaded " + format.toUpperCase() + ".");
      }, mimeType, 0.94);
    });

    image.addEventListener("error", () => {
      URL.revokeObjectURL(url);
      setStatus("Could not export image.");
    });

    image.src = url;
  }

  function printExportAreaAsPdf(area) {
    const svgString = buildExportSVGString(area);
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      setStatus("Could not open print window.");
      return;
    }

    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>Bubble Tiles Export</title>
  <style>
    body { margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    svg { width: 100vw; height: 100vh; object-fit: contain; }
  </style>
</head>
<body>
${svgString}
<script>window.addEventListener('load', () => setTimeout(() => window.print(), 200));</script>
</body>
</html>`);
    printWindow.document.close();
    setStatus("Opened print window. Choose Save as PDF.");
  }

  function downloadSelectedExportPicture() {
    const area = normalizedExportArea(exportArea);
    const format = exportPictureFormat.value;

    if (format === "svg") {
      downloadTextFile("bubble-tiles-export.svg", buildExportSVGString(area), "image/svg+xml");
      setStatus("Downloaded SVG export.");
      return;
    }

    if (format === "png" || format === "jpg") {
      downloadRasterExport(format, area);
      return;
    }

    if (format === "pdf") {
      printExportAreaAsPdf(area);
    }
  }

  function downloadPngFile() {
    const svgString = buildExportSVGString();
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const image = new Image();

    image.addEventListener("load", () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1000;
      canvas.height = 700;

      const context = canvas.getContext("2d");
      context.fillStyle = canvasBackgroundColor;
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      URL.revokeObjectURL(url);

      canvas.toBlob(pngBlob => {
        if (!pngBlob) {
          setStatus("Could not export PNG.");
          return;
        }

        const pngUrl = URL.createObjectURL(pngBlob);
        const link = document.createElement("a");
        link.href = pngUrl;
        link.download = "bubble-tiles-layout.png";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(pngUrl);
        setStatus("Downloaded PNG.");
      }, "image/png");
    });

    image.addEventListener("error", () => {
      URL.revokeObjectURL(url);
      setStatus("Could not export PNG.");
    });

    image.src = url;
  }

  function printOrSavePdf() {
    setStatus("Opening print dialog. Choose Save as PDF to make a PDF.");
    window.print();
  }

  function encodeSharePayload(data) {
    const json = JSON.stringify(data);
    const percentEncoded = encodeURIComponent(json);

    return btoa(percentEncoded)
      .replaceAll("+", "-")
      .replaceAll("/", "_")
      .replaceAll("=", "");
  }

  function decodeSharePayload(payload) {
    let base64 = payload.replaceAll("-", "+").replaceAll("_", "/");

    while (base64.length % 4 !== 0) {
      base64 += "=";
    }

    return JSON.parse(decodeURIComponent(atob(base64)));
  }

  function currentPageUrlWithoutHash() {
    return window.location.href.split("#")[0];
  }

  function buildShareUrl() {
    const payload = encodeSharePayload(serializeLayout());
    return currentPageUrlWithoutHash() + "#layout=" + payload;
  }

  function copyTextToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";

    document.body.appendChild(textarea);
    textarea.select();

    let succeeded = false;

    try {
      succeeded = document.execCommand("copy");
    } finally {
      document.body.removeChild(textarea);
    }

    return succeeded ? Promise.resolve() : Promise.reject(new Error("Copy failed."));
  }

  function copyShareLink() {
    const shareUrl = buildShareUrl();

    copyTextToClipboard(shareUrl)
      .then(() => {
        if (shareUrl.length > 7000) {
          setStatus("Copied share link, but it is very long. JSON export may be safer for this layout.");
          return;
        }

        if (window.location.protocol === "file:") {
          setStatus("Copied share link. For others to open it, use the hosted GitHub Pages version.");
          return;
        }

        setStatus("Copied share link.");
      })
      .catch(() => {
        setStatus("Could not copy share link. Try Export JSON instead.");
      });
  }

  function loadLayoutFromShareHash() {
    const hash = window.location.hash || "";

    if (!hash.startsWith("#layout=")) {
      return false;
    }

    try {
      const payload = hash.slice("#layout=".length);
      const data = decodeSharePayload(payload);

      loadLayoutData(data);
      recordHistory();
      setStatus("Loaded layout from share link.");
      return true;
    } catch (error) {
      setStatus("Could not load layout from share link.");
      return false;
    }
  }

  function downloadTextFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function updateHistoryButtons() {
    buttons.undo.disabled = historyIndex <= 0;
    buttons.redo.disabled = historyIndex >= history.length - 1;
  }

  function recordHistory() {
    renderLatticeFills();
    updateOverlapWarnings({ focusIds: selectedIds() });

    if (restoringHistory) return;

    const snapshot = JSON.stringify(serializeLayout());
    if (history[historyIndex] === snapshot) {
      updateHistoryButtons();
      return;
    }

    history = history.slice(0, historyIndex + 1);
    history.push(snapshot);
    historyIndex = history.length - 1;

    if (history.length > MAX_HISTORY) {
      history.shift();
      historyIndex = history.length - 1;
    }

    updateHistoryButtons();
  }

  function restoreHistory() {
    if (historyIndex < 0 || historyIndex >= history.length) return;

    try {
      restoringHistory = true;
      loadLayoutData(JSON.parse(history[historyIndex]));
      hideSnapPreview();
    } catch (error) {
      setStatus("Could not restore history.");
    } finally {
      restoringHistory = false;
      updateHistoryButtons();
    }
  }

  function undo() {
    if (historyIndex <= 0) return;
    historyIndex -= 1;
    restoreHistory();
    setStatus("Undid last change.");
  }

  function redo() {
    if (historyIndex >= history.length - 1) return;
    historyIndex += 1;
    restoreHistory();
    setStatus("Redid change.");
  }

  function createStaticTileElement(tileState, className) {
    const definition = tileDefinitions[tileState.tileType];

    if (!definition) return null;

    const group = document.createElementNS(SVG_NS, "g");
    group.setAttribute("class", className);
    group.setAttribute(
      "transform",
      tileTransformString(tileState.x, tileState.y, tileState.rotation, tileState.flipX || 1, tileState.flipY || 1)
    );

    let shape;

    if (definition.path) {
      shape = document.createElementNS(SVG_NS, "path");
      shape.setAttribute("d", definition.path);
    } else {
      shape = document.createElementNS(SVG_NS, "polygon");
      shape.setAttribute("points", definition.points);
    }

    setShapePaint(shape, (typeof state !== "undefined" ? state : (typeof tileState !== "undefined" ? tileState : null)), definition);

    if (definition.fillRule) {
      shape.setAttribute("fill-rule", definition.fillRule);
    }

    group.appendChild(shape);
    appendFillPattern(group, definition, (typeof state !== "undefined" ? state : (typeof tileState !== "undefined" ? tileState : null)), group.getAttribute("id") || "tile");
    appendTileDecorations(group, definition);

    if (definition.label) {
      const text = document.createElementNS(SVG_NS, "text");
      text.setAttribute("x", "0");
      text.setAttribute("y", "0");
      text.textContent = definition.label;
      group.appendChild(text);
    }

    return group;
  }

  function shiftedTileState(tileId, shift) {
    const state = tiles[tileId];

    if (!state) return null;

    return {
      tileType: state.tileType,
      x: state.x + shift.x,
      y: state.y + shift.y,
      rotation: state.rotation,
      flipX: state.flipX || 1,
      flipY: state.flipY || 1,
      fillColor: state.fillColor || null,
      fillPattern: state.fillPattern || "solid",
      fillOpacity: tileFillOpacity(state),
      strokeColor: state.strokeColor || null,
      strokeStyle: state.strokeStyle || "solid",
      strokeWidth: tileStrokeWidth(state)
    };
  }

  function vectorLength(vector) {
    return Math.hypot(vector.x, vector.y);
  }

  function vectorCross(a, b) {
    return a.x * b.y - a.y * b.x;
  }

  function tileStateVisibleInView(tileState, margin = 800) {
    const definition = tileDefinitions[tileState.tileType];

    if (!definition) return false;

    const radius = definition.radius || SIDE_LENGTH;

    return (
      tileState.x + radius >= viewBox.x - margin &&
      tileState.x - radius <= viewBox.x + viewBox.width + margin &&
      tileState.y + radius >= viewBox.y - margin &&
      tileState.y - radius <= viewBox.y + viewBox.height + margin
    );
  }

  function latticeCopiesForCurrentView() {
    const copies = [];
    const maxRenderedTiles = 10000;

    latticeFills.forEach(fill => {
      const sourceIds = fill.sourceIds.filter(id => tiles[id]);

      if (sourceIds.length === 0) return;

      const a = fill.vectorA;
      const b = fill.vectorB;
      const lenA = vectorLength(a);
      const lenB = b ? vectorLength(b) : Infinity;

      if (lenA < 5) return;

      const viewDiagonal = Math.hypot(viewBox.width, viewBox.height);
      const rangeA = Math.min(60, Math.max(3, Math.ceil(viewDiagonal / Math.max(lenA, 30)) + 12));
      const rangeB = b ? Math.min(60, Math.max(3, Math.ceil(viewDiagonal / Math.max(lenB, 30)) + 8)) : 0;

      for (let i = -rangeA; i <= rangeA; i += 1) {
        const jMin = b ? -rangeB : 0;
        const jMax = b ? rangeB : 0;

        for (let j = jMin; j <= jMax; j += 1) {
          if (i === 0 && j === 0) continue;

          const shift = {
            x: i * a.x + (b ? j * b.x : 0),
            y: i * a.y + (b ? j * b.y : 0)
          };

          const motifIsVisible = sourceIds.some(sourceId => {
            const candidateState = shiftedTileState(sourceId, shift);
            return candidateState && tileStateVisibleInView(candidateState);
          });

          if (!motifIsVisible) continue;

          sourceIds.forEach(sourceId => {
            const candidateState = shiftedTileState(sourceId, shift);

            if (candidateState) {
              copies.push(candidateState);
            }
          });

          if (copies.length >= maxRenderedTiles) {
            return;
          }
        }

        if (copies.length >= maxRenderedTiles) {
          return;
        }
      }
    });

    return copies;
  }

  function renderLatticeFills() {
    if (!latticeLayer) return;

    latticeLayer.innerHTML = "";

    latticeCopiesForCurrentView().forEach(copyState => {
      const group = createStaticTileElement(copyState, "lattice-copy");

      if (group) {
        latticeLayer.appendChild(group);
      }
    });
  }

  function clearLatticePreview() {
    if (latticePreview) {
      latticePreview.innerHTML = "";
    }
  }

  function renderLatticePreviewVector(vector, cssClass) {
    activeLatticeBuilder.sourceIds.forEach(sourceId => {
      const state = shiftedTileState(sourceId, vector);
      const group = state ? createStaticTileElement(state, "lattice-preview-copy " + cssClass) : null;

      if (group) {
        latticePreview.appendChild(group);
      }
    });
  }

  function updateLatticePreview(vector) {
    if (!activeLatticeBuilder || !latticePreview) return;

    clearLatticePreview();

    if (activeLatticeBuilder.vectorA) {
      renderLatticePreviewVector(activeLatticeBuilder.vectorA, "lattice-preview-a");
    }

    renderLatticePreviewVector(vector, activeLatticeBuilder.phase === "A" ? "lattice-preview-a" : "lattice-preview-b");

    const center = groupCenter(activeLatticeBuilder.sourceIds);

    const line = document.createElementNS(SVG_NS, "line");
    line.setAttribute("class", "lattice-vector-line");
    line.setAttribute("x1", center.x);
    line.setAttribute("y1", center.y);
    line.setAttribute("x2", center.x + vector.x);
    line.setAttribute("y2", center.y + vector.y);

    latticePreview.appendChild(line);
  }

  function makeLatticeProbeIds(sourceIds, vector) {
    const probeIds = [];

    sourceIds.forEach((sourceId, index) => {
      const state = tiles[sourceId];

      if (!state) return;

      const probeId = "__latticeProbe" + index;

      tiles[probeId] = {
        tileType: state.tileType,
        x: state.x + vector.x,
        y: state.y + vector.y,
        rotation: state.rotation,
        flipX: state.flipX || 1,
        flipY: state.flipY || 1,
        parent: null
      };

      probeIds.push(probeId);
    });

    return probeIds;
  }

  function removeLatticeProbeIds(probeIds) {
    probeIds.forEach(probeId => {
      delete tiles[probeId];
    });
  }

  function snappedLatticeVector(sourceIds, rawVector) {
    const probeIds = makeLatticeProbeIds(sourceIds, rawVector);

    try {
      const candidate = findSnapCandidate(probeIds);

      if (!candidate || Math.abs(candidate.rotationDelta) > 0.75 || !candidate.previewTiles.length) {
        return rawVector;
      }

      const firstProbePreview = candidate.previewTiles.find(tile => tile.id === probeIds[0]) || candidate.previewTiles[0];
      const firstSource = tiles[sourceIds[0]];

      if (!firstProbePreview || !firstSource) {
        return rawVector;
      }

      return {
        x: firstProbePreview.x - firstSource.x,
        y: firstProbePreview.y - firstSource.y
      };
    } finally {
      removeLatticeProbeIds(probeIds);
    }
  }

  function startLatticeFill() {
    const sourceIds = selectedIds();

    if (sourceIds.length === 0) {
      setStatus("Select a tile, group, or motif before using Lattice Fill.");
      return;
    }

    activeLatticeBuilder = {
      sourceIds: [...sourceIds],
      phase: "A",
      vectorA: null
    };

    latticeDrag = null;
    clearLatticePreview();
    hideSnapPreview();

    showLatticeHint("Lattice Fill step 1: drag a ghost copy of your selected motif into the first repeat position. It will try to snap. Release to set vector A. Hit Esc to cancel.");
    setStatus("Lattice Fill: drag a ghost copy to define vector A.");
  }

  function cancelLatticeFill() {
    activeLatticeBuilder = null;
    latticeDrag = null;
    clearLatticePreview();
    hideLatticeHint();
    setStatus("Canceled Lattice Fill.");
  }

  function finalizeLatticeFill(vectorB) {
    const sourceIds = activeLatticeBuilder.sourceIds.filter(id => tiles[id]);
    const vectorA = activeLatticeBuilder.vectorA;

    if (sourceIds.length === 0) {
      cancelLatticeFill();
      return;
    }

    if (vectorLength(vectorA) < 10 || vectorLength(vectorB) < 10) {
      setStatus("Lattice vectors are too small.");
      return;
    }

    if (Math.abs(vectorCross(vectorA, vectorB)) < 100) {
      setStatus("Vector B is too close to vector A. Drag in a different direction.");
      return;
    }

    const latticeId = "lattice" + nextLatticeNumber;
    nextLatticeNumber += 1;

    latticeFills.push({
      id: latticeId,
      sourceIds,
      vectorA: {
        x: Number(vectorA.x.toFixed(3)),
        y: Number(vectorA.y.toFixed(3))
      },
      vectorB: {
        x: Number(vectorB.x.toFixed(3)),
        y: Number(vectorB.y.toFixed(3))
      }
    });

    activeLatticeBuilder = null;
    latticeDrag = null;
    clearLatticePreview();
    hideLatticeHint();
    renderLatticeFills();
    recordHistory();

    setStatus("Created Lattice Fill with " + sourceIds.length + " seed tile" + (sourceIds.length === 1 ? "" : "s") + ".");
  }

  function clearLatticeFills() {
    latticeFills = [];
    nextLatticeNumber = 1;
    activeLatticeBuilder = null;
    latticeDrag = null;
    clearLatticePreview();
    hideLatticeHint();
    renderLatticeFills();
    recordHistory();
    setStatus("Cleared lattice fills.");
  }

  const tileCollections = {
    hex: ["B0", "B1", "B2A", "B2B", "B2C", "B3A", "B3ASTAR", "B3B", "B3C", "B4A", "B4B", "B4C", "B5", "B6"],
    tri: ["T0", "T1", "T2", "T3"],
    square: ["Q0", "Q1", "Q2A", "Q2B", "Q3", "Q4"],
    hexPuzzle: ["PH0", "PH1", "PH2A", "PH2B", "PH2C", "PH3A", "PH3ASTAR", "PH3B", "PH3C", "PH4A", "PH4B", "PH4C", "PH5", "PH6"],
    triPuzzle: ["PT0", "PT1", "PT2", "PT3"],
    squarePuzzle: ["PQ0", "PQ1", "PQ2A", "PQ2B", "PQ3", "PQ4"],
    monotiles: ["HAT", "TURTLE", "SPECTRE"],
    regular: ["TRI", "SQUARE", "PENT", "HEX", "HEPT", "OCT"],
    aperiodic: ["PRTHICK", "PRTHIN", "PKITE", "PDART", "HAT", "TURTLE", "SPECTRE"],
    polyominoes: ["TET_I", "TET_O", "TET_T", "TET_L", "TET_S", "PENT_F", "PENT_I", "PENT_L", "PENT_N", "PENT_P", "PENT_T", "PENT_U", "PENT_V", "PENT_W", "PENT_X", "PENT_Y", "PENT_Z"],
    assorted: ["SH_TRAP", "SH_PARA", "SH_RHOMBUS", "SH_RECT", "SH_RIGHT_TRI", "SH_SMALL_TRI", "SH_CHEVRON", "SH_KITE", "SH_DART"]
  };

  const traySetMetadata = {
    hex: { label: "Hexagonal", icon: "B3C" },
    tri: { label: "Triangular", icon: "T2" },
    square: { label: "Square", icon: "Q2A" },
    hexPuzzle: { label: "Hexagonal Puzzle", icon: "PH5" },
    triPuzzle: { label: "Triangular Puzzle", icon: "PT3" },
    squarePuzzle: { label: "Square Puzzle", icon: "PQ4" },
    frames: { label: "Frames", icon: "FMINI" },
    monotiles: { label: "Einstein / Spectre", icon: "SPECTRE" },
    regular: { label: "Regular Polygons", icon: "PENT" }
  };

  let activeCollapsedTraySet = "hex";

  function tileTypesForTraySet(setName) {
    if (setName === "frames") return ["F13", "FMINI", "FLARGE"];
    return tileCollections[setName] || [];
  }

  function tileSetForTileType(tileType) {
    if (["F13", "FMINI", "FLARGE"].includes(tileType)) return "frames";

    for (const [collectionName, tileTypes] of Object.entries(tileCollections)) {
      if (!traySetMetadata[collectionName]) continue;
      if (tileTypes.includes(tileType)) return collectionName;
    }

    return null;
  }

  function addCollapsedTraySet() {
    const setName = activeCollapsedTraySet;
    const tileTypes = tileTypesForTraySet(setName).filter(tileType => tileDefinitions[tileType]);

    if (tileTypes.length === 0) {
      setStatus("No tiles to add.");
      return;
    }

    if (tileCollections[setName]) {
      addTileCollection(setName);
      return;
    }

    const layout = genericCollectionLayout(tileTypes, setName);
    const center = {
      x: viewBox.x + viewBox.width / 2,
      y: viewBox.y + viewBox.height / 2
    };
    const newIds = [];

    layout.forEach(item => {
      const newId = addPlacedTile(
        item.tileType,
        center.x + item.x,
        center.y + item.y,
        Number.isFinite(item.rotation) ? item.rotation : defaultRotationForTileType(item.tileType)
      );
      newIds.push(newId);
    });

    selectMany(newIds);
    hideSnapPreview();
    recordHistory();
    recordRecentTraySet(setName);
    setStatus("Added " + newIds.length + " " + traySetMetadata[setName].label + " tiles.");
  }

  function renderCollapsedTrayIcons() {
    if (!collapsedTrayIcons) return;

    collapsedTrayIcons.innerHTML = "";

    const setName = activeCollapsedTraySet;
    const metadata = traySetMetadata[setName];
    const tileTypes = tileTypesForTraySet(setName).filter(tileType => tileDefinitions[tileType]);

    if (!metadata || tileTypes.length === 0) return;

    const heading = document.createElement("button");
    heading.type = "button";
    heading.className = "collapsed-tray-icon-heading";
    heading.title = "Add all " + metadata.label;
    heading.setAttribute("aria-label", "Add all " + metadata.label);
    heading.textContent = "▦+";
    heading.addEventListener("click", () => {
      addCollapsedTraySet();
      renderCollapsedTrayIcons();
    });
    collapsedTrayIcons.appendChild(heading);

    tileTypes.forEach(tileType => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "collapsed-tray-icon-button";
      button.title = "Add " + tileDisplayName(tileType);
      button.setAttribute("aria-label", "Add " + tileDisplayName(tileType));

      const icon = createTileIconSvg(tileType, "collapsed-tray-icon-svg");
      if (icon) button.appendChild(icon);
      else button.textContent = "▦";

      attachPaletteTileButtonEvents(button, () => tileType, {
        afterAdd: () => renderCollapsedTrayIcons()
      });

      collapsedTrayIcons.appendChild(button);
    });
  }

  function recordRecentTraySet(setName) {
    if (!setName || !traySetMetadata[setName]) return;

    activeCollapsedTraySet = setName;
    renderCollapsedTrayIcons();
  }

  function expandTileTray() {
    if (!appShell.classList.contains("tray-collapsed")) return;

    appShell.classList.remove("tray-collapsed");
    syncTrayStatusClass();
    toggleTrayButton.title = "Collapse tile tray";
  }

  function openTraySet(setName) {
    const section = document.querySelector('[data-tray-set="' + setName + '"]');

    expandTileTray();
    switchTrayTab("tiles");

    if (section) {
      section.open = true;
      window.setTimeout(() => {
        section.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }, 0);
    }

    recordRecentTraySet(setName);
    setStatus("Opened " + traySetMetadata[setName].label + ".");
  }

  function prefixedTiles(prefix, suffixes) {
    return suffixes.map(suffix => prefix + suffix);
  }

  function paperCollectionLayout(collectionName) {
    const hexSuffixRows = [
      { y: -310, items: [[-300, "2C"], [0, "3C"], [300, "4C"]] },
      { y: -155, items: [[-300, "2B"], [0, "3B"], [300, "4B"]] },
      { y: 0, items: [[-720, "0"], [-540, "1"], [-300, "2A"], [0, "3A"], [300, "4A"], [540, "5"], [720, "6"]] },
      { y: 170, items: [[0, "3ASTAR"]] }
    ];

    const squareRows = [
      { y: -135, items: [[0, "2B"]] },
      { y: 60, items: [[-300, "0"], [-150, "1"], [0, "2A"], [150, "3"], [300, "4"]] }
    ];

    const layouts = {
      hex: hexSuffixRows.flatMap(row => row.items.map(([x, suffix]) => ({ tileType: "B" + suffix, x, y: row.y }))),
      hexPuzzle: hexSuffixRows.flatMap(row => row.items.map(([x, suffix]) => ({ tileType: "PH" + suffix, x, y: row.y }))),
      tri: [
        { tileType: "T0", x: -240, y: 0 },
        { tileType: "T1", x: -80, y: 0 },
        { tileType: "T2", x: 80, y: 0 },
        { tileType: "T3", x: 240, y: 0 }
      ],
      triPuzzle: [
        { tileType: "PT0", x: -240, y: 0 },
        { tileType: "PT1", x: -80, y: 0 },
        { tileType: "PT2", x: 80, y: 0 },
        { tileType: "PT3", x: 240, y: 0 }
      ],
      square: squareRows.flatMap(row => row.items.map(([x, suffix]) => ({ tileType: "Q" + suffix, x, y: row.y }))),
      squarePuzzle: squareRows.flatMap(row => row.items.map(([x, suffix]) => ({ tileType: "PQ" + suffix, x, y: row.y }))),
      regular: [
        { tileType: "TRI", x: -330, y: -105 },
        { tileType: "SQUARE", x: -110, y: -105 },
        { tileType: "PENT", x: 110, y: -105 },
        { tileType: "HEX", x: 330, y: -105 },
        { tileType: "HEPT", x: -130, y: 130 },
        { tileType: "OCT", x: 150, y: 130 }
      ]
    };

    return layouts[collectionName] || null;
  }

  function genericCollectionLayout(tileTypes, collectionName) {
    const maxRadius = tileTypes.reduce((maxRadiusSoFar, tileType) => {
      const definition = tileDefinitions[tileType];
      return Math.max(maxRadiusSoFar, definition && Number.isFinite(definition.radius) ? definition.radius : 80);
    }, 80);
    const spacing = Math.max(155, maxRadius * 2 + 34);
    const columns = collectionName.includes("hex") ? 7 : Math.min(4, tileTypes.length);
    const rows = Math.ceil(tileTypes.length / columns);
    const startX = -(columns - 1) * spacing / 2;
    const startY = -(rows - 1) * spacing / 2;

    return tileTypes.map((tileType, index) => ({
      tileType,
      x: startX + (index % columns) * spacing,
      y: startY + Math.floor(index / columns) * spacing
    }));
  }

  function addTileCollection(collectionName) {
    const tileTypes = tileCollections[collectionName];

    if (!tileTypes) return;

    const center = {
      x: viewBox.x + viewBox.width / 2,
      y: viewBox.y + viewBox.height / 2
    };

    const layout = paperCollectionLayout(collectionName) || genericCollectionLayout(tileTypes, collectionName);
    const newIds = [];

    layout.forEach(item => {
      if (!tileDefinitions[item.tileType]) return;

      const newId = addPlacedTile(
        item.tileType,
        center.x + item.x,
        center.y + item.y,
        Number.isFinite(item.rotation) ? item.rotation : defaultRotationForTileType(item.tileType)
      );
      newIds.push(newId);
    });

    selectMany(newIds);
    hideSnapPreview();
    recordHistory();
    recordRecentTraySet(collectionName);

    setStatus("Added " + newIds.length + " tiles in the reference arrangement.");
  }

  function initializeBoard(shouldRecordHistory = true) {
    tilesLayer.innerHTML = "";
    tiles = {};
    groups = {};
    creationOrder = [];
    groupCreationOrder = [];
    selected = new Set();
    nextTileNumber = 1;
    nextGroupNumber = 1;
    nextNewTileOffset = 0;
    canvasBackgroundColor = "#fafafa";
    applyCanvasBackground();

    latticeCopyOpacity = 0.62;
    if (buttons.latticeOpacity) buttons.latticeOpacity.value = String(latticeCopyOpacity);
    applyLatticeOpacity();

    latticeFills = [];
    nextLatticeNumber = 1;
    activeLatticeBuilder = null;
    latticeDrag = null;
    if (latticeLayer) latticeLayer.innerHTML = "";
    clearLatticePreview();
    drag = null;
    rotation = null;
    boxSelect = null;
    ctrlTilePan = null;

    hideSnapPreview();
    hideSelectionBox();
    updateAllTileTransforms();
    clearSelection();
    updateOverlapWarnings();

    if (shouldRecordHistory) recordHistory();
    setStatus("Canvas cleared.");
  }

  function showTrayDragGhost(tileType, event) {
    if (!trayDragGhost) return;

    const iconSvg = createTileIconSvg(tileType, "tray-drag-ghost-svg");

    if (!iconSvg) return;

    trayDragGhost.innerHTML = "";
    trayDragGhost.appendChild(iconSvg);
    trayDragGhost.style.display = "block";
    moveTrayDragGhost(event);
  }

  function moveTrayDragGhost(event) {
    if (!trayDragGhost) return;

    trayDragGhost.style.left = event.clientX + "px";
    trayDragGhost.style.top = event.clientY + "px";
  }

  function hideTrayDragGhost() {
    if (!trayDragGhost) return;

    trayDragGhost.style.display = "none";
    trayDragGhost.innerHTML = "";
  }

  function addTileFromPaletteAtEvent(tileType, event) {
    const point = svgPoint(event);
    const newTileId = addPlacedTile(tileType, point.x, point.y, defaultRotationForTileType(tileType));

    selectOnly(newTileId);
    recordRecentTraySet(tileSetForTileType(tileType));
    hideSnapPreview();
    recordHistory();
    setStatus("Added " + tileDisplayName(tileType) + ".");
  }

  document.querySelectorAll("[data-add-collection]").forEach(button => {
    button.addEventListener("click", () => {
      addTileCollection(button.dataset.addCollection);
    });
  });

  function attachPaletteTileButtonEvents(button, tileTypeGetter, options = {}) {
    const getTileType = () => typeof tileTypeGetter === "function" ? tileTypeGetter() : button.dataset.tileType;

    button.addEventListener("click", () => {
      if (button.dataset.skipNextClick === "true") {
        delete button.dataset.skipNextClick;
        return;
      }

      const tileType = getTileType();
      if (!tileDefinitions[tileType]) return;

      addTileFromPalette(tileType);
      if (options.afterAdd) options.afterAdd(tileType);
    });

    button.addEventListener("pointerdown", event => {
      if (event.button !== 0) return;

      const tileType = getTileType();
      if (!tileDefinitions[tileType]) return;

      paletteDrag = {
        tileType,
        sourceButton: button,
        startClient: { x: event.clientX, y: event.clientY },
        wasDragged: false
      };

      button.setPointerCapture(event.pointerId);
    });

    button.addEventListener("pointermove", event => {
      if (!paletteDrag || paletteDrag.sourceButton !== button) return;

      const dx = event.clientX - paletteDrag.startClient.x;
      const dy = event.clientY - paletteDrag.startClient.y;

      if (Math.hypot(dx, dy) > 5) {
        if (!paletteDrag.wasDragged) {
          showTrayDragGhost(paletteDrag.tileType, event);
        }

        paletteDrag.wasDragged = true;
        button.classList.add("dragging-from-tray");
        moveTrayDragGhost(event);
        setStatus("Drag onto canvas to place " + tileDisplayName(paletteDrag.tileType) + ".");
      }
    });

    button.addEventListener("pointerup", event => {
      if (!paletteDrag || paletteDrag.sourceButton !== button) return;

      const dragInfo = paletteDrag;
      paletteDrag = null;
      button.classList.remove("dragging-from-tray");
      hideTrayDragGhost();

      if (!dragInfo.wasDragged) return;

      button.dataset.skipNextClick = "true";

      const rect = svg.getBoundingClientRect();
      const isOverCanvas =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (isOverCanvas) {
        addTileFromPaletteAtEvent(dragInfo.tileType, event);
        if (options.afterAdd) options.afterAdd(dragInfo.tileType);
      } else {
        setStatus("Drag canceled.");
      }
    });

    button.addEventListener("pointercancel", () => {
      paletteDrag = null;
      button.classList.remove("dragging-from-tray");
      hideTrayDragGhost();
    });
  }

  document.querySelectorAll("[data-tile-type]").forEach(button => {
    attachPaletteTileButtonEvents(button, () => button.dataset.tileType);
  });

  function syncTrayStatusClass() {
    document.body.classList.toggle("tray-is-collapsed", appShell.classList.contains("tray-collapsed"));
  }

  toggleTrayButton.addEventListener("click", () => {
    appShell.classList.toggle("tray-collapsed");
    syncTrayStatusClass();

    if (appShell.classList.contains("tray-collapsed")) {
      toggleTrayButton.title = "Expand tile tray";
      renderCollapsedTrayIcons();
      setStatus("Collapsed tile panel.");
    } else {
      toggleTrayButton.title = "Collapse tile tray";
      setStatus("Expanded tile panel.");
    }
  });

  syncTrayStatusClass();

  if (tileTray) {
    tileTray.addEventListener("wheel", event => {
      event.preventDefault();
      event.stopPropagation();

      tileTray.scrollTop += event.deltaY;
    }, { passive: false });
  }

  document.querySelectorAll(".tray-section").forEach(section => {
    section.addEventListener("toggle", () => {
      if (!section.open) return;

      if (section.dataset.traySet) {
        recordRecentTraySet(section.dataset.traySet);
      }

      document.querySelectorAll(".tray-section").forEach(otherSection => {
        if (otherSection !== section) otherSection.open = false;
      });

      section.scrollIntoView({
        block: "nearest",
        behavior: "smooth"
      });
    });
  });

  function closeStylePopovers(exceptPanel = null) {
    [buttons.shapeFillPanel, buttons.shapeOutlinePanel].forEach(panel => {
      if (panel && panel !== exceptPanel) {
        panel.hidden = true;
      }
    });
  }

  function toggleStylePopover(panel) {
    if (!panel) return;
    const shouldOpen = panel.hidden;
    closeStylePopovers(shouldOpen ? panel : null);
    panel.hidden = !shouldOpen;
  }

  const guidedTutorialStorageKey = "bubbleTilesGuidedTutorialSeen";
  const guidedTutorialSteps = [
    {
      title: "Welcome to Bubble Tiles",
      text: "This app is a geometry workbench: choose tiles, build patches, snap edges, create lattices, style the result, and export or share your layout.",
      target: "#toolbar"
    },
    {
      title: "View tools",
      text: "Use the View menu for zoom, full screen, Snap, Overlap, and toolbar visibility. The View icon toolbar is shown by default; if it is hidden, use the View dropdown instead.",
      target: "#viewToolbar",
      fallbackTarget: "#viewMenu > summary"
    },
    {
      title: "Edit tools",
      text: "Use the Edit menu for undo/redo, copy/paste, duplicate, delete, clear canvas, selection commands, and layer order. The Edit icon toolbar is shown by default; if it is hidden, use the Edit dropdown instead.",
      target: "#editToolbar",
      fallbackTarget: "#editMenu > summary"
    },
    {
      title: "1. Add a tile",
      text: "Use the Tiles tab on the left. Click a tile to add it, or drag it onto the canvas. The Examples tab can load finished starter designs.",
      target: "#tileTray"
    },
    {
      title: "2. Select and group",
      text: "Click tiles to select them. Use Ctrl/Shift for multiple selection, then Group to move a motif as one object.",
      target: "#selectionToolbar"
    },
    {
      title: "3. Snap and transform",
      text: "Snap is on by default. Drag compatible edges close together. Transform tools rotate, flip, and apply Arc Dual.",
      target: "#transformToolbar"
    },
    {
      title: "4. Try Lattice Fill",
      text: "Select a motif, press the lattice icon, then drag one ghost copy for vector A and another for vector B. Press Esc to cancel.",
      target: "#latticeToolbar"
    },
    {
      title: "5. Style the design",
      text: "Use the Fill icon for fill color/pattern, including cookie, Oreo, and donut fills; use the Outline icon for stroke color/style/width, and the canvas icon for the background.",
      target: "#styleToolbar"
    },
    {
      title: "6. Save, share, or export",
      text: "Use File to save, import/export JSON, copy a share link, or export a picture. Help and this guided tutorial live in the About menu.",
      target: "#fileMenu"
    }
  ];

  function clearGuidedHighlights() {
    document.querySelectorAll(".guided-highlight").forEach(element => {
      element.classList.remove("guided-highlight");
    });
  }

  function markGuidedTutorialSeen() {
    try {
      localStorage.setItem(guidedTutorialStorageKey, "true");
    } catch (error) {
      // localStorage may be unavailable in some privacy modes.
    }
  }

  function guidedTargetIsVisible(element) {
    if (!element) return false;

    if (element.hidden) return false;
    if (element.closest("[hidden]")) return false;

    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  function resolveGuidedTarget(step) {
    const target = step.target ? document.querySelector(step.target) : null;

    if (guidedTargetIsVisible(target)) {
      return target;
    }

    const fallbackTarget = step.fallbackTarget ? document.querySelector(step.fallbackTarget) : null;

    if (guidedTargetIsVisible(fallbackTarget)) {
      return fallbackTarget;
    }

    return null;
  }

  function updateGuidedTutorial() {
    if (!guidedTutorialPanel || guidedTutorialSteps.length === 0) return;

    const step = guidedTutorialSteps[guidedTutorialStep];
    guidedTutorialTitle.textContent = step.title;
    guidedTutorialText.textContent = step.text;
    guidedTutorialProgress.textContent = "Step " + (guidedTutorialStep + 1) + " of " + guidedTutorialSteps.length;

    guidedBackButton.disabled = guidedTutorialStep === 0;
    guidedNextButton.textContent = guidedTutorialStep === guidedTutorialSteps.length - 1 ? "Finish" : "Next";

    clearGuidedHighlights();
    const target = resolveGuidedTarget(step);
    if (target) {
      target.classList.add("guided-highlight");
      target.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  }

  function startGuidedTutorial() {
    if (!guidedTutorialPanel) return;

    closeToolbarMenus();
    closeStylePopovers();
    guidedTutorialStep = 0;
    guidedTutorialPanel.hidden = false;
    updateGuidedTutorial();
    setStatus("Started Guided Tutorial.");
  }

  function closeGuidedTutorial(shouldMarkSeen = true) {
    if (!guidedTutorialPanel) return;

    guidedTutorialPanel.hidden = true;
    clearGuidedHighlights();

    if (shouldMarkSeen) {
      markGuidedTutorialSeen();
    }

    setStatus("Closed Guided Tutorial.");
  }

  function maybeStartFirstRunGuidedTutorial() {
    try {
      if (localStorage.getItem(guidedTutorialStorageKey) === "true") return;
    } catch (error) {
      // localStorage may be unavailable; still allow manual tutorial.
    }

    window.setTimeout(() => {
      if (guidedTutorialPanel && guidedTutorialPanel.hidden) {
        startGuidedTutorial();
      }
    }, 700);
  }

  function openAboutModal() {
    aboutModal.hidden = false;
    setStatus("Opened About.");
  }

  function closeAboutModal() {
    aboutModal.hidden = true;
    setStatus("Closed About.");
  }

  function openHelpModal() {
    helpModal.hidden = false;
    setStatus("Opened Help.");
  }

  function closeHelpModal() {
    helpModal.hidden = true;
    setStatus("Closed Help.");
  }

  function openVersionHistoryModal() {
    versionHistoryModal.hidden = false;
    setStatus("Opened Version History.");
  }

  function closeVersionHistoryModal() {
    versionHistoryModal.hidden = true;
    setStatus("Closed Version History.");
  }

  aboutButton.addEventListener("click", openAboutModal);
  closeAboutButton.addEventListener("click", closeAboutModal);
  helpButton.addEventListener("click", openHelpModal);
  closeHelpButton.addEventListener("click", closeHelpModal);
  if (versionHistoryButton) versionHistoryButton.addEventListener("click", openVersionHistoryModal);
  if (closeVersionHistoryButton) closeVersionHistoryButton.addEventListener("click", closeVersionHistoryModal);
  if (guidedTutorialButton) guidedTutorialButton.addEventListener("click", startGuidedTutorial);
  if (guidedBackButton) guidedBackButton.addEventListener("click", () => {
    guidedTutorialStep = Math.max(0, guidedTutorialStep - 1);
    updateGuidedTutorial();
  });
  if (guidedNextButton) guidedNextButton.addEventListener("click", () => {
    if (guidedTutorialStep >= guidedTutorialSteps.length - 1) {
      closeGuidedTutorial(true);
      return;
    }

    guidedTutorialStep += 1;
    updateGuidedTutorial();
  });
  if (guidedDoneButton) guidedDoneButton.addEventListener("click", () => closeGuidedTutorial(true));

  aboutModal.addEventListener("click", event => {
    if (event.target === aboutModal) {
      closeAboutModal();
    }
  });

  helpModal.addEventListener("click", event => {
    if (event.target === helpModal) {
      closeHelpModal();
    }
  });

  if (versionHistoryModal) {
    versionHistoryModal.addEventListener("click", event => {
      if (event.target === versionHistoryModal) {
        closeVersionHistoryModal();
      }
    });
  }

  function syncMenuControlsFromToolbar() {
    if (buttons.menuRotateDegrees && buttons.rotateDegrees) buttons.menuRotateDegrees.value = formatMenuDegreeValue(parseDegreeValue(buttons.rotateDegrees.value));
    if (buttons.menuLatticeOpacity && buttons.latticeOpacity) buttons.menuLatticeOpacity.value = buttons.latticeOpacity.value;
    if (buttons.menuFillColorPicker && buttons.fillColorPicker) buttons.menuFillColorPicker.value = buttons.fillColorPicker.value;
    if (buttons.menuFillPatternPicker && buttons.fillPatternPicker) buttons.menuFillPatternPicker.value = buttons.fillPatternPicker.value;
    if (buttons.menuFillOpacityPicker && buttons.fillOpacityPicker) buttons.menuFillOpacityPicker.value = buttons.fillOpacityPicker.value;
    if (buttons.menuStrokeColorPicker && buttons.strokeColorPicker) buttons.menuStrokeColorPicker.value = buttons.strokeColorPicker.value;
    if (buttons.menuStrokeStylePicker && buttons.strokeStylePicker) buttons.menuStrokeStylePicker.value = buttons.strokeStylePicker.value;
    if (buttons.menuStrokeWidthPicker && buttons.strokeWidthPicker) buttons.menuStrokeWidthPicker.value = buttons.strokeWidthPicker.value;
    if (buttons.menuCanvasColorPicker && buttons.canvasColorPicker) buttons.menuCanvasColorPicker.value = buttons.canvasColorPicker.value;
    if (buttons.menuSnapToggle && snapToggle) buttons.menuSnapToggle.checked = snapToggle.checked;
    if (buttons.menuOverlapToggle && overlapToggle) buttons.menuOverlapToggle.checked = overlapToggle.checked;
  }

  function executeToolbarCommand(command) {
    const commands = {
      undo,
      redo,
      copySelected: copySelectedToClipboard,
      pasteClipboard,
      duplicateSelected,
      deleteSelected,
      clearCanvas: () => {
        initializeBoard(true);
        setStatus("Canvas cleared.");
      },
      zoomIn: () => {
        zoomAtCenter(0.85);
        setStatus("Zoomed in.");
      },
      zoomOut: () => {
        zoomAtCenter(1.15);
        setStatus("Zoomed out.");
      },
      resetView,
      fullScreen: toggleFullScreen,
      selectAll: () => {
        selectMany(orderedTileIds());
        setStatus("Selected all tiles.");
      },
      groupSelected,
      ungroupSelected,
      sendToBottom: sendSelectedToBottom,
      moveDown: moveSelectedDownLayer,
      moveUp: moveSelectedUpLayer,
      bringToTop: bringSelectedToTop,
      rotateLeft: () => rotateSelected(-rotationStepDegrees()),
      rotateRight: () => rotateSelected(rotationStepDegrees()),
      reflectHorizontal: () => reflectSelected("horizontal"),
      reflectVertical: () => reflectSelected("vertical"),
      arcDual: applyArcDualToSelection,
      latticeFill: startLatticeFill,
      clearLattice: clearLatticeFills,
      locateLatticeParents,
      toggleSnap: () => {
        snapToggle.checked = !snapToggle.checked;
        snapToggle.dispatchEvent(new Event("change"));
      },
      toggleOverlap: () => {
        overlapToggle.checked = !overlapToggle.checked;
        overlapToggle.dispatchEvent(new Event("change"));
      }
    };

    if (commands[command]) {
      commands[command]();
      syncMenuControlsFromToolbar();
    }
  }

  const toolbarVisibilityStorageKey = "bubbleTilesToolbarVisibilityV2";

  function toolbarToggleElements() {
    return [...document.querySelectorAll("[data-toolbar-toggle]")];
  }

  function saveToolbarVisibilitySettings() {
    try {
      const settings = {};
      toolbarToggleElements().forEach(toggle => {
        settings[toggle.dataset.toolbarToggle] = toggle.checked;
      });
      localStorage.setItem(toolbarVisibilityStorageKey, JSON.stringify(settings));
    } catch (error) {
      // localStorage may be unavailable in some privacy modes.
    }
  }

  function setToolbarSectionVisibility(sectionId, isVisible, shouldSave = true) {
    const section = document.getElementById(sectionId);

    if (!section) return;

    section.hidden = !isVisible;

    const toggle = document.querySelector('[data-toolbar-toggle="' + sectionId + '"]');
    if (toggle) toggle.checked = isVisible;

    if (shouldSave) saveToolbarVisibilitySettings();
  }

  function loadToolbarVisibilitySettings() {
    try {
      const raw = localStorage.getItem(toolbarVisibilityStorageKey);
      if (!raw) return;

      const settings = JSON.parse(raw);
      if (!settings || typeof settings !== "object") return;

      Object.entries(settings).forEach(([sectionId, isVisible]) => {
        setToolbarSectionVisibility(sectionId, isVisible !== false, false);
      });
    } catch (error) {
      // Ignore malformed or blocked storage.
    }
  }

  function closeToolbarMenus(exceptMenu = null) {
    document.querySelectorAll("#toolbar details.toolbar-menu").forEach(menu => {
      if (menu !== exceptMenu) {
        menu.removeAttribute("open");
      }
    });
  }

  document.querySelectorAll("#toolbar details.toolbar-menu").forEach(menu => {
    menu.addEventListener("toggle", () => {
      if (menu.open) {
        closeToolbarMenus(menu);
        closeStylePopovers();
      }
    });

    menu.addEventListener("click", event => {
      if (event.target.tagName && event.target.tagName.toLowerCase() === "button") {
        menu.removeAttribute("open");
      }
    });
  });

  document.addEventListener("pointerdown", event => {
    const openMenu = event.target.closest ? event.target.closest("#toolbar details.toolbar-menu") : null;
    if (!openMenu) {
      closeToolbarMenus();
    }
  });

  if (fileMenu) {
    fileMenu.addEventListener("click", event => {
      if (event.target.tagName && event.target.tagName.toLowerCase() === "button") {
        fileMenu.removeAttribute("open");
      }
    });
  }

  if (buttons.shapeFillButton) {
    buttons.shapeFillButton.addEventListener("click", event => {
      event.stopPropagation();
      toggleStylePopover(buttons.shapeFillPanel);
    });
  }

  if (buttons.shapeOutlineButton) {
    buttons.shapeOutlineButton.addEventListener("click", event => {
      event.stopPropagation();
      toggleStylePopover(buttons.shapeOutlinePanel);
    });
  }

  document.addEventListener("pointerdown", event => {
    if (event.target.closest && event.target.closest(".style-dropdown-wrap")) return;
    closeStylePopovers();
  });

  document.querySelectorAll("[data-command]").forEach(button => {
    button.addEventListener("click", () => executeToolbarCommand(button.dataset.command));
  });

  document.querySelectorAll("[data-toolbar-toggle]").forEach(toggle => {
    toggle.addEventListener("change", () => {
      setToolbarSectionVisibility(toggle.dataset.toolbarToggle, toggle.checked);
      setStatus((toggle.checked ? "Showed " : "Hid ") + toggle.parentElement.textContent.trim() + " toolbar.");
    });
  });

  loadToolbarVisibilitySettings();

  if (buttons.trayTilesTab && buttons.trayExamplesTab) {
    buttons.trayTilesTab.addEventListener("click", () => switchTrayTab("tiles"));
    buttons.trayExamplesTab.addEventListener("click", () => switchTrayTab("examples"));
  }

  renderExampleList();
  syncMenuControlsFromToolbar();

  buttons.undo.addEventListener("click", undo);
  buttons.redo.addEventListener("click", redo);
  buttons.copySelected.addEventListener("click", copySelectedToClipboard);
  buttons.pasteClipboard.addEventListener("click", pasteClipboard);
  buttons.reset.addEventListener("click", () => {
    initializeBoard(true);
    setStatus("Canvas cleared.");
  });

  buttons.rotateLeft.addEventListener("click", () => rotateSelected(-rotationStepDegrees()));
  buttons.rotateRight.addEventListener("click", () => rotateSelected(rotationStepDegrees()));
  buttons.reflectHorizontal.addEventListener("click", () => reflectSelected("horizontal"));
  buttons.reflectVertical.addEventListener("click", () => reflectSelected("vertical"));
  buttons.arcDual.addEventListener("click", applyArcDualToSelection);
  buttons.selectAll.addEventListener("click", () => {
    selectMany(orderedTileIds());
    setStatus("Selected all tiles.");
  });

  buttons.groupSelected.addEventListener("click", groupSelected);
  buttons.ungroupSelected.addEventListener("click", ungroupSelected);
  buttons.sendToBottom.addEventListener("click", sendSelectedToBottom);
  buttons.moveDown.addEventListener("click", moveSelectedDownLayer);
  buttons.moveUp.addEventListener("click", moveSelectedUpLayer);
  buttons.bringToTop.addEventListener("click", bringSelectedToTop);
  buttons.latticeFill.addEventListener("click", startLatticeFill);
  buttons.clearLattice.addEventListener("click", clearLatticeFills);
  buttons.locateLatticeParents.addEventListener("click", locateLatticeParents);
  buttons.latticeOpacity.addEventListener("input", () => {
    applyLatticeOpacity();
    syncMenuControlsFromToolbar();
    setStatus("Lattice opacity: " + Math.round(latticeCopyOpacity * 100) + "%.");
  });
  buttons.duplicate.addEventListener("click", duplicateSelected);
  buttons.deleteSelected.addEventListener("click", deleteSelected);

  buttons.zoomIn.addEventListener("click", () => {
    zoomAtCenter(0.85);
    setStatus("Zoomed in.");
  });

  buttons.zoomOut.addEventListener("click", () => {
    zoomAtCenter(1.15);
    setStatus("Zoomed out.");
  });

  buttons.resetView.addEventListener("click", resetView);
  buttons.fullScreen.addEventListener("click", toggleFullScreen);

  buttons.saveLayout.addEventListener("click", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializeLayout()));
    setStatus("Saved layout to this browser.");
  });

  buttons.loadLayout.addEventListener("click", () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      setStatus("No saved layout found.");
      return;
    }

    try {
      loadLayoutData(JSON.parse(saved));
      recordHistory();
      setStatus("Loaded saved layout.");
    } catch (error) {
      setStatus("Could not load saved layout.");
    }
  });

  buttons.exportJson.addEventListener("click", () => {
    downloadTextFile(
      "bubble-tiles-layout.json",
      JSON.stringify(serializeLayout(), null, 2),
      "application/json"
    );

    setStatus("Downloaded layout JSON.");
  });

  buttons.copyShareLink.addEventListener("click", copyShareLink);

  buttons.importJson.addEventListener("click", () => {
    importJsonFile.value = "";
    importJsonFile.click();
  });

  importJsonFile.addEventListener("change", () => {
    const file = importJsonFile.files && importJsonFile.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.addEventListener("load", () => {
      try {
        loadLayoutData(JSON.parse(String(reader.result)));
        recordHistory();
        setStatus("Imported layout JSON file.");
      } catch (error) {
        setStatus("Could not import JSON file.");
      }
    });

    reader.addEventListener("error", () => {
      setStatus("Could not read JSON file.");
    });

    reader.readAsText(file);
  });


  if (buttons.downloadSvg) {
    buttons.downloadSvg.addEventListener("click", () => {
      downloadTextFile("bubble-tiles-layout.svg", buildExportSVGString(), "image/svg+xml");
      setStatus("Downloaded SVG.");
    });
  }

  buttons.exportPicture.addEventListener("click", openExportPictureModal);

  function applyFillColorToSelection(shouldRecord = true) {
    const ids = selectedIds();

    if (ids.length === 0) {
      if (shouldRecord) setStatus("Select a tile before changing fill color.");
      return;
    }

    ids.forEach(id => {
      tiles[id].fillColor = buttons.fillColorPicker.value;
      updateTileAppearance(id);
      updateTileTransform(id);
    });

    renderLatticeFills();

    if (shouldRecord) {
      recordHistory();
      setStatus("Updated fill color.");
    } else {
      setStatus("Previewing fill color.");
    }
  }

  function applyFillPatternToSelection(shouldRecord = true) {
    const ids = selectedIds();

    if (ids.length === 0) {
      if (shouldRecord) setStatus("Select a tile before changing fill pattern.");
      return;
    }

    ids.forEach(id => {
      tiles[id].fillPattern = buttons.fillPatternPicker.value;
      updateTileAppearance(id);
      updateTileTransform(id);
    });

    renderLatticeFills();

    if (shouldRecord) {
      recordHistory();
      setStatus("Updated fill pattern.");
    } else {
      setStatus("Previewing fill pattern.");
    }
  }

  function applyFillOpacityToSelection(shouldRecord = true) {
    const ids = selectedIds();

    if (ids.length === 0) {
      if (shouldRecord) setStatus("Select a tile before changing opacity.");
      return;
    }

    const opacity = Math.max(0.05, Math.min(1, Number(buttons.fillOpacityPicker.value) || 1));

    ids.forEach(id => {
      tiles[id].fillOpacity = opacity;
      updateTileAppearance(id);
      updateTileTransform(id);
    });

    renderLatticeFills();

    if (shouldRecord) {
      recordHistory();
      setStatus("Updated tile opacity.");
    } else {
      setStatus("Previewing tile opacity.");
    }
  }

  function applyStrokeColorToSelection(shouldRecord = true) {
    const ids = selectedIds();

    if (ids.length === 0) {
      if (shouldRecord) setStatus("Select a tile before changing stroke color.");
      return;
    }

    ids.forEach(id => {
      tiles[id].strokeColor = buttons.strokeColorPicker.value;
      updateTileAppearance(id);
      updateTileTransform(id);
    });

    renderLatticeFills();

    if (shouldRecord) {
      recordHistory();
      setStatus("Updated stroke color.");
    } else {
      setStatus("Previewing stroke color.");
    }
  }

  function applyStrokeStyleToSelection(shouldRecord = true) {
    const ids = selectedIds();

    if (ids.length === 0) {
      if (shouldRecord) setStatus("Select a tile before changing stroke style.");
      return;
    }

    ids.forEach(id => {
      tiles[id].strokeStyle = buttons.strokeStylePicker.value;
      updateTileAppearance(id);
      updateTileTransform(id);
    });

    renderLatticeFills();

    if (shouldRecord) {
      recordHistory();
      setStatus("Updated stroke style.");
    } else {
      setStatus("Previewing stroke style.");
    }
  }

  function applyStrokeWidthToSelection(shouldRecord = true) {
    const ids = selectedIds();

    if (ids.length === 0) {
      if (shouldRecord) setStatus("Select a tile before changing stroke width.");
      return;
    }

    const width = Math.max(0, Number(buttons.strokeWidthPicker.value) || 0);

    ids.forEach(id => {
      tiles[id].strokeWidth = width;
      updateTileAppearance(id);
      updateTileTransform(id);
    });

    renderLatticeFills();

    if (shouldRecord) {
      recordHistory();
      setStatus("Updated stroke width.");
    } else {
      setStatus("Previewing stroke width.");
    }
  }

  function applyCanvasBackgroundFromPicker(shouldRecord = true) {
    canvasBackgroundColor = buttons.canvasColorPicker.value;
    applyCanvasBackground();
    renderLatticeFills();

    if (shouldRecord) {
      recordHistory();
      setStatus("Updated canvas background.");
    } else {
      setStatus("Previewing canvas background.");
    }
  }

  if (buttons.downloadPng) buttons.downloadPng.addEventListener("click", downloadPngFile);
  if (buttons.printPdf) buttons.printPdf.addEventListener("click", printOrSavePdf);

  closeExportPictureButton.addEventListener("click", closeExportPictureModal);
  downloadExportPictureButton.addEventListener("click", downloadSelectedExportPicture);

  exportPictureModal.addEventListener("click", event => {
    if (event.target === exportPictureModal) closeExportPictureModal();
  });

  exportAreaPreview.addEventListener("pointerdown", event => {
    event.preventDefault();
    const point = exportPreviewPoint(event);
    exportAreaDrag = { start: point };
    exportArea = { x: point.x, y: point.y, width: 1, height: 1 };
    updateExportAreaRect();
    exportAreaPreview.setPointerCapture(event.pointerId);
  });

  exportAreaPreview.addEventListener("pointermove", event => {
    if (!exportAreaDrag) return;
    const point = exportPreviewPoint(event);
    exportArea = constrainAreaToAspect(exportAreaDrag.start, point);
    updateExportAreaRect();
  });

  exportAreaPreview.addEventListener("pointerup", () => {
    if (!exportAreaDrag) return;
    exportArea = normalizedExportArea(exportArea);
    exportAreaDrag = null;
    updateExportAreaRect();
  });

  exportAreaPreview.addEventListener("pointercancel", () => {
    exportAreaDrag = null;
  });

  exportAspectRatio.addEventListener("change", () => {
    fitExportAreaToAspect();
    setStatus("Updated export proportion.");
  });

  buttons.fillColorPicker.addEventListener("input", () => { applyFillColorToSelection(false); syncMenuControlsFromToolbar(); });
  buttons.fillPatternPicker.addEventListener("change", () => { applyFillPatternToSelection(true); syncMenuControlsFromToolbar(); });
  buttons.fillOpacityPicker.addEventListener("input", () => { applyFillOpacityToSelection(false); syncMenuControlsFromToolbar(); });
  buttons.fillOpacityPicker.addEventListener("change", () => { applyFillOpacityToSelection(true); syncMenuControlsFromToolbar(); });
  buttons.strokeColorPicker.addEventListener("input", () => { applyStrokeColorToSelection(false); syncMenuControlsFromToolbar(); });
  buttons.strokeStylePicker.addEventListener("input", () => { applyStrokeStyleToSelection(false); syncMenuControlsFromToolbar(); });
  buttons.strokeStylePicker.addEventListener("change", () => { applyStrokeStyleToSelection(true); syncMenuControlsFromToolbar(); });
  buttons.strokeWidthPicker.addEventListener("input", () => { applyStrokeWidthToSelection(false); syncMenuControlsFromToolbar(); });
  buttons.canvasColorPicker.addEventListener("input", () => { applyCanvasBackgroundFromPicker(false); syncMenuControlsFromToolbar(); });

  buttons.fillColorPicker.addEventListener("change", () => { applyFillColorToSelection(true); syncMenuControlsFromToolbar(); });
  buttons.strokeColorPicker.addEventListener("change", () => { applyStrokeColorToSelection(true); syncMenuControlsFromToolbar(); });
  buttons.strokeWidthPicker.addEventListener("change", () => { applyStrokeWidthToSelection(true); syncMenuControlsFromToolbar(); });
  buttons.canvasColorPicker.addEventListener("change", () => { applyCanvasBackgroundFromPicker(true); syncMenuControlsFromToolbar(); });


  if (buttons.menuRotateDegrees && buttons.rotateDegrees) {
    const syncRotationControls = source => {
      normalizeRotationDegreeControls(source);
    };
    [buttons.menuRotateDegrees, buttons.rotateDegrees].forEach(control => {
      control.addEventListener("input", () => syncRotationControls(control));
      control.addEventListener("change", () => syncRotationControls(control));
      control.addEventListener("blur", () => syncRotationControls(control));
    });
    normalizeRotationDegreeControls(buttons.rotateDegrees);
  }

  if (buttons.menuLatticeOpacity && buttons.latticeOpacity) {
    buttons.menuLatticeOpacity.addEventListener("input", () => {
      buttons.latticeOpacity.value = buttons.menuLatticeOpacity.value;
      applyLatticeOpacity();
      setStatus("Lattice opacity: " + Math.round(latticeCopyOpacity * 100) + "%.");
    });
  }

  if (buttons.menuFillColorPicker && buttons.fillColorPicker) {
    buttons.menuFillColorPicker.addEventListener("input", () => {
      buttons.fillColorPicker.value = buttons.menuFillColorPicker.value;
      applyFillColorToSelection(false);
    });
    buttons.menuFillColorPicker.addEventListener("change", () => {
      buttons.fillColorPicker.value = buttons.menuFillColorPicker.value;
      applyFillColorToSelection(true);
    });
  }

  if (buttons.menuFillPatternPicker && buttons.fillPatternPicker) {
    buttons.menuFillPatternPicker.addEventListener("change", () => {
      buttons.fillPatternPicker.value = buttons.menuFillPatternPicker.value;
      applyFillPatternToSelection(true);
    });
  }

  if (buttons.menuStrokeColorPicker && buttons.strokeColorPicker) {
    buttons.menuStrokeColorPicker.addEventListener("input", () => {
      buttons.strokeColorPicker.value = buttons.menuStrokeColorPicker.value;
      applyStrokeColorToSelection(false);
    });
    buttons.menuStrokeColorPicker.addEventListener("change", () => {
      buttons.strokeColorPicker.value = buttons.menuStrokeColorPicker.value;
      applyStrokeColorToSelection(true);
    });
  }

  if (buttons.menuStrokeStylePicker && buttons.strokeStylePicker) {
    buttons.menuStrokeStylePicker.addEventListener("input", () => {
      buttons.strokeStylePicker.value = buttons.menuStrokeStylePicker.value;
      applyStrokeStyleToSelection(false);
    });
    buttons.menuStrokeStylePicker.addEventListener("change", () => {
      buttons.strokeStylePicker.value = buttons.menuStrokeStylePicker.value;
      applyStrokeStyleToSelection(true);
    });
  }

  if (buttons.menuStrokeWidthPicker && buttons.strokeWidthPicker) {
    buttons.menuStrokeWidthPicker.addEventListener("input", () => {
      buttons.strokeWidthPicker.value = buttons.menuStrokeWidthPicker.value;
      applyStrokeWidthToSelection(false);
    });
    buttons.menuStrokeWidthPicker.addEventListener("change", () => {
      buttons.strokeWidthPicker.value = buttons.menuStrokeWidthPicker.value;
      applyStrokeWidthToSelection(true);
    });
  }

  if (buttons.menuCanvasColorPicker && buttons.canvasColorPicker) {
    buttons.menuCanvasColorPicker.addEventListener("input", () => {
      buttons.canvasColorPicker.value = buttons.menuCanvasColorPicker.value;
      applyCanvasBackgroundFromPicker(false);
    });
    buttons.menuCanvasColorPicker.addEventListener("change", () => {
      buttons.canvasColorPicker.value = buttons.menuCanvasColorPicker.value;
      applyCanvasBackgroundFromPicker(true);
    });
  }

  if (buttons.menuSnapToggle && snapToggle) {
    buttons.menuSnapToggle.addEventListener("change", () => {
      snapToggle.checked = buttons.menuSnapToggle.checked;
      snapToggle.dispatchEvent(new Event("change"));
    });
  }

  if (buttons.menuOverlapToggle && overlapToggle) {
    buttons.menuOverlapToggle.addEventListener("change", () => {
      overlapToggle.checked = buttons.menuOverlapToggle.checked;
      overlapToggle.dispatchEvent(new Event("change"));
    });
  }

  snapToggle.addEventListener("change", () => {
    if (buttons.menuSnapToggle) buttons.menuSnapToggle.checked = snapToggle.checked;
    hideSnapPreview();
    setStatus(snapToggle.checked ? "Snap is on." : "Snap is off.");
  });

  overlapToggle.addEventListener("change", () => {
    updateOverlapWarnings();

    if (overlapToggle.checked && !hasShownOverlapHint) {
      hasShownOverlapHint = true;
      showTemporaryHint("Overlap detector highlights overlapping tiles in red. It checks many tile pairs, so very large designs may run more slowly while Overlap is on.", 9500);
    }

    setStatus(overlapToggle.checked ? "Overlap warning is on." : "Overlap warning is off.");
  });

  document.addEventListener("keydown", event => {
    const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : "";
    if (tag === "textarea" || tag === "input") return;

    if (event.key === "Escape") {
      hideContextMenu();
    }

    const key = event.key.toLowerCase();
    const command = event.ctrlKey || event.metaKey;

    if (event.code === "Space") {
      event.preventDefault();

      if (!spacePanMode) {
        spacePanMode = true;
        document.body.classList.add("space-pan-mode");
        setStatus("Hold Space and drag to pan.");
      }

      return;
    }

    if (command && key === "a") {
      event.preventDefault();
      selectMany(orderedTileIds());
      setStatus("Selected all tiles.");
      return;
    }

    if (command && key === "c") {
      event.preventDefault();
      copySelectedToClipboard();
      return;
    }

    if (command && key === "v") {
      event.preventDefault();
      pasteClipboard();
      return;
    }

    if (command && key === "z" && event.shiftKey) {
      event.preventDefault();
      redo();
      return;
    }

    if (command && key === "z") {
      event.preventDefault();
      undo();
      return;
    }

    if (command && key === "y") {
      event.preventDefault();
      redo();
      return;
    }

    if (command) return;

    const nudge = event.shiftKey ? 25 : 5;

    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveSelected(0, -nudge);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      moveSelected(0, nudge);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveSelected(-nudge, 0);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      moveSelected(nudge, 0);
    } else if (key === "q") {
      event.preventDefault();
      rotateSelected(-rotationStepDegrees());
    } else if (key === "e") {
      event.preventDefault();
      rotateSelected(rotationStepDegrees());
    } else if (key === "d") {
      event.preventDefault();
      duplicateSelected();
    } else if (key === "g") {
      event.preventDefault();
      groupSelected();
    } else if (key === "u") {
      event.preventDefault();
      ungroupSelected();
    } else if (event.key === "Delete" || event.key === "Backspace") {
      event.preventDefault();
      deleteSelected();
    } else if (event.key === "Escape") {
      event.preventDefault();

      if (!exportPictureModal.hidden) {
        closeExportPictureModal();
        return;
      }

      if (guidedTutorialPanel && !guidedTutorialPanel.hidden) {
        closeGuidedTutorial(true);
        return;
      }

      if (versionHistoryModal && !versionHistoryModal.hidden) {
        closeVersionHistoryModal();
        return;
      }

      if (!helpModal.hidden) {
        closeHelpModal();
        return;
      }

      if (!aboutModal.hidden) {
        closeAboutModal();
        return;
      }

      if (activeLatticeBuilder) {
        cancelLatticeFill();
        return;
      }

      hideSnapPreview();
      hideSelectionBox();
      boxSelect = null;
      ctrlTilePan = null;
      setStatus("Canceled preview.");
    }
  });

  populateBubbleTrayIcons();
  renderCollapsedTrayIcons();
  applyLatticeOpacity();

  window.addEventListener("hashchange", () => {
    if (window.location.hash.startsWith("#layout=")) {
      loadLayoutFromShareHash();
    }
  });

  document.addEventListener("keyup", event => {
    if (event.code === "Space") {
      spacePanMode = false;
      document.body.classList.remove("space-pan-mode");
    }
  });

  updateViewBox();

  if (!loadLayoutFromShareHash()) {
    initializeBoard(true);
  }

  updateOverlapWarnings();
  updateHistoryButtons();
  maybeStartFirstRunGuidedTutorial();
});
