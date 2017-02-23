import createSLA from './functions/slas';
import {FbRequest} from '../facebook';


export const B2B_1 = () => {
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
      const fbRequest = new FbRequest("TEST - SLA B2B 1: There are 120 customers without any iCare Members.", 583378391828836, 100011637135507);
      fbRequest.post();
    } else {
      console.log(`log into log file`);
    }
  });
};


export const B2B_14 = () => {
  // Test rule 14
  const ruleConditions = [
    {
      name: 'rule_femaleIcareMembersAreFemaleInLast6Months',
      priority: 1,
      condition: "femaleIcareMembersAreFemaleInLast6Months",
      operator: "greaterThanOrEqual",
      threshold: 60
    }
  ];

  const fact = {
    id: 1,
    femaleIcareMembersAreFemaleInLast6Months: 300,
    notify: false
  };

  const SLA_B2B_1 = createSLA(ruleConditions);

  SLA_B2B_1.execute(fact, function(result) {
    // console.log(result)
    if(result.notify) {
      //test only
      const fbRequest = new FbRequest("TEST - SLA B2B 14: over 60% of iCare Members are female in last 6 months", 583378391828836, 100011637135507);
      fbRequest.post();
    } else {
      console.log(`log into log file`);
    }
  });
};


export const B2B_5 = () => {
  // Test rule 5
  const ruleConditions = [
    {
      name: 'rule_noOfResignedMemberInLast3Weeks',
      priority: 1,
      condition: "femaleIcareMembersAreFemaleInLast6Months",
      operator: "greaterThanOrEqual",
      threshold: 1100
    }
  ];

  const fact = {
    id: 1,
    femaleIcareMembersAreFemaleInLast6Months: 300,
    notify: false
  };

  const SLA_B2B_1 = createSLA(ruleConditions);

  SLA_B2B_1.execute(fact, function(result) {
    // console.log(result)
    if(result.notify) {
      //test only
      const fbRequest = new FbRequest("TEST - SLA B2B 14: over 60% of iCare Members are female in last 6 months", 583378391828836, 100011637135507);
      fbRequest.post();
    } else {
      console.log(`log into log file`);
    }
  });
};