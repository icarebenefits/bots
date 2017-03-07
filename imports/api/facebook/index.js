import request from "request";

export function FbRequest(message, groupId, personalId) {
    this.message = message;
    this.groupId = groupId;
    this.personalId = personalId;
}

FbRequest.prototype = {
    post: function () {
        const app_token = Meteor.settings.facebook.appToken;
        const prefix_url = Meteor.settings.facebook.prefixUrl;
        const {personalId, groupId, message} = this;
        const options = {
            method: 'GET',
            url: prefix_url + personalId,
            qs: {fields: 'impersonate_token'},
            headers: {
                authorization: 'Bearer ' + app_token
            }
        };

        // console.log({personalId, groupId});

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            const obj = JSON.parse(body);

            const impersonate_token = obj.impersonate_token;
            // console.log(impersonate_token);
            const options = {
                method: 'POST',
                url: prefix_url + groupId + "/feed",
                headers: {
                    authorization: 'Bearer ' + impersonate_token
                },
                body: {
                    "message": message,
                    "type": "status"
                },
                json: true
            };
            // console.log(options);
            request(options, function (error, response, body) {
                if (error) throw new Error(error);

                // console.log(body);
            });
        });
    }
};

// //test only
// const fbRequest = new FbRequest("hello",  257279828017220, 100015398923627);
// fbRequest.post();