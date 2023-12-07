const taskForm = document.querySelector('#taskForm');

document.addEventListener("DOMContentLoaded", () => {
    App.init();
});

taskForm.addEventListener("submit", e => {
    e.preventDefault();
    const _title = taskForm["title"].value;
    const _description = taskForm["description"].value;

    if( _title != '' && _description != '' ){
        App.createTask( _title, _description );
        taskForm["title"].value = '';
        taskForm["description"].value = '';
    }
});