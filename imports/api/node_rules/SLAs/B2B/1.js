import RuleEngine from 'node-rules';


const
  name = "withoutIcareMembers",
  priority = 1,
  on = true
  ;

export default new RuleEngine([
  {
    name, priority, on,
    condition: function(R) {
      const
        {customers} = this || [],
        noOfCustomer = customers.filter(customer => {return customer.iCareMember === 0}).length
        ;
      R.when(this && noOfCustomer > 1);
    },
    consequence: function(R) {
      this.shouldNotify = true;
      // this.result = false;
      R.next();
    }
  }
]);