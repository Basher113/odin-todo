import { setToStorage, getFromStorage } from "../utils/storage";

export function Project() {
    let projects = [];
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

    setProjects(); // call set project to update the projects

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








