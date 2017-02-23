import createSLA from './functions/slas';
import {FbRequest} from '../facebook';


export const TestSLA = () => {
  // Test rule 1
  const ruleConditions = [
    {
      name: 'rule_customerHaveNoIcareMembers',
      priority: 1,
      condition: "noOfCustomersHaveNoIcareMembers",
      operator: "greaterThan",
      threshold: 200
    }
  ];

  const fact = {
    id: 1,
    noOfCustomersHaveNoIcareMembers: 300,
    notify: false
  };

  const SLA_B2B_1 = createSLA(ruleConditions);

  SLA_B2B_1.execute(fact, function(result) {
    // console.log(result)
    if(result.notify) {
      //test only
      const fbRequest = new FbRequest("TEST - SLA B2B 1", 583378391828836, 100011637135507);
      fbRequest.post();
    } else {
      console.log(`log into log file`);
    }
  });
};