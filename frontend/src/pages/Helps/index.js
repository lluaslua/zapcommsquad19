import React, { useState, useEffect, useCallback } from "react";
import { makeStyles, Paper, Typography, Modal, IconButton } from "@material-ui/core";
import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";
import { i18n } from "../../translate/i18n";
import useHelps from "../../hooks/useHelps";

import TextField from "@material-ui/core/TextField";
import SearchIcon from "@material-ui/icons/Search";
import InputAdornment from "@material-ui/core/InputAdornment";

const useStyles = makeStyles(theme => ({
  sidebarContainer: {
    width: '28%',
    // Height: '100vh', // Altura máxima para preencher até a base da tela
    maxHeight: "100vh",
    //  overflow: "hidden",
    // overflowY: 'auto',  // Ativa a rolagem se o conteúdo ultrapassar o limite
    // backgroundColor: '#EFF3F6',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    boxSizing: "border-box",
  },
  searchInput: {
    width: '98%',  // Largura do campo de pesquisa
    borderRadius: 5,  // Borda de 5px
    marginBottom: theme.spacing(2),
    backgroundColor: 'white',
    padding: theme.spacing(1),
  },
  titleList: {
    overflowY: 'auto',
    maxHeight: '100vh',  // Ajusta a altura para permitir rolagem
    padding: theme.spacing(1),
    flex: 1,
    height: "calc(69vh + 1px)",
    backgroundColor: "#EFF3F6"
  },
  titleItem: {
    fontSize: '1.9rem',
    fontWeight: '800',
    paddingBottom: "15px",
    paddingTop: "18px",
    borderRadius: theme.spacing(1),
    color: '#0c2340',
    textDecoration: 'none',
  },
  links: {
    backgroundColor: "black"
  },
  mainPaperContainer: {
    overflowY: 'auto',
    fontFamily: "Nunito, Arial, sans-serif",
   
  },
  mainPaper: {
    width: '100%',
    display: 'grid',
    display: "flex",
    flexDirection: "row",
    height: "94vh",
    // gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    // gap: theme.spacing(3),
    //  padding: theme.spacing(2),
    // marginBottom: theme.spacing(3),
    flex: "2",
  },
  helpPaper: {
    position: 'relative',
    width: '100%',
    // maxHeight: '100vh',
    // padding: theme.spacing(2),
    boxShadow: theme.shadows[3],
    borderRadius: theme.spacing(1),
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    maxWidth: '340px',
    flex: "2",
  },
  paperHover: {
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
      transform: 'scale(1.03)',
      boxShadow: `0 0 8px`,
      color: theme.palette.primary.main,
    },
  },
  videoThumbnail: {
    width: '70%',
    
    // height: 'calc(100% - 56px)',
    objectFit: 'cover',
    borderRadius: `${theme.spacing(1)}px ${theme.spacing(1)}px 0 0`,
  },
  videoTitle: {
    marginTop: theme.spacing(1),
    flex: 1,
    display: "block"
  },
  videoDescription: {
    overflow: 'hidden',
    paddingBottom: "250px",

  },
  videoModal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoModalContent: {
    outline: 'none',
    width: '90%',
    maxWidth: 1024,
    aspectRatio: '16/9',
    position: 'relative',
    backgroundColor: 'white',
    borderRadius: theme.spacing(1),
    overflow: 'hidden',
  },
}));

document.addEventListener("DOMContentLoaded", function() {
  const links = document.querySelectorAll(".help-links a");
  const contentItems = document.querySelectorAll(".content-item");

  links.forEach(link => {
      link.addEventListener("click", function(event) {
          event.preventDefault(); // Impede o comportamento padrão do link

          const targetId = this.getAttribute("data-content");

          // Remove a classe 'active' de todos os itens de conteúdo
          contentItems.forEach(item => item.classList.remove("active"));

          // Adiciona a classe 'active' ao item de conteúdo correspondente
          document.getElementById(targetId).classList.add("active");
      });
  });
});

