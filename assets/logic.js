const todoColumn = document.querySelector('#todo-tasks')
const inProgressColumn = document.querySelector('#in-progress-tasks')
const completedColumn = document.querySelector('#completed-tasks')
// new task modal selectors
// new bootstrap.Modal(...): initalizes a new bootstrap object so we can use bootstrap native fucntions
const newTaskModal = new bootstrap.Modal(document.getElementById('newTaskModal'))
const addTaskButton = document.querySelector('#add-task')
const titleInput = document.querySelector('#title-name')
const descriptionInput = document.querySelector('#description-text')
const blankTitleError = document.querySelector('#blank-title-error')
// edit modal selectors
const editTaskModal = new bootstrap.Modal(document.querySelector('#edit-task-modal'))
const editTitleInput = document.querySelector('#edit-name')
const editDescriptionInput = document.querySelector('#edit-text')
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
    console.log('ok')
    // if it has a title made an object out of it and save it to localStorage
    const newTask = {
        ID: generateRandomID(), //this id will be used to edit a specific task
        title: titleInput.value,
        description: descriptionInput.value,
        status: 'to-do'
    }
    storeLocalStorage(newTask)
    titleInput.value = ''
    descriptionInput.value = ''
    // Hide the modal using Bootstrap's method
    newTaskModal.hide()
    renderTasks()

})

// build a task card
function cardBuilder(data) {
    // to change colors check https://getbootstrap.com/docs/5.3/components/card/#background-and-color
    const newCard = document.createElement('div')
    newCard.classList.add('card', 'text-bg-primary', 'mb-3')
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
    todoColumn.innerHTML = ""
    const tasks = readLocalStorage()
    tasks.forEach(task => {
        const taskCard = cardBuilder(task)
        taskCard.addEventListener('click', handleCardClick) // add event listener to enable edition edit card
        todoColumn.appendChild(taskCard)
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

function openEditModal(taskId) {
    // console.log(taskId)
    const tasksArray = readLocalStorage()
    //get the index of the task to fill the modal and then replace
    const taskIndex = tasksArray.findIndex(task => task.ID == taskId)
    editTitleInput.value = tasksArray[taskIndex].title
    editDescriptionInput.value = tasksArray[taskIndex].description

    // Show the modal 
    editTaskModal.show()

    saveChangesBtn.addEventListener('click', () => {
        if (editTitleInput.value === tasksArray[taskIndex].title && editDescriptionInput.value === tasksArray[taskIndex].description) {
            editError.innerText = 'Make a change to save'
        } else if (editTitleInput.value === '') {
            editError.innerText = 'Title must not be blank'
        } else {
            editedTask = {
                ID: taskId,
                title: editTitleInput.value,
                description: editDescriptionInput.value,
                status: tasksArray[taskIndex].status
            }
            // replaces the task with the edited version
            tasksArray.splice(taskIndex, 1, editedTask)
            localStorage.setItem('tasks', JSON.stringify(tasksArray))
            renderTasks()
            editTaskModal.hide()
        }
    })
}