import React, { useContext, useState, useEffect } from "react";

import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import Typography from "@material-ui/core/Typography";
import { Button } from "@material-ui/core";

import SpeedIcon from "@material-ui/icons/Speed";
import GroupIcon from "@material-ui/icons/Group";
import AssignmentIcon from "@material-ui/icons/Assignment";
import PersonIcon from "@material-ui/icons/Person";
import CallIcon from "@material-ui/icons/Call";
import RecordVoiceOverIcon from "@material-ui/icons/RecordVoiceOver";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ForumIcon from "@material-ui/icons/Forum";
import FilterListIcon from "@material-ui/icons/FilterList";
import ClearIcon from "@material-ui/icons/Clear";
import SendIcon from '@material-ui/icons/Send';
import MessageIcon from '@material-ui/icons/Message';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import TimerIcon from '@material-ui/icons/Timer';

import { makeStyles } from "@material-ui/core/styles";
import { grey, blue } from "@material-ui/core/colors";
import { toast } from "react-toastify";

import Chart from "./Chart";
import ButtonWithSpinner from "../../components/ButtonWithSpinner";

import CardCounter from "../../components/Dashboard/CardCounter";
import TableAttendantsStatus from "../../components/Dashboard/TableAttendantsStatus";
import { isArray } from "lodash";

import { AuthContext } from "../../context/Auth/AuthContext";

import useDashboard from "../../hooks/useDashboard";
import useTickets from "../../hooks/useTickets";
import useUsers from "../../hooks/useUsers";
import useContacts from "../../hooks/useContacts";
import useMessages from "../../hooks/useMessages";
import { ChatsUser } from "./ChartsUser"

import Filters from "./Filters";
import { isEmpty } from "lodash";
import moment from "moment";
import { ChartsDate } from "./ChartsDate";


import { 
  BarChart, 
  Bar,
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

import group41 from "../../assets/Group 41.png"
import group42 from "../../assets/Group 42.png"
import group43 from "../../assets/Group 43.png"
import group44 from "../../assets/Group 44.png"

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.padding,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(2),
  },
  fixedHeightPaper: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    height: 240,
    overflowY: "auto",
    ...theme.scrollbarStyles,
  },
  cardAvatar: {
    fontSize: "55px",
    color: grey[500],
    backgroundColor: "#ffffff",
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  cardTitle: {
    fontSize: "18px",
    color: blue[700],
  },
  cardSubtitle: {
    color: grey[600],
    fontSize: "14px",
  },
  alignRight: {
    textAlign: "right",
  },
  fullWidth: {
    width: "100%",
  },
  selectContainer: {
    width: "100%",
    textAlign: "left",
  },
  iframeDashboard: {
    width: "100%",
    height: "calc(100vh - 64px)",
    border: "none",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  fixedHeightPaper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: 240,
  },
  customFixedHeightPaper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: 120,
  },
  customFixedHeightPaperLg: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "100%",
  },
  card1: {
    padding: theme.spacing(2),
    display: "block",
    overflow: "auto",
    flexDirection: "column",
    height: "180px",
    width: "210px",
    borderRadius: "20px",
    //backgroundColor: "palette",
    //backgroundColor: theme.palette.primary.main,
    backgroundColor: theme.palette.type === 'dark' ? theme.palette.boxticket.main : theme.palette.primary.main,
    color: "#eee",
  },
  card2: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "100%",
    //backgroundColor: "palette",
    //backgroundColor: theme.palette.primary.main,
    backgroundColor: theme.palette.type === 'dark' ? theme.palette.boxticket.main : theme.palette.primary.main,
    color: "#eee",
  },
  card3: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "100%",
  //backgroundColor: theme.palette.primary.main,
    backgroundColor: theme.palette.type === 'dark' ? theme.palette.boxticket.main : theme.palette.primary.main,
    color: "#eee",
  },
  card4: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "100%",
    //backgroundColor: theme.palette.primary.main,
    backgroundColor: theme.palette.type === 'dark' ? theme.palette.boxticket.main : theme.palette.primary.main,
    color: "#eee",
  },
  card5: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "100%",
    //backgroundColor: theme.palette.primary.main,
    backgroundColor: theme.palette.type === 'dark' ? theme.palette.boxticket.main : theme.palette.primary.main,
    color: "#eee",
  },
  card6: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "100%",
    //backgroundColor: theme.palette.primary.main,
    backgroundColor: theme.palette.type === 'dark' ? theme.palette.boxticket.main : theme.palette.primary.main,
    color: "#eee",
  },
  card7: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "100%",
    //backgroundColor: theme.palette.primary.main,
    backgroundColor: theme.palette.type === 'dark' ? theme.palette.boxticket.main : theme.palette.primary.main,
    color: "#eee",
  },
  card8: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "160px",
    width: "430px",
    //backgroundColor: theme.palette.primary.main,
    backgroundColor: theme.palette.type === 'dark' ? theme.palette.boxticket.main : theme.palette.primary.main,
    color: "#eee",
  },
  card9: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "160px",
    width: "430px",
    //backgroundColor: theme.palette.primary.main,
    backgroundColor: theme.palette.type === 'dark' ? theme.palette.boxticket.main : theme.palette.primary.main,
    color: "#eee",
  },
  fixedHeightPaper2: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
}));

