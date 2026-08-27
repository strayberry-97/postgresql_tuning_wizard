
document.getElementById('connection-next').addEventListener("click", () => {
  changeSection('query');
})


document.getElementById('query-back').addEventListener("click", () => {
  changeSection('connection');
})

document.getElementById('query-next').addEventListener("click", () => {
  changeSection('analysis');
  let query = document.getElementById("user-query").value.trim();
  let type = document.getElementById("analysis-mode-explain");
  if(type.classList.contains('not-active'))
      type = 'explain analyze';
  else
    type = 'explain';
  processQuery(query, type);
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

document.getElementById('analysis-mode-explain').addEventListener("click", () => {
    changeButtonState('analysis-mode-explain');
})

document.getElementById('analysis-mode-explain-analyze').addEventListener("click", () => {
    changeButtonState('analysis-mode-explain-analyze');
})

document.getElementById('tune-another-query').addEventListener("click", () =>{
    document.getElementById("user-query").value = '';
    changeSection('query');
})

function changeButtonState(buttonID) {
    let currentButton = document.getElementById(buttonID);
    let anotherButton;
    if(buttonID === 'analysis-mode-explain'){
        anotherButton = document.getElementById('analysis-mode-explain-analyze');
    }else{
        anotherButton = document.getElementById('analysis-mode-explain');
    }
    if(currentButton.classList.contains('not-active')){
        currentButton.classList.remove('not-active');
        anotherButton.classList.add('not-active');
    }else{
        currentButton.classList.add('not-active');
        anotherButton.classList.remove('not-active');
    }
}

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

function populateAnalysis(information, type){
    if(type === 'explain analyze'){
        document.getElementById('grid-item-4').hidden = false;
        document.getElementById('grid-item-5').hidden = false;
        document.getElementById('grid-item-6').hidden = false;

        document.getElementById('grid-item-1').querySelector('p').innerText = 'Planning Time';
        document.getElementById('planning_time').innerText = information['Planning Time'] + ' ms';

        document.getElementById('grid-item-2').querySelector('p').innerText = 'Execution Time';
        document.getElementById('execution_time').innerText = information['Execution Time'] + ' ms';

        document.getElementById('grid-item-3').querySelector('p').innerText = 'Total Rows';
        document.getElementById('total_rows').innerText = information['Total Rows'].toLocaleString('en-US');

        document.getElementById('shared_buffers_hit').innerText = information['Shared Buffers Hit'].toLocaleString('en-US');
        document.getElementById('shared_buffers_read').innerText = information['Shared Buffers Read'].toLocaleString('en-US');
        document.getElementById('temp_blocks_written').innerText = information['Temp Blocks Written'].toLocaleString('en-US');
    }else{
        document.getElementById('grid-item-4').hidden = true;
        document.getElementById('grid-item-5').hidden = true;
        document.getElementById('grid-item-6').hidden = true;

        document.getElementById('grid-item-1').querySelector('p').innerText = 'Startup cost';
        document.getElementById('grid-item-1').querySelector('span').innerText = information['Plan']['Startup Cost'];

        document.getElementById('grid-item-2').querySelector('p').innerText = 'Total cost';
        document.getElementById('grid-item-2').querySelector('span').innerText = information['Plan']['Total Cost'];

        document.getElementById('grid-item-3').querySelector('p').innerText = 'Estimated rows';
        document.getElementById('grid-item-3').querySelector('span').innerText = information['Plan']['Estimated Rows'];

    }
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

    let met3;

    if(document.getElementById('grid-item-4').hidden !== true){
        let met2 = document.createElement('span');
        met2.innerText = 'time='+node["Actual Startup Time"]+'..'+node["Actual Total Time"]+" ms";
        met3 = document.createElement('span');
        met3.classList.add('row-count');
        met3.innerText = node['Actual Rows']+' rows';
        nodeMetrics.appendChild(met2);
    }else{
        met3 = document.createElement('span');
        met3.classList.add('row-count');
        met3.innerText = node['Estimated Rows']+' rows';
    }

    nodeMetrics.appendChild(met1);
    nodeMetrics.appendChild(met3);

    if((node['Problems']?? []).length > 0){
        summary.classList.add('warning');
        met3.classList.add('warning-count');
        node['Problems'].forEach(x=>{
            if(x['Severity'] === 'High'){
                document.getElementById('problem-name').innerText = node['Node Type'];
                document.getElementById('problem-explanation').innerText = x['Sign']
        }
        })


    }

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
    const container = document.getElementById("execution-plan");

    container.innerHTML = '';

    container.appendChild(
        createPlanNode(result['Plan'])
    );
}

function populateRecommendations(result){
    const container = document.getElementById("recommendations-container");
    const summary = document.getElementById('recommendations-summary');

    container.innerHTML = '';

    let recommendations = [];

    function collectProblems(node) {
        if (node['Problems'] && node['Problems'].length > 0) {
            node['Problems'].forEach(problem => {
                recommendations.push({
                    nodeType: node['Node Type'],
                    severity: problem["Severity"],
                    sign: problem['Sign'],
                    recommendation: problem['Recommendations']
                });
            });
        }

        if (node['Children']) {
            node['Children'].forEach(child => {
                collectProblems(child);
            });
        }
    }

    collectProblems(result['Plan']);

    if (result['SQL Recommendations']) {
        result['SQL Recommendations'].forEach(problem =>{
            recommendations.push({
                nodeType: "SQL",
                severity: problem['Severity'],
                sign: problem['Sign'],
                recommendation: problem['Recommendations']
            });
        });
    }

    let high = recommendations.filter(x => x.severity === "High").length;
    let medium = recommendations.filter(x => x.severity === "Medium").length;
    let low = recommendations.filter(x => x.severity === "Low").length;

    summary.innerText =
        `${recommendations.length} suggestions found – ` +
        `${high} high, ${medium} medium, ${low} low`;

    recommendations.forEach(recommendation =>{
        const wrapper = document.createElement('div');
        const details = document.createElement('details');
        const summaryElement = document.createElement('summary');

        const severity = document.createElement('span');
        severity.innerText = recommendation.severity.toLocaleUpperCase();

        const title = document.createElement('b');
        title.innerText = `${recommendation.recommendation} (${recommendation.nodeType})`;

        summaryElement.appendChild(severity);
        summaryElement.appendChild(title);

        const explanation = document.createElement('p');
        explanation.innerText = recommendation.sign;

        details.appendChild(summaryElement);
        details.appendChild(explanation);

        wrapper.appendChild(details);
        container.appendChild(wrapper);

    });
}

async function processQuery(query, type){
    let connectionInformation = {
        connectionName : document.getElementById("conn").value,
        host : document.getElementById("host").value,
        port : document.getElementById("port").value,
        databaseName : document.getElementById("db").value,
        username : document.getElementById("username").value,
        password : document.getElementById("pass").value,
        query : query,
        type : type
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

        console.log("ANALYSIS RESULT:", result);

        populateAnalysis(result, type);

        fillExecutionPlan(result);

        populateRecommendations(result);

    } catch (error) {
        console.error(error.message);
    }
}