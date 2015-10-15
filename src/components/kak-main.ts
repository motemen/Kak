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
      path:    null,
      isDirty: false
    };
  },

  attached () {
    // for cases undefined is set...
    if (!this.draft) {
      this.initializeEmptyDraft();
    }

    this.reset(this.draft);
    this.$.editor.addEventListener('input', () => {
      this.set('draft.content', this.$.editor.text);
      this.set('draft.isDirty', true);
    });

    this.$.editor.focus();
  },

  commandNew() {
    this.reset({ path: null, content: '', isDirty: false });
  },

  commandOpen () {
    this.rpc('openFile').then(
      (file: IKakFile) => { if (file) this.openFile(file) },
      (err: string) => { this.notify(err) }
    );
  },

  commandSave () {
    if (!this.draft.isDirty) {
      return;
    }

    this.rpc('saveFile', this.draft).then(
      (path: string) => {
        this.reset({ path: path });
        this.notify(`File saved: ${path}`);
      },
      (err: string) => { this.notify(err) }
    );
  },

  THEME_STYLES: [
    {
      'paper-background': '#FFFFFF',
      'paper-font':       'medium YuGothic, sans-serif',
      'paper-color':      '#111111',
      'ui-background':    '#F3F3F3',
      'ui-color':         '#666666'
    },
    {
      'paper-background': 'transparent',
      'paper-font':       '110% "Hiragino Mincho ProN", serif',
      'paper-color':      '#EEEEEE',
      'ui-background':    '#333333',
      'ui-color':         '#EEEEEE'
    }
  ],

  commandToggleTheme () {
    this.themeIndex = ((this.themeIndex || 0) + 1) % this.THEME_STYLES.length;

    let theme = this.THEME_STYLES[this.themeIndex];
    for (let p in theme) {
      this.customStyle['--kak-' + p] = theme[p];
    }

    Polymer.updateStyles();
  },

  openFile (file: IKakFile) {
    this.reset(file);
  },

  notify (err: string) {
    this.latestError = err;
    this.$.toastError.show();
  },

  reset (file?: { path?: string; content?: string }) {
    this.set('draft.isDirty', false);

    if (file) {
      if (file.content !== undefined) {
        this.set('draft.content', this.$.editor.text = file.content);
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
  },

  _rpcWaiters: {},

  rpc<T> (name: string, arg?: any): Promise<T> {
    console.log('rpc', name, arg);

    return new Promise((ok, ng) => {
      this._rpcWaiters[name] = { ok: ok, ng: ng };
      this.fire(`rpc:${name}`, arg);
    });
  },

  registerRPCHandler(name: string, handler: (arg: any, ok: (v: any) => void, ng: (e: any) => void) => void) {
    this.addEventListener(`rpc:${name}`, (ev: CustomEvent) => {
      let w = this._rpcWaiters[name] || {};
      let nop = (x: any) => {};
      delete this._rpcWaiters[name];

      handler(ev.detail, w.ok || nop, w.ng || nop);
    });
  }
});
