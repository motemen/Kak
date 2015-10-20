import * as ipc from 'ipc';
import * as remote from 'remote';

let fs = remote.require('fs');
let dialog = remote.require('dialog');

let kakMainElement = <IKakMainElement>document.querySelector('#kakMain');

kakMainElement.addEventListener('kak:reset', (ev: CustomEvent) => {
  let file = <IKakFile>ev.detail;
  remote.getCurrentWindow().setTitle(file && file.path ? `${file.path} - Kak` : 'Kak');
});

kakMainElement.registerRPCHandler('openFile', (_: any, ok: (v: any) => void, ng: (e: any) => void) => {
  dialog.showOpenDialog(
    {
      filters: [
        { name: 'Text files', extensions: ['txt', 'md', 'adoc'] },
        { name: 'All files', extensions: ['*'] }
      ]
    }, (fileNames: string[]) => {
      if (fileNames === undefined) {
        ok(null);
        return;
      }

      fs.readFile(fileNames[0], (err: NodeJS.ErrnoException, data: Buffer) => {
        if (err) {
          ng(err);
          return;
        }

        ok({ path: fileNames[0], content: data.toString() });
      });
    }
  );
});

kakMainElement.registerRPCHandler('saveFile', (file: IKakFile, ok: (v: any) => void, ng: (e: any) => void) => {
  if (file.path) {
    fs.writeFile(file.path, file.content, (err: NodeJS.ErrnoException) => {
      if (err) {
        ng(err);
        return;
      }

      ok(file.path);
    });
    return;
  }

  dialog.showSaveDialog((fileName: string) => {
    if (fileName === undefined) {
      ok(null);
      return;
    }

    fs.writeFile(fileName, file.content, (err: NodeJS.ErrnoException) => {
      if (err) {
        ng(err);
        return;
      }

      ok(fileName);
    });
  });
});
