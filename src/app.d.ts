interface IKakFile {
  path:    string;
  content: string;
  isDirty: boolean;
}

interface IKakMainElement extends polymer.Base, HTMLElement {
  openFile(file: IKakFile): void;
  notify(msg: string): void;
  reset(file?: { path?: string; content?: string }): void;
}

declare module polymer {
  interface PolymerStatic {
    updateStyles(): void;
  }
}
