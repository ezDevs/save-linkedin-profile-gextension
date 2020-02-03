const person = {};

document.addEventListener('DOMContentLoaded', function () {
    var link = document.getElementById('checkPage');
    var saveLink = document.getElementById('save');

    // get onClick's logic below:
    link.addEventListener('click', function () {
        document.getElementById('loading').style.display = 'block';
        document.getElementById('checkPage').style.display = 'none';

        chrome.tabs.getSelected(null, function (tab) {
            get(tab.url);
        });

        // get('https://www.linkedin.com/in/wellington-cristi-vilela-santana-a48b1123/');
    });

    // save onClick's logic below:
    saveLink.addEventListener('click', function () {
        document.getElementById('loading').style.display = 'block';
        document.getElementById('checkPage').style.display = 'none';
        document.getElementById('result').style.display = 'none';
        document.getElementById('save').style.display = 'none';

        savePipefy({
            name: person.name,
            linkedin: person.linkedinURL
        })
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
            person.linkedinURL = data.userProfile.url;

            //change view
            document.getElementById('name').innerText = person.name;


            getPipefy(person.name);

        })
    });
}

function getPipefy(name) {
    fetch('http://localhost:3000/pipefy?name=' + name).then((response) => {
        response.json().then((data) => {

            if (data.data.cards.edges.length <= 0) {
                person.status = 'Ainda não está no Pipefy!';
                document.getElementById('status-ok').style.display = 'block';
                document.getElementById('save').style.display = 'block';
                document.getElementById('checkPage').style.display = 'none';

            } else {
                person.status = 'Candidato já está no Pipefy!';
                document.getElementById('status-bad').style.display = 'block';
            }
        });
    })
}

function savePipefy(body) {
    console.log(body);
    const header = new Headers();
    header.append("Content-Type", "application/json");

    fetch('http://localhost:3000/pipefy/create', {
        method: 'POST',
        headers: header,
        body: JSON.stringify({
            name: body.name,
            linkedin: body.linkedin
        })
    }).then((response) => {
        response.json().then((data) => {
            document.getElementById('result').style.display = 'none';
            document.getElementById('loading').style.display = 'none';
            document.getElementById('checkPage').style.display = 'block';
        });
    })
}