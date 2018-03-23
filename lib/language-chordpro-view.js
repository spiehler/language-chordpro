'use babel';

import chordModel from './chordModel';

export default class LanguageChordproView {

  constructor(serializedState) {
    // Data Properties
    //this.chords = [];
    this.chordModel = new chordModel();

    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('language-chordpro');

    this.subscriptions = atom.workspace.getCenter().observeActivePaneItem(item => {
      // clear array elements
      this.chordModel.clearChords();
      // clear content
      if (this.element.childNodes.length > 0) {
        this.element.firstChild.remove();
      }
  
      if (!item || !atom.workspace.isTextEditor(item)) {
        return
      }
      if (item.getGrammar().name !== 'Chordpro') {
        this.showMessage();
      } else {
       // get chords from file
        let editor = atom.workspace.getActiveTextEditor();
        editor.scan(new RegExp('\\[[a-zA-Z0-9#\\/]*\\]', 'g'), iterator => {
          this.chordModel.addChord(iterator.match[0].slice(1, iterator.match[0].length-1));
        });
        // add chords to panel
        this.showChordPanel();
      }
    });
  }

  // add info message if not Chordpro file
  showMessage() {
    // Create message element
    let message = document.createElement('div');
    message.classList.add('text-highlight');
    message.innerHTML = 'Please open an Chordpro File to see the Helper Tools.';
    this.element.appendChild(message);
  }

  // add chords to the view
  showChordPanel() {
    // Create message element
    let scoreBlock = document.createElement('div');
    scoreBlock.classList.add('block');

    let scoreKeyLabel = document.createElement('label');
    scoreKeyLabel.classList.add('inline-block');
    scoreKeyLabel.innerHTML = 'Key:';
    scoreBlock.appendChild(scoreKeyLabel);

    let scoreKey = document.createElement('label');
    scoreKey.classList.add('inline-block');
    scoreKey.innerHTML = this.chordModel.key.toString();
    scoreBlock.appendChild(scoreKey);

    let chordsBlock = document.createElement('div');
    chordsBlock.classList.add('block');
    // add chords
    for (let i = 0; i < this.chordModel.getChords().length; i++) {
      let chordButton = document.createElement('button');
      chordButton.classList.add('btn');
      chordButton.innerHTML = this.chordModel.getChord(i);
      chordButton.onclick = this.insertChord(chordButton);
      chordsBlock.appendChild(chordButton);
    }
    this.element.appendChild(scoreBlock);
    this.element.appendChild(chordsBlock);
  }

  insertChord(button) {
    return 0;
  }

  getTitle() {
    // Used by Atom for tab text
    return 'Chordpro';
  }

  getDefaultLocation() {
    return 'right';
  }

  getAllowedLocations() {
    return ['left', 'right', 'bottom'];
  }

  getURI() {
    // Used by Atom to indentify the view when toggling.
    return 'atom://language-chordpro';
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {
    return {
      // This is used to look up the deserializer function. It can be any string, but it needs to be
      // unique across all packages!
      deserializer: 'language-chordpro/LanguageChordproView'
    };
  }

  // Tear down any state and detach
  destroy() {
    this.element.remove();
    this.subscriptions.dispose();
  }

  getElement() {
    return this.element;
  }

}
