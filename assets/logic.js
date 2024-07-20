const todoColumn = document.querySelector('#todo-tasks')
const inProgressColumn = document.querySelector('#in-progress-tasks')
const completedColumn = document.querySelector('#completed-tasks')
// new task modal selectors
// new bootstrap.Modal(...): initalizes a new bootstrap object so we can use bootstrap native fucntions
const newTaskModal = new bootstrap.Modal(document.getElementById('newTaskModal'))
const addTaskButton = document.querySelector('#add-task')
const newTaskModalFade = document.querySelector('.fade')
const titleInput = document.querySelector('#title-name')
const descriptionInput = document.querySelector('#description-text')
const blankTitleError = document.querySelector('#blank-title-error')


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
        ID: generateRandomID(),
        title: titleInput.value,
        description: descriptionInput.value
    }
    storeLocalStorage(newTask)
    titleInput.value = ''
    descriptionInput.value = ''
    // Hide the modal using Bootstrap's method
    newTaskModal.hide();
    renderTasks()

})

// build a task card
function cardBuilder(data) {
    // to change colors check https://getbootstrap.com/docs/5.3/components/card/#background-and-color
    const newCard = document.createElement('div');
    newCard.classList.add('card', 'text-bg-primary', 'mb-3');
    newCard.style.maxWidth = '18rem';

    newCard.innerHTML = `
        <div class="card-header">Task</div>
        <div class="card-body">
            <h5 class="card-title">${data.title}</h5>
            <p class="card-text">${data.description}</p>
        </div>
    `;

    return newCard;
}

function renderTasks() {
    todoColumn.innerHTML = ""
    const tasks = readLocalStorage()
    tasks.forEach(task => {
        const taksCard = cardBuilder(task)
        todoColumn.appendChild(taksCard)
    });
}

renderTasks()