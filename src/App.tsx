import React from 'react';
import './App.css';
import { Grid } from './grid/Grid';
import { GridNode } from './algorithms';
import { BreadthFirstSearch } from './algorithms/breadth-first-search';

function App() {
    const searchHistory = [];
    const searchAlgorithm = new BreadthFirstSearch(snapshot => searchHistory.push(snapshot));
    const startNode: GridNode = [10, 5];
    const targetNode: GridNode = [30, 11];

    const finalState = searchAlgorithm.search(startNode, targetNode);

    return (
        <div className="App">
            <header className="App-header">
                <h2>
                    Visualize Search Algorithms on a Grid
                </h2>
            </header>
            <div className="App-content">
                <Grid width={40} height={20} target={targetNode} searchState={finalState} />
            </div>
            <p className="App-message">Breadth First Search Result</p>
        </div>
    );
}

export default App;
