import React, {PropTypes} from 'react';

const NoContent = (props) => {
  const
    {
      icon = "fa fa-folder-o",
      message = "There is no content."
    } = props,
    styles = {
      container: {
        width: '80%',
        height: '300px',
        margin: '0 auto',
        border: '2px dashed #ddd',
        padding: 50,
        textAlign: 'center'
      },
      msg: {
        textAlign: 'center'
      },
      icon: {
        fontSize: 40,
        color: '#ddd'
      }
    }
    ;
  return (
    <div style={styles.container}>
      <i className={icon} style={styles.icon}></i>
      <h2 style={styles.msg}>{message}</h2>
    </div>
  );
};

NoContent.propTypes = {
  icon: PropTypes.string,
  message: PropTypes.string,
};

export default NoContent

