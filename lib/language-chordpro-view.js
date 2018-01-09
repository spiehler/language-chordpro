'use babel';

export default class LanguageChordproView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('language-chordpro');

    // Create message element
    const message = document.createElement('div');
    message.classList.add('message');
    this.element.appendChild(message);

    this.subscriptions = atom.workspace.getCenter().observeActivePaneItem(item => {
      if (!atom.workspace.isTextEditor(item)) {
        message.innerText = 'Open a Chordpro file to see information about it.';
        return;
      }
      // get chords from file
      //const editor = atom.workspace.getActiveTextEditor();
      //const chords = editor.getText().scan(/\\[[a-zA-Z0-9#\\/]*\\]/, addChord);
      message.innerHTML = `
        <h2>${item[0] || 'untitled'}</h2>
        <ul>
          <li><b>Soft Wrap:</b> ${item.softWrapped}</li>
          <li><b>Tab Length:</b> ${item.getTabLength()}</li>
          <li><b>Encoding:</b> ${item.getEncoding()}</li>
          <li><b>Line Count:</b> ${item.getLineCount()}</li>
        </ul>
      `;
    });
  }

  // add Chords to the list of chords in the given key
  addChord(iterator) {
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
