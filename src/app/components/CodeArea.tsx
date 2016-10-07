import * as React from 'react';

import Config from '../types/Config';
import CursorPosition from '../types/CursorPosition';
import CursorSelection from '../types/CursorSelection';
import KeyEvent from '../types/KeyEvent';

import ConfigStore from '../stores/ConfigStore';
import CursorStore from '../stores/CursorStore';
import FileStore from '../stores/FileStore';

import insert from '../actions/InsertAction';
import keyOnCursor from '../actions/KeyOnCursorAction';
import maybeRemoveSelection from '../actions/MaybeRemoveSelectionAction';

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
    this._handleMouseMove = this._handleMouseMove.bind(this);
    this._handleMouseUp = this._handleMouseUp.bind(this);
    this._handleCopy = this._handleCopy.bind(this);
    this._handleCut = this._handleCut.bind(this);
    this._handlePaste = this._handlePaste.bind(this);

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
          onMouseDown={this._handleMouseDown}
          onMouseMove={this._handleMouseMove}
          onMouseUp={this._handleMouseUp}>
        <Cursor
            config={cfg}
            flash={this.state.cursorFlash}
            position={this.state.cursorPosition}
            handlers={cursorHandlers} />
        {codeLines}
      </div>
    );
  }

  componentDidMount() {
    this._ref.addEventListener('copy', this._handleCopy);
    this._ref.addEventListener('cut', this._handleCut);
    this._ref.addEventListener('paste', this._handlePaste);
  }

  componentWillUnmount() {
    this._ref.removeEventListener('paste', this._handlePaste);
    this._ref.removeEventListener('cut', this._handleCut);
    this._ref.removeEventListener('copy', this._handleCopy);
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

  private _getMouseEventCursorPosition(ev: React.MouseEvent) {
    let rect = this._ref.getClientRects()[0];
    let x = ev.clientX - rect.left;
    let y = ev.clientY - rect.top;
    return FileStore.getRCPositionByXY(x, y);
  }

  private _handleMouseDown(ev: React.MouseEvent) {
    ev.preventDefault();
    let pos = this._getMouseEventCursorPosition(ev);
    CursorStore.moveTo(pos.row, pos.col);
    CursorStore.enterVisual();
    this._setCursorPosition();
  }

  private _handleMouseMove(ev: React.MouseEvent) {
    ev.preventDefault();
    if (CursorStore.isInVisual()) {
      let pos = this._getMouseEventCursorPosition(ev);
      CursorStore.moveTo(pos.row, pos.col);
      this._setCursorPosition();
    }
  }

  private _handleMouseUp(ev: React.MouseEvent) {
    ev.preventDefault();
    CursorStore.exitVisual();
    this._setCursorPosition();
  }

  private _handleKeyOnCursor(ev: React.KeyboardEvent, type: KeyEvent) {
    keyOnCursor(ev, type);
    this._setLinesAndCursorPosition();
  }

  private _handleCopy(ev: ClipboardEvent) {
    let text = CursorStore.getSelectedText();
    if (text) {
      ev.clipboardData.setData('text/plain', text);
    }
    ev.preventDefault();
  }

  private _handleCut(ev: ClipboardEvent) {
    let text = CursorStore.getSelectedText();
    maybeRemoveSelection();
    if (text) {
      ev.clipboardData.setData('text/plain', text);
    }
    ev.preventDefault();
  }

  private _handlePaste(ev: ClipboardEvent) {
    let text = ev.clipboardData.getData('text/plain');
    if (text) {
      insert(text);
    }
  }

}
