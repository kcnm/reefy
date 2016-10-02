import * as React from 'react';

import Config from '../types/Config';
import CursorPosition from '../types/CursorPosition';
import CursorSelection from '../types/CursorSelection';

import CursorStore from '../stores/CursorStore';


interface CodeLineProps {
  config: Config;
  lineNum: number;
  code: string;
  selection: CursorSelection;
}

export default class CodeLine extends React.Component<CodeLineProps, {}> {

  constructor(props: CodeLineProps) {
    super(props);
  }

  render() {
    let style = this.props.code ? {} : {
      display: 'block',
      height: this.props.config.lineHeight,
    };

    let content = [
      <span key="normal" style={style}>
        {this.props.code}
      </span>
    ];

    let sel = this.props.selection;
    if (sel) {
      let prolog = this._intersect(sel.begin);
      let epilog = this._intersect(sel.end);
      if (prolog < epilog) {
        content = [
          <span key="prolog" style={style}>
            {this.props.code.slice(0, prolog)}
          </span>,
            <span key="select" className="highlight" style={style}>
            {this.props.code.slice(prolog, epilog)}
          </span>,
          <span key="epilog" style={style}>
            {this.props.code.slice(epilog)}
          </span>
        ];
      }
    }

    return (
      <div className="code-line">
        {content}
      </div>
    );
  }

  private _intersect(pos: CursorPosition) {
    if (pos.row < this.props.lineNum) {
      return 0;
    } else if (pos.row > this.props.lineNum) {
      return this.props.code.length;
    }
    return pos.col;
  }

}
