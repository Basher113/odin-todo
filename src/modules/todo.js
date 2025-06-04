import { setToStorage, getFromStorage } from "../utils/storage";
export function Todo() {
    let todoList = getFromStorage("todoList") || [];

    const addTodo = (title, description, projectId) => {
        const id = crypto.randomUUID();
        todoList.push({id, title, description, projectId})
        setToStorage("todoList", todoList);
    }

    const getTodosByProject = (projectId) => {
        return todoList.filter(todo => todo.projectId === projectId)
    }
    
    return {
        todoList,
        addTodo,
        getTodosByProject
    }
}