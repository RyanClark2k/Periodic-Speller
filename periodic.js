/*
 Main algorithm.
 Input: single string, no whitespace
 Output: String containing rendering information. Capital and lowercase letters will be rendered
     in that case in green. Zeros will be rendered as the original letter in it's original case
     but with a red font.
 Notes: The algorithm first prioritizes fewest mistakes (rendered in Red). If two solutions arrise with
     equal errors, the algorithm prioritizes the one with fewer atomic symbols.
*/
function preRenderWord(word){
    // stores best solution for each substring during iteration
    var solns = new Array(word.length).fill("");

    // Table of elements as of May 2018
    var TABLE = ['H', 'HE', 'LI', 'BE', 'B', 'C', 'N', 'O', 'F', 'NA', 'NE', 'MG', 'AL', 'SI', 'P', 'S', 'CL', 'AR', 'K', 'CA', 'SC', 'TI', 'V', 'CR', 'MN', 'FE',
	'CO', 'NI', 'CU', 'ZN', 'GA', 'GE', 'AS', 'SE', 'BR', 'KR', 'RB', 'SR', 'Y', 'ZR', 'NB', 'MO', 'TC', 'RU', 'RH', 'PD', 'AG', 'CD', 'IN', 'SN', 'SB', 'TE', 'I',
	'XE', 'CS', 'BA', 'LA', 'CE', 'PR', 'ND', 'PM', 'SM', 'EU', 'GD', 'TB', 'DY', 'HO', 'ER', 'TM', 'YB', 'LU', 'HF', 'TA', 'W', 'RE', 'OS', 'IR', 'PT', 'AU', 'HG',
	'TL', 'PB', 'TI', 'PO', 'AT', 'RN', 'FR', 'RA', 'AC', 'TH', 'PA', 'U', 'NP', 'PU', 'AM', 'CM', 'BK', 'CF', 'ES', 'FM', 'ND', 'NO', 'LR', 'RF', 'DB', 'SG', 'BH',
	'HS', 'MT', 'DS', 'RG', 'CN', 'NH', 'FL', 'MC', 'LV', 'TS', 'OG'];

    for (var i = 0; i < word.length; i++){
        // One letter symbol if possible, 0 if not
        var oneLetterElem = TABLE.indexOf(word.charAt(i).toUpperCase()) >= 0 ?
         word.charAt(i).toUpperCase() : "0";
        // Possible solution with one letter symbol appended
        var shortSoln = i > 0 ? solns[i-1] + oneLetterElem : oneLetterElem;
        if (i == 0){
            solns[0] = shortSoln;
            continue;
        }
        // Two letter symbol if possible, 00 if not
        var twoLetterElem = TABLE.indexOf(word.substring(i-1,i+1).toUpperCase()) >= 0 ?
            word.charAt(i-1).toUpperCase() + word.charAt(i).toLowerCase() : "00";
        // Possible solution with two letter symbol appended
        var longSoln = i > 1 ? solns[i-2] + twoLetterElem : twoLetterElem;
        // Chose soln with fewer errors. Defaults to longSoln if equal.
        if (shortSoln.split(0).length - 1 < longSoln.split(0).length - 1)
            solns[i] = shortSoln;
        else
            solns[i] = longSoln;
    }
    return solns[word.length-1];
}

function render() {
    var textArea = document.getElementById("input");
    var text = textArea.innerHTML;
    // remove all unnecessary html tags
    // thanks to Kevin van Zonneveld for string-tags.js
    text = strip_tags(text,"");
    text = text.replace(/&nbsp;/g, " ");
    var words = text.split(" ");
    // HTML to be rendered by browser
    var coloredText = "";
    // iterate through words
    for (var i = 0; i < words.length; i++){
        var word = words[i];
        var preRender = preRenderWord(word);
        // iterate through characters
        for (var j = 0; j < preRender.length; j++){
            // prerendered character (might be zero)
            var ch = preRender.charAt(j);
            // unrendered character (cannot be zero)
            var altCh = word.charAt(j);
            coloredText += "<span style=\"color:";
            coloredText += ch == "0" ? "#f00" : "#080";
            coloredText += "\">"+(ch=="0"?altCh:ch)+"</span>";
        }
        if (i < words.length-1)
            coloredText += " ";
    }
    // modify document with new HTML
    textArea.innerHTML = coloredText;
    // reset caret to end of line
    placeCaretAtEnd(textArea);
}

function placeCaretAtEnd(el) {
  if (typeof window.getSelection != "undefined"
          && typeof document.createRange != "undefined") {
      var range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
   } else if (typeof document.body.createTextRange != "undefined") {
      var textRange = document.body.createTextRange();
      textRange.moveToElementText(el);
      textRange.collapse(false);
      textRange.select();
   }
}