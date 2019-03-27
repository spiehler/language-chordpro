'use babel';

// import the view classes
import LanguageChordproView from './language-chordpro-view';
// import chord-magic module for transposing the chords
//import ChordMagic from 'chord-magic';
// which package to use for preview???
//import ChordProJS from './chordpro';
import ChordSheetJS from 'chordsheetjs';
// atom runtime environment
import { CompositeDisposable, Disposable } from 'atom';

export default {

  // define configuration item for CSS file 
  // TODO: find out where to save the file
  config: {
    cssFile: { 
      title: 'CSS File',
      description: 'Specifies the CSS file to layout your HTML preview.',
      type: 'string',
      default: 'chordpro.css'
    }
  },

  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable(
      // Add an opener for our view.
      atom.workspace.addOpener(uri => {
        if (uri === 'atom://language-chordpro') {
          return new LanguageChordproView();
        }
      }),

      // Register command that toggles this view
      atom.commands.add('atom-workspace', {
        'language-chordpro:toggle': () => this.toggle()
      }),

      // Register command that shows the preview window
      atom.commands.add('atom-workspace', {
        'language-chordpro:showPreview': () => this.showPreview()
      }),

      // Destroy any LanguageChordproViews when the package is deactivated
      new Disposable(() => {
        atom.workspace.getPaneItems().forEach(item => {
          if (item instanceof LanguageChordproView) {
            item.destroy();
          }
        });
      })
    );
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  deserializeLanguageChordproView(serialized) {
    return new LanguageChordproView();
  },

  toggle() {
    atom.workspace.toggle('atom://language-chordpro');
  },

  showPreview() {
    let editor = atom.workspace.getActiveTextEditor();
    // editor must be undefined and grammer must be Chordpro
    //if (editor.getGrammar().name === 'Chordpro') {
      let chordproFile = editor.getText();
      // split pane and preview Chorpro file
      atom.workspace.open('Chordpro Preview', {split: 'right'}).then(previewEditor => {
        
        // create preview
        let parser = new ChordSheetJS.ChordProParser();
        let song = parser.parse(chordproFile);
        //let formatter = new ChordSheetJS.TextFormatter();
        //let formatter = new ChordSheetJS.HtmlTableFormatter();
        //let formatter = new ChordSheetJS.HtmlDivFormatter();
        let formatter = new ChordSheetJS.ChordProFormatter();
        let display = formatter.format(song);
        
       /*
        let song = ChordProJS.parse(chordproFile);
        let display = song.render();
        */
        previewEditor.setText(display, true);
        // set previewPanel to readonly
        previewEditor.setReadOnly(true);
      })
        .catch(err => console.log(err));
    //}
  }  

};
