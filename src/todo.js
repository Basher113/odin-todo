import { setToStorage, getFromStorage } from "./utils/storage";
import { activeProject } from "./project";

import EditSvg from "./assets/edit.svg";
import TrashSvg from "./assets/trash.svg";
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
        deleteTodo,
        getTodosByProject,
        finishTodo,
        getTodoById
    }
}

const todoObj = Todo();
const todoListUlElement = document.querySelector(".todo-list");
const formModal = document.querySelector("#form-modal");
const todoForm = document.querySelector("#todo-form");
const addTodoButton = document.querySelector(".add-todo-button");
const todoHeader = document.querySelector(".todo-header");

export const createTodoElement = (todo) => {
    const completeButton = document.createElement('button');
    completeButton.className = 'complete-todo-button';
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
    dateDiv.textContent = todo.date || "June 8";

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

const listenEditTodo = () => {
    // Listens for edit todo when edit icon is clicked
    const editIcons = document.querySelectorAll(".edit-icon");
    editIcons.forEach(editIcon => {
        editIcon.addEventListener("click", () => {
            const todoId = editIcon.dataset.todoId;
            const todo = todoObj.getTodoById(todoId);
        })
    })
}

const listenCompleteTodo = () => {
    // Listens for completing todo when the complete button is clicked
    const completeButtons = document.querySelectorAll(".complete-todo-button"); 
    completeButtons.forEach(completeButton => {
        completeButton.addEventListener("click", () => {
            const todoId = completeButton.dataset.todoId;
            todoObj.finishTodo(todoId);
            updateTodoDisplay();
        })
    })
}

const listenDeleteTodo = () => {
    // Listen for deleting todo when the delete icon is clicked
    const deleteIcons = document.querySelectorAll(".delete-icon");
    deleteIcons.forEach(deleteIcon => {
        deleteIcon.addEventListener("click", () => {
            const todoId = deleteIcon.dataset.todoId;
            todoObj.deleteTodo(todoId);
            updateTodoDisplay();
        })
    })   
}

addTodoButton.addEventListener("click", () => {
    formModal.style.display = "flex";
    const closeModalButton = document.querySelector(".close");
    closeModalButton.addEventListener("click", () => {
        formModal.style.display = "none";
    })
        
})

todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(todoForm);
    const title = formData.get("title");
    const description = formData.get("description");
    todoObj.addTodo(title, description, activeProject.id);
    formModal.style.display = "none";
    todoForm.reset();
    updateTodoDisplay();
})

export const updateTodoDisplay = () => {
    const todosByActiveProject = todoObj.getTodosByProject(activeProject.id); // get the todo list for active project
    todoListUlElement.textContent = "";

    todosByActiveProject.forEach(todo => {
        const todoEl = createTodoElement(todo);
        todoListUlElement.appendChild(todoEl);
    })

    if (todosByActiveProject.length > 0) {
        todoHeader.textContent = activeProject.name + "'s Todo List ";
    } else {
        todoHeader.textContent = "Add a todo for " + activeProject.name + "-- No todo list yet."
    }

    listenEditTodo()
    listenCompleteTodo()
    listenDeleteTodo()
}
