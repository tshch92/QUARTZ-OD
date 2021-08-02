document.querySelector('.btn.OK').addEventListener('click', function() {
    document.querySelector('.disclaimer').style= "display: none";
  })
  
  document.querySelector('.opendisclaimer').addEventListener('click', function() {
    document.querySelector('.disclaimer').style= "display: flex";
  })