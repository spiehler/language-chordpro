'use babel';

export default class chordModel {

    constructor() {
        // TODO: map with chromatic scale 
        // TODO: map with major scale definition
        // TODO: map with minor scale definition
        // TODO: change from array to map
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

    // transposes a chord to a new chord which is x steps away
    // steps can be a positiv or negative value between -6 and +6
    transpose(chord, step) {
        let transposedChord = '';
        return transposedChord;
    }

    // reset the array of the chords
    clearChords() {
        this.chords.length = 0;
    }
}