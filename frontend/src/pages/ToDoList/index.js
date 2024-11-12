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
import Title from "../../components/Title";
import EditIcon from '@material-ui/icons/Edit';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    margin: '2rem'
  },
  inputContainer: {
    display: 'flex',
    width: '100%',
    marginTop: "1rem",
    marginBottom: '1rem',
    backgroundColor:"white",
    height: '60px',

  },
  input: {
    flexGrow: 1,
    marginRight: '1rem',
    height: '60px',    
    backgroundColor: 'white', 
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'white',  
      '& fieldset': {
        border: 'none',
      },
    },
  },
  listContainer: {
    width: '100%',
    height: '100%',
    marginTop: '1rem',
    backgroundColor: '#E6EDF5',
    borderRadius: '5px',
  },
  listItem: {
    borderRadius: '5px', 
    padding: '10px', 
    marginBottom: '10px',
    backgroundColor: '#fff',
    height: '40px',
  },
  checkbox: {
    color: '#0C2C4C', 
    '&.Mui-checked': {
      color: '#0C2C4C',
    },
    '&.Mui-checked:hover': {
      backgroundColor: 'rgba(12, 44, 76, 0.08)',
    },
    '&:hover': {
      backgroundColor: 'rgba(12, 44, 76, 0.1)',
    },
    '&:active': {
      backgroundColor: '#0C2C4C',
      color: '#fff',
    },
  },
  completedText: {
    color: 'gray',
    textDecoration: "line-through",
  },
}));

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
    if (!task.trim()) return;

    const now = new Date();
    if (editIndex >= 0) {
      const newTasks = [...tasks];
      newTasks[editIndex] = {
        ...newTasks[editIndex],
        text: task,
        updatedAt: now,
      };
      setTasks(newTasks);
      setTask('');
      setEditIndex(-1);
    } else {
      setTasks([...tasks, { text: task, completed: false, createdAt: now, updatedAt: now }]);
      setTask('');
    }
  };

  const handleEditTask = (index) => {
    setTask(tasks[index].text);
    setEditIndex(index);
  };

  const handleDeleteTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  const toggleTaskCompletion = (index) => {
    const updatedTasks = tasks.map((task, i) => 
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  return (
    <div className={classes.root}>
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
    Tarefas ({tasks.length})
  </div>
</Title>
      <div className={classes.inputContainer}>
        <TextField
          className={classes.input}
          label="Nova tarefa"
          value={task}
          onChange={handleTaskChange}
          variant="outlined"
        />
        <Button variant="contained" color="primary" onClick={handleAddTask}>
          {editIndex >= 0 ? 'Salvar' : 'Adicionar'}
        </Button>
      </div>
      <div className={classes.listContainer}>
        <List disablePadding component="div">
          {tasks.map((task, index) => (
            <ListItem key={index} className={classes.listItem}>
              <Checkbox
                className={classes.checkbox}
                size="small"
                edge="start"
                checked={task.completed}
                onChange={() => toggleTaskCompletion(index)}
              />
              <ListItemText
                primary={task.text}
                secondary={task.updatedAt.toLocaleString()}
                className={task.completed ? classes.completedText : ''}
              />
              
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
