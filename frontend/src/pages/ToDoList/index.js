import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start', // Alinhar os itens à esquerda
    margin: '2rem',
  },
  inputContainer: {
    display: 'flex',
    width: '100%',
    marginBottom: '1rem',
  },
  input: {
    flexGrow: 1,
    marginRight: '1rem',
  },
  listContainer: {
    width: '100%',
    height: '80%',
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: '5px',
  },
  list: {

    marginBottom: '5px'
  },
  checkbox: {
    color: '#0C2C4C',
  },
});

const ToDoList = () => {
  const classes = useStyles();

  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleTaskChange = (event) => {
    setTask(event.target.value);
  };

  const handleAddTask = () => {
    if (!task.trim()) {
      return; // Impede que o usuário crie uma tarefa sem texto
    }

    const now = new Date();
    if (editIndex >= 0) {
      const newTasks = [...tasks];
      newTasks[editIndex] = { text: task, updatedAt: now, createdAt: newTasks[editIndex].createdAt };
      setTasks(newTasks);
      setTask('');
      setEditIndex(-1);
    } else {
      setTasks([...tasks, { text: task, createdAt: now, updatedAt: now }]);
      setTask('');
    }
  };

  const handleEditTask = (index) => {
    setTask(tasks[index].text);
    setEditIndex(index);
  };

  const handleDeleteTask = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  return (
    <div className={classes.root}>
      <Typography
        variant="h4"
        style={{ color: '#0C2454', fontWeight: 500, textAlign: 'left' }} //rever o semibold após mudança de fonte!
        className={classes.elementMargin}
      >
        TAREFAS
      </Typography>
      <div className={classes.inputContainer}>
        <TextField
          className={classes.input}
          label="Nova tarefa"
          value={task}
          onChange={handleTaskChange}
          variant="outlined"
          style={{
            backgroundColor: "white", borderRadius: '5px'
          }}
        />
        <Button
          variant="contained"
          style={{
            backgroundColor: "#0C2C4C",
            color: "white",
            borderRadius: "8px",
          }}
          onClick={handleAddTask}
        >
          {editIndex >= 0 ? 'Salvar' : 'Adicionar'}
        </Button>
      </div>
      <div className={classes.listContainer}>
        <List>
          {tasks.map((task, index) => (
            <ListItem key={index} className={classes.list}>
              <Checkbox
                  className={classes.checkbox}
                  size="small" // Tamanho pequeno
                  edge="start"
              />
              <ListItemText primary={task.text} secondary={task.updatedAt.toLocaleString()} />
              <ListItemSecondaryAction>
                <IconButton onClick={() => handleEditTask(index)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteTask(index)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </div>
    </div>
  );
};

export default ToDoList;
