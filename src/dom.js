import { Item, Project } from "./item"
import { getFromLocalStorage, saveToLocalStorage } from "./localStorage"
import { format } from "date-fns";
import IconDel from './icons/outline_delete_black_24dp.png';
import IconEdit from './icons/outline_edit_black_24dp.png';

const itemF = document.getElementById("itemForm")
const projF = document.getElementById("projectForm")
const projectsDOM = document.getElementById("projects")
const itemsDOM = document.getElementById("items")

document.getElementById("add_project").addEventListener("click", (e) => {openModal("add_projects")})
document.getElementById("close_projects").addEventListener("click", (e) => {closeModal("add_projects")})
document.getElementById("close_items").addEventListener("click", (e) => {closeModal("add_items")})

let activeIndex, activeIndexI
let isEditing = false

function displayProjects(){
    const projects = getFromLocalStorage()
    if (!projects) {
        return
    }

    projectsDOM.innerHTML = ""
    for (let i = 0; i < projects.length; i++){
        const div = document.createElement("div")
        div.classList.add("project")
        div.id = projects[i]._id
        
        const h4 = document.createElement("h4")
        h4.textContent = projects[i].title

        div.appendChild(h4)

        const editP = document.createElement("div")
        const editIcon = new Image()
        editIcon.src = IconEdit
        editIcon.addEventListener("click", (e) => {
            isEditing = true
            activeIndex = i
            document.getElementById("titleP").value = projects[i].title
            openModal("add_projects")
        })
        editP.appendChild(editIcon)
        
        const delIcon = new Image()
        delIcon.src = IconDel
        delIcon.addEventListener("click", (e) => {
            e.stopPropagation()
            projects.splice(i, 1)
            saveToLocalStorage(projects)
            displayProjects()
        })
        editP.appendChild(delIcon)
        div.appendChild(editP) 

        div.addEventListener("click", (e) => {
            activeIndex = i
            let projectActive = document.getElementsByClassName("active");
            if (projectActive && projectActive.length > 0){
                projectActive[0].className = projectActive[0].className.replace(" active", "");
            }
            div.classList.add("active")

            displayItems(projects, projects[i].items)
        })

        projectsDOM.appendChild(div)
    }
}

function displayItems(pr = [], items){

    itemsDOM.innerHTML = ""

    const dd = document.createElement("div")
    dd.classList.add("dd")
    const h2 = document.createElement("h2")
    h2.textContent = "Items"
    const btn = document.createElement("button")
    btn.textContent = "Add"
    btn.classList.add("btn")
    btn.id = "add_item"
    btn.addEventListener("click", (e) => {openModal("add_items")})
    dd.appendChild(h2)
    dd.appendChild(btn)

    itemsDOM.appendChild(dd)

    const itemsDiv = document.createElement("div")
    itemsDiv.classList.add("items")
    if (!items) return
    for (let i = 0; i < items.length; i++){
        const div = document.createElement("div")
        div.classList.add("item")
        div.id = items[i].id
        
        const h4 = document.createElement("h4")
        h4.textContent = items[i].title

        const p = document.createElement("p")
        p.textContent = items[i].description

        const dd = document.createElement("div")
        dd.classList.add("dd")

        const duedate = document.createElement("span")
        if (items[i].dueDate)
            duedate.textContent = format(items[i].dueDate, "dd MMM yyyy");

        const divc = document.createElement("div")
        const label = document.createElement("label")
        label.htmlFor = "check"+i
        label.textContent = "Is done? "

        const checkbox = document.createElement("input")
        checkbox.type = "checkbox"
        checkbox.id = "check"+i
        checkbox.checked = items[i].complete

        checkbox.addEventListener("click", (e) => {
            items[i].complete = !items[i].complete
            saveToLocalStorage(pr)
        })

        const editP = document.createElement("div")
        editP.classList.add("action")
        const editIcon = new Image()
        editIcon.src = IconEdit
        editIcon.addEventListener("click", (e) => {
            isEditing = true
            activeIndexI = i
            document.getElementById("title").value = items[i].title
            document.getElementById("description").value = items[i].description
            document.getElementById("duedate").value = items[i].dueDate
            document.getElementById("priority").value = items[i].priority
            openModal("add_items")
        })
        editP.appendChild(editIcon)
        
        const delIcon = new Image()
        delIcon.src = IconDel
        delIcon.addEventListener("click", (e) => {
            items.splice(i, 1)
            e.stopPropagation()
            saveToLocalStorage(pr)
            displayItems(pr, items)
        })
        editP.appendChild(delIcon)
        div.appendChild(editP) 

        divc.appendChild(label)
        divc.appendChild(checkbox)

        dd.appendChild(duedate)
        dd.appendChild(divc)

        div.appendChild(h4)
        div.appendChild(p)
        div.appendChild(dd)
        div.style.backgroundColor = `var(--${items[i].priority})`

        itemsDiv.appendChild(div)
    }

    itemsDOM.appendChild(itemsDiv)
}

function openModal(id){
    document.getElementById(id).showModal()
}

function closeModal(id){
    document.getElementById(id).close()
}


projF.addEventListener("submit", (e) => {
    e.preventDefault()
    
    const title = document.getElementById("titleP").value
    const p = getFromLocalStorage()
    if (isEditing){
        p[activeIndex].title = title
        isEditing = false
    } else {
        const project = new Project(title)
        project.id = p.length + 1
        p.push(project)
    }
    saveToLocalStorage(p)
    
    itemF.reset()
    closeModal("add_projects")

    displayProjects()
})

itemF.addEventListener("submit", (e) => {
    e.preventDefault()
    const projects = getFromLocalStorage()

    const title = document.getElementById("title").value
    const description = document.getElementById("description").value
    const duedate = document.getElementById("duedate").value
    const priority = document.getElementById("priority").value
    if (isEditing){
        projects[activeIndex].items[activeIndexI].title = title
        projects[activeIndex].items[activeIndexI].description = description
        projects[activeIndex].items[activeIndexI].dueDate = duedate
        projects[activeIndex].items[activeIndexI].priority = priority
    } else {
        const item = new Item(title, description, duedate, priority)
        if (!projects[activeIndex].items) projects[activeIndex].items = []
        projects[activeIndex].items.push(item)
    }
    saveToLocalStorage(projects)

    itemF.reset()
    closeModal("add_items")

    displayItems(projects, projects[activeIndex].items)
})

export {displayProjects}