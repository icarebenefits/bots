import request from "request";

export const FBapi = (message, groupId, personalId) => {
    var app_token = 'DQVJ1a1ljbEJjS3hvNHMybG94MjFHUVp1ZADBUcGx2ZAlFpOTNGRU5NdHM1UE1qTl85RDJPZAXpKbFAtQUNKTGt2cDRjazc2TFZATOVEzNlltRTVlQUtwaHIyZA3Q2eFVtaGpZAZAnVlN0I4VmJubUNabU1WTUdrbVctM2R4cC1jdGluOS1aY1BxSWhyLVFNYi1mc1FfR1o3RV9UNEpacXVYbXZA2Sjdwa0lVRTRkLVNKSGloYzJCSFFuQ0g2Vk8wZAzZAxVkE1R3l4NkNsNHVScW4xXzR0NgZDZD';
    var options = {
        method: 'GET',
        url: 'https://graph.facebook.com/' + personalId,
        qs: {fields: 'impersonate_token'},
        headers: {
            authorization: 'Bearer ' + app_token
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        var obj = JSON.parse(body);

        var impersonate_token = obj.impersonate_token;
        console.log(impersonate_token);
        var options2 = {
            method: 'POST',
            url: 'https://graph.facebook.com/' + groupId + "/feed",
            headers: {
                authorization: 'Bearer ' + impersonate_token
            },
            body: {
                "message": message,
                "type": "status"
            },
            json: true
        };
        request(options2, function (error, response, body) {
            if (error) throw new Error(error);

            console.log(body);
        });
    });

}
// FBapi("hello", "1000116371355071", "100011637135507");