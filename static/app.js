
document.getElementById('connection-next').addEventListener("click", () => {
  changeSection('query');
})


document.getElementById('query-back').addEventListener("click", () => {
  changeSection('connection');
})

document.getElementById('query-next').addEventListener("click", () => {
  changeSection('analysis');
  let query = document.getElementById("user-query").value.trim();
  processQuery(query);
})

document.getElementById('analysis-next').addEventListener("click", () => {
  changeSection('recommendations');
})

document.getElementById('analysis-back').addEventListener("click", () => {
  changeSection('query');
})

document.getElementById('recommendations-back').addEventListener("click", () => {
  changeSection('analysis');
})

function changeSection(sectionName) {
  let x = document.querySelectorAll("section");
  x.forEach(section => {
    section.hidden = true;
  })
  document.querySelector('#'+sectionName).hidden = false;
  updateStepper(sectionName);
}

function updateStepper(currentStep){
  let x = document.querySelectorAll("#Progression .step");
  x.forEach(y=>{
      y.classList.remove("active");
      y.classList.remove("completed")
  })
  let indexes = {"connection" : 0, "query" : 1, "analysis" : 2, "recommendations" : 3};
  let currentIndex = indexes[currentStep];
  x.forEach((y, index)=>{
      if(index<currentIndex){
        y.classList.add('completed');
      } else if(index === currentIndex){
        y.classList.add('active');
      }

  })
}

let form = document.getElementById("connection-info");
async function handleForm(event) {
    event.preventDefault();

    //gets connection info from the form
    let connectionInformation = {
        connectionName : document.getElementById("conn").value,
        host : document.getElementById("host").value,
        port : document.getElementById("port").value,
        databaseName : document.getElementById("db").value,
        username : document.getElementById("username").value,
        password : document.getElementById("pass").value
    };

    //let flask know that data will come as json
    let options = {
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(connectionInformation)
    };

    try{
        //send data to flask and wait for an answer
        const response = await fetch("/api/data/", options);

        //read flask's answer
        const result = await response.json();

        //change component states according to results
        if (result.status === 'connected'){
            document.getElementById('connection-status-first-section').innerText = '✓ Connected';
            document.getElementById('connection-status-second-section').innerText = 'Connected';
            document.querySelectorAll(".connection-status").forEach(x =>{
                x.classList.add('connected')
                x.classList.remove('disconnected')
            })

        }
        else{
            document.getElementById('connection-status-first-section').innerText = '⨯ Connection failed';
            document.getElementById('connection-status-second-section').innerText = 'Connection failed';
            document.querySelectorAll(".connection-status").forEach(x =>{
                x.classList.remove('connected')
                x.classList.add('disconnected')
            })
        }
        console.log(result);
    } catch (error) {
        console.error(error.message);
    }

}
form.addEventListener('submit', handleForm);

function populateAnalysis(information){
    document.getElementById('planning_time').innerText = information['Planning Time'] + ' ms';
    document.getElementById('execution_time').innerText = information['Execution Time'] + ' ms';
    document.getElementById('total_rows').innerText = information['Total Rows'].toLocaleString('en-US');
    document.getElementById('shared_buffers_hit').innerText = information['Shared Buffers Hit'].toLocaleString('en-US');
    document.getElementById('shared_buffers_read').innerText = information['Shared Buffers Read'].toLocaleString('en-US');
    document.getElementById('temp_blocks_written').innerText = information['Temp Blocks Written'].toLocaleString('en-US');
}

function createPlanNode(node){

    let details = document.createElement('details');
    details.classList.add('plan-node-container');



    let summary = document.createElement('summary');
    summary.classList.add('plan-node');
    let nodeName = document.createElement('span');
    nodeName.classList.add('node-name');
    nodeName.innerText = node['Node Type'];

    let nodeMetrics = document.createElement('span');
    nodeMetrics.classList.add('node-metrics');

    let met1 = document.createElement('span');
    met1.innerText = 'cost='+node["Startup Cost"]+'..'+node["Total Cost"];
    let met2 = document.createElement('span');
    met2.innerText = 'time='+node["Actual Startup Time"]+'..'+node["Actual Total Time"]+" ms";
    let met3 = document.createElement('span');
    met3.classList.add('row-count');
    met3.innerText = node['Actual Rows']+' rows';

    nodeMetrics.appendChild(met1);
    nodeMetrics.appendChild(met2);
    nodeMetrics.appendChild(met3);

    summary.appendChild(nodeName);
    summary.appendChild(nodeMetrics);

    details.appendChild(summary);

    let child;
    if(node['Children'].length > 0){
        details.open = true;
        child = document.createElement('div');
        child.classList.add('plan-children');
        node['Children'].forEach(y =>{
            child.appendChild(
                createPlanNode(y)
            );
        })
        details.appendChild(child);
    }else{
        details.classList.add('leaf');
    }

    return details;
}

function fillExecutionPlan(result){
    document.getElementById("execution-plan").appendChild(
        createPlanNode(result['Plan'])
    );
}

async function processQuery(query){
    let connectionInformation = {
        connectionName : document.getElementById("conn").value,
        host : document.getElementById("host").value,
        port : document.getElementById("port").value,
        databaseName : document.getElementById("db").value,
        username : document.getElementById("username").value,
        password : document.getElementById("pass").value,
        query : query
    };

    let options = {
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(connectionInformation)
    };

    try{
        //send data to flask and wait for an answer
        const response = await fetch("/api/analyze/", options);

        //read flask's answer
        const result = await response.json();

        populateAnalysis(result);
        fillExecutionPlan(result);

    } catch (error) {
        console.error(error.message);
    }
}