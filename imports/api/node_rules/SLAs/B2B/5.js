import RuleEngine from 'node-rules';

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
            period:3,
            groupId: 10000321,
            noOfMatchedMember: 1100,
        }
        ;

    export const R5 = new RuleEngine(rules5);

    R5.execute(fact5, function (result) {

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