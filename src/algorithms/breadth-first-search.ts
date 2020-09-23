import { areGridNodesEqual, CompletedSearch, GridNode, manhattanDistance, NodeWithBackreference, SearchAlgorithm } from './search-algorithm';

export class BreadthFirstSearch extends SearchAlgorithm {
    public title = "Breadth First Search";

    private _singleSnapshotPerGeneration = true;

    search(start: GridNode, finish: GridNode): CompletedSearch<GridNode> {
        let frontier: NodeWithBackreference[] = [{ node: start }];
        let visitedNodes: GridNode[] = [];
        let lastSnapshotDistance = -1;

        this.addSnapshot({ start, visitedNodes, frontierNodes: frontier.map(pair => pair.node) });

        let targetNode: NodeWithBackreference | null = null;
        while (frontier.length > 0) {
            const current = frontier.shift()!;

            if (visitedNodes.some(node => areGridNodesEqual(node, current.node))) {
                continue; // don't visit again;
            }

            if (areGridNodesEqual(current.node, finish)) {
                targetNode = current;
                break;
            }

            visitedNodes = visitedNodes.concat([current.node]);
            const next = this.getNextFourConnected(current);
            frontier = frontier.concat(next);

            const currentDistanceFromStart = manhattanDistance(start, current.node);
            if (!this._singleSnapshotPerGeneration || currentDistanceFromStart > lastSnapshotDistance) {
                lastSnapshotDistance = currentDistanceFromStart;
                this.addSnapshot({ start, visitedNodes, frontierNodes: frontier.map(pair => pair.node) })
            }
        }

        const path = !!targetNode
            ? this.getReversePathToNode(targetNode).reverse()
            : [];

        return {
            isComplete: true,
            start,
            visitedNodes,
            frontierNodes: frontier.map(pair => pair.node),
            resultingPath: path
        }
    }

    private getNextFourConnected(current: NodeWithBackreference): NodeWithBackreference[] {
        const curNode = current.node;
        return [
            { node: [curNode[0] - 1, curNode[1]], previous: current },
            { node: [curNode[0], curNode[1] - 1], previous: current },
            { node: [curNode[0] + 1, curNode[1]], previous: current },
            { node: [curNode[0], curNode[1] + 1], previous: current }
        ]
    }

    private getReversePathToNode(nodeWithPrevious: NodeWithBackreference): GridNode[] {
        if (!nodeWithPrevious.previous) {
            return [nodeWithPrevious.node];
        }

        return [nodeWithPrevious.node, ...this.getReversePathToNode(nodeWithPrevious.previous)];
    }
}