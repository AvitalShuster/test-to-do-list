import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
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
  h1 {
    color: #29b6f6;
    font-size: 50px;
    font-weight: bold;
    margin-top: 30px;
  }
`;

const completedTaskStyle = css`
  text-decoration: line-through solid 2px;
  color: black;
`;

const listContainerStyle = css`
  width: 100%;
  max-height: 450px;
  overflow-x: hidden;
  overflow-y: auto;
`;

const ToDoList = () => {
  const [newTaskValue, setNewTaskValue] = useState(() => {
    const storedTasks = localStorage.getItem("newTaskValue");
    return storedTasks ? JSON.parse(storedTasks) : [];
  });

  const [inputValue, setInputValue] = useState("");
  const [taskState, associateTaskState] = useState("all");

  const addTask = () => {
    if (inputValue.trim() === "") {
      alert("Trying to add an empty string!");
      return;
    }

    const isTaskExists = newTaskValue.some(
      (task) => task.task === inputValue.trim()
    );

    if (isTaskExists) {
      alert("Task already exists!");
      return;
    }

    const newTask = {
      id: Date.now(),
      task: inputValue.trim(),
      isCompleted: false,
    };

    const updatedTasks = [...newTaskValue, newTask];
    setNewTaskValue(updatedTasks);
    setInputValue("");
    localStorage.setItem("newTaskValue", JSON.stringify(updatedTasks));
  };

  const deleteTask = (taskId) => {
    const updatedTasks = newTaskValue.filter((task) => task.id !== taskId);
    setNewTaskValue(updatedTasks);
    localStorage.setItem("newTaskValue", JSON.stringify(updatedTasks));
  };

  const filterTasks = () => {
    if (taskState === "isCompleted")
      return newTaskValue.filter((task) => task.isCompleted);
    if (taskState === "toDo")
      return newTaskValue.filter((task) => !task.isCompleted);
    return newTaskValue;
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
            <Button onClick={() => associateTaskState("all")}>All Tasks</Button>
            <Button onClick={() => associateTaskState("completed")}>
              Completed
            </Button>
            <Button onClick={() => associateTaskState("toDo")}>To Do</Button>
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
                  onChange={() => {
                    const updatedTasks = newTaskValue.map((t) =>
                      t.id === task.id
                        ? { ...t, isCompleted: !t.isCompleted }
                        : t
                    );
                    setNewTaskValue(updatedTasks);
                    localStorage.setItem(
                      "newTaskValue",
                      JSON.stringify(updatedTasks)
                    );
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={task.task}
                primaryTypographyProps={{
                  className: task.isCompleted ? completedTaskStyle : "",
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
          Total Tasks: {newTaskValue.length}
        </Typography>
        <Typography variant="body1" fontWeight="bold">
          Completed Tasks:{" "}
          {newTaskValue.filter((task) => task.isCompleted).length}
        </Typography>
        <Typography variant="body1" fontWeight="bold">
          Remaining Tasks:{" "}
          {newTaskValue.filter((task) => !task.isCompleted).length}
        </Typography>
      </Box>
    </div>
  );
};

export default ToDoList;
