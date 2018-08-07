'use babel';

import ChordModel from './ChordModel';

export default class LanguageChordproView {

  constructor(serializedState) {
    this.thisInstance = this;
    // Data Properties
    this.chordModel = new ChordModel();
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('language-chordpro');

    this.subscriptions = atom.workspace.getCenter().observeActivePaneItem(item => {

      // clear array elements
      this.chordModel.clearChords();
      // clear content
      while (this.element.childNodes.length > 0) {
        this.element.firstChild.remove();
      }

      if (!item || !atom.workspace.isTextEditor(item)) {
        this.showMessage();
        return;
      }
      // is it a Chordpro file
      if (item.getGrammar().name === 'Chordpro') {
        // parse chordpro file
        this.parseScore(atom.workspace.getActiveTextEditor());
        // add chords to panel
        this.showChordPanel();
      } else {
        this.showMessage();
      }
    });
  }

  parseScore(editor) {
    // scan for key
    editor.scan(new RegExp('^{(k|key):[A-Zmb# ]*}', 'g'), iterator => {
      let scoreKey = iterator.match[0].match(new RegExp('[A-Z][mb#]?'));
      this.chordModel.setScoreKey(scoreKey[0].toString());
    });
    // scan for chords
    editor.scan(new RegExp('\\[[a-zA-Z0-9#\\/]*\\]', 'g'), iterator => {
      this.chordModel.addChord(iterator.match[0].slice(1, iterator.match[0].length-1));
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
    // create Keys Block
    let scoreBlock = document.createElement('div');
    scoreBlock.classList.add('block');

    // add current key
    let scoreKeyLabel = document.createElement('label');
    scoreKeyLabel.classList.add('inline-block');
    scoreKeyLabel.innerHTML = 'Key:';
    scoreBlock.appendChild(scoreKeyLabel);

    let scoreKey = document.createElement('label');
    scoreKey.classList.add('inline-block');
    scoreKey.innerHTML = this.chordModel.getScoreKey();
    scoreBlock.appendChild(scoreKey);

    // add keys box
    let keysBox = document.createElement('select');
    keysBox.classList.add('input-select');
    keysBox.addEventListener('change', this.keySelected);
    for (let i = 0; i < this.chordModel.getKeys().length; i++) {
      let key = document.createElement('option');
      key.innerHTML = this.chordModel.getKey(i);
      keysBox.appendChild(key);
    }
    scoreBlock.appendChild(keysBox);

    // add steps box
    let stepsBox = document.createElement('select');
    stepsBox.classList.add('input-select');
    stepsBox.addEventListener('change', this.stepSelected);
    for (let i = 0; i < this.chordModel.getSteps().length; i++) {
      let step = document.createElement('option');
      step.innerHTML = this.chordModel.getStep(i);
      stepsBox.appendChild(step);
    }
    stepsBox.value = '0';
    scoreBlock.appendChild(stepsBox);

    // add transpose button
    let transposeButton = document.createElement('button');
    transposeButton.classList.add('btn');
    transposeButton.innerHTML = 'Transpose';
    transposeButton.addEventListener('click', this.transposeSong, false);
    scoreBlock.appendChild(transposeButton);

    this.element.appendChild(scoreBlock);

    // create chords block
    let chordsBlock = document.createElement('div');
    chordsBlock.classList.add('block');

    // add chord buttons
    for (let i = 0; i < this.chordModel.getChords().length; i++) {
      let chordButton = document.createElement('button');
      chordButton.classList.add('btn');
      chordButton.innerHTML = this.chordModel.getChord(i);
      chordButton.addEventListener('click', this.insertChord);
      chordsBlock.appendChild(chordButton);
    }
    this.element.appendChild(chordsBlock);
  }

  keySelected(event) {
    console.log(event.srcElement.value);
    return 0;
  }

  stepSelected(event) {
    console.log(event.srcElement.value);
    return 0;
  }

  transposeSong(event) {
    console.log(event.srcElement.innerText);
    let chordModel = LanguageChordproView.prototype.getChordModel();
    let newChord = chordModel.transposeChord('C', -2);
    console.log(newChord);
    return 0;
  }

  insertChord(event) {
    let editor = atom.workspace.getActiveTextEditor();
    editor.insertText('[' + event.srcElement.innerText + ']');
    return 0;
  }

  getTitle() {
    // Used by Atom for tab text
    return 'Chordpro';
  }

  getChordModel() {
    return this.chordModel;
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
