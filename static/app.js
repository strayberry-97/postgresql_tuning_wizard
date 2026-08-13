
document.getElementById('conn-next').addEventListener("click", () => {
  changeSection('query');
})


document.getElementById('query-back').addEventListener("click", () => {
  changeSection('connection');
})

function changeSection(section_name) {
  let x = document.querySelectorAll("section");
  x.forEach(section => {
    section.hidden = true;
  })
  document.querySelector('#'+section_name).hidden = false;
}