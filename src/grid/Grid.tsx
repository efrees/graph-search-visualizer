import React from 'react';
import './Grid.css';
import { CompletedSearch, SearchSnapshot, GridNode, areGridNodesEqual } from '../algorithms';

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
    target: [number, number];
    searchState: SearchSnapshot<GridNode> | CompletedSearch<GridNode>;
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
    constructor(props: GridParams) {
        super(props);
        this.state = {
            cells: this.generateGridArrays(props.searchState)
        }
    }

    render(): JSX.Element {
        const gridElements = this.mapToCellElements(this.state.cells);
        return (
            <div className="Grid">
                {gridElements}
            </div>
        );
    }

    private generateGridArrays(searchState: SearchSnapshot<GridNode> | CompletedSearch<GridNode>) {
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

    private getTypeForNode(currentNode: GridNode, searchState: SearchSnapshot<GridNode> | CompletedSearch<GridNode>) {
        let cellType = CellType.Default;
        if (areGridNodesEqual(this.props.target, currentNode)) {
            cellType = CellType.Finish;
        }
        else if (areGridNodesEqual(searchState.start, currentNode)) {
            cellType = CellType.Start;
        }
        else if (this.isCompletedSearch(searchState) && searchState.resultingPath.some(node => areGridNodesEqual(node, currentNode))) {
            cellType = CellType.Path;
        }
        else if (searchState.visitedNodes.some(node => areGridNodesEqual(node, currentNode))) {
            cellType = CellType.Visited;
        }
        else if (searchState.frontierNodes.some(node => areGridNodesEqual(node, currentNode))) {
            cellType = CellType.Frontier;
        }
        return cellType;
    }

    private isCompletedSearch(searchState: SearchSnapshot<GridNode> | CompletedSearch<GridNode>): searchState is CompletedSearch<GridNode> {
        return (searchState as CompletedSearch<GridNode>).isComplete;
    }

    private mapToCellElements(grid: CellType[][]): JSX.Element[] {
        return grid.map((row, i) => {
            return (
                <div className="GridRow" key={`row-${i}`}>
                    {row.map((type, j) => (<GridCell key={`${i}-${j}`} type={type} onClick={() => this.cellClicked(i, j)} />))}
                </div>
            );
        })
    }

    private cellClicked(rowIndex: number, colIndex: number): void {
        // const cells = this.state.cells.slice();
        // cells[rowIndex] = cells[rowIndex].slice();
        // cells[rowIndex][colIndex] = CellType.Visited;
        // this.setState({ cells });
    }
}