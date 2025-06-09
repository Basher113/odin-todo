import { setToStorage, getFromStorage } from "./utils/storage";
import { activeProject } from "./project";
import { format } from "date-fns";

import EditSvg from "./assets/edit.svg";
import TrashSvg from "./assets/trash.svg";
export function Todo() {
    let todoList = getFromStorage("todoList") || [];

    const getTodosByProject = (projectId) => {
        return todoList.filter(todo => todo.projectId === projectId);
    }

    const getTodoById = (todoId) => todoList.find(todo => todo.id === todoId);

    const addTodo = (title, description, dueDate, projectId, isFinished=false) => {
        const id = crypto.randomUUID();
        todoList.push({id, title, description, dueDate, isFinished, projectId});
        setToStorageTodo();
    }

    const editTodo = (todoId, newTitle, newDescription, newDate) => {
        const index = todoList.findIndex(todo => todo.id === todoId);
        todoList[index].title = newTitle;
        todoList[index].description = newDescription;
        todoList[index].dueDate = newDate;
        setToStorageTodo();
    }

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
        getTodoById,
        getTodosByProject,
        addTodo,
        editTodo,
        deleteTodo,
        finishTodo,
    }
}

const todoObj = Todo();
const todoListUlElement = document.querySelector(".todo-list");
const formModal = document.querySelector("#form-modal");
const todoForm = document.querySelector("#todo-form");
const addTodoButton = document.querySelector(".add-todo-button");
const todoHeader = document.querySelector(".todo-header");
let isEditing = false;
let todoToEdit = null;

export const createTodoElement = (todo) => {
    const completeButton = document.createElement('button');
    completeButton.className = 'complete-todo-button';
    completeButton.setAttribute("data-todo-id", todo.id)
    if (todo.isFinished) {
        completeButton.setAttribute('aria-label', 'Mark as complete');
        completeButton.classList.add("complete")
        completeButton.textContent = "✔"
    }
    const titleDiv = document.createElement("div");
    titleDiv.classList.add("todo-title");
    titleDiv.textContent = todo.title;

    const dateDiv = document.createElement("div");
    dateDiv.classList.add("todo-date");
    dateDiv.textContent = format(todo.dueDate, "MMM dd");
    console.log(todo)
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

const listenEditTodo = () => {
    // Listens for edit todo when edit icon is clicked
    const editIcons = document.querySelectorAll(".edit-icon");
    editIcons.forEach(editIcon => {
        editIcon.addEventListener("click", () => {
            const todoId = editIcon.dataset.todoId;
            const todo = todoObj.getTodoById(todoId);
            isEditing = true;
            todoToEdit = todo;
            showFormModal()
        })
    })
}

const showFormModal = () => {
    const closeModalButton = document.querySelector(".close");
    const titleInput = document.querySelector("#title-input");
    const descriptionInput = document.querySelector("#description-input");
    const todoSubmitButton = document.querySelector(".todo-submit-button");

    if (isEditing && todoToEdit) {
        titleInput.value = todoToEdit.title;
        descriptionInput.value = todoToEdit.description;
        todoSubmitButton.textContent = "Edit Todo"
    } 

    formModal.style.display = "flex";
    closeModalButton.addEventListener("click", () => {
        formModal.style.display = "none";
        isEditing = false;
        todoToEdit = null;
        todoForm.reset();
    })
}

todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(todoForm);
    const title = formData.get("title");
    const description = formData.get("description");
    const dueDate = formData.get("date")
    if (isEditing && todoToEdit) {
        todoObj.editTodo(todoToEdit.id, title, dueDate, description);
        isEditing = false;
        todoToEdit = null;
    } else {
        todoObj.addTodo(title, description, dueDate, activeProject.id);
    }

    formModal.style.display = "none";
    todoForm.reset();
    updateTodoDisplay();
})

addTodoButton.addEventListener("click", () => {
    showFormModal()
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
