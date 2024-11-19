import React, { useState, useEffect, useReducer, useContext, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import api from "../../services/api";
import { AuthContext } from "../../context/Auth/AuthContext";
import Board from 'react-trello';
import { toast } from "react-toastify";
import { i18n } from "../../translate/i18n";
import { useHistory } from 'react-router-dom';
import { colors } from "@material-ui/core";
import { BorderColor, BorderTop } from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(1),
    height: '100dvh',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0.5),
    },
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(1.5),
    },
  },
  button: {
    background: "#0C2C54",
    border: "none",
    padding: "10px",
    color: "white",
    fontWeight: "bold",
    borderRadius: "5px",
  },
  pageTitle: {
    color: "#0C2454",
    padding: "-40 20px",
    margin: "0 0 20px 0",
    fontFamily: "Nunito, sans-serif",
    fontSize: "24px",
    fontWeight: "600",
    transform: "translateY(0)",
  }
}));

const Kanban = () => {
  const classes = useStyles();
  const history = useHistory();

  const [tags, setTags] = useState([]);
  const [reloadData, setReloadData] = useState(false);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);


  const fetchTags = async () => {
    try {
      const response = await api.get("/tags/kanban");

      const fetchedTags = response.data.lista || []; 
      setTags(fetchedTags);

      // Fetch tickets after fetching tags
      await fetchTickets(jsonString);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const [file, setFile] = useState({
    lanes: []
  });


  const [tickets, setTickets] = useState([]);
  const { user } = useContext(AuthContext);
  const { profile, queues } = user;
  const jsonString = user.queues.map(queue => queue.UserQueue.queueId);

  const fetchTickets = async (jsonString) => {
    try {
      
      const { data } = await api.get("/ticket/kanban", {
        params: {
          queueIds: JSON.stringify(jsonString),
          teste: true
        }
      });
      setTickets(data.tickets);
    } catch (err) {
      console.log(err);
      setTickets([]);
    }
  };

  const popularCards = (jsonString) => {
    const filteredTickets = tickets.filter(ticket => ticket.tags.length === 0);
    const emAndamentoTickets = tickets.filter(ticket => ticket.status === "em_andamento");
    const finalizadoTickets = tickets.filter(ticket => ticket.status === "finalizado");
    const impedidoTickets = tickets.filter(ticket => ticket.status === "impedido");
    const aguardandoTickets = tickets.filter(ticket => ticket.status === "aguardando");
    
    const lanes = [
      {
        id: "lane0",
        title: (
          <div>
            <span>{i18n.t("Aberto")}</span>
            {/*<span> {`(${filteredTickets.length})`}</span>*/}
          </div>
        ),
        cards:filteredTickets.map((ticket) => ({
          id: ticket.id.toString(),
          label: "Ticket nº " + ticket.id.toString(),
          description:(
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#E3E3E3",
                borderRadius: "5px",
                padding: "10px",
                marginBottom: "10px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                justifyContent: "space-between",
                maxWidth: "100%",
              }}>
              <div
                style={{
                  backgroundColor: "#1FA3C0",
                  width: "7px",
                  height: "70px",
                  borderRadius: "3px",
                  marginRight: "10px",
                }}>
              </div>
              <div style={{ flex: 1, maxWidth: "70%" }}>
                <p
                  style={{
                    color: "#000000",
                    margin: "0 0 5px 0",
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>{ticket.contact.name}</p>
                <p
                  style={{
                    color: "#000000",
                    margin: "0",
                    wordWrap: "break-word",
                    overflow: "hidden",
                    maxHeight: "40px",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",}}>
                  {ticket.contact.number}
                  <br/>
                  {ticket.lastMessage}
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <button
                  style={{
                    backgroundColor: "#0C2C54",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "5px",
                    padding: "5px 15px",
                    cursor: "pointer",
                    fontSize: "12px",
                    maxWidth: "50px",
                    textAlign: "center",}}
                  className={classes.button}
                  onClick={() => {
                    handleCardClick(ticket.uuid);}}>Ver</button>
              </div>
            </div>
          ),
          title: ticket.contact.name,
          draggable: true,
          href: "/tickets/" + ticket.uuid,
        })),
      },
      {
        id: "lane1",
        title: (
          <div>
            <span>{i18n.t("Em andamento")}</span>
            {/*<span> {`(${emAndamentoTickets.length})`}</span>*/}
          </div>
        ),
        cards:emAndamentoTickets.map((ticket) => ({
          id: ticket.id.toString(),
          label: "Ticket nº " + ticket.id.toString(),
          description:(
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#E3E3E3",
                borderRadius: "5px",
                padding: "10px",
                marginBottom: "10px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                justifyContent: "space-between",
                maxWidth: "100%",
              }}>
              <div
                style={{
                  backgroundColor: "#E5C418",
                  width: "7px",
                  height: "70px",
                  borderRadius: "3px",
                  marginRight: "10px",
                }}>
              </div>
              <div style={{ flex: 1, maxWidth: "70%" }}>
                <p
                  style={{
                    color: "#000000",
                    margin: "0 0 5px 0",
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>{ticket.contact.name}</p>
                <p
                  style={{
                    color: "#000000",
                    margin: "0",
                    wordWrap: "break-word",
                    overflow: "hidden",
                    maxHeight: "40px",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",}}>
                  {ticket.contact.number}
                  <br/>
                  {ticket.lastMessage}
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <button
                  style={{
                    backgroundColor: "#0C2C54",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "5px",
                    padding: "5px 15px",
                    cursor: "pointer",
                    fontSize: "12px",
                    maxWidth: "50px",
                    textAlign: "center",}}
                  className={classes.button}
                  onClick={() => {
                    handleCardClick(ticket.uuid);}}>Ver</button>
              </div>
            </div>
          ),
          title: ticket.contact.name,
          draggable: true,
          href: "/tickets/" + ticket.uuid,
        })),
      },
      {
        id: "lane2",
        title: (
          <div>
            <span>{i18n.t("Finalizado")}</span>
            {/*<span> {`(${finalizadoTickets.length})`}</span>*/}
          </div>
        ),
        cards:finalizadoTickets.map((ticket) => ({
          id: ticket.id.toString(),
          label: "Ticket nº " + ticket.id.toString(),
          description:(
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#E3E3E3",
                borderRadius: "5px",
                padding: "10px",
                marginBottom: "10px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                justifyContent: "space-between",
                maxWidth: "100%",
              }}>
              <div
                style={{
                  backgroundColor: "#40633A",
                  width: "7px",
                  height: "70px",
                  borderRadius: "3px",
                  marginRight: "10px",
                }}>
              </div>
              <div style={{ flex: 1, maxWidth: "70%" }}>
                <p
                  style={{
                    color: "#000000",
                    margin: "0 0 5px 0",
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>{ticket.contact.name}</p>
                <p
                  style={{
                    color: "#000000",
                    margin: "0",
                    wordWrap: "break-word",
                    overflow: "hidden",
                    maxHeight: "40px",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",}}>
                  {ticket.contact.number}
                  <br/>
                  {ticket.lastMessage}
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <button
                  style={{
                    backgroundColor: "#0C2C54",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "5px",
                    padding: "5px 15px",
                    cursor: "pointer",
                    fontSize: "12px",
                    maxWidth: "50px",
                    textAlign: "center",}}
                  className={classes.button}
                  onClick={() => {
                    handleCardClick(ticket.uuid);}}>Ver</button>
              </div>
            </div>
          ),
          title: ticket.contact.name,
          draggable: true,
          href: "/tickets/" + ticket.uuid,
        })),
      },
      {
        id: "lane3",
        title: (
          <div>
            <span>{i18n.t("Impedido")}</span>
            {/*<span> {`(${impedidoTickets.length})`}</span>*/}
          </div>
        ),
        cards:impedidoTickets.map((ticket) => ({
          id: ticket.id.toString(),
          label: "Ticket nº " + ticket.id.toString(),
          description:(
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#E3E3E3",
                borderRadius: "5px",
                padding: "10px",
                marginBottom: "10px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                justifyContent: "space-between",
                maxWidth: "100%",
              }}>
              <div
                style={{
                  backgroundColor: "#B40E0E",
                  width: "7px",
                  height: "70px",
                  borderRadius: "3px",
                  marginRight: "10px",
                }}>
              </div>
              <div style={{ flex: 1, maxWidth: "70%" }}>
                <p
                  style={{
                    color: "#000000",
                    margin: "0 0 5px 0",
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>{ticket.contact.name}</p>
                <p
                  style={{
                    color: "#000000",
                    margin: "0",
                    wordWrap: "break-word",
                    overflow: "hidden",
                    maxHeight: "40px",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",}}>
                  {ticket.contact.number}
                  <br/>
                  {ticket.lastMessage}
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <button
                  style={{
                    backgroundColor: "#0C2C54",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "5px",
                    padding: "5px 15px",
                    cursor: "pointer",
                    fontSize: "12px",
                    maxWidth: "50px",
                    textAlign: "center",}}
                  className={classes.button}
                  onClick={() => {
                    handleCardClick(ticket.uuid);}}>Ver</button>
              </div>
            </div>
          ),
          title: ticket.contact.name,
          draggable: true,
          href: "/tickets/" + ticket.uuid,
        })),
      },
      {
        id: "lane4",
        title: (
          <div>
            <span>{i18n.t("Aguardando")}</span>
            {/*<span> {`(${aguardandoTickets.length})`}</span>*/}
          </div>
        ),
        cards:aguardandoTickets.map((ticket) => ({
          id: ticket.id.toString(),
          label: "Ticket nº " + ticket.id.toString(),
          description:(
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#E3E3E3",
                borderRadius: "5px",
                padding: "10px",
                marginBottom: "10px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                justifyContent: "space-between",
                maxWidth: "100%",
              }}>
              <div
                style={{
                  backgroundColor: "#EE7D2C",
                  width: "7px",
                  height: "70px",
                  borderRadius: "3px",
                  marginRight: "10px",
                }}>
              </div>
              <div style={{ flex: 1, maxWidth: "70%" }}>
                <p
                  style={{
                    color: "#000000",
                    margin: "0 0 5px 0",
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>{ticket.contact.name}</p>
                <p
                  style={{
                    color: "#000000",
                    margin: "0",
                    wordWrap: "break-word",
                    overflow: "hidden",
                    maxHeight: "40px",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",}}>
                  {ticket.contact.number}
                  <br/>
                  {ticket.lastMessage}
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <button
                  style={{
                    backgroundColor: "#0C2C54",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "5px",
                    padding: "5px 15px",
                    cursor: "pointer",
                    fontSize: "12px",
                    maxWidth: "50px",
                    textAlign: "center",}}
                  className={classes.button}
                  onClick={() => {
                    handleCardClick(ticket.uuid);}}>Ver</button>
              </div>
            </div>
          ),
          title: ticket.contact.name,
          draggable: true,
          href: "/tickets/" + ticket.uuid,
        })),
      },
      ...tags.map(tag => {
        const filteredTickets = tickets.filter(ticket => {
          const tagIds = ticket.tags.map(tag => tag.id);
          return tagIds.includes(tag.id);
        });

        return {
          id: tag.id.toString(),
          title:(
            <div>
              <span>{i18n.t(tag.name)}</span>
              {/*<span> {`(${tag.name.length})`} </span>*/}
            </div>
          ),
          label: tag.id.toString(),
          cards: filteredTickets.map(ticket => ({
            id: ticket.id.toString(),
            label: "Ticket nº " + ticket.id.toString(),
            description:(
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#E3E3E3",
                  borderRadius: "5px",
                  padding: "10px",
                  marginBottom: "10px",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  justifyContent: "space-between",
                  maxWidth: "100%",
                }}>
                <div
                  style={{
                    backgroundColor: tag.color ,
                    width: "7px",
                    height: "70px",
                    borderRadius: "3px",
                    marginRight: "10px",
                  }}>
                </div>
                <div style={{ flex: 1, maxWidth: "70%" }}>
                  <p
                    style={{
                      color: "#000000",
                      margin: "0 0 5px 0",
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>{ticket.contact.name}</p>
                  <p
                    style={{
                      color: "#000000",
                      margin: "0",
                      wordWrap: "break-word",
                      overflow: "hidden",
                      maxHeight: "40px",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",}}>
                    {ticket.contact.number}
                    <br/>
                    {ticket.lastMessage}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "flex-end" }}>
                  <button
                    style={{
                      backgroundColor: "#0C2C54",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: "5px",
                      padding: "5px 15px",
                      cursor: "pointer",
                      fontSize: "12px",
                      maxWidth: "50px",
                      textAlign: "center",}}
                    className={classes.button}
                    onClick={() => {
                      handleCardClick(ticket.uuid);}}>Ver</button>
                </div>
              </div>
            ),
            title: ticket.contact.name,
            draggable: true,
            href: "/tickets/" + ticket.uuid,
          })),
          style: { color: "white" }
        };
      }),
    ];

    setFile({ lanes });
  };

  const handleCardClick = (uuid) => {  
    //console.log("Clicked on card with UUID:", uuid);
    history.push('/tickets/' + uuid);
  };

  useEffect(() => {
    popularCards(jsonString);
}, [tags, tickets, reloadData]);

  const handleCardMove = async (cardId, sourceLaneId, targetLaneId) => {
    try {
          await api.delete(`/ticket-tags/${targetLaneId}`);
        toast.success('Ticket Tag Removido!');
          await api.put(`/ticket-tags/${targetLaneId}/${sourceLaneId}`);
        toast.success('Ticket Tag Adicionado com Sucesso!');

    } catch (err) {
      console.log(err);
    }
  };
  const CustomLaneHeader = ({label, cards, title, current, target}) => {
    return (
      <div>
        <header
          style={{
            backgroundColor: "#0C2C54",
            padding: "10px 15px",
            borderRadius: "10px",
            color: "#FFFFFF",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxSizing: "border-box",
          }}>
          <div
            style={{
              fontFamily: "Nunito, sans-serif",
              fontSize: "18px",
              fontWeight: "600",
              lineHeight: "normal",
            }}>
            {title}
          </div>
          <div
            style={{
              fontFamily: "Nunito, sans-serif",
              fontSize: "18px",
              fontWeight: "600",
              lineHeight: "normal",
            }}>
            ({cards.length})
          </div>
        </header>
      </div>
    );
  };

  return (
    <div className={classes.root}>
      <div className={classes.pageTitle} style={{ marginTop: 0 }}>
        Kanban
      </div>
      <Board
        data={file}
        onCardMoveAcrossLanes={handleCardMove}
        style={{
          backgroundColor: '#E3E7ED',
          padding: "10px",
          borderRadius: "10px",
        }}
        components={{
          LaneHeader: CustomLaneHeader,
        }}
      />
    </div>
  );
};

export default Kanban;