import React, {
  useState,
  useEffect,
  useReducer,
  useCallback,
  useContext,
} from "react";
import { toast } from "react-toastify";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import CustomTextField from "../../components/CustomTextField";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";
import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";
import Grid from "@material-ui/core/Grid";
import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import TagModal from "../../components/TagModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import toastError from "../../errors/toastError";
import { Chip } from "@material-ui/core";
import { Tooltip } from "@material-ui/core";
import { SocketContext } from "../../context/Socket/SocketContext";
import { AuthContext } from "../../context/Auth/AuthContext";
import { blue } from "@material-ui/core/colors";

const reducer = (state, action) => {
  if (action.type === "LOAD_TAGS") {
    const tags = action.payload;
    const newTags = [];

    tags.forEach((tag) => {
      const tagIndex = state.findIndex((s) => s.id === tag.id);
      if (tagIndex !== -1) {
        state[tagIndex] = tag;
      } else {
        newTags.push(tag);
      }
    });

    return [...state, ...newTags];
  }

  if (action.type === "UPDATE_TAGS") {
    const tag = action.payload;
    const tagIndex = state.findIndex((s) => s.id === tag.id);

    if (tagIndex !== -1) {
      state[tagIndex] = tag;
      return [...state];
    } else {
      return [tag, ...state];
    }
  }

  if (action.type === "DELETE_TAG") {
    const tagId = action.payload;

    const tagIndex = state.findIndex((s) => s.id === tagId);
    if (tagIndex !== -1) {
      state.splice(tagIndex, 1);
    }
    return [...state];
  }

  if (action.type === "RESET") {
    return [];
  }
};

const useStyles = makeStyles((theme) => ({
  mainPaper: {
    flex: 1,
    padding: theme.spacing(1),
    overflowY: "scroll",
    ...theme.scrollbarStyles,
  },
  "@media (max-width: 600px)": {
    mainPaper: {
      padding: theme.spacing(0.5),
    },
    tableCell: {
      fontSize: "0.8rem",
    },
    button: {
      fontSize: "0.75rem",
      padding: theme.spacing(0.5),
    },
  },
}));

