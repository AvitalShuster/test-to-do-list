import React, { useState, useEffect } from "react";
//import { css } from "@emotion/react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import DeleteIcon from "@mui/icons-material/Delete";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import { Typography, Box } from "@mui/material";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

import {
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "500px",
  height: "600px",
  backgroundColor: "lightGrey",
  borderRadius: "30px",
  margin: "0 auto",
  marginTop: "30px",
};

const titleStyle = {
  color: "black",
  variant: "h1",
  width: "300px",
  height: "50px",
  //borderRadius: "20px",
  //backgroundColor: "lightBlue",
  margin: "0 auto",
  fontWeight: "bold",
  //justifyContent: "center",
  //alignItems: "center",
};

const inputContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  //height: "40px",
};

/*const taskItemStyle = {
  width: "200px",
  display: "flex",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};*/

const completedTaskStyle = {
  textDecoration: "line-through",
  textDecorationStyle: "solid",
  textDecorationThickness: "2px",
  color: "black",
};

/*const deleteButtonStyle = {
  fontSize: "10px",
  padding: "3px 3px",
};*/

const ToDoList = () => {
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : [];
  });

  const [taskInfo, setTaskInfo] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleInputChange = (event) => {
    setTaskInfo(event.target.value);
  };
  const addTask = () => {
    if (taskInfo.trim() !== "") {
      const newTask = {
        id: Date.now(),
        task: taskInfo,
        completed: false,
      };

      setTasks([...tasks, newTask]);
      setTaskInfo("");
    }
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  const markAsCompleted = (taskId) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
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
    <div sx={containerStyle}>
      <Box sx={titleStyle}>To Do List</Box>

      <Box sx={inputContainerStyle}>
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
              //sx={taskItemStyle}
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
                  sx: task.completed ? completedTaskStyle : null,
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
        //height="40vh"
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
