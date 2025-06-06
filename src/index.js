import "./styles.css"
import { Project} from "./modules/project";
import { Todo, createTodoElement } from "./modules/todo";

function DOMEditor() {
    // Form Dom start //
    const projectObj = Project();
    const formProject = document.querySelector("#project-form");
    const projectCardsContainer = document.querySelector(".project-list");
    const projectPlusButton = document.querySelector(".project-plus");

    const updateProjectDisplay = () => {
        const projects = projectObj.getProjects();

        projectCardsContainer.textContent = "";
        projects.forEach((project) => {
            const projectCard = createProjectCard(project);
            projectCardsContainer.appendChild(projectCard);

            // add class for active-project for styling 
            projectObj.isActiveProject(project.id) ? projectCard.classList.add("active-project") : projectCard.classList.remove("active-project")
        })
        
        // update active project when the element of project is clicked
        const projectCards = document.querySelectorAll(".project-card");
        projectCards.forEach((projectCard) => {
            projectCard.addEventListener("click", () => {
                const projectId = projectCard.dataset.projectId;
                projectObj.setActiveProject(projectId);
                updateProjectDisplay();
                updateTodoDisplay(); // update the todo display also to get the todo list from the active project
            })
        })

        projectPlusButton.addEventListener("click", () => {
            formProject.classList.add("visible");
            formProject[0].focus() // focus to new project input when plus button is clicked
        })
    }

    const createProjectCard = (project) => {
        const projectEl = document.createElement("li");
        projectEl.classList.add("project-card");
        projectEl.setAttribute("data-project-id", project.id);
        projectEl.textContent = project.name;
        return projectEl;
    }

    // create a project when user submit the form
    formProject.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(formProject);
        const name = formData.get("project-name");
        
        projectObj.addProject(name);
        updateProjectDisplay();
        formProject.reset(); // reset the form
        formProject.classList.remove("visible");
    });

    updateProjectDisplay();
    // PROJECT DISPLAY END // 

    // TODO DISPLAY START //
    const todoObj = Todo();
    const todoListUlElement = document.querySelector(".todo-list");
    const formTodo = document.querySelector("#todo-form");

    const updateTodoDisplay = () => {
        const activeProject = projectObj.getActiveProject()
        const todosByActiveProject = todoObj.getTodosByProject(activeProject.id);
        todoListUlElement.textContent = "";

        todosByActiveProject.forEach(todo => {
            const todoEl = createTodoElement(todo);
            todoListUlElement.appendChild(todoEl);
        })

        const completeButtons = document.querySelectorAll(".complete-task-button");
        completeButtons.forEach(completeButton => {
            completeButton.addEventListener("click", () => {
                const todoId = completeButton.dataset.todoId;
                todoObj.finishTodo(todoId);
                updateTodoDisplay();
            })
        })

        const editIcons = document.querySelectorAll(".edit-icon");
        editIcons.forEach(editIcon => {
            editIcon.addEventListener("click", () => {
                const todoId = editIcon.dataset.todoId;
                const todo = todoObj.getTodoById(todoId);
                openFormModal(todo);
            })
        })
    }

    const openFormModal = (todo=null) => {
        formModal.style.display = "flex";
        if (todo) {
            document.querySelector("input[name='title']").value = todo.title;
            document.querySelector("textarea").value = todo.description 
            document.querySelector(".todo-submit-button").textContent = "Update"
        }

        formTodo.addEventListener("submit", (e) => {
            e.preventDefault();
            const formData = new FormData(formTodo);
            const title = formData.get("title");
            const description = formData.get("description");
            const activeProjectId = projectObj.getActiveProject().id;
            console.log(title, description, activeProjectId)
            todoObj.addTodo(title, description, activeProjectId);
            formTodo.reset();
            updateTodoDisplay();
        })
    }

    // Get the modal
    var formModal = document.querySelector("#form-modal");

    // Get the button that opens the modal
    var addTodoButton = document.querySelector(".add-todo-button");

    // Get the <span> element that closes the modal
    var closeButton = document.querySelector(".close");

    // When the user clicks the button, open the modal 
    addTodoButton.onclick = function() {
        openFormModal()
    }

    // When the user clicks on <span> (x), close the modal
    closeButton.onclick = function() {
        formModal.style.display = "none";
    }

    
    updateTodoDisplay();


    // TODO DISPLAY END //
}

DOMEditor();
