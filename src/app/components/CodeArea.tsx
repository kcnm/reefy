import * as React from 'react';

import Config from '../types/Config';
import CursorPosition from '../types/CursorPosition';
import CursorSelection from '../types/CursorSelection';
import KeyEvent from '../types/KeyEvent';

import ConfigStore from '../stores/ConfigStore';
import CursorStore from '../stores/CursorStore';
import FileStore from '../stores/FileStore';

import clickOnCodeArea from '../actions/ClickOnCodeAreaAction';
import clickOnCodeLine from '../actions/ClickOnCodeLineAction';
import keyOnCursor from '../actions/KeyOnCursorAction';

import CodeLine from './CodeLine';
import Cursor from './Cursor';


interface CodeAreaState {
  config?: Config;
  lines?: string[];

  cursorFlash?: boolean;
  cursorPosition?: CursorPosition;
  cursorSelection?: CursorSelection;
}

export default class CodeArea extends React.Component<{}, CodeAreaState> {

  cursorFlashTimeoutId: number;

  constructor(props: {}) {
    super(props);
    this.state = {
      config: ConfigStore.getConfig(),
      lines: FileStore.getLines(),
      cursorFlash: true,
      cursorPosition: CursorStore.getPosition(),
      cursorSelection: CursorStore.getSelection(),
    };
    this._handleClick = this._handleClick.bind(this);
    this._handleClickOnCodeLine = this._handleClickOnCodeLine.bind(this);
    this._handleKeyOnCursor = this._handleKeyOnCursor.bind(this);

    this.cursorFlashTimeoutId = undefined;
  }

  render() {
    let cfg = this.state.config;
    let style = {
      fontSize: cfg.fontSize,
      fontFamily: cfg.fontFamily,
      lineHeight: cfg.lineHeight + 'px',
    };

    let codeLineHandlers = {
      handleClickOnLine: this._handleClickOnCodeLine
    };
    let codeLines = this.state.lines.map((line: string, idx: number) => {
      return (
        <CodeLine key={idx}
            config={cfg}
            lineNum={idx}
            code={line}
            selection={this.state.cursorSelection}
            handlers={codeLineHandlers} />
      );
    });

    let cursorHandlers = {
      handleKeyEvent: this._handleKeyOnCursor
    };

    this._setCursorFlashTimeout();

    return (
      <div className="code-area" style={style}
          onClick={this._handleClick}>
        <Cursor
            config={cfg}
            flash={this.state.cursorFlash}
            position={this.state.cursorPosition}
            handlers={cursorHandlers} />
        {codeLines}
      </div>
    );
  }

  private _setCursorFlashTimeout() {
    if (!this.cursorFlashTimeoutId) {
      this.cursorFlashTimeoutId = setTimeout(() => {
        this.cursorFlashTimeoutId = undefined;
        this.setState({
          cursorFlash: !this.state.cursorFlash,
        });
      }, 1000);
    }
  }

  private _clearCursorFlashTimeout(flash = true) {
    if (this.cursorFlashTimeoutId) {
      clearTimeout(this.cursorFlashTimeoutId);
      this.cursorFlashTimeoutId = undefined;
    }
  }

  private _setCursorPosition() {
    this._clearCursorFlashTimeout();
    this.setState({
      cursorFlash: true,
      cursorPosition: CursorStore.getPosition(),
      cursorSelection: CursorStore.getSelection(),
    });
  }

  private _setLinesAndCursorPosition() {
    this._clearCursorFlashTimeout();
    this.setState({
      lines: FileStore.getLines(),
      cursorFlash: true,
      cursorPosition: CursorStore.getPosition(),
      cursorSelection: CursorStore.getSelection(),
    });
  }

  private _handleClick(ev: React.MouseEvent) {
    ev.stopPropagation();
    clickOnCodeArea();
    this._setCursorPosition();
  }

  private _handleClickOnCodeLine(ev: React.MouseEvent, lineNum: number) {
    ev.stopPropagation();
    let nativeEvent: any = ev.nativeEvent;  // Workaround for typescript check.
    clickOnCodeLine(nativeEvent.offsetX, lineNum);
    this._setCursorPosition();
  }

  private _handleKeyOnCursor(ev: React.KeyboardEvent, type: KeyEvent) {
    keyOnCursor(ev, type);
    this._setLinesAndCursorPosition();
  }

}
