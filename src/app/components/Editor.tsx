import * as React from 'react';

import CodeArea from './CodeArea';


export default class Editor extends React.Component<{}, {}> {

  render() {
    return (
      <div className="editor">
        <CodeArea />
      </div>
    );
  }

}
