import { setToStorage, getFromStorage } from "./utils/storage";
import { updateTodoDisplay } from "./todo";

export function Project() {
    // factoral function for project
    let projects = []; // 
    const getProjects = () => projects;

    const addProject = (name) => {
        const id = crypto.randomUUID();
        projects.push({id, name});
        setToStorage("projects", projects);
    }

    const setProjects = () => {
        const storedProjects = getFromStorage("projects");
        if (storedProjects) {
            projects = storedProjects;
        } else {
            addProject("default"); // add default project if no projects in storage
        }
    }

    setProjects(); // call to update the projects

    let activeProject = projects[0];
    const getActiveProject = () => activeProject;
    const setActiveProject = (projectId) => {
        const index = projects.findIndex(project => project.id === projectId);
        return activeProject = projects[index];
    }

    const isActiveProject = (projectId) => {
        return activeProject.id === projectId
    }

    return {
        getProjects,
        addProject,
        setProjects,
        getActiveProject,
        setActiveProject,
        isActiveProject
    }
}

export const projectObj = Project();
export let activeProject = projectObj.getActiveProject();
const formProject = document.querySelector("#project-form");
const projectListContainer = document.querySelector(".project-list");
const projectPlusButton = document.querySelector(".project-plus");

const createProjectElement = (project) => {
    // Create the project element
    const projectEl = document.createElement("li");
    projectEl.classList.add("project-element");
    projectEl.setAttribute("data-project-id", project.id);
    projectEl.textContent = project.name;
    return projectEl;
}

const listenChangeActiveProject = () => {
    // update active project when the element of project is clicked
    const projectElements = document.querySelectorAll(".project-element");
    projectElements.forEach((projectElement) => {
        projectElement.addEventListener("click", () => {
            const projectId = projectElement.dataset.projectId;
            projectObj.setActiveProject(projectId);
            activeProject = projectObj.getActiveProject();
            updateProjectDisplay(); // call to update the active project
            updateTodoDisplay(); // update the todo display also to get the todo list from the active project
        })
    })
}

projectPlusButton.addEventListener("click", () => {
    formProject.classList.add("visible"); // show the form
    formProject[0].focus() // focus to new project input when plus button is clicked
})

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

export const updateProjectDisplay = () => {
    const projects = projectObj.getProjects();

    projectListContainer.textContent = "";
    projects.forEach((project) => {
        const projectElement = createProjectElement(project);
        projectListContainer.appendChild(projectElement);

        // add class for active-project for styling 
        projectObj.isActiveProject(project.id) ? projectElement.classList.add("active-project") : projectElement.classList.remove("active-project")
    })

    listenChangeActiveProject() // event listener for changin active project
}






