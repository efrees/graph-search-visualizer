import React from 'react';
import './App.css';
import { Grid } from './grid/Grid';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h2>
                    Visualize Search Algorithms on a Grid
                </h2>
            </header>
            <div className="App-content">
                <Grid width={40} height={20} />
            </div>
        </div>
    );
}

export default App;
