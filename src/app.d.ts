interface IKakFile {
  path:    string;
  content: string;
  isDirty: boolean;
}

interface IKakMainElement extends polymer.Base, HTMLElement {
  openFile(file: IKakFile): void;
  notify(msg: string): void;
  reset(file?: { path?: string; content?: string }): void;

  registerRPCHandler(name: string, cb: (arg: any, ok: (v: any) => void, ng: (e: any) => void) => void): void;
}

declare module polymer {
  interface PolymerStatic {
    updateStyles(): void;
  }
}

declare module 'remote' {
  export function require(name: string): any;
  export function getCurrentWindow(): GitHubElectron.BrowserWindow;
}