const Dashboard = () => {
    const classes = useStyles();
    const [counters, setCounters] = useState({});
    const [attendants, setAttendants] = useState([]);
    const [period, setPeriod] = useState(0);
    const [filterType, setFilterType] = useState(1);
    const [dateFrom, setDateFrom] = useState(moment("1", "D").format("YYYY-MM-DD"));
    const [dateTo, setDateTo] = useState(moment().format("YYYY-MM-DD"));
    const [loading, setLoading] = useState(false);
    const { find } = useDashboard();
  
    const [showFilter, setShowFilter] = useState(false);
    const [queueTicket, setQueueTicket] = useState(false);
  
    const { user } = useContext(AuthContext);
    var userQueueIds = [];
  
    if (user.queues && user.queues.length > 0) {
      userQueueIds = user.queues.map((q) => q.id);
    }
    
    let newDate = new Date();
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    let now = `${year}-${month < 10 ? `0${month}` : `${month}`}-${date < 10 ? `0${date}` : `${date}`}`;
  
    useEffect(() => {
      async function firstLoad() {
        await fetchData();
      }
      setTimeout(() => {
        firstLoad();
      }, 1000);
    }, []);
    
      async function handleChangePeriod(value) {
      setPeriod(value);
    }
  
    async function handleChangeFilterType(value) {
      setFilterType(value);
      if (value === 1) {
        setPeriod(0);
      } else {
        setDateFrom("");
        setDateTo("");
      }
    }
  
    async function fetchData() {
      setLoading(true);
  
      let params = {};
  
      if (period > 0) {
        params = {
          days: period,
        };
      }
  
      if (!isEmpty(dateFrom) && moment(dateFrom).isValid()) {
        params = {
          ...params,
          date_from: moment(dateFrom).format("YYYY-MM-DD"),
        };
      }
  
      if (!isEmpty(dateTo) && moment(dateTo).isValid()) {
        params = {
          ...params,
          date_to: moment(dateTo).format("YYYY-MM-DD"),
        };
      }
  
      if (Object.keys(params).length === 0) {
        toast.error("Parametrize o filtro");
        setLoading(false);
        return;
      }
  
      const data = await find(params);
  
      setCounters(data.counters);
      if (isArray(data.attendants)) {
        setAttendants(data.attendants);
      } else {
        setAttendants([]);
      }
  
      setLoading(false);
    }
  
    function formatTime(minutes) {
      return moment()
        .startOf("day")
        .add(minutes, "minutes")
        .format("HH[h] mm[m]");
    }
  
    const GetUsers = () => {
      let count;
      let userOnline = 0;
      attendants.forEach(user => {
        if (user.online === true) {
          userOnline = userOnline + 1
        }
      })
      count = userOnline === 0 ? 0 : userOnline;
      return count;
    };
    
      const GetContacts = (all) => {
      let props = {};
      if (all) {
        props = {};
      }
      const { count } = useContacts(props);
      return count;
    };

    const dailyData = [
      { name: 'D', value: 35 },
      { name: 'S', value: 28 },
      { name: 'T', value: 25 },
      { name: 'Q', value: 20 },
      { name: 'Q', value: 30 },
      { name: 'S', value: 35 },
      { name: 'S', value: 28 }
    ];

  return (
    <div>
      <div>
        <h1
        style={{ fontFamily: 'Nunito', fontWeight: 'bold', color: '#0C2C4C', marginTop: '-1%', marginLeft: '7%' }}
        >
          Dashboard
        </h1>
      </div>
      <Container maxWidth="lg" className={classes.container}>
        <Grid 
        container spacing={3} 
        justifyContent="flex-end"
        style={{ 
          backgroundColor: "white", 
          border: "solid, 1px", 
          borderRadius: "5px",
          borderColor: "#0C2454",
          gridTemplateColumns: 'repeat(3, 1fr)', // ajuste conforme o número de colunas desejado
          width: '77%', // ajuste a largura
          marginLeft: '-10%', // desloca o grid para a esquerda
        }}
        >
		

          {/* EM ATENDIMENTO */}
          <Grid item md={1.5}
            style={{ 
              display: "flex", 
              textAlign: "center", 
              justifyContent: "center",

            }}
          >
            <Paper
              className={classes.card1}
              style={{ 
                overflow: "hidden",
                display: "flex", 
                textAlign: "center", 
                justifyContent: "center",
              }}
              elevation={4}
            >
              <Grid 
              style={{ 
                display: "flex", 
                textAlign: "center", 
                justifyContent: "center",

              }}
              >
                <Grid item xs={8}>
                  <div>
                  <img
                    style={{ height: "56px", width: "56px" }}
                    src={group42}
                    alt="em_aberto"
                  />
                  </div>
                  <Grid item>
                    <Typography
                      component="h1"
                      variant="h4"
                      style={{ fontSize: "40px", fontFamily: "Nunito", fontWeight: "bolder"}}
                    >
                      {counters.supportHappening}
                    </Typography>
                  </Grid>
                  <Typography
                    component="h3"
                    variant="h6"
                    paragraph
                    style={{ fontSize: "16px", fontFamily: "Nunito" }}
                  >
                    Em Conversa
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* AGUARDANDO */}
          <Grid item md={1.5}
            style={{ 
              display: "flex", 
              textAlign: "center", 
              justifyContent: "center",

            }}
          >
            <Paper
              className={classes.card1}
              style={{ 
                overflow: "hidden",
                display: "flex", 
                textAlign: "center", 
                justifyContent: "center",
              }}
              elevation={4}
            >
              <Grid 
              style={{ 
                display: "flex", 
                textAlign: "center", 
                justifyContent: "center",

              }}
              >
                <Grid item xs={8}>
                  <div>
                  <img
                    style={{ height: "56px", width: "56px" }}
                    src={group43}
                    alt="em_aberto"
                  />
                  </div>
                  <Grid item>
                    <Typography
                      component="h1"
                      variant="h4"
                      style={{ fontSize: "40px", fontFamily: "Nunito", fontWeight: "bolder"}}
                    >
                      {counters.supportHappening}
                    </Typography>
                  </Grid>
                  <Typography
                    component="h3"
                    variant="h6"
                    paragraph
                    style={{ fontSize: "16px", fontFamily: "Nunito" }}
                  >
                    Aguardando
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* ATENDENTES ATIVOS */}
			  {/*<Grid item xs={12} sm={6} md={4}>
            <Paper
              className={classes.card6}
              style={{ overflow: "hidden" }}
              elevation={6}
            >
              <Grid container spacing={3}>
                <Grid item xs={8}>
                  <Typography
                    component="h3"
                    variant="h6"
                    paragraph
                  >
                    Conversas Ativas
                  </Typography>
                  <Grid item>
                    <Typography
                      component="h1"
                      variant="h4"
                    >
                      {GetUsers()}
                      <span
                        style={{ color: "#805753" }}
                      >
                        /{attendants.length}
                      </span>
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs={4}>
                  <RecordVoiceOverIcon
                    style={{
                      fontSize: 100,
                      color: "#805753",
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
</Grid>*/}

          {/* FINALIZADOS */}
          <Grid item md={1.5}
            style={{ 
              display: "flex", 
              textAlign: "center", 
              justifyContent: "center",

            }}
          >
            <Paper
              className={classes.card1}
              style={{ 
                overflow: "hidden",
                display: "flex", 
                textAlign: "center", 
                justifyContent: "center",
              }}
              elevation={4}
            >
              <Grid 
              style={{ 
                display: "flex", 
                textAlign: "center", 
                justifyContent: "center",

              }}
              >
                <Grid item xs={8}>
                  <div>
                  <img
                    style={{ height: "56px", width: "56px" }}
                    src={group41}
                    alt="em_aberto"
                  />
                  </div>
                  <Grid item>
                    <Typography
                      component="h1"
                      variant="h4"
                      style={{ fontSize: "40px", fontFamily: "Nunito", fontWeight: "bolder"}}
                    >
                      {counters.supportHappening}
                    </Typography>
                  </Grid>
                  <Typography
                    component="h3"
                    variant="h6"
                    paragraph
                    style={{ fontSize: "16px", fontFamily: "Nunito" }}
                  >
                    Finalizados
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* NOVOS CONTATOS */}
          <Grid item md={1.5}
            style={{ 
              display: "flex", 
              textAlign: "center", 
              justifyContent: "center",

            }}
          >
            <Paper
              className={classes.card1}
              style={{ 
                overflow: "hidden",
                display: "flex", 
                textAlign: "center", 
                justifyContent: "center",
              }}
              elevation={4}
            >
              <Grid 
              style={{ 
                display: "flex", 
                textAlign: "center", 
                justifyContent: "center",

              }}
              >
                <Grid item xs={8}>
                  <div>
                  <img
                    style={{ height: "56px", width: "56px" }}
                    src={group44}
                    alt="em_aberto"
                  />
                  </div>
                  <Grid item>
                    <Typography
                      component="h1"
                      variant="h4"
                      style={{ fontSize: "40px", fontFamily: "Nunito", fontWeight: "bolder"}}
                    >
                      {counters.supportHappening}
                    </Typography>
                  </Grid>
                  <Typography
                    component="h3"
                    variant="h6"
                    paragraph
                    style={{ fontSize: "16px", fontFamily: "Nunito" }}
                  >
                    Novos Contatos
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        <Grid 
        container spacing={3} 
        justifyContent="flex-end"
        style={{ 
          backgroundColor: "white", 
          border: "solid, 1px", 
          borderRadius: "5px",
          borderColor: "#0C2454",
          gridTemplateColumns: 'repeat(3, 1fr)', // ajuste conforme o número de colunas desejado
          width: '40%', // ajuste a largura
          marginLeft: '70%', // desloca o grid para a esquerda
          marginTop: '-16.79%',
          justifyContent: "center",
        }}
        >
          
          {/* T.M. DE ATENDIMENTO */}
          <Grid item md={1.5}>
            <Paper
              className={classes.card8}
              style={{ overflow: "hidden", borderRadius: '20px' }}
              elevation={6}
            >
              <Grid container spacing={3}>
                <Grid item xs={8}>
                  <Typography
                    component="h3"
                    variant="h6"
                    paragraph
                    style={{ fontFamily: 'Nunito' }}
                  >
                    Tempo Médio de Conversa
                  </Typography>
                  <Grid item>
                    <Typography
                      component="h1"
                      variant="h4"
                      style={{ fontFamily: 'Nunito', fontWeight: 'bolder', position: 'relative', left: '50px' }}
                    >
                      {formatTime(counters.avgSupportTime)}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs={4} style={{ position: 'relative', top: '45px', right: '40px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dailyData}>
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#34D3A3" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* T.M. DE ESPERA */}
          <Grid item md={1.5}>
            <Paper
              className={classes.card9}
              style={{ overflow: "hidden", borderRadius: '20px' }}
              elevation={6}
            >
              <Grid container spacing={3}>
                <Grid item xs={8}>
                  <Typography
                    component="h3"
                    variant="h6"
                    paragraph
                    style={{ fontFamily: 'Nunito' }}
                  >
                    Tempo Médio de Espera
                  </Typography>
                  <Grid item>
                    <Typography
                      component="h1"
                      variant="h4"
                      style={{ fontFamily: 'Nunito', fontWeight: 'bolder', position: 'relative', left: '50px' }}
                    >
                      {formatTime(counters.avgWaitTime)}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs={4} style={{ position: 'relative', top: '45px', right: '40px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={dailyData}>
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#34D3A3" 
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

        </Grid>

        <Grid 
          container spacing={3} 
          justifyContent="flex-end"
          style={{ 
            backgroundColor: "white", 
            border: "solid, 1px", 
            borderRadius: "5px",
            borderColor: "#0C2454",
            width: '77%', // ajuste a largura
            marginLeft: '-10%',
            marginTop: '-8%',
          }}
          >
          {/* TOTAL DE ATENDIMENTOS POR USUARIO */}
          <Grid item xs={12}>
            <Paper className={classes.fixedHeightPaper2}>
              <ChatsUser />
            </Paper>
          </Grid>
        </Grid>

        <Grid 
          container spacing={3} 
          justifyContent="flex-end"
          style={{ 
            backgroundColor: "white", 
            border: "solid, 1px", 
            borderRadius: "5px",
            borderColor: "#0C2454",
            width: '40%', // ajuste a largura
            marginLeft: '70%', // desloca o grid para a esquerda
            marginTop: '-27.5%',
          }}
          >

          {/* TOTAL DE ATENDIMENTOS */}
          <Grid item xs={12}>
            <Paper className={classes.fixedHeightPaper2}>
              <ChartsDate />
            </Paper>
          </Grid>

        </Grid>

        
      </Container >
    </div >
  );
};

export default Dashboard;
