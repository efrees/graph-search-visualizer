import React from 'react';
import { areGridNodesEqual, GridNode, isCompletedSearch, SearchSnapshot } from '../algorithms';
import './Grid.css';

export enum CellType {
    Default = 'Default',
    Visited = 'Visited',
    Frontier = "Frontier",
    Path = "Path",
    Start = 'Start',
    Finish = 'Finish',
}

export interface GridParams {
    width: number;
    height: number;
    target: GridNode;
    searchState: SearchSnapshot<GridNode>;
    cellClicked: (cell: GridNode) => void;
}

export interface GridState {
    cells: CellType[][];
}

interface GridCellParams {
    type: CellType;
    onClick?: (event: React.MouseEvent) => void;
}

function GridCell(props: GridCellParams): JSX.Element {
    const cssClass = `GridCell ${props.type.toString()}`;
    return (
        <div className={cssClass} onClick={props.onClick}></div>
    )
}

export class Grid extends React.Component<GridParams, GridState> {
    render(): JSX.Element {
        const cells = this.generateGridArrays(this.props.searchState);
        const gridElements = this.mapToCellElements(cells);
        return (
            <div className="Grid">
                {gridElements}
            </div>
        );
    }

    private generateGridArrays(searchState: SearchSnapshot<GridNode>) {
        const tempGrid: CellType[][] = Array(this.props.height);
        for (let i = 0; i < tempGrid.length; i++) {
            tempGrid[i] = Array(this.props.width);
            for (let j = 0; j < this.props.width; j++) {
                const currentNode: GridNode = [j, i];
                tempGrid[i][j] = this.getTypeForNode(currentNode, searchState);
            }
        }
        return tempGrid;
    }

    private getTypeForNode(currentNode: GridNode, searchState: SearchSnapshot<GridNode>): CellType {
        if (areGridNodesEqual(this.props.target, currentNode)) {
            return CellType.Finish;
        }
        if (!searchState) {
            return CellType.Default;
        }
        if (areGridNodesEqual(searchState.start, currentNode)) {
            return CellType.Start;
        }
        if (isCompletedSearch(searchState) && searchState.resultingPath.some(node => areGridNodesEqual(node, currentNode))) {
            return CellType.Path;
        }
        if (searchState.visitedNodes.some(node => areGridNodesEqual(node, currentNode))) {
            return CellType.Visited;
        }
        if (searchState.frontierNodes.some(node => areGridNodesEqual(node, currentNode))) {
            return CellType.Frontier;
        }
        return CellType.Default;
    }

    private mapToCellElements(grid: CellType[][]): JSX.Element[] {
        return grid.map((row, i) => {
            return (
                <div className="GridRow" key={`row-${i}`}>
                    {row.map((type, j) => (<GridCell key={`${i}-${j}`} type={type} onClick={() => this.props.cellClicked([j, i])} />))}
                </div>
            );
        })
    }
}