import RuleEngine from 'node-rules';

export const setSLA = () => {
  // console.log("engine1");
  // const
  //   name = "iCareMember",
  //   rules = [{
  //     name,
  //     "condition": function (R) {
  //       R.when(this && this.noOfIcareMembers > 120);
  //     },
  //     "consequence": function (R) {
  //       this.result = false;
  //       R.stop();
  //     }
  //   }],
  //   fact = {
  //     customers: [{noOfIcareMembers: 10}, {noOfIcareMembers: 10}]
  //   },
  //   R = new RuleEngine(rules)
  //   ;
  //
  // R.execute(fact, function (result) {
  //   console.log(result);
  //   if (result.result) {
  //     console.log("touch the threshold - notify");
  //   } else {
  //     console.log("still ok");
  //   }
  // });
  //
  // console.log("engine2");
  const
    name2 = "iCareMember2",
    rules2 = [
      {
        "name": "iCareMember2",
        "priority": 3,
        "condition": function (R) {
          console.log(`check ${name2}`);
          // console.log(this);
          R.when(this && this.noOfIcareMembers > 120);
        },
        "consequence": function (R) {
          // console.log(this.result);
          // this.result = "iCareMember2";
          console.log("noOfIcareMembers is greater than 120");
          R.next();
        }
      },
      {
        "name": "Customer",
        "priority": 3,
        "condition": function (R) {
          console.log(`check Customer`);
          R.when(this && this.noOfResignedMember > 1000);
        },
        "consequence": function (R) {
          // console.log(this.result);
          // this.result = true;
          console.log("noOfResignedMember is greater than 1000");
          R.next();
        }
      }
    ],
    fact2 = {
      noOfIcareMembers: 100,
      noOfResignedMember: 15000
    }
    ;

  export const R2 = new RuleEngine(rules2);

  // R2.execute(fact2, function (result) {
  //   console.log(result);
  //   // if (result.result) {
  //   //   console.log("touch the threshold of engine 2 - notify");
  //   // } else {
  //   //   console.log("still ok with engine 2");
  //   // }
  // });
  // console.log(R2.toJSON());
};