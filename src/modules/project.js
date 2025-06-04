import { setToStorage, getFromStorage } from "../utils/storage";

export function Project(state) {
    const id = crypto.randomUUID();
    return {
        id,
        ...state,
    }
}

export function ProjectDom() {
    const formEl = document.querySelector("#project-form");
    const projectCardsContainer = document.querySelector(".project-list");
    const projectList = ProjectList();

    const updateProjectView = () => {
        const projects = projectList.getProjects();

        projectCardsContainer.textContent = "";
        projects.forEach((project) => {
            const projectCard = createProjectCard(project);
            projectCardsContainer.appendChild(projectCard);

            // add class for active-project for styling 
            projectList.isActiveProject(project) ? projectCard.classList.add("active-project") : projectCard.classList.remove("active-project")
        })
        
        activateProjectClick();

    }

    const createProjectCard = (project) => {
        const projectEl = document.createElement("li");
        projectEl.classList.add("project-card");
        projectEl.setAttribute("data-project-id", project.id);
        projectEl.textContent = project.name + " - " + project.id;
        return projectEl;
    }

    const activateProjectClick = () => {
        const projectCards = document.querySelectorAll(".project-card");
        projectCards.forEach((projectCard) => {
            projectCard.addEventListener("click", () => {
                const projectId = projectCard.dataset.projectId;
                projectList.setActiveProject(projectId);
                updateProjectView();
            })
        })
    }

    formEl.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(formEl);
        const name = formData.get("project-name");
        const project = Project({name})
        projectList.addToProjects(project);
        updateProjectView();
        formEl.reset(); // reset the form
        console.log(projectList.getProjects());
    });



    updateProjectView();
}


function ProjectList() {
    let projects = [];
    const getProjects = () => projects;

    const addToProjects = (project) => {
        projects.push(project);
        setToStorage("projects", projects);
    }

    const setProjects = () => {
        const storedProjects = getFromStorage("projects");
        if (storedProjects) {
                projects = storedProjects.map(project => Project({...project}))
        } else {
            const defaultProject = Project({name: "default"})
            addToProjects(defaultProject);
        }
    }

    setProjects();

    let activeProject = projects[0]
    const getActiveProject = () => activeProject;
    const setActiveProject = (projectId) => {
        const index = projects.findIndex(project => project.id === projectId);
        return activeProject = projects[index];
    }

    const isActiveProject = (project) => {
        return activeProject.id === project.id
    }

    return {
        getProjects,
        getActiveProject,
        setActiveProject,
        addToProjects,
        isActiveProject
    }
}






