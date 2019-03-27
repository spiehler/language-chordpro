'use babel';

import ChordModel from './chordModel';

export default class LanguageChordproView {

  constructor(serializedState) {
    // regulare expressions to select the key and the chords from the file
    this.regexChords = new RegExp('\\[[A-Z0-9#\\/]*\\]', 'gi');
    this.regexChord = new RegExp('([A-G])(#|b)?([^\\/]*)(\\/([A-G])(#|b)?)?', 'gi');
    this.regexKey = new RegExp('^{(k|key):[A-Zmb# ]*}', 'g');
    
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('language-chordpro');
    this.chordModel = new ChordModel();

    // is called when editor changes, e.g. another file is selected in the tree view
    this.subscriptions = atom.workspace.getCenter().observeActivePaneItem(item => {

      // clear panel
      this.clearPanel();

      if (!item || !atom.workspace.isTextEditor(item)) {
        this.showMessage();
        return;
      }

      // is it a Chordpro file
      if (item.getGrammar().name === 'Chordpro') {
        // parse chordpro file
        this.parseScore(atom.workspace.getActiveTextEditor());
        // create chordpro tools panel
        this.createToolsPanel();
        // select button for key of the song
        let keyButton = document.getElementById(this.chordModel.getScoreKey());
        if (keyButton != null) {
          keyButton.classList.add('selected');
        }
      } else {
        // if no chordpro file, show message
        this.showMessage();
      }

    });

    // is called when content of editor has hanged
    this.subscriptions = atom.workspace.getActiveTextEditor().onDidStopChanging(item => {
      // clear panel
      this.clearPanel();
      // parse chordpro file
      this.parseScore(atom.workspace.getActiveTextEditor());
      // create chordpro tools panel
      this.createToolsPanel();
      // select button for key of the song
      let keyButton = document.getElementById(this.chordModel.getScoreKey());
      if (keyButton != null) {
        keyButton.classList.add('selected');
      }
    });
  
  }

  clearPanel() {
    // clear array elements
    this.chordModel.clearChords();
    // clear content
    while (this.element.childNodes.length > 0) {
      this.element.firstChild.remove();
    }
  }

  parseScore(editor) {
    // scan for key
    editor.scan(this.regexKey, iterator => {
      let scoreKey = iterator.match[0].match(new RegExp('[A-Z][b#]?[m]?'));
      if (scoreKey != null) {
        this.chordModel.setScoreKey(scoreKey[0].toString());
      } else {
        this.chordModel.setScoreKey('');
      }
    });
    // scan for chords
    editor.scan(this.regexChords, iterator => {
      this.chordModel.addChord(iterator.match[0].slice(1, iterator.match[0].length-1));
    });
  }

  // add info message if not Chordpro file
  showMessage() {
    // Create message element
    let message = document.createElement('div');
    message.classList.add('text-highlight');
    message.innerHTML = 'Please open an Chordpro File to use the Chorpro tools.';
    this.element.appendChild(message);
  }

  // add chords to the view
  createToolsPanel() {
    // create tools panel
    let toolsPanel = document.createElement('div');
    toolsPanel.classList.add('block');
    this.element.appendChild(toolsPanel);

    // Keys Header
    let keysHeader = document.createElement('div');
    keysHeader.innerHTML = 'Key';
    toolsPanel.appendChild(keysHeader);

    // create sharp keys Block
    let sharpKeysBlock = document.createElement('div');
    sharpKeysBlock.classList.add('block');

    // add sharp keys buttons
    this.chordModel.getSharpKeys().forEach(element => {
      let keyButton = document.createElement('button');
      keyButton.classList.add('btn');
      keyButton.id = element;
      keyButton.innerHTML = element;
      keyButton.addEventListener('click', this.transposeSong.bind(this), false);
      sharpKeysBlock.appendChild(keyButton);     
    });
    toolsPanel.appendChild(sharpKeysBlock);

    // create flat keys Block
    let flatKeysBlock = document.createElement('div');
    flatKeysBlock.classList.add('block');
    
    // add flat keys buttons
    this.chordModel.getFlatKeys().forEach(element => {
      let keyButton = document.createElement('button');
      keyButton.classList.add('btn');
      keyButton.id = element;
      keyButton.innerHTML = element;
      keyButton.addEventListener('click', this.transposeSong.bind(this), false);
      flatKeysBlock.appendChild(keyButton);     
    });
    toolsPanel.appendChild(flatKeysBlock);
    
    // Chords Header
    let chordsHeader = document.createElement('div');
    chordsHeader.innerHTML = 'Chords';
    toolsPanel.appendChild(chordsHeader);

    // create chords block
    let chordsBlock = document.createElement('div');
    chordsBlock.classList.add('block');

    // add chord buttons
    for (let i = 0; i < this.chordModel.getChords().length; i++) {
      let chordButton = document.createElement('button');
      chordButton.classList.add('btn');
      chordButton.innerHTML = this.chordModel.getChord(i);
      chordButton.addEventListener('click', this.insertChord.bind(this), false);
      chordsBlock.appendChild(chordButton);
    }
    toolsPanel.appendChild(chordsBlock);
  }

  transposeSong(event) {
    console.log(event.srcElement.innerText);
    // get active editor
    let editor = atom.workspace.getActiveTextEditor();
    // get current value of steps to transpose
    let steps = parseInt(document.getElementById('stepsBox').value);
    // replace for chords
    editor.scan(this.regexChords, iterator => {
      let oldChord = iterator.match[0].slice(1, iterator.match[0].length-1);
      let newChord = this.chordModel.transposeChord(oldChord, steps);
      newChord = '[' + newChord + ']';
      iterator.replace(newChord);
      console.log(oldChord + ' -> ' +newChord);
    });
    // replace song key
    editor.scan(this.regexKey, iterator => {
      let scoreKey = iterator.match[0].match(new RegExp('[A-Z][mb#]?'));
      this.chordModel.setScoreKey(scoreKey[0].toString());
    });    
    return 0;
  }

  insertChord(event) {
    let editor = atom.workspace.getActiveTextEditor();
    editor.insertText('[' + event.srcElement.innerText + ']');
    return 0;
  }

  getTitle() {
    // Used by Atom for tab text
    return 'Chordpro Tools';
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
