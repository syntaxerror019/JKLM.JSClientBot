function getSyllable() {
  var syllable = document.getElementsByClassName("syllable")[0];
  return syllable.innerHTML;
}

var hintInterval, toggle = false, currentSyllable, lastSyllable, running = false;
var submitButton;

const sim = function (id, text, lat, irt) {
  const length = text.length-1;
  var current = 0;
  /**
   * insertText
   * @param str {string} The character to input into the text area
   */
  const insertChar = function(char) {
      // get element
      var target = id;
      if (target !== null) {
          let [start, end] = [target.selectionStart, target.selectionEnd];
          // insert char
          target.setRangeText(char, start, end, 'select');
          // move cursor forward 1
          target.selectionStart = start+1;
          // trigger any onChange listeners
          target.dispatchEvent(new Event('input', { bubbles: true }));
      } else {
          console.log(`No <textarea> with id "${id}" found.`)
      };
  };
  const write = function() {
      // insert current character
      insertChar(text[current]);
      if(current < length) { // so long as there are more chars to input
          current++; // increment
          setTimeout(function(){write()},irt); // recurisvely write next char
          completed = false;
      } else {
        submitButton.click();
        running = false;
      };
  };
  setTimeout(function(){
      // kickoff input 
      setTimeout(function(){write()},irt)
  },lat); // wait this long before starting
};



function sendResponse(text) {
  var form = document.querySelector("form");
  var wordInput = form.querySelector("input[type='text']");
  wordInput.focus();
  running = true;
  sim(wordInput, text, 5, 15);

  //wordInput.value = text;
  //wordInput.dispatchEvent(new Event('input', { bubbles: true }));

}

function getWord() {
  currentSyllable = getSyllable();
  document.querySelector('.joinRound').click();
  if (document.querySelector('.otherTurn').hidden && running==false) {
      var potentialWords = [];
      var word = "Can't find matching word!";
      for (var j = 0; j < dictionary.length; j++) {
        if (dictionary[j].toLowerCase().includes(currentSyllable)){
          potentialWords.push(dictionary[j]);
        }
      }
      word = potentialWords[parseInt(Math.random() * (potentialWords.length - 1))];
      console.log("Word is: " + word);
      sendResponse(word);
  }
}



function main() {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/gh/syntaxerror019/JKLM.JSClientBot/dictionary.js';
  document.head.appendChild(script);
  hintInterval = setInterval(getWord, 500);
}

submitButton = document.createElement('input');
submitButton.type = 'submit';
submitButton.value = 'Submit';

var form = document.querySelector("form");
form.appendChild(submitButton);
main();
