// Electron
import * as app           from 'app';
import * as BrowserWindow from 'browser-window';

let editorWindow: GitHubElectron.BrowserWindow;

app.on('ready', () => {
  editorWindow = new BrowserWindow({});
  editorWindow.setTitle('Kak');
  editorWindow.loadUrl('file://' + __dirname + '/view/editor.html');
  editorWindow.on('closed', () => { editorWindow = null });
});
