
export interface Config {
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
}

export interface CursorPosition {
  row: number;
  col: number;
}

export interface CursorSelection {
  begin: CursorPosition;
  end: CursorPosition;
}

export enum KeyEventType {
  KeyDown = 1,
  KeyPress,
  KeyUp
}
