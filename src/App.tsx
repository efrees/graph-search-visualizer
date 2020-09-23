import React, { ChangeEvent } from 'react';
import { AStarSearch, BreadthFirstSearch, GridNode, isCompletedSearch, SearchAlgorithm, SearchSnapshot } from './algorithms';
import './App.css';
import { Grid } from './grid/Grid';

type SearchAlgorithmType = {
    new(addSnapshot: (snapshot: SearchSnapshot<GridNode>) => void): SearchAlgorithm;
};

interface AlgorithmOption {
    id: number;
    name: string;
    searchImplementation: SearchAlgorithmType;
}

interface AppState {
    searchHistory: SearchSnapshot<GridNode>[];
    currentSnapshot: SearchSnapshot<GridNode>;
    startNode: GridNode;
    targetNode: GridNode;
    selectedAlgorithm: AlgorithmOption;
}

function initialSearchState(): SearchSnapshot<GridNode> {
    return {
        start: [-1, -1],
        visitedNodes: [],
        frontierNodes: []
    };
}

export class App extends React.Component<any, AppState>  {
    private animationTimeoutId: NodeJS.Timeout | undefined;

    private thing = typeof SearchAlgorithm;
    private readonly _availableAlgorithms: AlgorithmOption[] = [
        { id: 1, name: "Breadth First Search", searchImplementation: BreadthFirstSearch },
        { id: 2, name: "A* Search", searchImplementation: AStarSearch }
    ];

    constructor(props: any) {
        super(props);
        this.state = {
            searchHistory: [],
            currentSnapshot: initialSearchState(),
            startNode: [-1, -1],
            targetNode: [30, 11],
            selectedAlgorithm: this._availableAlgorithms[0]
        }
    }

    componentWillUnmount() {
        this.cancelAnimation();
    }

    render(): JSX.Element {
        return (
            <div className="App">
                <header className="App-header">
                    <h2>
                        Visualize Search Algorithms on a Grid
                    </h2>
                    <label>
                        Algorithm:
                        <select id="alg-chooser"
                            value={this.state.selectedAlgorithm.id}
                            onChange={(event) => this.selectAlgorithmOption(event)}>
                            {this.getAlgorithmOptions()}
                        </select>
                    </label>
                </header>
                <div className="App-content">
                    <Grid width={40} height={20}
                        target={this.state.targetNode}
                        searchState={this.state.currentSnapshot}
                        cellClicked={cell => this.handleCellClicked(cell)}
                    />
                </div>
                <p className="App-message">{this.getStatusMessage()}</p>
            </div>
        );
    }

    private getAlgorithmOptions(): JSX.Element[] {
        return this._availableAlgorithms.map(alg => (
            <option value={alg.id} key={alg.id}>{alg.name}</option>
        ));
    }

    private getStatusMessage(): string {
        const searchState = this.state.currentSnapshot;
        const stats = isCompletedSearch(searchState)
            ? ` (Visited: ${searchState.visitedNodes.length}, Path Length: ${searchState.resultingPath.length})`
            : '';

        return searchState.visitedNodes.length > 0
            ? `${this.state.selectedAlgorithm.name} Result${stats}`
            : 'Click to select a start node.';
    }

    private selectAlgorithmOption(event: ChangeEvent<HTMLSelectElement>): void {
        const selectedId = +event.target.value;
        this.setState({
            selectedAlgorithm: this._availableAlgorithms.find(alg => alg.id === selectedId)!
        }, () => this.runSearchWithAnimation());

        this.runSearchWithAnimation();
    }

    private handleCellClicked(cell: GridNode): void {
        this.setState({
            startNode: cell
        }, () => this.runSearchWithAnimation());
    }

    private hasStartNodeSelected(): boolean {
        return this.state.startNode[0] >= 0
    }

    private runSearchWithAnimation(): void {
        if (!this.hasStartNodeSelected()) {
            return;
        }

        this.cancelAnimation();
        this.runSearchAlgorithm();
        this.animateSearchHistory();
    }

    private runSearchAlgorithm(): void {
        const searchHistory: SearchSnapshot<GridNode>[] = [];
        const searchImplementation = this.state.selectedAlgorithm.searchImplementation;
        const searchAlgorithm = new searchImplementation(snapshot => searchHistory.push(snapshot));

        const finalState = searchAlgorithm.search(this.state.startNode, this.state.targetNode);
        this.setState({
            searchHistory: searchHistory.concat([finalState])
        });
    }

    private animateSearchHistory(): void {
        this.animationTimeoutId = setTimeout(() => {
            const searchHistory = this.state.searchHistory;
            if (searchHistory.length > 0) {
                const nextStep = searchHistory[0];
                this.setState({
                    currentSnapshot: nextStep,
                    searchHistory: searchHistory.slice(1, searchHistory.length)
                })

                this.animateSearchHistory();
            }
        }, 20);
    }

    private cancelAnimation(): void {
        if (this.animationTimeoutId) {
            clearTimeout(this.animationTimeoutId);
        }
    }
}

export default App;
