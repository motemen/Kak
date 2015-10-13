import * as ipc from 'ipc';

let kakMain = <IKakMainElement>document.querySelector('#kakMain');

kakMain.addEventListener(
  'kak:command:openFile', () => {
    console.log('a');
    (<any>ipc).send('openFile');
  }, true
);

ipc.on('openFile:fileChosen', (arg: IKakFile) => {
  console.log(arg);
  kakMain.openFile(arg);
});
