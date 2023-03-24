import { Model } from './model.js'

const View = {
    // Initialize partial users and observations templates
    initialize() {
        Handlebars.registerPartial('usersTemplate', `
        <h2>{{usersHeader}}</h2>
        <ul id="users-list" style="list-style-type: none;">
            {{#each users}}
            <li class="user-card">
                <img src={{this.avatar}} class="user-avatar"/>
                <a href="#!/users/{{this.id}}">{{this.last_name}}    {{this.first_name}}</a>
            </li>
            {{/each}}
        </ul>
        `);
        Handlebars.registerPartial('observationsTemplate', `
        <h2>{{observationsHeader}}</h2>
        <ul id="observations-list">
            {{#each observations}}
            <li>
                <a href='#!/observations/{{this.id}}'>
                    Time: {{this.timestamp}} | Location: {{this.location}} | Weather: {{this.weather}}
                </a>
            </li>
            {{/each}}
        </ul>
        `);
    },
        renderFormTemp() {
            return(
                Handlebars.compile(`<form id="form" action ="/api/observations" method="POST"> 
                <label for="participant">participant:</label><br/>
                <input type="text" id="participant" name="participant"/><br/>
                <label for="temperature">temp:</label><br/>
                <input type="text" id="temperature" name="temperature"/><br/><br/>
                <label for="weather">weather:</label><br/>
                <input type="text" id="weather" name="weather"/><br/>
                <label for="wind">wind:</label><br/>
                <input type="text" id="wind" name="wind"/><br/><br/>
                <label for="height">height:</label><br/>
                <input type="text" id="height" name="height"/><br/>
                <label for="girth">girth:</label><br/>
                <input type="text" id="girth" name="girth"/><br/>
                <label for="location">location:</label><br/>
                <input type="text" id="location" name="location"/><br/>
                <label for="leaf_size">leaf_size:</label><br/>
                <input type="text" id="leaf_size" name="leaf_size"/><br/>
                <label for="leaf_shape">leaf_shape:</label><br/>
                <input type="text" id="leaf_shape" name="leaf_shape"/><br/>
                <label for="bark_colour">bark_colour:</label><br/>
                <input type="text" id="bark_colour" name="bark_colour"/><br/>
                <label for="bark_texture">bark_texture:</label><br/>
                <input type="text" id="bark_texture" name="bark_texture"/><br/>
                <input type="submit" value="Submit"/>  
            </form>`
            )
            );

        },
    // Loading icon while data fetching
    renderLoading(isLoading) {
        document.getElementById('loading').style.display = isLoading ? "block" : "none";
    },

    // Reset selected data while route change
    resetSelectedData() {
        document.getElementById("selected-data").innerHTML = '';
    },

    // Display top users and recent observations
    renderHomeView() {
        const templateScript = Handlebars.compile(`
        {{> observationsTemplate}}
        {{> usersTemplate}}
        `);
        const observations = Model.get_recent_observations(10);
        const users = Model.get_users().slice(0, 10);
        
        this.resetSelectedData();
        document.getElementById("view-data").innerHTML =
            templateScript({ observations, users, usersHeader: 'Top users', observationsHeader: 'Recent observations' });
    },

    // Display selected user
    renderUser(user) {
        const templateScript = Handlebars.compile(`
        <ul>
            {{#with user}}
            <li>First Name: {{first_name}}</li>
            <li>Last Name: {{last_name}}</li>
            <li>Email ID: {{email}}</li>
            {{/with}}
        </ul>
        `);

        document.getElementById("selected-data").innerHTML = templateScript({ user });
    },

    // Display selected observation
    renderObservation(observation) {
        const templateScript = Handlebars.compile(`
        <ul>
            {{#with observation}}
            <li>Timestamp: {{timestamp}}</li>
            <li>Location: {{location}}</li>
            <li>Weather: {{weather}}</li>
            {{/with}}
        </ul>
        `);

        document.getElementById("selected-data").innerHTML = templateScript({ observation });
    },

    // Display list of all observations
    renderObservationsList(id) {
        const observations = Model.get_observations();
        const observationsElement = Handlebars.compile(`
        {{> observationsTemplate}}
        `);

        if (id) {
            const observationData = Model.get_observation(id);

            if (observationData) {
                this.renderObservation(observationData);
            }
        } else {
            this.resetSelectedData();
        }
        
        document.getElementById("view-data").innerHTML = observationsElement({ observations, observationsHeader: 'Observations' });
    },

    // Display list of all users
    renderUsersList(id) {
        if (id) {
            const userData = Model.get_user(id);

            if (userData) {
                this.renderUser(userData);
                this.renderUserObservations(id);
            }
        } else {
            const users = Model.get_users();
            const usersElement = Handlebars.compile(`
            {{> usersTemplate}}
            `);

            this.resetSelectedData(); 
            document.getElementById("view-data").innerHTML = usersElement({ users, usersHeader: 'Users' });
        }
    },

    // Display list of observations of a user
    renderUserObservations(id) {
        const userObservations = Model.get_user_observations(id);
        const userObservationsElement = Handlebars.compile(`
        {{> observationsTemplate}}
        `);

        document.getElementById("view-data").innerHTML = userObservationsElement({ observations: userObservations, observationsHeader: 'User\'s observations' });
    },
    renderForm() {
        document.getElementById("view-data").innerHTML = this.renderFormTemp()();

    }
}
export default View;