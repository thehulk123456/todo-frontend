import React, { useEffect, useState } from "react";
import "./css/style.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import closeIcon from "./images/close-icon.svg";
import checkIcon from "./images/check-icon.svg";
import deleteIcon from "./images/delete-icon.svg";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function App() {
  const [date, setDate] = useState(new Date());

  const [todos, setTodos] = useState([]);

  const [todoTitle, setToDoTitle] = useState("");

  useEffect(() => {
    fetchToDos();
  }, [date]);

  const fetchToDos = async () => {
    try {
      const dateToSend = date.toISOString().split("T")[0];

      const response = await fetch(
        `${API_BASE_URL}/get-todos?date=${dateToSend}`
      );
      const data = await response.json();

      setTodos(data);
    } catch (e) {
      console.error("Error fetching todos:", e);
    }
  };

  const toggleToDoCompleted = async (id, completed) => {
    try {
      await fetch(`${API_BASE_URL}/toggle-todo-complete/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !completed,
        }),
      });

      await fetchToDos();
    } catch (e) {
      console.error("Error updating todo:", e);
    }
  };

  const deleteToDo = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/delete-todo/${id}`, {
        method: "DELETE",
      });

      await fetchToDos();
    } catch (e) {
      console.error("Error deleting todo:", e);
    }
  };

  const handleToDoTitleChange = (e) => {
    setToDoTitle(e.target.value);
  };

  const addToDo = async () => {
    if (todoTitle.trim() === "") {
      alert("Please enter a todo title");
      return;
    }

    try {
      const dateToSend = new Date().toISOString().split("T")[0];

      await fetch(`${API_BASE_URL}/add-todo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: todoTitle,
          date: dateToSend,
        }),
      });

      setToDoTitle("");
      await fetchToDos();
    } catch (e) {
      console.error("Error adding todo:", e);
    }
  };

  return (
    <div className="container">
      <h1 className="todo-title">Todos</h1>
      <div>Date</div>
      <DatePicker
        selected={date}
        onChange={(date) => setDate(date)}
        maxDate={new Date()}
      />

      <div className="todo-add-form">
        <h3>Add new todo</h3>
        <label>Title</label>
        <input
          type="text"
          value={todoTitle}
          onChange={handleToDoTitleChange}
          placeholder="Type your todo"
        />

        <button
          onClick={() => {
            addToDo();
          }}>
          Add todo
        </button>
      </div>

      <div className="todo-list">
        {todos.length > 0 ? (
          todos.map((todo) => (
            <div
              className={`todo-item  ${
                todo.completed ? "todo-item-completed" : ""
              }`}
              key={todo.id}>
              <div className="todo-item-title">{todo.title}</div>
              <div className="todo-actions">
                <div
                  className="todo-icon"
                  onClick={() => {
                    toggleToDoCompleted(todo.id, todo.completed);
                  }}>
                  {todo.completed ? (
                    <img src={closeIcon} />
                  ) : (
                    <img src={checkIcon} />
                  )}
                </div>
                <div
                  className="todo-icon"
                  onClick={() => {
                    deleteToDo(todo.id);
                  }}>
                  <img src={deleteIcon} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>No todos for current date </div>
        )}
      </div>
    </div>
  );
}

export default App;
