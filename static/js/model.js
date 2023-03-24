export {Model}
/* 
 * Model class to support the Citizen Science application
 * this class provides an interface to the web API and a local
 * store of data that the application can refer to.
 * The API generates two different events:
 *   "modelChanged" event when new data has been retrieved from the API
 *   "observationAdded" event when a request to add a new observation returns
*/

let Model = {
    observations_url: '/api/observations', 
    users_url:  '/api/users',   
    xhr: new XMLHttpRequest(),

    // this will hold the data stored in the model
    data: {
        observations: [],
        users: []
    },

    // update_users - retrieve the latest list of users 
    //    from the server API
    // when the request is resolved, creates a "modelUpdated" event 
    // with the model as the event detail
    update_users: function() {
        // this.xhr.open('GET', '/api/users');
        // this.xhr.onload = function (event) {
        //     try {
        //         const data = JSON.parse(event.target.response);
        //         this.set_users(data);
        //         var event = new CustomEvent('modelUpdated', { detail: data });
        //     } catch (err) {
        //         console.error('Could not parse the response');
        //     }
        // };
        // this.xhr.send();
    },

    // update_observations - retrieve the latest list of observations
    //   from the server API
    // when the request is resolved, creates a "modelUpdated" event 
    // with the model as the event detail
    update_observations: function() {
        // this.xhr.open('GET', '/api/observations');
        // this.xhr.onload = function (event) {
        //     try {
        //         const data = JSON.parse(event.target.response);
        //         this.set_observations(data);

        //         var newEvent = new Event('modelUpdated', { detail: this });
        //         window.addEventListener('modelUpdated', newEvent);
        //         // newEvent.dispatchEvent(newEvent);
        //     } catch (err) {
        //         console.error('Could not parse the response');
        //     }
        // };
        // this.xhr.send();
    },

    // get_observations - return an array of observation objects
    get_observations: function() {
        return this.data.observations;
    },

    // get_observation - return a single observation given its id
    get_observation: function(observationid) {
        let observation = null;

        for (let i=0, observationsLength = this.data.observations.length; i < observationsLength; i++) {
            if (Number(this.data.observations[i].id) === Number(observationid)) {
                observation = this.data.observations[i];
                break;
            }
        }

        return observation;
    },
 
    set_observations: function(observations) {
        this.data.observations = observations;
    },

    // add_observation - add a new observation by submitting a request
    //   to the server API
    //   formdata is a FormData object containing all fields in the observation object
    // when the request is resolved, creates an "observationAdded" event
    //  with the response from the server as the detail
    add_observation: function(formdata) {
        this.data.observations.push(formdata);

        return this.data.observations();
    },

    // get_user_observations - return just the observations for
    //   one user as an array
    get_user_observations: function(userid) {
        let userObservations = [];

        for (let i=0, observationsLength = this.data.observations.length; i < observationsLength; i++) {
            if (Number(this.data.observations[i].participant) === Number(userid)) {
                userObservations.push(this.data.observations[i]);
            }
        }

        return userObservations.sort((ob1, ob2) => ob2.timestamp.localeCompare(ob1.timestamp));
    },

    // get_recent_observations - return the N most recent
    //  observations, ordered by timestamp, most recent first
    get_recent_observations: function(N) {
        let recentObservations = this.data.observations;

        return recentObservations.sort((ob1, ob2) => ob2.timestamp.localeCompare(ob1.timestamp)).slice(0, N);
    },

    /* 
    * Users
    */
    // get_users - return the array of users
    get_users: function() {
        return this.data.users;
    },

    // set_users - set the array of users
    set_users: function(users) {
        this.data.users = users;
    },

    // get_user - return the details of a single user given 
    //    the user id
    get_user: function(userid) {
        let user = null;

        for (let i=0, usersLength = this.data.users.length; i < usersLength; i++) {
            if (Number(this.data.users[i].id) === Number(userid)) {
                user = this.data.users[i];
                break;
            }
        }

        return user;
    }
};
