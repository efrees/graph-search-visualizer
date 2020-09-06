import React from 'react';
import './Grid.css';

export enum CellType {
    Default = 'Default',
    Visited = 'Visited',
    Start = 'Start',
    Finish = 'Finish'
}

export interface GridParams {
    width: number;
    height: number;
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
            cells: this.generateGridArrays()
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

    private generateGridArrays() {
        const tempGrid: CellType[][] = Array(this.props.height);
        for (let i = 0; i < tempGrid.length; i++) {
            tempGrid[i] = Array(this.props.width).fill(CellType.Default);
        }
        return tempGrid;
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
        const cells = this.state.cells.slice();
        cells[rowIndex] = cells[rowIndex].slice();
        cells[rowIndex][colIndex] = CellType.Visited;
        this.setState({ cells });
    }
}