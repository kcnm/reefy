import * as React from 'react';

import { KeyEventType } from '../types';
import { ConfigStore } from '../stores/ConfigStore';
import { CursorStore } from '../stores/CursorStore';
import { FileStore } from '../stores/FileStore';
import { ClickOnCodeAreaAction } from '../actions/ClickOnCodeAreaAction';
import { ClickOnCodeLineAction } from '../actions/ClickOnCodeLineAction';
import { KeyOnCursorAction } from '../actions/KeyOnCursorAction';

import { CodeLine } from './CodeLine';
import { Cursor } from './Cursor';


export class CodeArea extends React.Component<{}, any> {

  constructor(props: {}) {
    super(props);
    this.state = {
      config: ConfigStore.getConfig(),
      lines: FileStore.getLines(),
      cursorPosition: CursorStore.getPosition(),
      cursorSelection: CursorStore.getSelection()
    };
    this._handleClick = this._handleClick.bind(this);
    this._handleClickOnCodeLine = this._handleClickOnCodeLine.bind(this);
    this._handleKeyOnCursor = this._handleKeyOnCursor.bind(this);
  }

  render() {
    var cfg = this.state.config;
    var style = {
      fontSize: cfg.fontSize,
      fontFamily: cfg.fontFamily,
      lineHeight: cfg.lineHeight + 'px'
    };

    var codeLineHandlers = {
      handleClickOnLine: this._handleClickOnCodeLine
    };
    var codeLines = this.state.lines.map(function(line: string, idx: number) {
      return (
        <CodeLine key={idx}
            config={cfg}
            lineNum={idx}
            code={line}
            selection={this.state.cursorSelection}
            handlers={codeLineHandlers} />
      );
    }, this);

    var cursorHandlers = {
      handleKeyEvent: this._handleKeyOnCursor
    };

    return (
      <div className="code-area" style={style}
          onClick={this._handleClick}>
        <Cursor
            config={cfg}
            position={this.state.cursorPosition}
            handlers={cursorHandlers} />
        {codeLines}
      </div>
    );
  }

  private _handleClick(ev: React.MouseEvent) {
    ev.stopPropagation();
    ClickOnCodeAreaAction.create();
    this._setCursorPosition();
  }

  private _handleClickOnCodeLine(ev: React.MouseEvent, lineNum: number) {
    ev.stopPropagation();
    let nativeEvent: any = ev.nativeEvent;  // Workaround for typescript check.
    ClickOnCodeLineAction.create(nativeEvent, lineNum);
    this._setCursorPosition();
  }

  private _handleKeyOnCursor(ev: React.KeyboardEvent, type: KeyEventType) {
    KeyOnCursorAction.create(ev, type);
    this._setLinesAndCursorPosition();
  }

  private _setCursorPosition() {
    this.setState({
      cursorPosition: CursorStore.getPosition(),
      cursorSelection: CursorStore.getSelection()
    });
  }

  private _setLinesAndCursorPosition() {
    this.setState({
      lines: FileStore.getLines(),
      cursorPosition: CursorStore.getPosition(),
      cursorSelection: CursorStore.getSelection()
    });
  }

}
