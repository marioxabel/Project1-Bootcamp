const addTaskButton = document.querySelector('#addTask')


// Open modal when addTaskButton is clicked
// function that opens the modal
function openModal() {
    console.log('modal')
    document.querySelector('.modal').style.display = 'block'
}

addTaskButton.addEventListener('click', openModal) 


// Close modal event listener

document.body.addEventListener('click', (e) => {
    console.log(e.target)
    const element = e.target
    if (element.matches('.btn-close')) {
        document.querySelector('.modal').style.display = 'none'
    } else if (element.matches('.btn-secondary')) {
        document.querySelector('.modal').style.display = 'none'
    } else if (element.matches('.btn-primary')) {
        // save the task to local storage

        document.querySelector('.modal').style.display = 'none'
    }
});
  
