import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { cx } from "@emotion/css";
import Tooltip from "@mui/material/Tooltip";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import * as React from "react";
import { css } from "@emotion/css";
import CloseIcon from "@mui/icons-material/Close";
import Collapse from "@mui/material/Collapse";
import {
  Typography,
  Box,
  Checkbox,
  TextField,
  Button,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";

const ToDoList = () => {
  const storedTasks = localStorage.getItem("tasks");
  const initialTasks = storedTasks ? JSON.parse(storedTasks) : [];
  const [tasks, setTasks] = useState([...initialTasks]);

  const [inputValue, setInputValue] = useState("");
  const [taskStateFilter, setTaskStateFilter] = useState("all");

  const completedTasks = tasks.filter((task) => task.isCompleted);
  const remainingTasks = tasks.filter((task) => !task.isCompleted);

  const [showEmptyStringAlert, setShowEmptyStringAlert] = useState(false);
  const [showTaskExistsAlert, setShowTaskExistsAlert] = useState(false);

  const addTask = () => {
    if (inputValue.trim() === "") {
      setShowEmptyStringAlert(true);
      return;
    }

    const isTaskExists = tasks.some(
      (task) => task.description === inputValue.trim()
    );

    if (isTaskExists) {
      setShowTaskExistsAlert(true);
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

    setShowEmptyStringAlert(false);
    setShowTaskExistsAlert(false);
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
      <Collapse in={showEmptyStringAlert}>
        <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setShowEmptyStringAlert(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          severity="error"
        >
          <AlertTitle>Error</AlertTitle>Trying to add an empty string!
        </Alert>
      </Collapse>

      <Collapse in={showTaskExistsAlert}>
        <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setShowTaskExistsAlert(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          severity="error"
        >
          <AlertTitle>Error</AlertTitle>Task already exists!
        </Alert>
      </Collapse>
      <Typography variant="h1">To Do List</Typography>
      <Box className={boxStyle}>
        <div>
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
        </div>

        <Box>
          <div
            size="medium"
            aria-label="outlined primary button group"
            className={buttonGroupStyle}
          >
            <Button
              variant="contained"
              onClick={() => setTaskStateFilter(FilterByTaskStateOption.ALL)}
            >
              All Tasks
            </Button>
            <Button
              variant="contained"
              onClick={() =>
                setTaskStateFilter(FilterByTaskStateOption.COMPLETED)
              }
            >
              Completed
            </Button>
            <Button
              variant="contained"
              onClick={() => setTaskStateFilter(FilterByTaskStateOption.TODO)}
            >
              To Do
            </Button>
          </div>
        </Box>

        <List className={listContainerStyle}>
          {filterTasks().map((task) => (
            <ListItemButton component="li" href="#simple-list" key={task.id}>
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
                <Tooltip title="Delete">
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => deleteTask(task.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItemButton>
          ))}
        </List>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="start"
        gap="10px"
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

const containerStyle = css`
  display: flex;
  justify-content: start;
  align-items: start;
  flex-direction: column;
  gap: 30px;
  padding: 20px;

  .css-1qedkg0 {
    width: 99%;
  }

  .css-o2w69a-MuiTypography-root {
    color: #29b6f6;
    font-size: 50px;
    font-weight: bold;
  }
`;

const listContainerStyle = css`
  max-height: 450px;
  overflow-y: auto;
  background-color: #f5f5f5;
  border-radius: 10px;
  width: 100%;
`;

const completedTaskStyle = css`
  text-decoration: line-through solid 2px;
  color: black;
`;

const boxStyle = css`
  display: flex;
  flex-direction: column;
  gap: 30px;

  > div {
    display: flex;
    gap: 30px;
    align-items: center;
  }
`;

const buttonGroupStyle = css`
  display: flex;
  gap: 20px;
`;

const FilterByTaskStateOption = {
  ALL: "all",
  TODO: "toDo",
  COMPLETED: "completed",
};
