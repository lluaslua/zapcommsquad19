import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Title from "../../components/Title";
import { i18n } from "../../translate/i18n";
import { Button, CircularProgress, Grid, TextField, Typography } from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import toastError from "../../errors/toastError";
import { toast } from "react-toastify";
// import api from "../../services/api";
import axios from "axios";
import usePlans from "../../hooks/usePlans";


const useStyles = makeStyles((theme) => ({
  mainPaper: {
    flex: 1,
    padding: theme.spacing(0),
    paddingBottom: 0,
    color: '#0C2454',
    margin: 0,
    border: 'none',
    backgroundColor: 'transparent',
    overflowX: 'hidden',
  },
  buttonMargin: {
    marginTop: '30px',
  },  
  subtitle: {
    color: '#0C2454',
    fontSize: '16px',
  },
  mainHeader: {
    marginTop: theme.spacing(1),
  },
  elementMargin: {
    padding: theme.spacing(2),
  },
  formContainer: {
    maxWidth: 500,
  },
  textRight: {
    textAlign: "right"
  },
  rectangleBackground: {
    backgroundColor: '#FFFFFF',
    borderRadius: '10px',
    padding: '10px',
    marginBottom: '21px',
    height: '350px',
    flex: true, 
  },
}));

const MessagesAPI = () => {
  const classes = useStyles();
  const history = useHistory();

  const [formMessageTextData,] = useState({ token: '', number: '', body: '' })
  const [formMessageMediaData,] = useState({ token: '', number: '', medias: '' })
  const [file, setFile] = useState({})

  const { getPlanCompany } = usePlans();

  useEffect(() => {
    async function fetchData() {
      const companyId = localStorage.getItem("companyId");
      const planConfigs = await getPlanCompany(undefined, companyId);
      if (!planConfigs.plan.useExternalApi) {
        toast.error("Esta empresa não possui permissão para acessar essa página! Estamos lhe redirecionando.");
        setTimeout(() => {
          history.push(`/`)
        }, 1000);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getEndpoint = () => {
    return process.env.REACT_APP_BACKEND_URL + '/api/messages/send'
  }

  const handleSendTextMessage = async (values) => {
    const { number, body } = values;
    const data = { number, body };
    try {
      await axios.request({
        url: getEndpoint(),
        method: 'POST',
        data,
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${values.token}`
        }
      })
      toast.success('Mensagem enviada com sucesso');
    } catch (err) {
      toastError(err);
    }
  }

  const handleSendMediaMessage = async (values) => {
    try {
      const firstFile = file[0];
      const data = new FormData();
      data.append('number', values.number);
      data.append('body', firstFile.name);
      data.append('medias', firstFile);
      await axios.request({
        url: getEndpoint(),
        method: 'POST',
        data,
        headers: {
          'Content-type': 'multipart/form-data',
          'Authorization': `Bearer ${values.token}`
        }
      })
      toast.success('Mensagem enviada com sucesso');
    } catch (err) {
      toastError(err);
    }
  }

  const renderFormMessageText = () => {
    return (
      <Formik
        initialValues={formMessageTextData}
        enableReinitialize={true}
        onSubmit={(values, actions) => {
          setTimeout(async () => {
            await handleSendTextMessage(values);
            actions.setSubmitting(false);
            actions.resetForm()
          }, 400);
        }}
        className={classes.elementMargin}
      >
        {({ isSubmitting }) => (
          <Form className={classes.formContainer}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} md={6}>

                <Field
                  as={TextField}
                  label={i18n.t("messagesAPI.textMessage.token")}
                  name="token"
                  autoFocus
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  className={classes.textField}
                  required
                  style= {{
                    backgroundColor:"white"
                  }}
                />
              
              </Grid>
              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  label={i18n.t("messagesAPI.textMessage.number")}
                  name="number"
                  autoFocus
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  className={classes.textField}
                  required
                  style= {{
                    backgroundColor:"white"
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  label={i18n.t("messagesAPI.textMessage.body")}
                  name="body"
                  autoFocus
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  className={classes.textField}
                  required
                  style= {{
                    backgroundColor:"white"
                  }}
                />
              </Grid>
              <Grid item xs={12} justifyContent="center" className={classes.textRight}>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  className={classes.btnWrapper}
                  style={{
                    borderRadius: '8px', 
                  }}
                >
                  {isSubmitting ? (
                    <CircularProgress
                      size={24}
                      className={classes.buttonProgress}
                    />
                  ) : 'Enviar'}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    )
  }

  
  const renderFormMessageMedia = () => {
    return (
      <Formik
        initialValues={formMessageMediaData}
        enableReinitialize={true}
        onSubmit={(values, actions) => {
          setTimeout(async () => {
            await handleSendMediaMessage(values);
            actions.setSubmitting(false);
            actions.resetForm()
            document.getElementById('medias').files = null
            document.getElementById('medias').value = null
          }, 400);
        }}
        className={classes.elementMargin}
      >
        {({ isSubmitting }) => (
          <Form className={classes.formContainer}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  label={i18n.t("messagesAPI.mediaMessage.token")}
                  name="token"
                  autoFocus
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  className={classes.textField}
                  required
                  style= {{ backgroundColor: "white"}}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  label={i18n.t("messagesAPI.mediaMessage.number")}
                  name="number"
                  autoFocus
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  className={classes.textField}
                  required
                  style= {{backgroundColor: "white"}}
                />
              </Grid>
              <Grid item xs={12}>
                <input type="file" name="medias" id="medias" required onChange={(e) => setFile(e.target.files)} />
              </Grid>
              <Grid item xs={12} className={classes.textRight}>
              <Grid container justifyContent="flex-end">
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  className= {`${classes.btnWrapper} ${classes.buttonMargin}`}
                  style={{
                    borderRadius: '8px', 
                  }}
                >
                  {isSubmitting ? (
                    <CircularProgress
                      size={24}
                      className={classes.buttonProgress}
                    />
                  ) : 'Enviar'}
                </Button>
              </Grid>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    )
  }

  return (
    <Paper
      className={classes.mainPaper}
      style={{marginLeft: "5px", overflowY: "hidden"}}
      // className={classes.elementMargin}
      variant="outlined"
      color="0C2454"
    >
      <Title>
  <div 
    style={{
      color: "#0C2C4C", 
      fontWeight: "bold", 
      fontFamily: "Nunito", 
      fontSize: "24px", 
      lineHeight: "18px", 
      marginLeft: "50px",
    }}
  >
    API
  </div>
</Title>
      <Typography variant="h6" style={{ color: '#0C2454'}} className={`${classes.elementMargin} ${classes.title}`}>
        Métodos de envio
      </Typography>
      <Typography component="div" style={{ color: '#0C2454' }}>
        <ol>
          <li>Mensagens de texto</li>
          <li>Mensagens de media</li>
        </ol>
      </Typography>
      <div className={classes.rectangleBackground}>
      <Typography variant="h6" style={{ color: '#0C2454' }} className={classes.elementMargin}>
        Instruções
      </Typography>
      
      <Typography className={classes.elementMargin} component="div" style={{ color: '#0C2454' }}>
        <ul>
          <p>Antes de enviar mensagens, é necessário o cadastro do token vinculado à conexão que enviará as mensagens. <br />Para realizar o cadastro acesse o menu "Conexões", clique no botão editar da conexão e insira o token no devido campo.</p>
          
            <p>O número para envio não deve ter mascara ou caracteres especiais e deve ser composto por:</p>
            
              <ul>
                <li>Código do país</li>
                <li>DDD</li>
                <li>Número</li>
              </ul>
        </ul>
      </Typography>
      </div>

      <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
      <div className={classes.rectangleBackground}>
      <Typography variant="h6" style={{ color: '#0C2454' }} className={classes.elementMargin}>
         Mensagens de texto
      </Typography>
          <Typography className={classes.elementMargin} component="div" style={{ color: '#0C2454' }}>
            <p>Seguem abaixo a lista de informações necessárias para envio das mensagens de texto:</p>
            <b>Endpoint: </b> {getEndpoint()} <br />
            <b>Método: </b> POST <br />
            <b>Headers: </b> Authorization (Bearer token) e Content-Type (application/json) <br />
            <b>Body: </b> {"{ \"number\": \"5599999999999\", \"body\": \"Sua mensagem\" }"}
          </Typography>
      </div>
        </Grid>
    <Grid item xs={12} sm={6}>
    <div className={classes.rectangleBackground}>
      <Typography variant="h6" style={{ color: '#0C2454' }} className={classes.elementMargin}>
         Mensagens de media
      </Typography>
          <Typography className={classes.elementMargin} component="div" style={{ color: '#0C2454' }}>
            <p>Seguem abaixo a lista de informações necessárias para envio das mensagens de texto:</p>
            <b>Endpoint: </b> {getEndpoint()} <br />
            <b>Método: </b> POST <br />
            <b>Headers: </b> Authorization (Bearer token) e Content-Type (multipart/form-data) <br />
            <b>FormData: </b> <br />
            <ul>
              <li>
                <b>number: </b> 5599999999999
              </li>
              <li>
                <b>medias: </b> arquivo
              </li>
            </ul>
          </Typography>
      </div>
        </Grid>
      
      </Grid>
      
      <Grid container spacing={2}>

      <Grid item xs={12} sm={6}>
          <Typography className={classes.elementMargin} style={{ color: '#0C2454'}}> 
            <b>Teste de Envio</b> 
          </Typography>
          {renderFormMessageText()}
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography className={classes.elementMargin} style={{ color: '#0C2454' }}>
            <b>Teste de Envio</b>
          </Typography>
          {renderFormMessageMedia()}
        </Grid>
        
      </Grid>
      
    </Paper>
  );
};

export default MessagesAPI;
