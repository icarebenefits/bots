import RuleEngine from 'node-rules';

export const SLA_B2B_7 = () => {
    const
        name7 = "iCareMember7",
        rules7 = [
            {
                "name": name7,
                "priority": 3,
                "condition": function (R) {
                    console.log(`checking "${name7}"`);
                    this.name = name7;
                    R.when(this && this.noOfMatchedMember > 10);
                },
                "consequence": function (R) {
                    this.result = false;
                    this.message = `There are ${this.noOfMatchedMember}  iCare Members started maternity leave in last ${this.period} days`;
                    R.stop();
                }
            }
        ],
        fact7 = {
            status: "maternityLeave",
            period:10,
            groupId: 10000321,
            noOfMatchedMember: 23,
        }
        ;

    export const R7 = new RuleEngine(rules7);

    R7.execute(fact7, function (result) {

        if (result.result) {
            console.log(`still ok with rule "${result.name}"`);
        } else {
            console.log(`touched the threshold of "${result.name}" - send notify`);
            console.log(`"${result.message}" posted to facebook groupId:${result.groupId}`);
        }
        // console.log(result);
    });
    // console.log(R2.toJSON());
};