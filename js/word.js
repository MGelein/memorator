/**
 * Creates a new word from the provided def line
 */
function Word(line){
    var eqIndex = line.indexOf('=');
    /***The lemma of this word */
    this.lemma = line.substring(0, eqIndex);
    /** The unparsed meaning of this word */
    this.meaningDef = line.substring(eqIndex + 1);
    /** All possible meanings of this word */
    this.meanings = [];
    this.learned = false;
    var parts = this.meaningDef.split(",");
    for(index in parts){
        this.meanings.push(parts[index].trim().toLowerCase());
    }

    /**Checks if the provided meaning is in the list of meanings */
    this.isMeaning = function(m){
        m = m.trim().toLowerCase().replace(/\s/g, '');
        for(index in this.meanings){
            //Normalize to length of provided meaning if their lenghts are 1 apart, to allow missing of last character
            var s = this.meanings[index].replace(/\s/g, '');
            if(s.length - m.length < 2 && s.length > m.length) s = s.substring(0, m.length);
            if(s == m) return true;
        }
        return false;
    }
}