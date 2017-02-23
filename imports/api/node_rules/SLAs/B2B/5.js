import RuleEngine from "node-rules";
import {FbRequest} from "../../../facebook/index";

export const SLA_B2B_5 = () => {
    const
        name5 = "iCareMember5",
        rules5 = [
            {
                "name": name5,
                "priority": 3,
                "condition": function (R) {
                    console.log(`checking "${name5}"`);
                    this.name = name5;
                    R.when(this && this.noOfMatchedMember > 10);
                },
                "consequence": function (R) {
                    this.result = false;
                    this.message = `There are ${this.noOfMatchedMember} resigned iCare Members in last ${this.period} weeks`;
                    R.stop();
                }
            }
        ],
        fact5 = {
            status: "resigned",
            period: 3,
            groupId: 583378391828836, // Engineering
            personateId: 100011637135507, //vinhcq
            noOfMatchedMember: 1100,
        }
        ;

    const R5 = new RuleEngine();
    R5.register(rules5);

    R5.execute(fact5, function (result) {

        if (result.result) {
            console.log(`still ok with rule "${result.name}"`);
        } else {
            console.log(`touch the threshold of "${result.name}" - send notify`);
            console.log(`"${result.message}" posted to facebook groupId:${result.groupId}`);
            const fbRequest = new FbRequest("# Test from Meteor \n" + result.message, result.groupId, result.personateId);
            fbRequest.post();
            // postToFacebook(fbRequest);
        }
        // console.log(result);
    });
    // console.log(R2.toJSON());
};