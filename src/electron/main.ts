// Electron
import * as app           from 'app';
import * as BrowserWindow from 'browser-window';
import * as Menu          from 'menu';

let editorWindow: GitHubElectron.BrowserWindow;

app.on('ready', () => {
  editorWindow = new BrowserWindow({});
  editorWindow.setTitle('Kak');
  editorWindow.loadUrl('file://' + __dirname + '/view/editor.html');
  editorWindow.on('closed', () => { editorWindow = null });

  // Create the Application's main menu
  let template = [{
      label: "Application",
      submenu: [
          { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
          { type: "separator" },
          { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
      ]}, {
      label: "Edit",
      submenu: [
          { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
          { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
          { type: "separator" },
          { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
          { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
          { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
          { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
      ]}
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
});
