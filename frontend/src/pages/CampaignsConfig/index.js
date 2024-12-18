import React, { useEffect, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { toast } from "react-toastify";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import ConfirmationModal from "../../components/ConfirmationModal";

const useStyles = makeStyles((theme) => ({
  mainPaper: {
    flex: 1,
    padding: theme.spacing(1),
    overflowY: "scroll",
    ...theme.scrollbarStyles,
    backgroundColor:"transparent",
    border: "none"
  },
  tablePaper:{
    backgroundColor: "#fff",
    border: "0.1px solid #c8c8c8",
    borderRadius: "5px", 
    padding: theme.spacing(0.6),
    boxShadow: theme.shadows[3],
  },
  formControl: {
    backgroundColor: "#fff",  
  },
  textField: {
    backgroundColor: "#fff", 
  },
  roundedButton: {
      borderRadius: '8px',
    },
  textRight: {
    textAlign: "right",
  },
  tabPanelsContainer: {
    padding: theme.spacing(2),
  },
  tableHeader: {
    backgroundColor: '#0C2454', 
    color: 'white',
    borderRadius: '5px 5px 0 0',
    textAlign: "center",
  },
  tableRow: {
    backgroundColor: 'white',
    textAlign: 'center',
  },
}));

const initialSettings = {
  messageInterval: 20,
  longerIntervalAfter: 20,
  greaterInterval: 60,
  variables: [],
};

const CampaignsConfig = () => {
  const classes = useStyles();

  const [settings, setSettings] = useState(initialSettings);
  const [showVariablesForm, setShowVariablesForm] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
  const [variable, setVariable] = useState({ key: "", value: "" });

  useEffect(() => {
    api.get("/campaign-settings").then(({ data }) => {
      const settingsList = [];
      if (Array.isArray(data) && data.length > 0) {
        data.forEach((item) => {
          settingsList.push([item.key, JSON.parse(item.value)]);
        });
        setSettings(Object.fromEntries(settingsList));
      }
    });
  }, []);

  const handleOnChangeVariable = (e) => {
    if (e.target.value !== null) {
      const changedProp = {};
      changedProp[e.target.name] = e.target.value;
      setVariable((prev) => ({ ...prev, ...changedProp }));
    }
  };

  const handleOnChangeSettings = (e) => {
    const changedProp = {};
    changedProp[e.target.name] = e.target.value;
    setSettings((prev) => ({ ...prev, ...changedProp }));
  };

  const addVariable = () => {
    setSettings((prev) => {
      const variablesExists = settings.variables.filter(
        (v) => v.key === variable.key
      );
      const variables = prev.variables;
      if (variablesExists.length === 0) {
        variables.push(Object.assign({}, variable));
        setVariable({ key: "", value: "" });
      }
      return { ...prev, variables };
    });
  };

  const removeVariable = () => {
    const newList = settings.variables.filter((v) => v.key !== selectedKey);
    setSettings((prev) => ({ ...prev, variables: newList }));
    setSelectedKey(null);
  };

  const saveSettings = async () => {
    await api.post("/campaign-settings", { settings });
    toast.success("Configurações salvas");
  };

  return (
    <MainContainer>
      <ConfirmationModal
        title={i18n.t("campaigns.confirmationModal.deleteTitle")}
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        onConfirm={removeVariable}
      >
        {i18n.t("campaigns.confirmationModal.deleteMessage")}
      </ConfirmationModal>
      <MainHeader>
        <Grid style={{ width: "99.6%" }} container>
          <Grid xs={12} item>
          <Title>
  <div 
    style={{
      color: "#0C2C4C", 
      fontWeight: "bold", 
      fontFamily: "Nunito", 
      fontSize: "24px", 
      lineHeight: "18px", 
    }}
  >
    CONFIGURAÇÕES
  </div>
</Title>
          </Grid>
        </Grid>
      </MainHeader>
      <Paper className={classes.mainPaper} variant="outlined" >
        <Box className={classes.tabPanelsContainer}>
        
            <Grid xs={12} item>
              <Typography component={"h3"} style={{padding:"10px"}}>Intervalos</Typography>
            </Grid>
            <Grid container spacing={2} alignItems="flex-start">
            <Grid xs={12} md={4} item>
              <FormControl
                variant="outlined"
                className={classes.formControl}
                fullWidth
              >
                <InputLabel id="messageInterval-label">
                  Intervalo Randômico de Disparo
                </InputLabel>
                <Select
                  name="messageInterval"
                  id="messageInterval"
                  labelId="messageInterval-label"
                  label="Intervalo Randômico de Disparo"
                  value={settings.messageInterval}
                  onChange={(e) => handleOnChangeSettings(e)}
                >
                  <MenuItem value={0}>Sem Intervalo</MenuItem>
                  <MenuItem value={5}>5 segundos</MenuItem>
                  <MenuItem value={10}>10 segundos</MenuItem>
                  <MenuItem value={15}>15 segundos</MenuItem>
                  <MenuItem value={20}>20 segundos</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} md={4} item>
              <FormControl
                variant="outlined"
                className={classes.formControl}
                fullWidth
              >
                <InputLabel id="longerIntervalAfter-label">
                  Intervalo Maior Após
                </InputLabel>
                <Select
                  name="longerIntervalAfter"
                  id="longerIntervalAfter"
                  labelId="longerIntervalAfter-label"
                  label="Intervalo Maior Após"
                  value={settings.longerIntervalAfter}
                  onChange={(e) => handleOnChangeSettings(e)}
                >
                  <MenuItem value={0}>Não definido</MenuItem>
                  <MenuItem value={1}>1 segundo</MenuItem>
                  <MenuItem value={5}>5 segundos</MenuItem>
                  <MenuItem value={10}>10 segundos</MenuItem>
                  <MenuItem value={15}>15 segundos</MenuItem>
                  <MenuItem value={20}>20 segundos</MenuItem>
                  <MenuItem value={30}>30 segundos</MenuItem>
                  <MenuItem value={40}>40 segundos</MenuItem>
                  <MenuItem value={60}>60 segundos</MenuItem>
                  <MenuItem value={80}>80 segundos</MenuItem>
                  <MenuItem value={100}>100 segundos</MenuItem>
                  <MenuItem value={120}>120 segundos</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} md={4} item>
              <FormControl
                variant="outlined"
                className={classes.formControl}
                fullWidth
              >
                <InputLabel id="greaterInterval-label">
                  Intervalo de Disparo Maior
                </InputLabel>
                <Select
                  name="greaterInterval"
                  id="greaterInterval"
                  labelId="greaterInterval-label"
                  label="Intervalo de Disparo Maior"
                  value={settings.greaterInterval}
                  onChange={(e) => handleOnChangeSettings(e)}
                >
                  <MenuItem value={0}>Sem Intervalo</MenuItem>
                  <MenuItem value={1}>1 segundo</MenuItem>
                  <MenuItem value={5}>5 segundos</MenuItem>
                  <MenuItem value={10}>10 segundos</MenuItem>
                  <MenuItem value={15}>15 segundos</MenuItem>
                  <MenuItem value={20}>20 segundos</MenuItem>
                  <MenuItem value={30}>30 segundos</MenuItem>
                  <MenuItem value={40}>40 segundos</MenuItem>
                  <MenuItem value={60}>60 segundos</MenuItem>
                  <MenuItem value={80}>80 segundos</MenuItem>
                  <MenuItem value={100}>100 segundos</MenuItem>
                  <MenuItem value={120}>120 segundos</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            </Grid>

            <Grid container spacing={2} className={classes.textRight} justifyContent="flex-end" style={{ marginTop: '10px',  }}>            
            <Grid xs={6} className={classes.textRight}>
            <Button
                  onClick={saveSettings}
                  color="primary"
                  variant="contained"
                  className={classes.roundedButton}
                  style={{
                    borderRadius: '8px', 
                    marginRight: '10px'
                  }}
                >
                  Salvar 
            </Button>
              
            </Grid>
            <Grid container spacing={2} className={classes.textRight} justifyContent="flex-end">
              <Grid item xs={6} className={classes.textLeft}>
              <Button
                onClick={() => setShowVariablesForm(!showVariablesForm)}
                color="primary"
                style={{ marginRight: 10, borderRadius: '8px', backgroundColor:"#0C2454", color:"white", marginTop: "50px"}}
              >
                Adicionar Variável
              </Button>
              </Grid>
            </Grid>


            {showVariablesForm && (
              <>
                <Grid xs={12} md={6} item>
                  <TextField
                    label="Atalho"
                    variant="outlined"
                    value={variable.key}
                    name="key"
                    onChange={handleOnChangeVariable}
                    fullWidth
                    style={{backgroundColor:"white"}}
                  
                  />
                </Grid>
                <Grid xs={12} md={6} item>
                  <TextField
                    label="Conteúdo"
                    variant="outlined"
                    value={variable.value}
                    name="value"
                    onChange={handleOnChangeVariable}
                    fullWidth
                    style={{backgroundColor:"white"}}
                  />
                </Grid>
                <Grid xs={12} className={classes.textRight} item>

                  
                  <Button
                    onClick={() => setShowVariablesForm(!showVariablesForm)}
                    color="primary"
                    style={{ marginRight: 10, borderRadius: '8px', border: '1px solid'}}
                  >
                    Fechar
                  </Button>


                  <Button
                    onClick={addVariable}
                    color="primary"
                    variant="contained"
                    style={{
                      borderRadius: '8px', 
                    }}
                  >
                    Adicionar
                  </Button>
                </Grid>
              </>
            )}
            {settings.variables.length > 0 && (
              <Grid xs={12} className={classes.textRight} item>
               <Paper className={classes.tablePaper} elevation={3}>
                <Table size="small">
                  <TableHead>
                    <TableRow className={classes.tableHeader}>
                      <TableCell align="center" style={{borderRadius: '5px 0px 0px 5px', color:'white'}}>Atalho</TableCell>
                      <TableCell align="center"> </TableCell>
                      <TableCell align="center"style={{color:'white'}}>Conteúdo</TableCell>
                      <TableCell style={{backgroundColor: '#0C2454', color:'white', borderRadius: '0px 5px 5px 0px', width:"150px"}}></TableCell>
                      
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Array.isArray(settings.variables) &&
                      settings.variables.map((v, k) => (
                        <TableRow key={k} className={classes.tableRow}>
                          <TableCell align="center">{"{" + v.key + "}"}</TableCell>
                          <TableCell align="center"> </TableCell>
                          <TableCell align="center">{v.value}</TableCell>
                          <TableCell align="center">
                            <IconButton 
                              size="small"
                              onClick={() => {
                                setSelectedKey(v.key);
                                setConfirmationOpen(true);
                              }}
                            >
                              <DeleteOutlineIcon />
                            </IconButton>
                          </TableCell>
                          
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
               </Paper>
              </Grid>
            )}
          </Grid>
        </Box>
      </Paper>
    </MainContainer>
  );
};

export default CampaignsConfig;
