/**
 * Entry point
 */
$(document).ready(function () {
    //Disable caching
    $.ajaxSetup({
        cache: false
    });
    loadURLVars();
    order = getWordOrder();
    //Load the vocab file
    loadVocab(getFileURL());

    $('#meaning').keydown(function (e) {
        if (e.keyCode === 13) submitMeaning();
    });
    $('#hint').click(function () {
        submitMeaning();
    });
    //Add order listeners
    $('#wordOrdered').click(function () {
        $('#wordRandom').removeClass().addClass('btn btn-outline-primary');
        $(this).removeClass().addClass('btn btn-primary');
        order = ORDERED;
    });
    $('#wordRandom').click(function () {
        $('#wordOrdered').removeClass().addClass('btn btn-outline-primary');
        $(this).removeClass().addClass('btn btn-primary');
        order = RANDOM;
    });
});

/**
 * checks the meaning of the word
 */
function submitMeaning() {
    var meaning = $('#meaning').val().trim().toLowerCase();
    var correct = word.isMeaning(meaning);
    if (correct) {
        correctCount++;
        $('#correctCount').html(correctCount);
        $('#wrongCount').html(words.length - correctCount);
    }
    var color = 'text-danger';
    if (correct) {
        word.learned = true;
        color = 'text-success';
    }
    $('#lemma').addClass(color);
    $('#hint').html(word.meanings.join(', '));
    setTimeout(function () {
        $('#lemma').removeClass();
        order === ORDERED ? nextWrd() : rndWord();
    }, 400);
}

const RANDOM = 'random';
const ORDERED = 'ordered';

/**Array of words*/
var words = [];
var wordCounter = -1;
var order = ORDERED;
var counter = -1;
var correctCount = 0;
var word;

/**
 * Returns a random unlearned word
 */
function rndWord() {
    counter ++;
    if (correctCount == words.length) {
        showDone();
        return;
    }
    word = undefined;
    while (!word || word.learned) {
        word = words[Math.floor(Math.random() * words.length)];
    }
    showWord();
}

/**
 * Shows the word that has been loaded;
 */
function showWord() {
    wordCounter++;
    $('#meaning').val('').focus();
    $('#lemma').html(word.lemma);
    $('#triesAmt').html(wordCounter);

    setTimeout(function () { $('#hint').html('*****'); }, 500);
}

/**
 * Starts the test
 */
function nextWrd() {
    if (correctCount == words.length) {
       showDone();
        return;
    }
    counter++;
    //Get the next word that is not learned yet
    word = words[counter % words.length];
    while (!word || word.learned) {
        counter++;
        word = words[counter % words.length];
    }
    showWord();
}

/**
 * Shows the result once we've done all words
 */
function showDone(){
    $('#meaning').val('');
    $('#hint').html('It took ' + (wordCounter + 1) + " tries");
    $('#lemma').html('All Correct!').addClass('text-success');
}

/**
 * Loads and parses the vocab file
 */
function loadVocab(file) {
    $.get(file, function (data) {
        var lines = data.split('\n');
        for (index in lines) {
            words.push(new Word(lines[index]));
        }

        $('#correctCount').html(correctCount);
        $('#wrongCount').html(words.length - correctCount);
        $('#totalCount, #total2Count').html(words.length);

        //Start the test
        order === ORDERED ? nextWrd() : rndWord();
    });
}

/**
 * Returnss the file url found in the top bar
 */
function getFileURL() {
    return urlVars['file'];
}

/**
 * Returns the Word order defined in the 
 */
function getWordOrder(){
    var ord =  urlVars['order'] == 'O' ? ORDERED : RANDOM;
    if(ord == RANDOM){
        $('#wordOrdered').removeClass().addClass('btn btn-outline-primary');
        $('#wordRandom').removeClass().addClass('btn btn-primary');
    }
    if(ord) return ord;
    else return ORDERED;
}

/**
 * Object that holds the url vars that have been parsed
 */
var urlVars = {};
/**
 * Loads the url vars into the urlVars object
 */
function loadURLVars(){
    var query = window.location.href.split('?')[1];
    var vars = query.split('&');
    for(index in vars){
        var variable = vars[index];
        var parts = variable.split('=');
        urlVars[parts[0]] = parts[1];
    }
}