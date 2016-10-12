import * as React from 'react';

import Config from '../types/Config';
import CursorPosition from '../types/CursorPosition';
import CursorSelection from '../types/CursorSelection';
import ConfigStore from '../stores/ConfigStore';
import FileStore from '../stores/FileStore';
import CursorStore from '../stores/CursorStore';
import removeSelection from '../actions/RemoveSelection';
import insert from '../actions/Insert';
import cursorKeyDown from '../actions/cursor/KeyDown';
import cursorKeyPress from '../actions/cursor/KeyPress';
import cursorKeyUp from '../actions/cursor/KeyUp';
import CodeLine from './CodeLine';
import Cursor from './Cursor';


interface CodeAreaState {
  config?: Config;
  lines?: string[];

  cursorPosition?: CursorPosition;
  cursorSelection?: CursorSelection;
}

export default class CodeArea extends React.Component<{}, CodeAreaState> {

  constructor(props: {}) {
    super(props);
    this.state = {
      config: ConfigStore.getConfig(),
      lines: FileStore.getLines(),
      cursorPosition: CursorStore.getPosition(),
      cursorSelection: CursorStore.getSelection(),
    };
    this._handleMouseDown = this._handleMouseDown.bind(this);
    this._handleMouseMove = this._handleMouseMove.bind(this);
    this._handleMouseUp = this._handleMouseUp.bind(this);
    this._handleCursorKeyDown = this._handleCursorKeyDown.bind(this);
    this._handleCursorKeyPress = this._handleCursorKeyPress.bind(this);
    this._handleCursorKeyUp = this._handleCursorKeyUp.bind(this);
  }

  render() {
    let cfg = this.state.config;
    let style = {
      fontSize: cfg.fontSize,
      fontFamily: cfg.fontFamily,
      lineHeight: cfg.lineHeight + 'px',
      tabSize: cfg.tabSize,
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
      handleKeyDown: this._handleCursorKeyDown,
      handleKeyPress: this._handleCursorKeyPress,
      handleKeyUp: this._handleCursorKeyUp,
    };

    return (
      <div className="code-area" style={style}
          ref={(ref) => this._ref = ref }
          onMouseDown={this._handleMouseDown}
          onMouseMove={this._handleMouseMove}
          onMouseUp={this._handleMouseUp}>
        <Cursor
            config={cfg}
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

  private _setCursorPosition() {
    this.setState({
      cursorPosition: CursorStore.getPosition(),
      cursorSelection: CursorStore.getSelection(),
    });
  }

  private _setLinesAndCursorPosition() {
    this.setState({
      lines: FileStore.getLines(),
      cursorPosition: CursorStore.getPosition(),
      cursorSelection: CursorStore.getSelection(),
    });
  }

  private _getMouseEventCursorPosition(ev: React.MouseEvent) {
    let rect = this._ref.getClientRects()[0];
    let x = ev.clientX - rect.left;
    let y = ev.clientY - rect.top;
    return CursorStore.getPositionByPx({x: x, y: y});
  }

  private _handleMouseDown(ev: React.MouseEvent) {
    ev.preventDefault();
    let pos = this._getMouseEventCursorPosition(ev);
    CursorStore.moveTo(pos);
    CursorStore.enterVisual();
    this._setCursorPosition();
  }

  private _handleMouseMove(ev: React.MouseEvent) {
    ev.preventDefault();
    if (CursorStore.isInVisual()) {
      let pos = this._getMouseEventCursorPosition(ev);
      CursorStore.moveTo(pos);
      this._setCursorPosition();
    }
  }

  private _handleMouseUp(ev: React.MouseEvent) {
    ev.preventDefault();
    CursorStore.exitVisual();
    this._setCursorPosition();
  }

  private _handleCursorKeyDown(ev: React.KeyboardEvent) {
    cursorKeyDown(ev);
    this._setLinesAndCursorPosition();
  }

  private _handleCursorKeyPress(ev: React.KeyboardEvent) {
    cursorKeyPress(ev);
    this._setLinesAndCursorPosition();
  }

  private _handleCursorKeyUp(ev: React.KeyboardEvent) {
    cursorKeyUp(ev);
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
    removeSelection();
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
