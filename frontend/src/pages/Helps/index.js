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
    maxHeight: "100vh",
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    boxSizing: "border-box",

  },
  searchInput: {
    width: '100%', // ou ajuste a largura desejada
    maxWidth: '90%', // largura máxima para limitar no contêiner
    borderRadius: 8,
    margin: '0 auto', // centraliza horizontalmente no contêiner
    marginBottom: theme.spacing(2),
    backgroundColor: 'white',
    padding: theme.spacing(1),
    display: 'flex',
    justifyContent: 'center',
  },
  titleList: {
    overflowY: 'auto',
    maxHeight: '100vh',
    padding: theme.spacing(1),
    flex: 1,
    height: "calc(62vh + 7px)",
    backgroundColor: "#EFF3F6",
    "&::-webkit-scrollbar": {
      width: "7px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#232323",
      borderRadius: "20px",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "transparent",
    },
    "&::-webkit-scrollbar-button": {
      display: "none",
    },
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
    "&::-webkit-scrollbar": {
      width: "8px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "transparent",
      borderRadius: "20px",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "transparent",
    },
  },
  mainPaper: {
    width: '100%',
    display: "flex",
    flexDirection: "row",
    height: "94vh",
    flex: "2",
  },
  helpPaper: {
    position: 'relative',
    width: '100%',
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
    width: '60%',
    objectFit: 'cover',
    borderRadius: '15px',
  },
  videoTitle: {
    marginTop: theme.spacing(1),
    flex: 1,
    display: "block",
    fontSize: "1rem",
    fontWeight: "520",
    color: "black"
  },
  videoDescription: {
    overflow: 'hidden',
    paddingBottom: "250px",
    textAlign: "center",
    whiteSpace: 'pre-line',
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
const getYouTubeVideoId = (url) => {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === "youtu.be") {
      // Caso seja um link encurtado, retorna o path após "/"
      return urlObj.pathname.slice(1);
    } else if (urlObj.hostname.includes("youtube.com")) {
      // Caso seja um link típico do YouTube, retorna o parâmetro "v"
      return urlObj.searchParams.get("v");
    }
    return null; // Retorna null se não for um link válido do YouTube
  } catch (error) {
    console.error("Invalid URL:", error);
    return null;
  }
};

// Exemplos de uso:
console.log(getYouTubeVideoId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")); // "dQw4w9WgXcQ"
console.log(getYouTubeVideoId("https://youtu.be/dQw4w9WgXcQ")); // "dQw4w9WgXcQ"

const Helps = () => {
  const classes = useStyles();
  const [records, setRecords] = useState([]);
  const { list } = useHelps();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [activeContentId, setActiveContentId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para o termo de pesquisa

  useEffect(() => {
    async function fetchData() {
      const helps = await list();
      setRecords(helps);
    }
    fetchData();
  }, []);

  const openVideoModal = (video) => {
    setSelectedVideo(video);
  };
  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  // Manipulador de busca
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filtra os registros com base no termo de busca
  const filteredRecords = records.filter(record =>
    record.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      {filteredRecords.map((record, key) => ( // Usa filteredRecords para exibir os itens filtrados
        activeContentId === record.id && (
          <section key={key} className="content-item active" style={{width: "100%", justifyContent: "center"}}>
            <Typography style={{margin: "auto"}} variant="h4" className={classes.titleItem}>{record.title}</Typography>
            <Typography style={{fontSize: "1rem"}} variant="text" className={classes.videoDescription}>{record.description}</Typography>
            <div style={{display: "flex", justifyContent: "center", alignContent: "center", marginTop: "30px"}}>
              <img
                src={`https://img.youtube.com/vi/${getYouTubeVideoId(record.video)}/mqdefault.jpg`}
                alt="Thumbnail"
                className={classes.videoThumbnail}
                onClick={() => openVideoModal(getYouTubeVideoId(record.video)
                )}
                style={{margin: "auto"}}
              /> 
            </div>
          </section>
        )
      ))}
    </div>
  );

  return (
    <div style={{
      margin: "auto",
      display: "flex",
      width: "90%",
      fontFamily: "Nunito, Arial, sans-serif",
      gap: "1.2rem"
    }}> 
      <aside className={classes.sidebarContainer} style={{width: "28%", display: "block", justifyContent: "center", maxHeight: "200px"}}>
        <MainHeader style={{display: "flex", flexDirection: "column"}}>
          <Typography style={{fontWeight: "bold", fontSize: "1.875rem", paddingBottom: "60px"}} variant="text">{i18n.t("helps.title")}</Typography>
          <MainHeaderButtonsWrapper></MainHeaderButtonsWrapper>
        </MainHeader>
        <div style={{backgroundColor: "#EFF3F6",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderTopLeftRadius: "20px", borderTopRightRadius: "20px"}}>
          <Typography style={{fontWeight: "bold", fontSize: "1.5rem", display: "block", textAlign: "left", paddingLeft: "1rem", paddingTop: "18px"}} variant="text">Pesquise a sua pergunta</Typography>
          <Typography style={{fontWeight: "500px", fontSize: "1rem", display: "block", textAlign: "center", paddingLeft: "1rem", paddingBottom: "10px"}} variant="text">Caso não encontre, pode pesquisar na barra abaixo:</Typography>
          <TextField
            variant="standard"
            className={classes.searchInput}
            placeholder="Pesquisar..."
            value={searchTerm} // Adiciona o valor de searchTerm ao campo de pesquisa
            onChange={handleSearchChange} // Chama handleSearchChange ao digitar
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
          {filteredRecords.map((record) => ( // Usa filteredRecords para mostrar apenas os itens filtrados na barra lateral
            <nav key={record.id} style={{ display: "block" }}>
              <div style={{ borderRadius: "10px", padding: "11px", width: "100%", cursor: "pointer", backgroundColor: selectedId === record.id ? "#BEBEBE" : "transparent", display: "flex", alignItems: "center"}}>
                <Typography
                  variant="text"
                  className={classes.videoTitle}
                  onClick={() => {
                    setActiveContentId(record.id);
                    setSelectedId(record.id);  
                  }}
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
      {renderVideoModal()}
    </div>
  );
};

export default Helps;
