import * as React from 'react';

import Config from '../types/Config';
import CursorPosition from '../types/CursorPosition';
import CursorSelection from '../types/CursorSelection';
import KeyEvent from '../types/KeyEvent';

import ConfigStore from '../stores/ConfigStore';
import CursorStore from '../stores/CursorStore';
import FileStore from '../stores/FileStore';

import keyOnCursor from '../actions/KeyOnCursorAction';
import mouseDownOnCodeArea from '../actions/MouseDownOnCodeAreaAction';

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
    this._handleKeyOnCursor = this._handleKeyOnCursor.bind(this);
    this._handleMouseDown = this._handleMouseDown.bind(this);

    this.cursorFlashTimeoutId = undefined;
  }

  render() {
    let cfg = this.state.config;
    let style = {
      fontSize: cfg.fontSize,
      fontFamily: cfg.fontFamily,
      lineHeight: cfg.lineHeight + 'px',
    };

    let codeLines = this.state.lines.map((line: string, idx: number) => {
      return (
        <CodeLine key={idx}
            config={cfg}
            lineNum={idx}
            code={line}
            selection={this.state.cursorSelection} />
      );
    });

    let cursorHandlers = {
      handleKeyEvent: this._handleKeyOnCursor
    };

    this._setCursorFlashTimeout();

    return (
      <div className="code-area" style={style}
          ref={(ref) => this._ref = ref }
          onMouseDown={this._handleMouseDown}>
        <Cursor
            config={cfg}
            flash={this.state.cursorFlash}
            position={this.state.cursorPosition}
            handlers={cursorHandlers} />
        {codeLines}
      </div>
    );
  }

  private _ref: HTMLDivElement

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

  private _handleMouseDown(ev: React.MouseEvent) {
    ev.stopPropagation();
    let rect = this._ref.getClientRects()[0];
    mouseDownOnCodeArea(ev.clientX - rect.left, ev.clientY - rect.top);
    this._setCursorPosition();
  }

  private _handleKeyOnCursor(ev: React.KeyboardEvent, type: KeyEvent) {
    keyOnCursor(ev, type);
    this._setLinesAndCursorPosition();
  }

}
