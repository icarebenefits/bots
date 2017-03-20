import React from 'react';

// components
import {Button} from '../../components/elements';

const Discover = () => (
      <div>
        <h1>
          Welcome to the Icare bots
        </h1>

        <h2>Buttons</h2>
        <div>Button with onClick:
          <Button
            className="btn-success"
            onClick={() => console.log('click on button')}
          >Click me</Button>
        </div>
        <div>A link:
          <Button
            href="http://reactjs.com"
            className="btn-link"
          >Follow me</Button>
        </div>
        <div>Custom class name:
          <Button
          >I do nothing</Button>
        </div>
      </div>
    );

export default Discover