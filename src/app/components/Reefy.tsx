import * as React from 'react';

import { Editor } from './Editor';


export class Reefy extends React.Component<{}, {}> {

  render() {
    return (
      <div className="reefy">
        <Editor />
      </div>
    );
  }

}
