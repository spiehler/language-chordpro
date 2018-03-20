'use babel';

import LanguageChordproView from './language-chordpro-view';
import { CompositeDisposable, Disposable } from 'atom';

export default {

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
  }

};
