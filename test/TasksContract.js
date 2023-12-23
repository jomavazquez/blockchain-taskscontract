const TaskContract = artifacts.require("TasksContract");

contract("TaskContract", () => {

    before( async () => {
        this.taskContract = await TaskContract.deployed();
    });

    it('Migrate deployed successfully', async () => {
        const _address = this.taskContract.address;
        
        assert.notEqual( _address, null );
        assert.notEqual( _address, undefined );
        assert.notEqual( _address, 0x0 );
        assert.notEqual( _address, "" );
    });

    it('Get Task List', async () => {
        const _taskCounter = await this.taskContract.taskCounter();
        const _task = await this.taskContract.tasks( _taskCounter - 1 );
        
        assert.equal( _task.id.toNumber(), _taskCounter - 1 );
        assert.equal( _task.title, "My first task" );
        assert.equal( _task.description, "I have to do something today..." );
        assert.equal( _task.done, false );
        assert.equal( _taskCounter, 1 );
    });

    it('Task created successfully', async () => {
        const result = await this.taskContract.createTask(
            "Some task", 
            "Description example"
        );
        const _taskEvent = result.logs[0].args;
        const _tasksCounter = await this.taskContract.taskCounter();

        assert.equal( _tasksCounter, 2 );
        assert.equal( _taskEvent.id.toNumber(), 2 );
        assert.equal( _taskEvent.title, "Some task" );
        assert.equal( _taskEvent.description, "Description example" );
        assert.equal( _taskEvent.done, false );
    });

    it('Task Toggle Done', async () => {
        const result = await this.taskContract.toggleDone( 0 );
        const _taskEvent = result.logs[0].args;

        assert.equal( _taskEvent.done, true );
    });
  
});