# Change Log

## Before edits
- Created this archive folder before source edits.
- Copied pre-change files into `before/`.
- Ran pre-change checks and recorded results in `checks.md`.

## Planned implementation
- Replace the static DOM relation graph with the previous canvas particle graph runtime.
- Keep the current asset workbench information architecture and current asset card/detail flow.
- Reconnect asset-card selection to graph-node highlighting.

## After edits
- Restored `assetKnowledgeCanvas` to a real `<canvas>` and updated the graph copy to describe an interactive particle knowledge graph.
- Replaced the static relation-map renderer with the canvas particle graph renderer, including KPI, graph filters, legend, node detail, animation, and cleanup behavior.
- Removed the `selectedAssetRelationNode` DOM-node selection path and static `.asset-relation-*` styles.
- Reconnected asset cards to graph highlighting and graph-node selection to the right-side asset manual; canvas clicks now choose the nearest graph node for easier interaction.
- Preserved the existing workbench layout, collapsed import panel, asset filters, asset manual, copy/use actions, and reuse action band.
- Copied post-change source files into `after/`.
