
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

        console.log(result);
    } catch (error) {
        console.error(error.message);
    }
}