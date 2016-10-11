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
  flash: boolean;
  position: CursorPosition;
  handlers: CursorHandlers;
}

export default class Cursor extends React.Component<CursorProps, {}> {

  constructor(props: CursorProps) {
    super(props);
  }

  render() {
    let cfg = this.props.config;
    let pos = CursorStore.getPositionPx();
    let cursorClassName = "cursor " + (this.props.flash ? "flash" : "");
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

    return (
      <div className={cursorClassName} style={cursorStyle}>
        <textarea style={textareaStyle}
            ref={(ref) => this._textarea = ref }
            onKeyDown={handlers.handleKeyDown}
            onKeyPress={handlers.handleKeyPress}
            onKeyUp={handlers.handleKeyUp}>
        </textarea>
      </div>
    );
  }

  componentDidUpdate() {
    this._textarea.focus();
  }

  private _textarea: HTMLTextAreaElement

}
