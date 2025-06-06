import { setToStorage, getFromStorage } from "../utils/storage";

import EditSvg from "../assets/edit.svg";
import TrashSvg from "../assets/trash.svg";
export function Todo() {
    let todoList = getFromStorage("todoList") || [];

    const addTodo = (title, description, projectId, isFinished=false) => {
        const id = crypto.randomUUID();
        todoList.push({id, title, description, isFinished, projectId});
        setToStorageTodo();
    }

    const getTodosByProject = (projectId) => {
        return todoList.filter(todo => todo.projectId === projectId);
    }

    const getTodoById = (todoId) => todoList.find(todo => todo.id === todoId);

    const deleteTodo = (todoId) => {
        const newList = todoList.filter(todo => todo.id !== todoId);
        todoList = newList;
        setToStorageTodo()
    }

    const finishTodo = (todoId) => {
        const index = todoList.findIndex(todo => todo.id === todoId);
        todoList[index].isFinished = !todoList[index].isFinished
        setToStorageTodo();
    }

    const setToStorageTodo = () => {
        setToStorage("todoList", todoList);
    }
    
    return {
        todoList,
        addTodo,
        editTodo,
        deleteTodo,
        getTodosByProject,
        finishTodo,
        getTodoById
    }
}

export const createTodoElement = (todo) => {
    if (!todo) return;
    const completeButton = document.createElement('button');
    completeButton.className = 'complete-task-button';
    completeButton.setAttribute("data-todo-id", todo.id)
    if (todo.isFinished) {
        completeButton.setAttribute('aria-label', 'Mark as complete');
        completeButton.classList.add("complete")
    }
    const titleDiv = document.createElement("div");
    titleDiv.classList.add("todo-title");
    titleDiv.textContent = todo.title;

    const dateDiv = document.createElement("div");
    dateDiv.classList.add("todo-date");
    dateDiv.textContent = todo.date;

    const editIcon = document.createElement('img');
    editIcon.setAttribute("data-todo-id", todo.id)
    editIcon.className = "edit-icon"
    editIcon.src = EditSvg;
    editIcon.alt = 'Edit task';
    editIcon.title = 'Edit';

    const deleteIcon = document.createElement('img');
    deleteIcon.setAttribute("data-todo-id", todo.id)
    deleteIcon.className = "delete-icon";
    deleteIcon.src = TrashSvg;
    deleteIcon.alt = 'Delete task';
    deleteIcon.title = 'Delete';

    const todoIcons = document.createElement('div');
    todoIcons.className = 'todo-icons';
    todoIcons.appendChild(editIcon);
    todoIcons.appendChild(deleteIcon);

    const todoCard = document.createElement('div');
    todoCard.className = 'todo-card';
    todoCard.appendChild(completeButton);
    todoCard.appendChild(titleDiv);
    todoCard.appendChild(dateDiv);
    todoCard.appendChild(todoIcons);

    return todoCard
}