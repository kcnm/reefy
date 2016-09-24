import * as React from 'react';

import Config from '../types/Config';
import CursorPosition from '../types/CursorPosition';
import KeyEvent from '../types/KeyEvent';

import CursorStore from '../stores/CursorStore';


interface CursorHandlers {
  handleKeyEvent(ev: React.KeyboardEvent, type: KeyEvent): void;
}

interface CursorProps {
  config: Config;
  flash: boolean;
  position: CursorPosition;
  handlers: CursorHandlers;
}

export default class Cursor extends React.Component<CursorProps, {}> {

  constructor(props: CursorProps) {
    super(props);
    this._handleKeyDown = this._handleKeyDown.bind(this);
    this._handleKeyPress = this._handleKeyPress.bind(this);
    this._handleKeyUp = this._handleKeyUp.bind(this);
  }

  render() {
    let cfg = this.props.config;
    let pos = this.props.position;
    let posPx = CursorStore.getPositionPx(pos.row, pos.col);
    let cursorClassName = "cursor " + (this.props.flash ? "flash" : "");
    let cursorStyle = {
      left: posPx.x,
      top: posPx.y,
    };
    let textareaStyle = {
      height: cfg.lineHeight,
      fontSize: cfg.fontSize,
      fontFamily: cfg.fontFamily,
      lineHeight: `${cfg.lineHeight}px`,
    };

    return (
      <div className={cursorClassName} style={cursorStyle}>
        <textarea style={textareaStyle}
            ref={(ref) => this._textarea = ref }
            onKeyDown={this._handleKeyDown}
            onKeyPress={this._handleKeyPress}
            onKeyUp={this._handleKeyUp}>
        </textarea>
      </div>
    );
  }

  componentDidUpdate() {
    this._textarea.focus();
  }

  private _textarea: HTMLTextAreaElement

  private _handleKeyDown(ev: React.KeyboardEvent) {
    this.props.handlers.handleKeyEvent(ev, KeyEvent.Down);
  }

  private _handleKeyPress(ev: React.KeyboardEvent) {
    ev.preventDefault();
    this.props.handlers.handleKeyEvent(ev, KeyEvent.Press);
  }

  private _handleKeyUp(ev: React.KeyboardEvent) {
    this.props.handlers.handleKeyEvent(ev, KeyEvent.Up);
  }

}
