import React, { useState, useContext } from "react";
import { Link as RouterLink } from "react-router-dom";

import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid"; 
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { versionSystem } from "../../../package.json";
import { i18n } from "../../translate/i18n";
import { nomeEmpresa } from "../../../package.json";
import { AuthContext } from "../../context/Auth/AuthContext";
import logo from "../../assets/logo.png";
import bgimage from "../../assets/bgimage.png";


const Copyright = () => {
	return (
		<Typography variant="body2" color="primary" align="center">
			{"Copyright "}
 			<Link color="primary" href="#">
 				{ nomeEmpresa } - v { versionSystem }
 			</Link>{" "}
 			{new Date().getFullYear()}
 			{"."}
 		</Typography>
 	);
 };

const useStyles = makeStyles(theme => ({
	root: {
		width: "100vw",
		height: "100vh",
		//background: "linear-gradient(to right, #682EE3 , #682EE3 , #682EE3)",
		backgroundImage: "url(https://i.imgur.com/Ck8YpM7.png)",
		backgroundColor: "#ffffff",
		backgroundRepeat: "no-repeat",
		backgroundSize: "60.5% 100%",
		backgroundPosition: "left",
		display: "flex",
		justifyContent: "flex-end",
		alignItems: "center",
		justifyContent: "right",
		textAlign: "right",

		transition: "background-size 0.3s ease-in-out",

		[theme.breakpoints.down('1920')]: {
			backgroundSize: "56% 100%", 
		},

		[theme.breakpoints.down('1668')]: {
			backgroundSize: "52% 100%", 
			display: "grid",
		},

		[theme.breakpoints.down('1120')]: {
			backgroundSize: "100% 100%", 
			backgroundImage: "url(https://i.imgur.com/dh9j2GN.png)",
		  },

	},

	paper: {
		margin: "5%",
		marginRight: "0%",
		backgroundColor: theme.palette.login,
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		padding: "55px 30px",
		borderRadius: "12.5px",

		transition: "margin-left 0.3s ease-in-out, margin-right 0.6s ease-in-out",

		[theme.breakpoints.down('1505')]: {
			marginRight: "2.5%",
		  },

		[theme.breakpoints.down('1331')]: {
		  marginRight: "0%",
		  marginLeft: "20%",
		},
	
		[theme.breakpoints.down('1119')]: {
		  marginLeft: "0%",
	
		},

	},
	avatar: {
		margin: theme.spacing(1),  
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
	powered: {
		color: "white"
	}
}));

const Login = () => {
	const classes = useStyles();

	const [user, setUser] = useState({ email: "", password: "" });

	const { handleLogin } = useContext(AuthContext);

	const handleChangeInput = e => {
		setUser({ ...user, [e.target.name]: e.target.value });
	};

	const handlSubmit = e => {
		e.preventDefault();
		handleLogin(user);
	};

	
	return (
		<div
		style={{ display: "flex", justifyContent: "flex-end"}}
		className={classes.root}
		>
		<Container 
		component="main" 
		maxWidth="sm"
		style={{ 
			margin: "5%",
			

		}}
		>
			<CssBaseline/>
			<div className={classes.paper}>
				<div
				style={{ textAlign: "center" }}
				>
					<img style={{ margin: "0 auto", width: "90%" }} src={logo} alt="Whats" />
				</div>
				{/*<Typography component="h1" variant="h5">
					{i18n.t("login.title")}
				</Typography>*/}
				<form className={classes.form} noValidate onSubmit={handlSubmit}>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						id="email"
						label={i18n.t("login.form.email")}
						name="email"
						value={user.email}
						onChange={handleChangeInput}
						autoComplete="email"
						autoFocus
					/>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						name="password"
						label={i18n.t("login.form.password")}
						type="password"
						id="password"
						value={user.password}
						onChange={handleChangeInput}
						autoComplete="current-password"
					/>
					
					<Grid container justify="flex-end">
					  <Grid item xs={6} style={{ textAlign: "right" }}>
						<Link component={RouterLink} to="/forgetpsw" variant="body2">
						  Esqueceu sua senha?
						</Link>
					  </Grid>
					</Grid>
					
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className={classes.submit}
						borderRadius="30"
						style={{ fontWeight: "bold", fontStyle: "Nunito", color: "white" }}
					>
						
						{i18n.t("Entrar")}
					</Button>
					{ <Grid container>
						<Grid item>
							<div
							style={{FontFace: "Nunito"}}
							>
								Caso não tenha uma conta. 
							</div>
							<Link
								href="#"
								variant="body2"
								component={RouterLink}
								to="/signup"
							>
								Registre-se, agora mesmo!
							</Link>
						</Grid>
					</Grid> }
				</form>
			
			</div>
		</Container>
		</div>
	);
};

export default Login;
