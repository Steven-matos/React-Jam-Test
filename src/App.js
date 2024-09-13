import { React, Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import Gamepage from "./Components/Web/Gamepage/index.js"
import store from './Config/store';

import './App.css';

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Router>
                    <div className="App">
                        {/* <Navbar /> */}
                        <Routes>
                            <Route exact path="/" element={<Gamepage/>} />
                        </Routes>
                    </div>
                </Router>
            </Provider>
        );
    }
}

export default App;
