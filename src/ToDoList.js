import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { cx } from "@emotion/css";
import { css } from "@emotion/css";
import {
  Typography,
  Box,
  Checkbox,
  TextField,
  ButtonGroup,
  Button,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";

const containerStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 30px;
  .css-o2w69a-MuiTypography-root {
    color: #29b6f6;
    font-size: 50px;
    font-weight: bold;
    margin-top: 30px;
  }
`;

const listContainerStyle = css`
  width: 100%;
  max-height: 450px;
  overflow-x: hidden;
  overflow-y: auto;
`;

const completedTaskStyle = css`
  text-decoration: line-through solid 2px;
  color: black;
`;

const FilterByTaskStateOption = {
  ALL: "all",
  TODO: "toDo",
  COMPLETED: "completed",
};

const ToDoList = () => {
  const storedTasks = localStorage.getItem("tasks");
  const initialTasks = storedTasks ? JSON.parse(storedTasks) : [];
  const [tasks, setTasks] = useState([...initialTasks]);

  const [inputValue, setInputValue] = useState("");
  const [taskStateFilter, setTaskStateFilter] = useState("all");

  const completedTasks = tasks.filter((task) => task.isCompleted);
  const remainingTasks = tasks.filter((task) => !task.isCompleted);

  const addTask = () => {
    if (inputValue.trim() === "") {
      alert("Trying to add an empty string!");
      return;
    }

    const isTaskExists = tasks.some(
      (task) => task.description === inputValue.trim()
    );

    if (isTaskExists) {
      alert("Task already exists!");
      return;
    }

    const newTask = {
      id: Date.now(),
      description: inputValue.trim(),
      isCompleted: false,
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    setInputValue("");
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const markAsCompleted = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const filterTasks = () => {
    if (taskStateFilter === FilterByTaskStateOption.COMPLETED)
      return completedTasks;
    if (taskStateFilter === FilterByTaskStateOption.TODO) return remainingTasks;
    return tasks;
  };

  return (
    <div className={containerStyle}>
      <Typography variant="h1">To Do List</Typography>
      <Box>
        <TextField
          id="outlined-basic"
          label="Add a new task here"
          variant="outlined"
          size="small"
          input
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
        />
        <Button variant="outlined" size="large" onClick={addTask}>
          Add Task
        </Button>

        <Box display="flex" flexDirection="column" alignItems="center">
          <ButtonGroup
            variant="outlined"
            size="medium"
            aria-label="outlined primary button group"
          >
            <Button
              onClick={() => setTaskStateFilter(FilterByTaskStateOption.ALL)}
            >
              All Tasks
            </Button>
            <Button
              onClick={() =>
                setTaskStateFilter(FilterByTaskStateOption.COMPLETED)
              }
            >
              Completed
            </Button>
            <Button
              onClick={() => setTaskStateFilter(FilterByTaskStateOption.TODO)}
            >
              To Do
            </Button>
          </ButtonGroup>
        </Box>

        <List className={listContainerStyle}>
          {filterTasks().map((task) => (
            <ListItemButton
              component="li"
              href="#simple-list"
              key={task.id}
              disableGutters
            >
              <ListItemIcon>
                <Checkbox
                  checked={task.isCompleted}
                  onChange={() => markAsCompleted(task.id)}
                />
              </ListItemIcon>
              <ListItemText
                primary={task.description}
                primaryTypographyProps={{
                  className: cx(task.isCompleted && completedTaskStyle),
                }}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => deleteTask(task.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItemButton>
          ))}
        </List>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="body1" fontWeight="bold">
          Total Tasks: {tasks.length}
        </Typography>
        <Typography variant="body1" fontWeight="bold">
          Completed Tasks: {completedTasks.length}
        </Typography>
        <Typography variant="body1" fontWeight="bold">
          Remaining Tasks: {tasks.length - completedTasks.length}
        </Typography>
      </Box>
    </div>
  );
};

export default ToDoList;
