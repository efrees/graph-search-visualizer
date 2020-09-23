import PriorityQueue from 'ts-priority-queue';
import { areGridNodesEqual, CompletedSearch, GridNode, manhattanDistance, NodeWithBackreference, SearchAlgorithm } from './search-algorithm';

interface SearchNodeWithCost extends NodeWithBackreference {
    actualCost: number
    estimatedTotalCost: number;
}

export class AStarSearch extends SearchAlgorithm {
    public title = "A* Search";

    private _singleSnapshotPerGeneration = false;

    search(start: GridNode, finish: GridNode): CompletedSearch<GridNode> {
        const searchStart = {
            node: start,
            actualCost: 0,
            estimatedTotalCost: this.estimateRemainingSteps(start, finish)
        };
        let frontier = new PriorityQueue<SearchNodeWithCost>({
            initialValues: [searchStart],
            comparator: this.compareNodesByCost
        });
        let visitedNodes: GridNode[] = [];
        let lastSnapshotDistance = -1;

        this.addSnapshot({ start, visitedNodes, frontierNodes: [] });

        let targetNode: SearchNodeWithCost | null = null;
        while (frontier.length > 0) {
            const current = frontier.dequeue()!;

            if (visitedNodes.some(node => areGridNodesEqual(node, current.node))) {
                continue; // don't visit again;
            }

            if (areGridNodesEqual(current.node, finish)) {
                targetNode = current;
                break;
            }

            visitedNodes = visitedNodes.concat([current.node]);
            const nextFour = this.getNextFourConnected(current, finish);
            for (const next of nextFour) {
                frontier.queue(next);
            }

            const currentDistanceFromStart = manhattanDistance(start, current.node);
            if (!this._singleSnapshotPerGeneration || currentDistanceFromStart > lastSnapshotDistance) {
                lastSnapshotDistance = currentDistanceFromStart;
                this.addSnapshot({ start, visitedNodes, frontierNodes: [] })
            }
        }

        const path = !!targetNode
            ? this.getReversePathToNode(targetNode).reverse()
            : [];

        return {
            isComplete: true,
            start,
            visitedNodes,
            frontierNodes: [],
            resultingPath: path
        }
    }

    private getNextFourConnected(current: SearchNodeWithCost, finish: GridNode): SearchNodeWithCost[] {
        const curNode = current.node;
        const curCost = current.actualCost;
        const connectedGridNodes: GridNode[] = [
            [curNode[0] - 1, curNode[1]],
            [curNode[0], curNode[1] - 1],
            [curNode[0] + 1, curNode[1]],
            [curNode[0], curNode[1] + 1]
        ]
        return connectedGridNodes.map(nextNode => ({
            node: nextNode,
            previous: current,
            actualCost: curCost + 1,
            estimatedTotalCost: curCost + 1 + this.estimateRemainingSteps(nextNode, finish)
        }));
    }

    private estimateRemainingSteps(current: GridNode, target: GridNode): number {
        return manhattanDistance(current, target);
    }

    private compareNodesByCost(nodeA: SearchNodeWithCost, nodeB: SearchNodeWithCost): number {
        return nodeA.estimatedTotalCost - nodeB.estimatedTotalCost
    }

    private getReversePathToNode(nodeWithPrevious: NodeWithBackreference): GridNode[] {
        if (!nodeWithPrevious.previous) {
            return [nodeWithPrevious.node];
        }

        return [nodeWithPrevious.node, ...this.getReversePathToNode(nodeWithPrevious.previous)];
    }
}