import createSLA from './functions/slas';



// Test rule 1
const ruleConditions = [
  {
    name: 'rule_customerHaveNoIcareMembers',
    priority: 1,
    condition: "noOfCustomersHaveNoIcareMembers",
    operator: "greaterThan",
    threshold: 120
  }
];

const fact = {
  id: 1,
  noOfCustomersHaveNoIcareMembers: 150,
  notify: false
};

const SLA_B2B_1 = createSLA(ruleConditions);

SLA_B2B_1.execute(fact, function(result) {
  // console.log(result)
  if(result.notify) {
    console.log(`notify to fb@work`);
  } else {
    console.log(`log into log file`);
  }
});