const Tags = () => {
  const classes = useStyles();

  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [deletingTag, setDeletingTag] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [tags, dispatch] = useReducer(reducer, []);
  const [tagModalOpen, setTagModalOpen] = useState(false);

  const fetchTags = useCallback(async () => {
    try {
      const { data } = await api.get("/tags/", {
        params: { searchParam, pageNumber },
      });
      dispatch({ type: "LOAD_TAGS", payload: data.tags });
      setHasMore(data.hasMore);
      setLoading(false);
    } catch (err) {
      toastError(err);
    }
  }, [searchParam, pageNumber]);

  const socketManager = useContext(SocketContext);

  useEffect(() => {
    dispatch({ type: "RESET" });
    setPageNumber(1);
  }, [searchParam]);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      fetchTags();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchParam, pageNumber, fetchTags]);

  useEffect(() => {
    const socket = socketManager.getSocket(user.companyId);

    socket.on("user", (data) => {
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_TAGS", payload: data.tags });
      }

      if (data.action === "delete") {
        dispatch({ type: "DELETE_USER", payload: +data.tagId });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [socketManager, user]);

  const handleOpenTagModal = () => {
    setSelectedTag(null);
    setTagModalOpen(true);
  };

  const handleCloseTagModal = () => {
    setSelectedTag(null);
    setTagModalOpen(false);
  };

  const handleSearch = (event) => {
    setSearchParam(event.target.value.toLowerCase());
  };

  const handleEditTag = (tag) => {
    setSelectedTag(tag);
    setTagModalOpen(true);
  };

  const handleDeleteTag = async (tagId) => {
    try {
      await api.delete(`/tags/${tagId}`);
      toast.success(i18n.t("tags.toasts.deleted"));
    } catch (err) {
      toastError(err);
    }
    setDeletingTag(null);
    setSearchParam("");
    setPageNumber(1);

    dispatch({ type: "RESET" });
    setPageNumber(1);
    await fetchTags();
  };

  const loadMore = () => {
    setPageNumber((prevState) => prevState + 1);
  };

  const handleScroll = (e) => {
    if (!hasMore || loading) return;
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - (scrollTop + 100) < clientHeight) {
      loadMore();
    }
  };

return (
    <MainContainer>
      <ConfirmationModal
        title={deletingTag && `${i18n.t("tags.confirmationModal.deleteTitle")}`}
        open={confirmModalOpen}
        onClose={setConfirmModalOpen}
        onConfirm={() => handleDeleteTag(deletingTag.id)}
      >
        {i18n.t("tags.confirmationModal.deleteMessage")}
      </ConfirmationModal>
      <TagModal
        open={tagModalOpen}
        onClose={handleCloseTagModal}
        reload={fetchTags}
        aria-labelledby="form-dialog-title"
        tagId={selectedTag && selectedTag.id}
      />
      <MainHeader>
        <Grid style={{width: '99.6%'}} container>
        <Grid xs={12} sm={8} md={3} item>
          <Title>{i18n.t("tags.title")}</Title>
        </Grid>
        <MainHeaderButtonsWrapper>
        <Grid xs={12} sm={12} md={9} item>
        <Grid container spacing={2}>
        <Grid item xs={6} sm={8} md={10}>
        <TextField
            placeholder={i18n.t("queueIntegration.searchPlaceholder")}
            color='primary'
            variant="outlined"
            type="search"
            size="small"
            value={searchParam}
            onChange={handleSearch}
            InputProps={{
              style: {
                borderRadius: '20px'
              },
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon style={{ color: "gray"}}/>
                </InputAdornment>
              ),
            }}
          />
          </Grid>
          <Grid item xs={4} sm={4} md={1}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenTagModal}
            style={{borderRadius:'8px'}}
          >
            {i18n.t("tags.buttons.add")}
          </Button>
          </Grid>
          </Grid>
          </Grid>
        </MainHeaderButtonsWrapper>
        </Grid>
      </MainHeader>
      <Paper
        className={classes.mainPaper}
        variant="outlined"
        onScroll={handleScroll}
        style={{
          borderRadius: '5px'
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow style={{borderRadius: '5px',backgroundColor: '#0C2454'}}>
                <TableCell align="center"style={{color: '#FFFFFF',borderRadius: '5px 0px 0px 5px'}}>{i18n.t("tags.table.name")}</TableCell>
                <TableCell align='justify'style={{color: '#FFFFFF'}}>Cores</TableCell>
                <TableCell align="center"style={{color: '#FFFFFF',}}>{i18n.t("tags.table.tickets")}</TableCell>
                {/*Adicionar {i18n.t("tags.table.actions")} para inserir o texto de volta*/ }
                <TableCell align="center"style={{color: '#FFFFFF',borderRadius: '0px 5px 5px 0px'}}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <>
                {tags.map((tag) => (
                  <TableRow key={tag.id}>
                    <TableCell align="center">
                      <Chip
                        variant="default"
                        style={{
                          backgroundColor: '#FFFFFF',
                          color: "black",
                        }}
                        label={tag.name}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                    <Chip
                      style={{backgroundColor: tag.color,borderRadius:'100%',height: '25px'}}
                      />
                    </TableCell>
                    <TableCell align="center">{tag.ticketsCount}</TableCell>
                    <TableCell align="center">
                      <IconButton size="small" onClick={() => handleEditTag(tag)}>
                        <EditIcon />
                      </IconButton>

                      <IconButton
                        size="small"
                        onClick={(e) => {
                          setConfirmModalOpen(true);
                          setDeletingTag(tag);
                        }}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {loading && <TableRowSkeleton columns={4} />}
              </>
            </TableBody>
          </Table>
        </div>
      </Paper>
    </MainContainer>
  );
};

export default Tags;
