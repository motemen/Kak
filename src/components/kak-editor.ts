Polymer({
  is: 'kak-editor',

  focus () {
    this.$.contentEditor.focus();
  },

  set text(text: string) {
    let contentEditor = this.$.contentEditor;
    while (contentEditor.firstChild) {
      contentEditor.removeChild(contentEditor.firstChild);
    }

    contentEditor.appendChild(document.createTextNode(text));
  },

  get text() {
    if ('innerText' in this.$.contentEditor) {
      return this.$.contentEditor.innerText;
    }

    let text = '';
    let children = this.$.contentEditor.childNodes;
    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      if (child.nodeName === 'BR') {
        text += '\n';
      } else {
        text += child.textContent;
      }
    }

    return text;
  },

  attached() {
    let lastText: string;
    this.$.contentEditor.addEventListener('keyup', (ev: KeyboardEvent) => {
      if (this.text !== lastText) {
        lastText = this.text;
        this.onInput(ev);
      }
    });
  },

  onInput(ev: KeyboardEvent) {
    this.fire('changed');
  }
});
