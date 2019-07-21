import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "./App.css";
import Fib from "./Fib";
import Otherpage from "./Otherpage";
function App() {
	return (
		<Router>
			<div className="App">
				<h1 className="App-title">
					Welcome to Fib Calculator <i class="fa fa-calculator" aria-hidden="true" />
				</h1>
				<Link to="/">Home</Link>
				<Link to="/otherpage">Other Page</Link>
				<div>
					<Route exact path="/" component={Fib} />
					<Route exact path="/otherpage" component={Otherpage} />
				</div>
			</div>
			;
		</Router>
	);
}

export default App;
