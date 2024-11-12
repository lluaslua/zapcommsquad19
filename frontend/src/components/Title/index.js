import React from "react";
import Typography from "@material-ui/core/Typography";

export default function Title(props) {
	return (
		<Typography variant="h5" color="primary" style={{ fontFamily: "Nunito, sans-serif", fontWeight: "600", }} gutterBottom>
			{props.children}
		</Typography>
	);
}
