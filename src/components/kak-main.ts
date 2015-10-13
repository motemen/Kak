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

  initializeDraft () {
    this.draft = {
      content: '',
      path: null
    };
  },

  attached () {
    this.isDirty = false;

    this.$.editor.text = this.draft.content;
    this.$.editor.addEventListener('input', () => {
      this.set('draft.content', this.$.editor.text);
      this.isDirty = true;
    });
    this.$.editor.focus();
  },

  commandOpen () {
    this.fire('kak:command:openFile');
  },

  openFile (file: IKakFile) {
    this.draft = file;
    this.$.editor.text = file.content;
  }
});
