'use babel';

export default class chordModel {

    constructor() {
        this.chords = [];
        this.title = '';
        this.key = '';
    }

    // return the chord at the given position in the array
    getChord(index) {
        return this.chords[index];
    }

    // return the array with the chords of the file
    getChords() {
        return this.chords;
    }

    // add the new chord to the array of chords if it is not in already
    addChord(chord) {
        // Is chord in array of chords?
        for (let i = 0; i < this.chords.length; i++) {
            if (this.chords[i] == chord) {
                return 0;
            }
        }
        this.chords.push(chord);
        return 0;       
    }

    // reset the array of the chords
    clearChords() {
        this.chords.length = 0;
    }
}