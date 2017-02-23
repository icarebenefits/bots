import request from "request";

export function FbRequest(message, groupId, personalId) {
    this.message = message;
    this.groupId = groupId;
    this.personalId = personalId;
}

FbRequest.prototype = {
    post: function () {
        const app_token = 'DQVJ1a1ljbEJjS3hvNHMybG94MjFHUVp1ZADBUcGx2ZAlFpOTNGRU5NdHM1UE1qTl85RDJPZAXpKbFAtQUNKTGt2cDRjazc2TFZATOVEzNlltRTVlQUtwaHIyZA3Q2eFVtaGpZAZAnVlN0I4VmJubUNabU1WTUdrbVctM2R4cC1jdGluOS1aY1BxSWhyLVFNYi1mc1FfR1o3RV9UNEpacXVYbXZA2Sjdwa0lVRTRkLVNKSGloYzJCSFFuQ0g2Vk8wZAzZAxVkE1R3l4NkNsNHVScW4xXzR0NgZDZD';
        const options = {
            method: 'GET',
            url: 'https://graph.facebook.com/' + this.personalId,
            qs: {fields: 'impersonate_token'},
            headers: {
                authorization: 'Bearer ' + app_token
            }
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            const obj = JSON.parse(body);

            const impersonate_token = obj.impersonate_token;
            console.log(impersonate_token);
            const options = {
                method: 'POST',
                url: 'https://graph.facebook.com/' + this.groupId + "/feed",
                headers: {
                    authorization: 'Bearer ' + impersonate_token
                },
                body: {
                    "message": this.message,
                    "type": "status"
                },
                json: true
            };
            request(options, function (error, response, body) {
                if (error) throw new Error(error);

                console.log(body);
            });
        });
    }
};

//test only
const fbRequest = new FbRequest("hello", "1000116371355071", "100011637135507");
fbRequest.post();