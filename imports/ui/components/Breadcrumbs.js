import React, {PropTypes} from 'react';
import classNames from 'classnames';

const Breadcrumbs = (props) => {
  const {crumbs, active} = props;
  return (
    <ol className="breadcrumb">
      {crumbs.map(item => {
        const {id, href = '#', title} = item;
        return (
          <li
            key={`bread-${id}`}
            className={classNames({'active': id === active})}
          >
            {id === active
              ? title
              : <a href={href}>{title}</a>
            }
          </li>
        );
      })}
    </ol>
  );
};

Breadcrumbs.propTypes = {
  crumbs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      href: PropTypes.string,
      title: PropTypes.string,
    })
  ),
  active: PropTypes.string,
};

export default Breadcrumbs