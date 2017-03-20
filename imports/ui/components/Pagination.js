import React, {PropTypes} from 'react';

const Pagination = (props) => {
  const {} = props;
  
  return (
    <ul className="pagination" style={{visibility: 'visible'}}>
      <li className="prev disabled">
        <a href="#" title="First"><i className="fa fa-angle-double-left"/></a>
      </li>
      <li className="prev disabled">
        <a href="#" title="Prev"><i className="fa fa-angle-left"/></a>
      </li>
      <li className="active"><a href="#">1</a></li>
      <li><a href="#">2</a></li>
      <li><a href="#">3</a></li>
      <li><a href="#">4</a></li>
      <li><a href="#">5</a></li>
      <li className="next"><a href="#" title="Next"><i className="fa fa-angle-right"></i></a></li>
      <li className="next"><a href="#" title="Last"><i className="fa fa-angle-double-right"></i></a></li>
    </ul>
  );
};

Pagination.propTypes = {

};

export default Pagination