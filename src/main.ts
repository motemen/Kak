// Electron
import * as app           from 'app';
import * as ipc           from 'ipc';
import * as dialog        from 'dialog';
import * as BrowserWindow from 'browser-window';

// node
import * as fs from 'fs';

let editorWindow: GitHubElectron.BrowserWindow;

app.on('ready', () => {
  editorWindow = new BrowserWindow({});
  editorWindow.setTitle('Kak');
  editorWindow.loadUrl('file://' + __dirname + '/../view/editor.html');
  editorWindow.on('closed', () => { editorWindow = null });
  editorWindow.openDevTools({ detach: true });
});

ipc.on('openFile', (ev: any) => {
  dialog.showOpenDialog(
    {
      filters: [
        { name: 'Text files', extensions: ['txt', 'md', 'adoc'] },
        { name: 'All files', extensions: ['*'] }
      ]
    }, (fileNames: string[]) => {
      if (fileNames === undefined) {
        ev.sender.send('openFile:cancelled');
      } else {
        fs.readFile(fileNames[0], (err: NodeJS.ErrnoException, data: Buffer) => {
          if (err) {
            ev.sender.send('error', err);
            return;
          }
          ev.sender.send('openFile:fileChosen', { path: fileNames[0], content: data.toString() });
        });
      }
    }
  );
});

ipc.on('saveFile', (ev: any, file: IKakFile) => {
  console.log(ev, file)
  if (file.path) {
    fs.writeFile(file.path, file.content, (err: NodeJS.ErrnoException) => {
      if (err) {
        ev.sender.send('error', err);
        return;
      }
      ev.sender.send('saveFile:done', file.path);
    });
  } else {
    dialog.showSaveDialog(editorWindow, (fileName: string) => {
      if (fileName === undefined) {
        ev.sender.send('saveFile:cancelled');
      } else {
        fs.writeFile(fileName, file.content, (err: NodeJS.ErrnoException) => {
          if (err) {
            ev.sender.send('error', err);
            return;
          }
          ev.sender.send('saveFile:done', fileName);
        });
      }
    });
  }
});

ipc.on('reset', (ev: any, file?: IKakFile) => {
  editorWindow.setTitle(file && file.path ? `${file.path} - Kak` : 'Kak');
});
