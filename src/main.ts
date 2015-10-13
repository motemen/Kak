// Electron
import * as app           from 'app';
import * as ipc           from 'ipc';
import * as dialog        from 'dialog';
import * as BrowserWindow from 'browser-window';

// node
import * as fs from 'fs';

let editorWindow: GitHubElectron.BrowserWindow;

app.on('ready', () => {
  editorWindow = new BrowserWindow({ 'use-content-size': true });
  editorWindow.setTitle('Kak');
  editorWindow.loadUrl('file://' + __dirname + '/../view/editor.html');
  editorWindow.on('closed', () => { editorWindow = null });
  editorWindow.openDevTools({ detach: true });
});

ipc.on('openFile', (ev: any) => {
  dialog.showOpenDialog(
    {
      filters: [
        { name: 'Text files', extensions: ['txt', 'md', 'adoc'] }
      ]
    }, (fileNames: string[]) => {
      if (fileNames === undefined) {
        ev.sender.send('openFile:cancelled');
      } else {
        fs.readFile(fileNames[0], (err: NodeJS.ErrnoException, data: Buffer) => {
          ev.sender.send('openFile:fileChosen', { path: fileNames[0], content: data.toString() });
        });
      }
    }
  );
});
