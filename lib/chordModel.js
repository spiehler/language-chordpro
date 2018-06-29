'use babel';

export default class chordModel {

    constructor() {
        // TODO: map with chromatic scale 
        // TODO: map with major scale definition
        // TODO: map with minor scale definition
        // TODO: change from array to map
        this.sharpKeys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        this.flatKeys = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
        this.steps = ['-5', '-4', '-3', '-2', '-1', '0', '1', '2', '3', '4', '5', '6'];
        this.isMinorKey = false;
        this.isFlatKey = false;
        this.scoreChords = [];
        this.scoreTitle = '';
        this.scoreKey = '';
    }

    // return the key at the given position in the array of keys
    getKey(index) {
        if (this.isFlatKey) {
            return this.flatKeys[index];
        } else {
            return this.sharpKeys[index];
        }
    }

    // return the array of keys
    getKeys() {
        if (this.isFlatKey) {
            return this.flatKeys;
        } else {
            return this.sharpKeys;
        }
    }

    getStep(index) {
        return this.steps[index];
    }

    getSteps() {
        return this.steps;
    }

    // return the chord at the given position in the array
    getChord(index) {
        return this.scoreChords[index];
    }

    // return the array with the chords of the file
    getChords() {
        return this.scoreChords;
    }

    // add the new chord to the array of chords if it is not in already
    addChord(chord) {
        // Is chord in array of chords?
        for (let i = 0; i < this.scoreChords.length; i++) {
            if (this.scoreChords[i] === chord) {
                return 0;
            }
        }
        this.scoreChords.push(chord);
        return 0;       
    }

    setScoreKey(scoreKey) {
        this.scoreKey = scoreKey;
        if (this.scoreKey.substr(this.scoreKey.length-1, 1) === 'm') {
            this.isMinorKey = true;
            if (this.scoreKey.substr(this.scoreKey.length-2, 1) === 'b') {
                this.isFlatKey = true;
            } else {
                this.isFlatKey = false;
            }
        } else {
            this.isMinorKey = false;
            if (this.scoreKey.substr(this.scoreKey.length-1, 1) === 'b') {
                this.isFlatKey = true;
            } else {
                this.isFlatKey = false;
            }
        }
    }

    getScoreKey() {
        return this.scoreKey;
    }

    // transposes a chord to a new chord which is x steps away
    // steps can be a positiv or negative value between -6 and +6
    transpose(chord, step) {
        let transposedChord = '';
        return transposedChord;
    }

    // reset the array of the chords
    clearChords() {
        this.scoreChords.length = 0;
    }
}