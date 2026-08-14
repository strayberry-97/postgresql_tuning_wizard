
document.getElementById('connection-next').addEventListener("click", () => {
  changeSection('query');
})


document.getElementById('query-back').addEventListener("click", () => {
  changeSection('connection');
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
    let connectionInformation = {
        connectionName : document.getElementById("conn").value,
        host : document.getElementById("host").value,
        port : document.getElementById("port").value,
        databaseName : document.getElementById("db").value,
        username : document.getElementById("username").value,
        password : document.getElementById("pass").value
    };

    let options = {
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(connectionInformation)
    };
    try{
        const response = await fetch("/api/data/", options);
        const result = await response.json();
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