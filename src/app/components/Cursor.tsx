import * as React from 'react';

import { Config, CursorPosition, KeyEventType } from '../types';
import { CursorStore } from '../stores/CursorStore';


export interface CursorHandlers {
  handleKeyEvent(ev: React.KeyboardEvent, type: KeyEventType): void;
}

export interface CursorProps {
  config: Config;
  position: CursorPosition;
  handlers: CursorHandlers;
}

export class Cursor extends React.Component<CursorProps, {}> {

  constructor(props: CursorProps) {
    super(props);
    this._handleKeyDown = this._handleKeyDown.bind(this);
    this._handleKeyPress = this._handleKeyPress.bind(this);
    this._handleKeyUp = this._handleKeyUp.bind(this);
  }

  render() {
    let cfg = this.props.config;
    let pos = this.props.position;
    let posPx = CursorStore.getCursorPositionPx(pos.row, pos.col);
    let style = {
      left: posPx.x,
      top: posPx.y,
      width: cfg.fontSize * 0.5,
      height: cfg.lineHeight,
      fontSize: cfg.fontSize,
      fontFamily: cfg.fontFamily,
      lineHeight: `${cfg.lineHeight}px`
    };

    return (
      <textarea className="cursor" style={style}
          ref={(ref) => this._textarea = ref }
          onKeyDown={this._handleKeyDown}
          onKeyPress={this._handleKeyPress}
          onKeyUp={this._handleKeyUp}>
      </textarea>
    );
  }

  componentDidUpdate() {
    this._textarea.focus();
  }

  private _textarea: HTMLTextAreaElement

  private _handleKeyDown(ev: React.KeyboardEvent) {
    this.props.handlers.handleKeyEvent(ev, KeyEventType.KeyDown);
  }

  private _handleKeyPress(ev: React.KeyboardEvent) {
    ev.preventDefault();
    this.props.handlers.handleKeyEvent(ev, KeyEventType.KeyPress);
  }

  private _handleKeyUp(ev: React.KeyboardEvent) {
    this.props.handlers.handleKeyEvent(ev, KeyEventType.KeyUp);
  }

}
