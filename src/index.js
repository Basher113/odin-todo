import "./styles.css"
import { Project} from "./modules/project";
import { Todo } from "./modules/todo";

function DOMEditor() {
    // Form Dom start //
    const formProject = document.querySelector("#project-form");
    const projectCardsContainer = document.querySelector(".project-list");
    const projectObj = Project();

    const updateProjectDisplay = () => {
        const projectPlusButton = document.querySelector(".project-plus");
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
            formProject[0].focus() // focus on creating new project input when plus button is clicked
            
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
            const todoEl = createTodoEl(todo);
            todoListUlElement.appendChild(todoEl);
        })
    }

    const createTodoEl = (todo) => {
        const todoEl = document.createElement("li");
        todoEl.classList.add("todo");
        todoEl.textContent = todo.title + " - " + todo.description;
        return todoEl;
    }

    formTodo.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(formTodo);
        const title = formData.get("title");
        const description = formData.get("description");
        const activeProjectId = projectObj.getActiveProject().id;
        todoObj.addTodo(title, description, activeProjectId);
        formTodo.reset();
        updateTodoDisplay();
    })
    updateTodoDisplay();
    // TODO DISPLAY END //
}

DOMEditor();
