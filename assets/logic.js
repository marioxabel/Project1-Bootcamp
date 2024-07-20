const todoColumn = document.querySelector('#todo-tasks')
const inProgressColumn = document.querySelector('#in-progress-tasks')
const completedColumn = document.querySelector('#completed-tasks')
const archivedSection = document.querySelector('#archived-section')
const deleteAllBtn = document.querySelector('#delete-all')
// new task modal selectors
// new bootstrap.Modal(...): initalizes a new bootstrap object so we can use bootstrap native fucntions
const newTaskModal = new bootstrap.Modal(document.getElementById('newTaskModal'))
const addTaskButton = document.querySelector('#add-task')
const titleInput = document.querySelector('#title-name')
const descriptionInput = document.querySelector('#description-text')
const statusInput = document.querySelector('#status')
const blankTitleError = document.querySelector('#blank-title-error')
// edit modal selectors
const editTaskModal = new bootstrap.Modal(document.querySelector('#edit-task-modal'))
const editTitleInput = document.querySelector('#edit-name')
const editDescriptionInput = document.querySelector('#edit-text')
const editStatusInput = document.querySelector('#edit-status')
const editError = document.querySelector('#edit-error')
const saveChangesBtn = document.querySelector('#save-changes')

// Read LocalStorage
function readLocalStorage() {
    return JSON.parse(localStorage.getItem("tasks")) || []
}

// Write localStorage
function storeLocalStorage(data) {
    const array = readLocalStorage()
    array.push(data)
    localStorage.setItem('tasks', JSON.stringify(array))
}

// Add new task to localStorage 
addTaskButton.addEventListener('click', () => {
    // check if form has at least a title to continue
    if (titleInput.value === '') {
        console.log('please fill the title')
        blankTitleError.innerText = 'Please fill the title input'
        return
    }
    // if it has a title made an object out of it and save it to localStorage
    const newTask = {
        ID: generateRandomID(), //this id will be used to edit a specific task
        title: titleInput.value,
        description: descriptionInput.value,
        status: statusInput.value
    }
    storeLocalStorage(newTask)
    titleInput.value = ''
    descriptionInput.value = ''
    statusInput.value = 'To-do'
    // Hide the modal using Bootstrap's method
    newTaskModal.hide()
    renderTasks()

})

// build a task card
function cardBuilder(data) {
    // to change colors check https://getbootstrap.com/docs/5.3/components/card/#background-and-color
    const newCard = document.createElement('div')

    // color the card according to status using bootstrap classes
    let colorOfCard = 'text-bg-light'
    if (data.status === 'To-do') {
        colorOfCard = 'text-bg-secondary'
    } else if (data.status === 'In-progress') {
        colorOfCard = 'text-bg-warning'
    } else if (data.status === 'Completed') {
        colorOfCard = 'text-bg-success'
    } else if (data.status === 'Archived') {
        colorOfCard = 'text-bg-dark'
    }
    newCard.classList.add('card', colorOfCard, 'mb-3', 'clickable')

    // Use ID to later locate and edit card
    newCard.setAttribute('data-task-id', data.ID)
    // TODO implement drag and drop
    newCard.setAttribute('draggable', 'true')

    newCard.innerHTML = `
        <div class="card-body">
            <h5 class="card-title">${data.title}</h5>
            <p class="card-text">${data.description}</p>
        </div>
    `
    return newCard
}

function renderTasks() {
    // clear all columns before each render
    todoColumn.innerHTML = ""
    inProgressColumn.innerHTML = ""
    completedColumn.innerHTML = ""
    archivedSection.innerHTML = ""
    const tasks = readLocalStorage()
    tasks.forEach(task => {
        const taskCard = cardBuilder(task)
        taskCard.addEventListener('click', handleCardClick) // add event listener to enable edition edit card
        // render in the correct section
        if (task.status === 'To-do') {
            todoColumn.appendChild(taskCard)
        } else if (task.status === 'In-progress') {
            inProgressColumn.appendChild(taskCard)
        } else if (task.status === 'Completed') {
            completedColumn.appendChild(taskCard)
        } else if (task.status === 'Archived') {
            archivedSection.appendChild(taskCard)
        }
    })
}

renderTasks()

// Edit a card
function handleCardClick(event) {
    // get the task id of the task we click
    const taskId = event.currentTarget.getAttribute('data-task-id')
    // Open the modal and pass the task ID to it
    openEditModal(taskId);
}

function handleSaveChangesClick() {
    const tasksArray = readLocalStorage()
    const taskIndex = tasksArray.findIndex(task => task.ID == currentTaskId)

    if (editTitleInput.value === tasksArray[taskIndex].title && editDescriptionInput.value === tasksArray[taskIndex].description && editStatusInput.value === tasksArray[taskIndex].status) {
        editError.innerText = 'Make a change to save'
    } else if (editTitleInput.value === '') {
        editError.innerText = 'Title must not be blank'
    } else {
        const editedTask = {
            ID: currentTaskId,
            title: editTitleInput.value,
            description: editDescriptionInput.value,
            status: editStatusInput.value
        }
        // Replaces the task with the edited version
        tasksArray.splice(taskIndex, 1, editedTask)
        localStorage.setItem('tasks', JSON.stringify(tasksArray))
        renderTasks()
        editTaskModal.hide()
    }
}

// Variable to store the current task ID globally
let currentTaskId

// Open edit modal and attach the event listener
function openEditModal(taskId) {
    currentTaskId = taskId // Set the current task ID
    const tasksArray = readLocalStorage()
    const taskIndex = tasksArray.findIndex(task => task.ID == taskId)

    editTitleInput.value = tasksArray[taskIndex].title
    editDescriptionInput.value = tasksArray[taskIndex].description
    editStatusInput.value = tasksArray[taskIndex].status
    // Show the modal
    editTaskModal.show()

    // Remove existing event listener before adding a new one so if we display an error we can try again
    saveChangesBtn.removeEventListener('click', handleSaveChangesClick)
    saveChangesBtn.addEventListener('click', handleSaveChangesClick)

    // Clear previous error message
    editError.innerText = ''
}

deleteAllBtn.addEventListener('click', () => {
    localStorage.clear()
    renderTasks()
})