const Helps = () => {
  const classes = useStyles();
  const [records, setRecords] = useState([]);
  const { list } = useHelps();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [activeContentId, setActiveContentId] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const helps = await list();
      setRecords(helps);
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openVideoModal = (video) => {
    setSelectedVideo(video);
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };
//COMANDO ESC PARA FECHAR VIDEO
  const handleModalClose = useCallback((event) => {
    if (event.key === "Escape") {
      closeVideoModal();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleModalClose);
    return () => {
      document.removeEventListener("keydown", handleModalClose);
    };
  }, [handleModalClose]);
  const renderVideoModal = () => {
    return (
      <Modal
        open={Boolean(selectedVideo)}
        onClose={closeVideoModal}
        className={classes.videoModal}
      >
        <div className={classes.videoModalContent}>
          {selectedVideo && (
            <iframe
              style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
              src={`https://www.youtube.com/embed/${selectedVideo}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      </Modal>
    );
  };

  const renderHelps = () => (
    <div className={`${classes.mainPaper} ${classes.mainPaperContainer}`}>
      {records.map((record, key) => (
        activeContentId === record.id && ( // Mostra somente o conteúdo ativo
          <section key={key} className="content-item active" style={{width: "80%", justifyContent: "center"}}>
            <Typography style={{margin: "auto"}} variant="h4" className={classes.titleItem}>{record.title}</Typography>
            <Typography style={{fontSize: "1rem"}} variant="text" className={classes.videoDescription}>{record.description}</Typography>
            <div style={{display: "flex", justifyContent: "center", alignContent: "center", marginTop: "30px"}}>
             <img
              src={`https://img.youtube.com/vi/${record.video}/mqdefault.jpg`}
              alt="Thumbnail"
              className={classes.videoThumbnail}
              onClick={() => openVideoModal(record.video)}
              style={{margin: "auto"}}
              /> 
            </div>
          </section>
        )
      ))}
    </div>
  );

            // <Paper key={key} className={`${classes.helpPaper} ${classes.paperHover}`} onClick={() => openVideoModal(record.video)}>
            //   <img
            //     src={`https://img.youtube.com/vi/${record.video}/mqdefault.jpg`}
            //     alt="Thumbnail"
            //     className={classes.videoThumbnail}
            //   />
            //   <Typography variant="button" className={classes.videoTitle}>
            //     {record.title}
            //   </Typography>
            //   <Typography variant="caption" className={classes.videoDescription}>
            //     {record.description}
            //   </Typography>
            // </Paper>
          // )) : null}
  //       </div>
  //     </>
  //   );
  // };

  return (
    <div style={{
      // height: "100%",
      margin: "auto",
      display: "flex",
      width: "90%",
      fontFamily: "Nunito, Arial, sans-serif",
      gap: "1.2rem"
      }}> 
      <aside className={classes.sidebarContainer} style={{width: "28%", display: "block", justifyContent: "center", maxHeight: "200px"}}>
      <MainHeader style={{display: "flex", flexDirection: "column"}}>
        <Typography style={{fontWeight: "bold", fontSize: "1.875rem", paddingBottom: "0px"}} variant="text">{i18n.t("helps.title")}</Typography>
        <MainHeaderButtonsWrapper></MainHeaderButtonsWrapper>
      </MainHeader>
      <div style={{backgroundColor: "#EFF3F6"}} >
      <Typography style={{fontWeight: "bold", fontSize: "1.5rem", display: "block", textAlign: "left", paddingLeft: "1rem", paddingTop: "18px"}} variant="text">Pesquise a sua pergunta</Typography>
      <Typography style={{fontWeight: "500px", fontSize: "1rem", display: "block", textAlign: "left", paddingLeft: "1rem", paddingBottom: "10px", }} variant="text">Caso não encontre, pode pesquisar na barra abaixo:</Typography>
        <TextField
            // fullWidth
            variant="standard"
            // size="large"
            className={classes.searchInput}
            placeholder={"Pesquisar..."}  
            InputProps={{
              disableUnderline: true,
              
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon style={{ color: "gray" }} />
                </InputAdornment>
              ),
            }}
            />
      </div>
      <div className={classes.titleList}>
      {records.map((record) => (
        <nav key={record.id} style={{ display: "block" }}>
            <div style={{ borderRadius: "10px", padding: "11px", width: "100%", cursor: "pointer"}}>
              <Typography
                variant="text"
                className={classes.videoTitle}
                onClick={() => setActiveContentId(record.id)  } // Atualiza o conteúdo ativo ao clicar
                >
                <a href="#" style={{ color: "#0c2340", textDecoration: "none" }}>{record.title}</a>
              </Typography>
            </div>
          </nav>
        ))}
      </div>
      </aside>
      <div className={classes.mainPaper}>
        {renderHelps()}
      </div>
      {/* rendervideomodal abre o video ao clicar */}
      {renderVideoModal()}
    </div>
  );
};

export default Helps;