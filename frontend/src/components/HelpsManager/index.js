import React, { useState, useEffect } from "react";
import {
    makeStyles,
    Paper,
    Grid,
    TextField,
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    IconButton
} from "@material-ui/core";
import { Formik, Form, Field } from 'formik';
import ButtonWithSpinner from "../ButtonWithSpinner";
import ConfirmationModal from "../ConfirmationModal";

import { Edit as EditIcon } from "@material-ui/icons";

import { toast } from "react-toastify";
import useHelps from "../../hooks/useHelps";


const useStyles = makeStyles(theme => ({
    root: {
        width: '100%'
    },
    mainPaper: {
        backgroundColor: "#e6edf5",
        width: '100%',
        flex: 1,
        padding: theme.spacing(2)
    },
    fullWidth: {
        width: '100%'
    },
    tableContainer: {
        backgroundColor: "#D0DEED",
        width: '100%',
        overflowX: "scroll",
        ...theme.scrollbarStyles
    },
    textfield: {
        width: "100%",
        backgroundColor: "white",
        borderRadius: "5px",
        padding: "1px",
    },
    textRight: {
        textAlign: 'right'
    },
    row: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2)
    },
    control: {
        paddingRight: theme.spacing(1),
        paddingLeft: theme.spacing(1)
    },
    buttonContainer: {
        textAlign: 'right',
        padding: theme.spacing(1)
    },
    selectField: {
        backgroundColor: "#ffffff", 
        borderRadius: "4px",
        padding: "10px",
    },
}));

export function HelpManagerForm (props) {
    const { onSubmit, onDelete, onCancel, initialValue, loading } = props;
    const classes = useStyles();

    const [record, setRecord] = useState(initialValue);

    useEffect(() => {
        setRecord(initialValue);
    }, [initialValue]);

    const handleSubmit = async(data) => {
        onSubmit(data);
    };

    return (
        <Formik
            enableReinitialize
            className={classes.fullWidth}
            initialValues={record}
            onSubmit={(values, { resetForm }) =>
                setTimeout(() => {
                    handleSubmit(values);
                    resetForm();
                }, 500)
            }
        >
            {(values) => (
                <Form className={classes.fullWidth}>
                    <Grid container spacing={2}>
                        {/* Linha para Título e Código do Vídeo */}
                        <Grid item xs={12} sm={6} md={6}>
                            <Field
                                as={TextField}
                                label="Título"
                                name="title"
                                variant="outlined"
                                className={`${classes.fullWidth} ${classes.textfield}`}
                                margin="dense"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                            <Field
                                as={TextField}
                                label="Código do Vídeo"
                                name="video"
                                variant="outlined"
                                className={`${classes.fullWidth} ${classes.textfield}`}
                                margin="dense"
                            />
                        </Grid>

                        {/* Linha para Descrição */}
                        <Grid item xs={12}>
                            <Field
                                as={TextField}
                                label="Descrição"
                                name="description"
                                variant="outlined"
                                multiline
                                rows={8}  // Define o número de linhas visíveis
                                className={`${classes.fullWidth} ${classes.textfield}`}
                                margin="dense"
                            />
                        </Grid>

                        {/* Botões */}
                        <Grid item sm={3} md={1}>
                            <ButtonWithSpinner className={classes.fullWidth} loading={loading} onClick={() => onCancel()} color="primary">
                                Limpar
                            </ButtonWithSpinner>
                        </Grid>
                        { record.id !== undefined ? (
                            <Grid item sm={3} md={1}>
                                <ButtonWithSpinner className={classes.fullWidth} loading={loading} onClick={() => onDelete(record)} variant="contained" color="secondary">
                                    Excluir
                                </ButtonWithSpinner>
                            </Grid>
                        ) : null }
                        <Grid item sm={3} md={1}>
                            <ButtonWithSpinner className={classes.fullWidth} loading={loading} type="submit" variant="contained" color="primary">
                                Salvar
                            </ButtonWithSpinner>
                        </Grid>
                    </Grid>
                </Form>
            )}
        </Formik>
    );
}

export function HelpsManagerGrid (props) {
    const { records, onSelect } = props;
    const classes = useStyles();

    return (
        <Paper className={classes.tableContainer}>
            <Table className={classes.fullWidth} size="small" aria-label="a dense table">
                <TableHead>
                <TableRow>
                    <TableCell align="center" style={{width: '1%'}}>#</TableCell>
                    <TableCell align="left">Título</TableCell>
                    <TableCell align="left">Descrição</TableCell>
                    <TableCell align="left">Vídeo</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {records.map((row) => (
                    <TableRow key={row.id}>
                        <TableCell align="center" style={{width: '1%'}}>
                            <IconButton onClick={() => onSelect(row)} aria-label="edit">
                                <EditIcon />
                            </IconButton>
                        </TableCell>
                        <TableCell align="left">{row.title || '-'}</TableCell>
                        <TableCell align="left">{row.description || '-'}</TableCell>
                        <TableCell align="left">{row.video || '-'}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </Paper>
    );
}

export default function HelpsManager () {
    const classes = useStyles();
    const { list, save, update, remove } = useHelps();
    
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [records, setRecords] = useState([]);
    const [record, setRecord] = useState({
        title: '',
        description: '',
        video: ''
    });

    useEffect(() => {
        async function fetchData () {
            await loadHelps();
        }
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadHelps = async () => {
        setLoading(true);
        try {
            const helpList = await list();
            setRecords(helpList);
        } catch (e) {
            toast.error('Não foi possível carregar a lista de registros');
        }
        setLoading(false);
    };

    const handleSubmit = async (data) => {
        setLoading(true);
        try {
            if (data.id !== undefined) {
                await update(data);
            } else {
                await save(data);
            }
            await loadHelps();
            handleCancel();
            toast.success('Operação realizada com sucesso!');
        } catch (e) {
            toast.error('Não foi possível realizar a operação. Verifique se já existe uma ajuda com o mesmo nome ou se os campos foram preenchidos corretamente');
        }
        setLoading(false);
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            await remove(record.id);
            await loadHelps();
            handleCancel();
            toast.success('Operação realizada com sucesso!');
        } catch (e) {
            toast.error('Não foi possível realizar a operação');
        }
        setLoading(false);
    };

    const handleOpenDeleteDialog = () => {
        setShowConfirmDialog(true);
    };

    const handleCancel = () => {
        setRecord({
            title: '',
            description: '',
            video: ''
        });
    };

    const handleSelect = (data) => {
        setRecord({
            id: data.id,
            title: data.title || '',
            description: data.description || '',
            video: data.video || ''
        });
    };

    return (
        <Paper className={classes.mainPaper} elevation={0}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <HelpManagerForm 
                        initialValue={record} 
                        onDelete={handleOpenDeleteDialog} 
                        onSubmit={handleSubmit} 
                        onCancel={handleCancel} 
                        loading={loading}
                    />
                </Grid>
                <Grid item xs={12}>
                    <HelpsManagerGrid 
                        records={records}
                        onSelect={handleSelect}
                    />
                </Grid>
            </Grid>
            <ConfirmationModal
                title="Exclusão de Registro"
                open={showConfirmDialog}
                onClose={() => setShowConfirmDialog(false)}
                onConfirm={() => handleDelete()}
            >
                Deseja realmente excluir esse registro?
            </ConfirmationModal>
        </Paper>
    );
}
