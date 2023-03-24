import { Model } from './model.js'
import { split_hash } from './util.js'
import View from './view.js'

function redraw() { 

    let content = "<h2>API Test</h2><ul>";
    content += "<li><a href='/api/observations'>List of Observations</a></li>";
    content += "<li><a href='/api/users'>List of Users</a></li>"; 
    content += "<li><a href='/api/users/1'>Detail of one user</a></li>"; 
    content += "<li><a href='/api/observations/1'>Detail of one observation</a></li>"; 
    content += "</ul>";

    // update the page
    document.getElementById("target").innerHTML = content;
}

function getObservations() {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open('GET', '/api/observations');
        xhr.onload = function (event) {
            try {
                Model.set_observations(JSON.parse(event.target.response));
            } catch (err) {
                console.error('Could not parse the response');
                reject();
            }
            resolve();
        };
        xhr.send();
    });
}

function getUsers() {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open('GET', '/api/users');
        xhr.onload = function (event) {
            try {
                Model.set_users(JSON.parse(event.target.response));
            } catch (err) {
                console.error('Could not parse the response');
                reject();
            }
            resolve();
        };
        xhr.send();
    });
}

// Handle view based on route
function onRouteChange() {
    const { path, id } = split_hash(window.location.href);

    switch (path) {
        case '': {
            View.renderHomeView();
            break;
        }
        case 'users': {
            View.renderUsersList(id);
            break;
        }
        case 'observations': {
            View.renderObservationsList(id);
            break;
        }
        case 'submit': {
            View.renderForm();
            break;
        }
    }

}

async function initializeApp() {
    redraw();
    // Watch over route chane
    window.addEventListener('popstate', onRouteChange);
    // Initialize handlebars templates
    View.initialize();
    // Fetch all users and observations
    await Promise.all([await getObservations(), await getUsers()]);
    View.renderLoading(false);
    onRouteChange();
}

window.onload = function() {
    initializeApp();
};
