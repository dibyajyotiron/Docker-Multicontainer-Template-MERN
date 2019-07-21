import React from "react";
import { Link } from "react-router-dom";

export default () => {
	return (
		<div>
			I'm the other page!
			<Link to="/">Go home!</Link>
		</div>
	);
};
