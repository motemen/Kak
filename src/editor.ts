import * as ipc from 'ipc';

let kakMain = <IKakMainElement>document.querySelector('#kakMain');

kakMain.addEventListener('kak:command:openFile', () => {
  (<any>ipc).send('openFile')
}, true);

kakMain.addEventListener('kak:command:saveFile', (ev: any) => {
  (<any>ipc).send('saveFile', ev.detail);
}, true);

kakMain.addEventListener('kak:reset', (ev: any) => {
  (<any>ipc).send('reset', ev.detail);
});

ipc.on('openFile:fileChosen', (arg: IKakFile) => {
  console.log(arg);
  kakMain.openFile(arg);
});

ipc.on('error', (msg: string) => {
  kakMain.notify(msg);
});

ipc.on('saveFile:done', (path: string) => {
  kakMain.reset();
  kakMain.notify('File saved: ' + path);
});
