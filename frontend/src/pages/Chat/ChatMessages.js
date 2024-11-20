import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";

import { AuthContext } from "../../context/Auth/AuthContext";
import { useDate } from "../../hooks/useDate";
import api from "../../services/api";
import { green } from "@material-ui/core/colors";

// Local do Input
const useStyles = makeStyles((theme) => ({
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    position: "relative",
    flex: 1,
    overflow: "hidden",
    borderRadius: 15,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    height: "100%",
    borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
    backgroundColor: "white",
    
  },
  // Local onde estarão as mensagens
  messageList: {
    position: "relative",
    overflowY: "auto",
    height: "100%",
    ...theme.scrollbarStyles,
    backgroundColor: theme.palette.chatlist, //DARK MODE PLW DESIGN//
  },
  inputArea: {
    position: "relative",
    height: "auto",
    borderRadius: "5px",
    border: "0.6px solid #656565",  
  },
  input: {
    padding: "20px",
  },
  buttonSend: {
    margin: theme.spacing(1),
  },
  boxLeft: {
    padding: "10px 10px 5px",
    margin: "10px",
    position: "relative",
    backgroundColor: "#0C2C4C",
    maxWidth: 400,
    borderRadius: 10,
    borderBottomLeftRadius: 0,
    border: "1px solid rgba(0, 0, 0, 0.12)",
    fontSize: "1rem",
    color: "white",
    fontWeight: "300px",
    wordBreak: "break-word", // Corrigido
    overflowWrap: "break-word",
  },
  boxRight: {
    padding: "10px 10px 5px",
    margin: "10px 10px 10px auto",
    position: "relative",
    backgroundColor: "#34D3A3", //DARK MODE PLW DESIGN//
    textAlign: "right",
    maxWidth: 400,
    borderRadius: 10,
    borderBottomRightRadius: 0,
    border: "1px solid rgba(0, 0, 0, 0.12)",
    fontSize: "1rem",
    color: "white",
    wordBreak: "break-word", // Corrigido
    overflowWrap: "break-word",
  },
  contato: {
    backgroundColor: "#0C2C4C",
    color: "purple",
    height: "90px",
    display: "block",
  }
}));
export default function ChatMessages({
  chat,
  messages,
  handleSendMessage,
  handleLoadMore,
  scrollToBottomRef,
  pageInfo,
  loading,
}) {
  const classes = useStyles();
  const { user } = useContext(AuthContext);
  const { datetimeToClient } = useDate();
  const baseRef = useRef();

  const [contentMessage, setContentMessage] = useState("");

  const scrollToBottom = () => {
    if (baseRef.current) {
      baseRef.current.scrollIntoView({});
    }
  };

  const unreadMessages = (chat) => {
    if (chat !== undefined) {
      const currentUser = chat.users.find((u) => u.userId === user.id);
      return currentUser.unreads > 0;
    }
    return 0;
  };

  useEffect(() => {
    if (unreadMessages(chat) > 0) {
      try {
        api.post(`/chats/${chat.id}/read`, { userId: user.id });
      } catch (err) {}
    }
    scrollToBottomRef.current = scrollToBottom;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScroll = (e) => {
    const { scrollTop } = e.currentTarget;
    if (!pageInfo.hasMore || loading) return;
    if (scrollTop < 600) {
      handleLoadMore();
    }
  };
  //titulo do site(header e chat.title é o nome do contato)
  return (
    <Paper className={classes.mainContainer}>
      
      <Box variant='body' display="block" padding='30px' bgcolor='#0C2C4C' color="white" fontSize='1.5rem' borderRadius='15'>
      <Typography variant="h7" display="inline" margin='unset' color='#34D3A3'>{chat.title}</Typography>
      </Box>
      <div onScroll={handleScroll} className={classes.messageList}>
        {Array.isArray(messages) &&
          messages.map((item, key) => {
            if (item.senderId === user.id) {
              return (
                <Box key={key} className={classes.boxRight}>
                  {/* <Typography variant="subtitle2">
  
                  </Typography> */}
                  <Typography style={{maxWidth: "380px", wordwrap: "break-word"}}>
                   {item.message}
                  </Typography>
             
                  {/* <Typography variant="caption" display="block">

                  </Typography> */}
                </Box>
              );
            } else {
              return (
                <Box key={key} className={classes.boxLeft}>
                  {/* <Typography variant="subtitle2">

                  </Typography> */}
                  <Typography style={{maxWidth: "380px", wordwrap: "break-word"}}>
                    {item.message}
                  </Typography>
                  
                  {/* <Typography variant="caption" display="block">
 
                  </Typography> */}
                </Box>
              );
            }
          })}
        <div ref={baseRef}></div>
      </div>
      <div className={classes.inputArea}>
        <FormControl variant="outlined" fullWidth>
          <Input
            placeholder="Digite sua mensagem..."
            multiline
            value={contentMessage}
            onKeyUp={(e) => {
              if (e.key === "Enter" && contentMessage.trim() !== "") {
                handleSendMessage(contentMessage);
                setContentMessage("");
              }
            }}
            onChange={(e) => setContentMessage(e.target.value)}
            className={classes.input}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    if (contentMessage.trim() !== "") {
                      handleSendMessage(contentMessage);
                      setContentMessage("");
                    }
                  }}
                  className={classes.buttonSend}
                >
                  <SendIcon />
                </IconButton>
              </InputAdornment>
        
            }
          />
        </FormControl>
      </div>
    </Paper>
  );
}
