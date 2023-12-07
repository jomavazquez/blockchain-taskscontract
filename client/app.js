App = {

    contracts: {},

    init: async () => {
        console.log('Loaded');
        await App.loadEthereum();
        await App.loadContracts();
        App.render();
        await App.renderTask();
    },

    loadEthereum: async () => {
        if( window.ethereum ){
            App.web3Provider = window.ethereum;
            
            const accounts = await window.ethereum.request({ 
                method: 'eth_requestAccounts' 
            });
            App.account = accounts[ 0 ];

        }else{
            console.log('Please try to install Metamask extension.')
        }
    },

    loadContracts: async () => {
        const res = await fetch("TasksContract.json");
        const tasksContractJSON = await res.json();

        App.contracts.tasksContract = TruffleContract( tasksContractJSON );
        
        App.contracts.tasksContract.setProvider( App.web3Provider );

        App.tasksContract = await App.contracts.tasksContract.deployed();
    },

    createTask: async ( title, description ) => {
        await App.tasksContract.createTask( title, description, {
            from: App.account
        });
        App.renderTask();
    },

    toggleDone: async ( element ) => {
        const taskId = element.dataset.id;
        await App.tasksContract.toggleDone( taskId, {
            from: App.account
        });
    },

    render: () => {
        document.getElementById('account').innerHTML = App.account;
    },

    renderTask: async () => {
        const taskCounter = await App.tasksContract.taskCounter();
        const taskCounterNumber = taskCounter.toNumber();

        let html = '';

        for( let i = 1; i < taskCounterNumber; i++ ){
            const task = await App.tasksContract.tasks( i );

            const taskId = task[0];
            const taskTitle = task[1];
            const taskDescription = task[2];
            const taskDone = task[3];
            const taskCreated = task[4];

            let taskElement = `
                <div class="card bg-dark text-light mb-2">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span>${ taskTitle }</span>
                        <div class="form-check form-switch">
                            <input data-id="${ taskId }" class="form-check-input" type="checkbox" ${ taskDone && "checked" } onchange="App.toggleDone(this)" />
                        </div>
                    </div>                    
                    <div class="card-body">
                        <span>${ taskDescription }</span>
                        <p class="gray mb-0">Task was created at ${ new Date(taskCreated * 1000).toLocaleString() }</p>
                    </div>
                </div>
            `;
            html += taskElement;
        }
        document.querySelector('#taskList').innerHTML = html;
    },

}