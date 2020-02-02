const person = {};

document.addEventListener('DOMContentLoaded', function () {
    var link = document.getElementById('checkPage');

    // onClick's logic below:
    link.addEventListener('click', function () {
        document.getElementById('loading').style.display = 'block';
        document.getElementById('checkPage').style.display = 'none';

        chrome.tabs.getSelected(null, function (tab) {
            get(tab.url);
        });
    });
});

function get(tablink) {
    getLinkedin(tablink);
}

function getLinkedin(url) {
    fetch('http://localhost:3000?url=' + url).then((response) => {
        response.json().then((data) => {

            //change view
            document.getElementById('loading').style.display = 'none';
            document.getElementById('result').style.display = 'block';
            document.getElementById('checkPage').style.display = 'block';

            //get data
            person.name = data.userProfile.fullName;
            person.linkedinURL = data.url;

            //change view
            document.getElementById('name').innerText = person.name;


            getPipefy(person.name);

        })
    });
}

function getPipefy(name) {
    fetch('http://localhost:3000/pipefy?name=' + name).then((response) => {
        response.json().then((data) => {
            console.log(data);

            if (data.data.cards.edges.length <= 0) {
                person.status = 'Ainda não está no Pipefy!';
                document.getElementById('status-ok').style.display = 'block';
            } else {
                person.status = 'Candidato já está no Pipefy!';
                document.getElementById('status-bad').style.display = 'block';
            }
        });
    })
}