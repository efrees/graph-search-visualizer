import React from 'react';
import './App.css';
import { Grid } from './grid/Grid';
import { GridNode, BreadthFirstSearch, SearchSnapshot } from './algorithms';

interface AppState {
    searchHistory: SearchSnapshot<GridNode>[];
    currentSnapshot: SearchSnapshot<GridNode>;
    startNode: GridNode;
    targetNode: GridNode;
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

    constructor(props: any) {
        super(props);
        this.state = {
            searchHistory: [],
            currentSnapshot: initialSearchState(),
            startNode: [0, 0],
            targetNode: [30, 11]
        }
    }

    componentWillUnmount() {
        this.cancelAnimation();
    }

    render(): JSX.Element {
        console.log('rendering');
        return (
            <div className="App">
                <header className="App-header">
                    <h2>
                        Visualize Search Algorithms on a Grid
                </h2>
                </header>
                <div className="App-content">
                    <Grid width={40} height={20}
                        target={this.state.targetNode}
                        searchState={this.state.currentSnapshot}
                        cellClicked={cell => this.handleCellClicked(cell)}
                    />
                </div>
                <p className="App-message">Breadth First Search Result</p>
            </div>
        );
    }

    private handleCellClicked(cell: GridNode): void {
        this.setState({
            startNode: cell
        }, () => this.runSearchWithAnimation());
    }

    private runSearchWithAnimation() {
        this.cancelAnimation();
        this.runSearchAlgorithm();
        this.animateSearchHistory();
    }

    private runSearchAlgorithm() {
        const searchHistory: SearchSnapshot<GridNode>[] = [];
        const searchAlgorithm = new BreadthFirstSearch(snapshot => searchHistory.push(snapshot));

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

    private cancelAnimation() {
        if (this.animationTimeoutId) {
            clearTimeout(this.animationTimeoutId);
        }
    }
}

export default App;
