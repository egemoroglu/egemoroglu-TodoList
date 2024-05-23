#!/usr/bin/env node
    
    const { error } = require('console');
    const fs = require('fs');

    //Save JSON file
    function save(data = {}, file="data.json"){ 
        return fs.writeFileSync(file, JSON.stringify(data, null, 2), (error) => {
            if (error) {
                console.error('Error writing to file');

                throw error;
            }
        });
    }

    //Load JSON File
    function load(file="data.json"){
        
        const text = fs.readFileSync(file, 'utf8');
        return JSON.parse(text.length > 0 ? text : '[]');
    }

    //Operations
    function displayOperations() {
        return process.stdout.write(
          `\nOperations:\n\n${
            Object.entries(func)
              .map(entry => `- ${entry[0]}\n`)
              .join('')
          }\n`

          )

    }

    const func ={

        //List All Tasks
        listAll: function(){
            data = load();
            console.log(data);
        },

        //List Done Tasks
        listDone: function(){
            data = load();
            items = [];
            items = Object.entries(data).filter(item => item[1].done);
            console.log(items);
        },

        //List Undone Tasks
        listUndone: function(){
            data = load();
            items = [];
            items = Object.entries(data).filter(item => !item[1].done);
            console.log(items);
        },
        //Add a New Task
        addTask: function(title, assignee, done) {
            data = load();
            id = data.length;
            title = process.argv[3];
            assignee = process.argv[4];
            done = process.argv[5] === false;
            data[id]={
                id: id,
                title: title,
                assignee: assignee,
                done: done
            }
            save(data);  
        },
        
        //Update Title by ID
        updateTitleById: function(id, title){
            data = load();
            id = process.argv[3];
            title = process.argv[4];
            if(data[id]){
                data[id].title = title;
            }
            save(data);
        },

        //Remove Task by ID
        removeTaskById: function(id){
            let data = load();
            id = process.argv[3];
            for (let i = 0; i < data.length; i++) {
                if (data[i].id == id) {
                    data.splice(i, 1);
                    break;
                }
            }
            save(data);
        },
        //Mark as Done by ID
        markAsDoneById: function(id){
            let data = load();
            id = process.argv[3];
            if(data[id] && !data[id].done){
                data[id].done = true;
            }
            save(data);
        },
        //Mark as Undone by ID
        markAsUndoneById: function(id){
            let data = load();
            id = process.argv[3];
            if(data[id] && data[id].done){
                data[id].done = false;
            }
            save(data);
        }
    }
//Get Command line arguments
if (process.argv[2]) {
    const cli = process.argv[2].split(' ')
    if (func[cli[0]]) {
          func[cli[0]](...cli.slice(1))
    } else {
        displayOperations()
    }
    } else {
    displayOperations()
}
