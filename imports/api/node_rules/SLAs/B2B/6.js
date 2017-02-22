import RuleEngine from 'node-rules';

export const SLA_B2B_6 = () => {
    const
        name6 = "iCareMember6",
        rules6 = [
            {
                "name": name6,
                "priority": 3,
                "condition": function (R) {
                    console.log(`checking "${name6}"`);
                    this.name = name6;
                    R.when(this && this.noOfMatchedMember > 10);
                },
                "consequence": function (R) {
                    this.result = false;
                    this.message = `There are ${this.noOfMatchedMember} resigned iCare Members who has active loan in last ${this.period} week`;
                    R.stop();
                }
            }
        ],
        fact6 = {
            status: "resigned",
            period:1,
            groupId: 10000321,
            noOfMatchedMember: 14,
        }
        ;

    export const R6 = new RuleEngine(rules6);

    R6.execute(fact6, function (result) {

        if (result.result) {
            console.log(`still ok with rule "${result.name}"`);
        } else {
            console.log(`touch the threshold of "${result.name}" - send notify`);
            console.log(`"${result.message}" posted to facebook groupId:${result.groupId}`);
        }
        // console.log(result);
    });
    // console.log(R2.toJSON());
};