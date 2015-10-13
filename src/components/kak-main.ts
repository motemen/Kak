Polymer({
  is: 'kak-main',

  properties: {
    draft: {
      type: Object
    },
    isDirty: {
      type: Boolean
    }
  },

  listeners: {
    keydown: 'onKeyDown'
  },

  initializeEmptyDraft () {
    this.draft = {
      content: '',
      path: null
    };
  },

  attached () {
    this.reset(this.draft);
    this.$.editor.addEventListener('input', () => {
      this.set('draft.content', this.$.editor.text);
      this.isDirty = true;
    });

    this.$.editor.focus();
  },

  commandNew() {
    this.reset({ path: null, content: '' });
  },

  commandOpen () {
    this.fire('kak:command:openFile');
  },

  commandSave () {
    if (!this.isDirty) {
      return;
    }

    let file: IKakFile = { path: this.draft.path, content: this.$.editor.text };
    this.fire('kak:command:saveFile', file);
  },

  openFile (file: IKakFile) {
    this.reset(file);
  },

  notify (err: string) {
    this.latestError = err;
    this.$.toastError.show();
  },

  reset (file?: { path?: string; content: string }) {
    this.set('isDirty', false);

    if (file) {
      if (file.content !== undefined) {
        this.$.editor.text = file.content;
      }
      if (file.path !== undefined) {
        this.set('draft.path', file.path);
      }
    }

    this.fire('kak:reset', file);
  },

  KEYBINDS: {
    'M-O': 'commandOpen',
    'M-S': 'commandSave'
  },

  onKeyDown (ev: KeyboardEvent) {
    let key = (ev.altKey ? 'A-' : '') + (ev.ctrlKey ? 'C-' : '') + (ev.metaKey ? 'M-' : '') + (ev.shiftKey ? 'S-' : '') + String.fromCharCode(ev.keyCode);

    let action = this.KEYBINDS[key];
    if (action) {
      this[action]();
    }
  }
});
