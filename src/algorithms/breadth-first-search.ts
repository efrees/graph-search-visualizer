import { SearchAlgorithm, CompletedSearch, GridNode, areGridNodesEqual } from './search-algorithm';

interface NodeWithBackreference {
    node: GridNode;
    previous?: NodeWithBackreference;
}

export class BreadthFirstSearch extends SearchAlgorithm {
    search(start: GridNode, finish: GridNode): CompletedSearch<GridNode> {
        let frontier: NodeWithBackreference[] = [{ node: start }];
        let visitedNodes: GridNode[] = [];

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

            this.addSnapshot({ start, visitedNodes, frontierNodes: frontier.map(pair => pair.node) })
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
            { node: [curNode[0] + 1, curNode[1]], previous: current },
            { node: [curNode[0], curNode[1] - 1], previous: current },
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