export type GridNode = [number, number];

export function areGridNodesEqual(node1: GridNode, node2: GridNode): boolean {
    return node1[0] === node2[0]
        && node1[1] === node2[1];
}

export function manhattanDistance(nodeA: GridNode, nodeB: GridNode) {
    return Math.abs(nodeA[0] - nodeB[0])
        + Math.abs(nodeA[1] - nodeB[1]);
}

export interface NodeWithBackreference {
    node: GridNode;
    previous?: NodeWithBackreference;
}

export interface SearchSnapshot<TNode> {
    visitedNodes: TNode[];
    frontierNodes: TNode[];
    start: TNode;
}

export interface CompletedSearch<TNode> extends SearchSnapshot<TNode> {
    isComplete: true;
    resultingPath: TNode[];
}

export function isCompletedSearch(searchState: SearchSnapshot<GridNode>): searchState is CompletedSearch<GridNode> {
    return (searchState as CompletedSearch<GridNode>).isComplete;
}

export abstract class SearchAlgorithm {
    constructor(protected addSnapshot: (snapshot: SearchSnapshot<GridNode>) => void) {
    }

    abstract search(start: GridNode, finish: GridNode): CompletedSearch<GridNode>;
}
