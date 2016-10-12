import * as React from 'react';

import Config from '../types/Config';
import CursorPosition from '../types/CursorPosition';
import CursorStore from '../stores/CursorStore';


interface CursorHandlers {
  handleKeyDown(ev: React.KeyboardEvent): void;
  handleKeyPress(ev: React.KeyboardEvent): void;
  handleKeyUp(ev: React.KeyboardEvent): void;
}

interface CursorProps {
  config: Config;
  position: CursorPosition;
  handlers: CursorHandlers;
}

interface CursorState {
  flash?: boolean;
}

export default class Cursor extends React.Component<CursorProps, CursorState> {

  constructor(props: CursorProps) {
    super(props);
    this.state = {
      flash: false,
    };
    this._handleBlur = this._handleBlur.bind(this);
    this._flashTimeout = undefined;
  }

  render() {
    let cfg = this.props.config;
    let pos = CursorStore.getPositionPx();
    let cursorClassName = "cursor " + (this.state.flash ? "flash" : "");
    let cursorStyle = {
      left: pos.x,
      top: pos.y,
    };
    let textareaStyle = {
      height: cfg.lineHeight,
      fontSize: cfg.fontSize,
      fontFamily: cfg.fontFamily,
      lineHeight: `${cfg.lineHeight}px`,
    };
    let handlers = this.props.handlers;

    if (document.activeElement == this._textarea) {
      this._setFlashTimeout();
    }

    return (
      <div className={cursorClassName} style={cursorStyle}>
        <textarea style={textareaStyle}
            ref={(ref) => this._textarea = ref }
            onBlur={this._handleBlur}
            onKeyDown={handlers.handleKeyDown}
            onKeyPress={handlers.handleKeyPress}
            onKeyUp={handlers.handleKeyUp}>
        </textarea>
      </div>
    );
  }

  componentWillReceiveProps() {
    this._textarea.focus();
    this._clearFlashTimeout();
    this.setState({
      flash: true,
    });
  }

  private _textarea: HTMLTextAreaElement
  private _flashTimeout: number

  private _setFlashTimeout() {
    if (!this._flashTimeout) {
      this._flashTimeout = setTimeout(() => {
        this._flashTimeout = undefined;
        this.setState({
          flash: !this.state.flash,
        });
      }, 1000);
    }
  }

  private _clearFlashTimeout() {
    if (this._flashTimeout) {
      clearTimeout(this._flashTimeout);
      this._flashTimeout = undefined;
    }
  }

  private _handleBlur() {
    this._clearFlashTimeout();
    this.setState({
      flash: false,
    });
  }

}
