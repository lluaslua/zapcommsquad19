import React, { useState } from "react";
import qs from "query-string";
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import InputAdornment from "@material-ui/core/InputAdornment";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import moment from "moment";
import logo from "../../assets/logo.png";
import { toast } from 'react-toastify'; 
import toastError from '../../errors/toastError';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useMediaQuery } from "@material-ui/core";
import Component7 from "../../assets/Component 7.png";

const useStyles = makeStyles((theme) => ({
  root: { //fundo da página
    width: "100vw",
    height: "100vh",
    background: "black", //Cor de fundo
    backgroundImage: "url(https://i.imgur.com/uTcKDrB.jpeg)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "58.5% 100%",
    backgroundPosition: "right",
    display: "grid",
    alignItems: "center",
    justifyContent: "left",
    textAlign: "left",
    position: "relative",  

    transition: "background-size 0.3s ease-in-out", //animação do fundo

    [theme.breakpoints.down('1920')]: { //define onde a mudança ocorre
      backgroundSize: "47% 100%", //altera o tamanho
    },

    [theme.breakpoints.down('1119')]: {
      backgroundSize: "100% 100%", 
      backgroundImage: "url(https://i.imgur.com/px0qtLU.png)",
    },
  },

  paper: {
    position: "absolute",
    top: "45%",
    marginLeft: "4.5%",
    marginRight: "60%",
    transform: "translateY(-50%)",
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "55px 30px",
    borderRadius: "1.5em",

    transition: "margin-left 0.3s ease-in-out, margin-right 0.6s ease-in-out", //animação as margens

    [theme.breakpoints.down('1920')]: { //define onde a mudança ocorre
      backgroundSize: "47% 100%", //altera o tamanho
      marginLeft: "10.5%",
      marginRight: "60%",
    },

    [theme.breakpoints.down('1331')]: {
      marginLeft: "5%",
      marginRight: "55%"
    },

    [theme.breakpoints.down('1119')]: {
      marginRight: "5%",
      marginLeft: "5%",
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
    fontStyle: "Nunito",
    fontWeight: "bold",
    color: "white",
    margin: theme.spacing(3, 0, 2),
  },
  powered: {
    color: "white",
  },
}));

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

const ForgetPassword = () => {
  const classes = useStyles();
  const history = useHistory();
  let companyId = null;
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [showResetPasswordButton, setShowResetPasswordButton] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(""); // Estado para mensagens de erro

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const toggleAdditionalFields = () => {
    setShowAdditionalFields(!showAdditionalFields);
    if (showAdditionalFields) {
      setShowResetPasswordButton(false);
    } else {
      setShowResetPasswordButton(true);
    }
  };

  const params = qs.parse(window.location.search);
  if (params.companyId !== undefined) {
    companyId = params.companyId;
  }

  const initialState = { email: "" };

  const [user] = useState(initialState);
  const dueDate = moment().add(3, "day").format();

const handleSendEmail = async (values) => {
  const email = values.email;
  try {
    const response = await api.post(
      `${process.env.REACT_APP_BACKEND_URL}/forgetpassword/${email}`
    );
    console.log("API Response:", response.data);

    if (response.data.status === 404) {
      toast.error("Email não encontrado");
    } else {
      toast.success(i18n.t("Email enviado com sucesso!"));
    }
  } catch (err) {
    console.log("API Error:", err);
    toastError(err);
  }
};

  const handleResetPassword = async (values) => {
    const email = values.email;
    const token = values.token;
    const newPassword = values.newPassword;
    const confirmPassword = values.confirmPassword;

    if (newPassword === confirmPassword) {
      try {
        await api.post(
          `${process.env.REACT_APP_BACKEND_URL}/resetpasswords/${email}/${token}/${newPassword}`
        );
        setError(""); // Limpe o erro se não houver erro
        toast.success(i18n.t("Senha redefinida com sucesso."));
        history.push("/login");
      } catch (err) {
        console.log(err);
      }
    }
  };

  const isResetPasswordButtonClicked = showResetPasswordButton;
  const UserSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    newPassword: isResetPasswordButtonClicked
      ? Yup.string()
          .required("Campo obrigatório")
          .matches(
            passwordRegex,
            "Sua senha precisa ter no mínimo 8 caracteres, sendo uma letra maiúscula, uma minúscula e um número."
          )
      : Yup.string(), // Sem validação se não for redefinição de senha
    confirmPassword: Yup.string().when("newPassword", {
      is: (newPassword) => isResetPasswordButtonClicked && newPassword,
      then: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "As senhas não correspondem")
        .required("Campo obrigatório"),
      otherwise: Yup.string(), // Sem validação se não for redefinição de senha
    }),
  });

  return (
    <div className={classes.root}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <div>
            <img
              style={{ margin: "3 auto", height: "100px", width: "100%" }}
              src={Component7}
              alt="Whats"
            />
          </div>
          <Typography component="h1" variant="h5">
            <div 
            style={{ 
              margin: "5px", 
              fontWeight: "bold", 
              marginTop: "15px",
              textAlign: "center",
            }}
            >
            {i18n.t("Esqueceu a senha?")} 
            </div>
          </Typography>

          <Typography>
            <div
            style={{
              textAlign: "center",
              marginBottom: "20",
            }}
            component="p" variant="p"
            >
            {i18n.t("Digite seu email para que possamos enviar um")}
            {i18n.t(" código de verificação")}
            </div>
          </Typography>

          <Formik
            initialValues={{
              email: "",
              token: "",
              newPassword: "",
              confirmPassword: "",
            }}
            enableReinitialize={true}
            validationSchema={UserSchema}
            onSubmit={(values, actions) => {
              setTimeout(() => {
                if (showResetPasswordButton) {
                  handleResetPassword(values);
                } else {
                  handleSendEmail(values);
                }
                actions.setSubmitting(false);
                toggleAdditionalFields();
              }, 400);
            }}
          >
            {({ touched, errors, isSubmitting }) => (
              <Form className={classes.form}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      variant="outlined"
                      fullWidth
                      id="email"
                      label={i18n.t("signup.form.email")}
                      name="email"
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                      autoComplete="email"
                      required
                    />
                  </Grid>
                  {showAdditionalFields && (
                    <>
                      <Grid item xs={12}>
                        <Field
                          as={TextField}
                          variant="outlined"
                          fullWidth
                          id="token"
                          label="Código de Verificação"
                          name="token"
                          error={touched.token && Boolean(errors.token)}
                          helperText={touched.token && errors.token}
                          autoComplete="off"
                          required
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Field
                          as={TextField}
                          variant="outlined"
                          fullWidth
                          type={showPassword ? "text" : "password"}
                          id="newPassword"
                          label="Nova senha"
                          name="newPassword"
                          error={
                            touched.newPassword &&
                            Boolean(errors.newPassword)
                          }
                          helperText={
                            touched.newPassword && errors.newPassword
                          }
                          autoComplete="off"
                          required
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={togglePasswordVisibility}
                                >
                                  {showPassword ? (
                                    <VisibilityIcon />
                                  ) : (
                                    <VisibilityOffIcon />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Field
                          as={TextField}
                          variant="outlined"
                          fullWidth
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          label="Confirme a senha"
                          name="confirmPassword"
                          error={
                            touched.confirmPassword &&
                            Boolean(errors.confirmPassword)
                          }
                          helperText={
                            touched.confirmPassword &&
                            errors.confirmPassword
                          }
                          autoComplete="off"
                          required
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={toggleConfirmPasswordVisibility}
                                >
                                  {showConfirmPassword ? (
                                    <VisibilityIcon />
                                  ) : (
                                    <VisibilityOffIcon />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
                {showResetPasswordButton ? (
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                  >
                    Redefinir Senha
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                  >
                    Enviar Email
                  </Button>
                )}
                <Grid container justifyContent="center">
                  <Grid item>
                    Lembrou a senha?
                    <Link
                      href="#"
                      variant="body2"
                      component={RouterLink}
                      to="/Login"
                    >
                      {i18n.t(" Retornar")}
                    </Link>
                  </Grid>
                </Grid>
                {error && (
                  <Typography variant="body2" color="error">
                    {error}
                  </Typography>
                )}
              </Form>
            )}
          </Formik>
        </div>
        <Box mt={5} />
      </Container>
    </div>
  );
};

export default ForgetPassword;
