import { useState, useEffect } from "react";
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
  min-height: 100vh;
  flex-direction: column;
`;

const titleStyle = css`
  color: black;
  font-size: 24px;
  width: 300px;
  height: 50px;
  border-radius: 20px;
  background-color: lightBlue;
  margin: 0 auto;
  font-weight: bold;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
`;

const inputContainerStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
`;

const completedTaskStyle = css`
  text-decoration: line-through;
  text-decoration-style: solid;
  text-decoration-thickness: 2px;
  color: black;
`;

const ToDoList = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInfo, setTaskInfo] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  const handleInputChange = (event) => {
    setTaskInfo(event.target.value);
  };

  const addTask = () => {
    if (taskInfo.trim() !== "") {
      const isTaskExists = tasks.some((task) => task.task === taskInfo.trim());

      if (isTaskExists) {
        alert("Task already exists!");
        return;
      }

      const newTask = {
        id: Date.now(),
        task: taskInfo.trim(),
        completed: false,
      };

      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      setTaskInfo("");
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    }
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const markAsCompleted = (taskId) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const updatedTask = { ...task, completed: !task.completed };
        return updatedTask;
      }
      return task;
    });

    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const filterTasks = () => {
    switch (filter) {
      case "completed":
        return tasks.filter((task) => task.completed);
      case "toDo":
        return tasks.filter((task) => !task.completed);
      default:
        return tasks;
    }
  };

  return (
    <div className={containerStyle}>
      <Box className={titleStyle}>To Do List</Box>

      <Box className={inputContainerStyle}>
        <TextField
          id="outlined-basic"
          label="Add a new task here"
          variant="outlined"
          size="small"
          input
          value={taskInfo}
          onChange={handleInputChange}
        />
        <Button variant="outlined" size="large" onClick={addTask}>
          Add Task
        </Button>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        height="40vh"
      >
        <Box>
          <ButtonGroup
            variant="outlined"
            size="medium"
            aria-label="outlined primary button group"
          >
            <Button onClick={() => setFilter("all")}>All Tasks</Button>
            <Button onClick={() => setFilter("completed")}>Completed</Button>
            <Button onClick={() => setFilter("toDo")}>To Do</Button>
          </ButtonGroup>
        </Box>

        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
          {filterTasks().map((task) => (
            <ListItemButton
              component="li"
              href="#simple-list"
              key={task.id}
              disableGutters
            >
              <ListItemIcon>
                <Checkbox
                  checked={task.completed}
                  onChange={() => markAsCompleted(task.id)}
                />
              </ListItemIcon>
              <ListItemText
                primary={task.task}
                primaryTypographyProps={{
                  className: task.completed ? completedTaskStyle : "",
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
          Completed Tasks: {tasks.filter((task) => task.completed).length}
        </Typography>
        <Typography variant="body1" fontWeight="bold">
          Remaining Tasks: {tasks.filter((task) => !task.completed).length}
        </Typography>
      </Box>
    </div>
  );
};

export default ToDoList;
