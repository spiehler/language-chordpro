'use babel';

export default class LanguageChordproView {

  constructor(serializedState) {
    // Data Properties
    this.chords = [];
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('language-chordpro');

    this.subscriptions = atom.workspace.getCenter().observeActivePaneItem(item => {
      if (!atom.workspace.isTextEditor(item)) {
        message.innerText = 'Open a Chordpro file to get the helper funtionality.';
        return;
      }
      // clear array elements
      this.chords.length = 0;
      // get chords from file
      let editor = atom.workspace.getActiveTextEditor();
      editor.scan(new RegExp('\\[[a-zA-Z0-9#\\/]*\\]', 'g'), iterator => {
        this.extractChord(iterator);
      });
      // add chords to panel
      this.addChords();
    });
  }

  // extract Chords from file and create list of chords
  extractChord(iterator) {
    // Is chord in array of chords?
    for (let i = 0; i < this.chords.length; i++) {
      if (this.chords[i] == iterator.match[0]) {
        return 0;
      }
    }
    this.chords.push(iterator.match[0]);
    console.log('Match! ' + iterator.match[0]);
    return 0;
  }

  // add chords to the view
  addChords(){
    // Create message element
    let chordPanel = document.createElement('div');
    chordPanel.classList.add('block');
    chordPanel.id = 'chordPanel';
    for (let i = 0; i < this.chords.length; i++) {
      let chordButton = document.createElement('button');
      chordButton.classList.add('btn');
      chordButton.innerHTML = this.chords[i];
      chordPanel.appendChild(chordButton);
    }
    if (this.element.childNodes.length === 0) {
      this.element.appendChild(chordPanel);
    } else {
      let oldChordPanel = document.getElementById('chordPanel');
      this.element.replaceChild(chordPanel, oldChordPanel);
    }
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
