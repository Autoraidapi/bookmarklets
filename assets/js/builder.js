
/*---------------------------------------------------------
Parse a text of Javascript source code.
Put each logical substring element into a tree structure
of BlockElement objects.

A BlockElement object has a start string and an end string.
It may also have a number of child blocks (contained in an array).
The child blocks together represent the substring between the parent's 
start string and end string.

Example - result of parsing:
while(i<3){       block 0 start string
  i++;            block 0 child 0 start string (and empty end string)
  j--;            block 0 child 1 start string (and empty end string)
  if(i==3){       block 0 child 2 start string
    j=0;          block 0 child 2 child 0 start string (and empty end string)
  }               block 0 child 2 end string
}                 block 0 end string

The source string is parsed 1 char. at a time.
Special handling is done for string expressions.
Validation is performed of opening and closing parantheses ( ) and brackets { }.

Copyright (c) Troels Jakobsen, bmkl@gmx.net
---------------------------------------------------------*/


// Define constants
const BLOCK_GENERIC    = 0;
const BLOCK_IF         = 1;
const BLOCK_FOR        = 2;
const BLOCK_WHILE      = 3;
const BLOCK_WITH       = 4;
const BLOCK_SWITCH     = 5;
const BLOCK_ELSE_SPACE = 6;

// Global vars.
var rootBlock;                    // Root BlockElement object
var parseErrors = [];             // Array of error (ParseError) elements
var prevIfBlock = null;           // The latest block containing an if statement
var isInsideVoidFunction = false; // Used when bookmarklet contains "(function(){...})()"

// Define parse error object
function ParseError(str, pos) {
  this.length = 2;
  this.str = str;
  this.pos = pos;
}

// Define block element object
function BlockElement(parent) {
  this.length = 8;
                                  // The complete statement might be:  while(i<3){i++;j--;}
  this.strStart = "";             // Start of statement if any         - eg. while(i<3){
  this.strEnd = "";               // End of statement if any           - eg. }
  this.type = BLOCK_GENERIC;      // Type of block (for, if, etc)
  this.level = 0;                 // Current level (number of consecutive parents)
  this.pos = -1;                  // Start pos. of str inside parent block's str
  this.indented = false;          // Indicates whether stmt. is indented in rel. to parent.
  this.parent = parent;           // Super-block
  this.children = [];             // Sub-blocks

  if (this.parent != null) {
    parent.children[parent.children.length] = this;
    this.level = parent.level+1;
  }
}

function addParseError(str, pos) {
  parseErr = new ParseError(str, pos);
  parseErrors[parseErrors.length] = parseErr;
}

function scan(str) {
  parseErrors.length = 0;
  return doScan(str);
}

function doScan(str) {

  function isNextStatementChild(block, str, strpos) {
    if (block.type != BLOCK_GENERIC) {
      // Check if statement ends with { or ;
      var cc = nextSignificantChar(str, strpos+1);
      if (cc != '{' && cc != ';') {
        // We have a condtional/loop statement (for/if/while/etc.) without brackets.
        // Next stmt. (and ONLY next stmt.) must be treated as a "child" (indented).
        return true;
      }
    }
    return false;
  }

  function insertChildBlock(block) {
    block = new BlockElement(block);
    return block;
  }

  function insertSiblingBlock(block) {
    block = new BlockElement(block.parent);
    return block;
  }

  function nonIndentedParent(block) {
    var parentBlock = block;
    while (parentBlock.indented) {
      if (parentBlock.parent == null) {
        return parentBlock;
      }
      parentBlock = parentBlock.parent;
    }
    return parentBlock;
  }

  var c;                     // Current char
  var strpos = -1;           // Position within str
  var substr = "";           // Current substring (since last substring)
  var block = null;          // Current BlockElement
  var parseErr;

  block = new BlockElement(null);
  block.level = -1;
  rootBlock = block;
  block = new BlockElement(block);

  while (strpos < str.length) {
    strpos++;
    c = str.charAt(strpos);
    switch (c) {

      default:
        substr += c;
        block.strStart = substr;
        break;

      case '"':              // String begin, read to end of string
      case '\'':
        var pos = endOfStringIndex(str, c, strpos, false);
        if (pos != -1) {
          substr += str.substring(strpos, pos+1);
          strpos = pos;
          block.strStart = substr;
        }
        else {
          return false;
        }
        break;

      case ';':              // End of statement, except in for statements
        substr += c;
/*
        if (block.type == BLOCK_FOR) {
          // We are inside a for statement, read to char before ending parenthesis
          var pos = matchingParenthesisIndex(str, "(", ")", strpos-substr.length);
          if (pos == -1) {
            addParseError("Expression is missing closing parenthesis )", strpos-substr.length);
            return false;
          }
          else {
            substr += str.substring(strpos+1, pos);
            strpos = pos-1;
            block.strStart = substr;
          }
        }
        else {
*/
          if (getStatementType(substr) != BLOCK_IF)
            if (block.parent != null && block.parent.type != BLOCK_IF)
              prevIfBlock = null;

          // End of statement
          block.strStart = substr;
          if (nextSignificantChar(str, strpos+1) == '/') {
            // Seems we have a comment following this statement
          }
          else {
            substr = "";

            if (block.indented) {
              var nipb = nonIndentedParent(block);
              if (nipb != null) {
                block = insertSiblingBlock(nipb);
              }
              else {
                block = insertSiblingBlock(block);
              }
            }
            else {
              block = insertSiblingBlock(block);
            }
          }
/*
        }
*/
        break;

      case '\n':             // End of statement (we presume)
/*
        block.strStart = substr;
        substr = "";
*/
/*
        block = insertSiblingBlock(block);
*/
/*
        if (prevSignificantChar(str, strpos-1) != ';') {
alert('no ;');
          block = insertSiblingBlock(block);
        }
*/
        break;

      case '\r':             // CR
        break;

      case '(':
        substr += c;
        block.strStart = substr;
        // Find type of statement (for/if/while/etc.)
        block.type = getStatementType(substr);

        if (block.type == BLOCK_IF)
          prevIfBlock = block;
        else
          prevIfBlock = null;

        // Check for "(function(){...})();"
        if (str.substring(strpos).indexOf("(function()") == 0) {
          // Found the start part
          substr = "(function()";
          strpos = strpos + substr.length - 1;
          block.strStart = substr;
          isInsideVoidFunction = true;
        }
        else {

          // Read to matching closing parenthesis
          var pos = matchingParenthesisIndex(str, "(", ")", strpos-1);
          if (pos == -1) {
            addParseError("Expression is missing closing parenthesis )", strpos);
            return false;
          }
          else {
            substr += str.substring(strpos+1, pos+1);
            strpos = pos;
            block.strStart = substr;
          }
          if (isNextStatementChild(block, str, strpos)) {
            substr = "";
            block = new BlockElement(block);
            block.indented = true;
          }

        }
        break;

      case ')':              // We only get here if there is not a corresponding start paranthesis
        // Check for "(function(){...})()"
        if (str.substring(strpos).replace(/[ \n\r]/g, "").indexOf(")()") == 0) {
          // Found the end part
          substr = ")()";
          strpos += str.substring(strpos+1).indexOf(")") + 1;
          strpos += str.substring(strpos+1).indexOf(")") + 1;
          block.strStart = substr;
          isInsideVoidFunction = false;
        }
        else {
          addParseError("Closing parenthesis ) without opening parenthesis (", strpos);
          return false;
        }
        break;

      case '{':
        substr += c;
        block.strStart = substr;
        block = insertChildBlock(block);
//alert(substr);
/*
        // Check for valid syntax
        if (block.type == BLOCK_GENERIC) {
          addParseError("Expression cannot use brackets", strpos);
          return false;
        }
*/
        // Check for matching closing bracket
        if (matchingParenthesisIndex(str, "{", "}", strpos-substr.length) == -1) {
          addParseError("Expression is missing closing bracket }", strpos);
          return false;
        }
        substr = "";
        break;

      case '}':
        if (prevSignificantChar(str, strpos-1) != ';') {
          if (block.indented) {
            var nipb = nonIndentedParent(block);
            if (nipb != null) {
              // Last stmt. was indented and NOT terminated with a ;
              // Hack! Why does this work?
              block = insertSiblingBlock(nipb);
            }
          }
        }

        block = block.parent;
        if (block != null) {
          block.strEnd = c;
          // Check for matching opening bracket
          if (block.strStart.indexOf('{') == -1) {
            addParseError("Closing bracket } without opening bracket {", strpos);
            return false;
            break;
          }
          var nipb = nonIndentedParent(block);
          if (nipb != null)
            block = insertSiblingBlock(nipb);
          else
            block = insertSiblingBlock(block);

        }
        substr = "";
        break;

      case ':':
        substr += c;
        // Check for "javascript:"
        if (trimLeadingSpaces(substr) == "javascript:") {
          block.strStart = substr;
          substr = "";
          block = insertSiblingBlock(block);
        }
        break;

      case 'e':
        substr += c;
        // Check for "else" without "{"
        if (trimLeadingSpaces(substr) == "else") {
          if (nextSignificantChar(str, strpos+1) != '{') {
            var cc = str.charAt(strpos+1);
            if (cc == ' ' || cc == '\r' || cc == '\n' || cc == '\t') {

              if (prevIfBlock == null) {
                if (block.parent != null && block.parent.children.length > 1) {
                  var prevSibling = block.parent.children[block.parent.children.length-2];
//alert(prevSibling.strStart);
                  if (prevSibling.type != BLOCK_IF) {
                    // We don't have an IF statement to match the ELSE
                    addParseError("ELSE without IF", strpos);
                    return false;
                    break;
                  }
                  else {
                    prevIfBlock = prevSibling;
                  }
                }
              }

              // Discard allocated block; we need to change its parent
              block.parent.children.length--;
              block = null;
              block = insertSiblingBlock(prevIfBlock);
              block.indented = prevIfBlock.indented;
              prevIfBlock = null;

              block.strStart = substr;
              substr = "";
              block.type = BLOCK_ELSE_SPACE;
              if (isNextStatementChild(block, str, strpos)) {
                substr = "";
                block = new BlockElement(block);
                block.indented = true;
              }
            }
          }
        }
        break;

      case '\\':
        // We need to read an extra char
        substr += c;
        strpos++;
        substr += getChar(str, strpos);
        block.strStart = substr;
        break;

      case '/':              // Check for regular string expressions and comments
        var cc = prevSignificantChar(str, strpos);
        // Check for regular string expression, eg.  /hello{2}/i
        // Reg. strings must end with / . A / inside a set, eg. [abc+-/*] doesn't count.
        if (cc == '(' || cc == '=') {            // We have a regular string expression
          var pos = endOfStringIndex(str, c, strpos, true);
          if (pos != -1) {
            substr += str.substring(strpos, pos+1);
            strpos = pos;
            block.strStart = substr;
          }
          else {
            return false;
          }
        }
//        else if (str.charAt(strpos-1) == '/') {  // We have a single-line comment  //
        else if (str.charAt(strpos-1) == '/' && nextSignificantChar(str, strpos+1) != '*') {  // We have a single-line comment  //
          // Remove the comment
          var pos = endOfLineIndex(str, strpos);
          if (pos != -1) {
//            substr += str.substring(strpos, pos+1);
            strpos = pos-1;
//            block.strStart = substr;
//            block.strStart = str.substring(0, str.length-2);
            substr = substr.substring(0, substr.length-1) + '\n';
            block.strStart = "";
          }
          else {
            return false;
          }
        }
        else {
          substr += c;
          block.strStart = substr;
        }
        break;

      case '*':
        if (str.charAt(strpos-1) == '/') {       // We have a multi-line comment  /*---*/
          var pos = str.indexOf('*/', strpos);
          if (pos != -1) {
            substr += str.substring(strpos, pos+2) + '\n';
            strpos = pos+1;
            block.strStart = substr;
          }
          else {
            return false;
          }
        }
        else {
          substr += c;
          block.strStart = substr;
        }
        break;

    }
  }
  return true;
}

function matchingParenthesisIndex(str, startChar, endChar, startPos) {
  // Find position of matching parenthesis or -1 if not found. Ignore strings.
  // Starting parenthesis (startChar) must be part of str starting at startPos.
  var c;
  var strpos = startPos;
  var subParLvl = 0;

  while (strpos < str.length) {
    strpos++;
    c = str.charAt(strpos);
    switch (c) {

      default:
        if (c == startChar) {
          subParLvl++;
        }
        else if (c == endChar) {
          subParLvl--;
          if (subParLvl == 0) {
            if (isInsideVoidFunction && startChar == '(') {
              // Compensate for "(function(){...})()"
              if (str.substring(strpos).replace(/[ \n\r]/g, "").indexOf(")()") == 0)
                return -1;
              else
                return strpos;
            }
            else
              return strpos;
            }
          }
        break;

      case '"':              // String begin, read to end of string
      case '\'':
        var pos = endOfStringIndex(str, c, strpos, false);
        if (pos != -1) {
          strpos = pos;
        }
        else {
          return -1;
        }
        break;

      case '/':              // Check for regular string expressions and comments
        var cc = prevSignificantChar(str, strpos);
        // Check for regular string expression, eg.  /hello{2}/i
        if (cc == '(' || cc == '=') {            // We have a regular string expression
          var pos = endOfStringIndex(str, c, strpos, true);
          if (pos != -1) {
            strpos = pos;
          }
          else {
            return -1;
          }
          break;
        }
        else if (str.charAt(strpos-1) == '/') {  // We have a single-line comment  //
          var pos = endOfLineIndex(str, strpos);
          if (pos != -1) {
            strpos = pos;
          }
          else {
            return -1;
          }
        }
        else {
          // goto default
        }
        break;

      case '*':
        if (str.charAt(strpos-1) == '/') {       // We have a multi-line comment  /*---*/
          var pos = str.indexOf('*/', strpos);
          if (pos != -1) {
            strpos = pos+1;
          }
          else {
            return -1;
          }
        }
        else {
          // goto default
        }
        break;

    }
  }
  return -1;
}

function endOfStringIndex(str, chr, startPos, regStrExpr) {
  // Read to end of string and return end of string pos., or -1 if error
  var c;
  var strpos = startPos;

  while (strpos < str.length) {
    strpos++;
    c = str.charAt(strpos);
    switch (c) {

      default:
        if (c == chr) {
          return strpos;
        }
        break;

      case '\r':
      case '\n':
        // Line break; seems we have an unterminated string
        addParseError("Unterminated string", startPos);
        return -1;
        break;

      case '\\':
        // We need to read an extra char in case it's \' or \"
        strpos++;
        break;

      case '[':
        if (regStrExpr) {
//          strpos = matchingParenthesisIndex(str, '[', ']', strpos);
          var pos = endOfStringIndex(str, ']', strpos, true);
          if (pos != -1) {
            strpos = pos;
          }
          else {
            // Seems we have an unterminated regular expression
            addParseError("Unterminated regular expression - missing ]", startPos);
            return -1;
          }
        }
        break;

    }
  }

  // Seems we have an unterminated string
  addParseError("Unterminated string", startPos);
  return -1;
}

function endOfLineIndex(str, startPos) {
  // Read to end of line and return end of line pos., or -1 if error
  var c;
  var strpos = startPos;

  while (strpos < str.length) {
    strpos++;
    c = str.charAt(strpos);
    switch (c) {

      default:
        if (c == '\n') {
          return strpos;
        }
        break;

      case '\\':
        // We need to read an extra char in case it's \' or \"
        strpos++;
        break;

    }
  }

  // Seems we have an unterminated string
  addParseError("Unterminated comment(?)", startPos);
  return -1;
}

function getStatementType(str) {
  if (findSubstatement(str, "if"))
    return BLOCK_IF;
  if (findSubstatement(str, "for"))
    return BLOCK_FOR;
  if (findSubstatement(str, "while"))
    return BLOCK_WHILE;
  if (findSubstatement(str, "with"))
    return BLOCK_WITH;
  if (findSubstatement(str, "switch"))
    return BLOCK_SWITCH;
  return BLOCK_GENERIC;
}

function findSubstatement(str, substr) {
  var stmt = str.toLowerCase();
  stmt = trimLeadingSpaces(stmt);
  substr = substr.toLowerCase();

  if (stmt.indexOf(substr) == 0) {
    if (nextSignificantChar(stmt, substr.length) == '(')
      return true;
  }
  return false;
}

function getChar(str, strpos) {
  // Get char at strpos but check for invalid string positions
  var s = str.charAt(0);
  if (s != undefined)
    return s;
  return '';
}

function nextSignificantChar(str, strpos) {
  // Get next char from strpos, ignoring spaces
  var s = str.substring(strpos);
  s = trimLeadingSpaces(s);
  if (s.length > 0)
    return s.charAt(0);
  return '';
}

function prevSignificantChar(str, strpos) {
  // Get previous char from strpos, ignoring spaces
  var s = str.substring(0, strpos);
  while ((s.length > 0) && (s.charAt(s.length-1) == ' ')) {
    s = s.substring(0, s.length-1);
  }
  if (s.length > 0)
    return s.charAt(s.length-1);
  return '';
}



/*---------------------------------------------------------
Present a formatted string of source code.
This is done by traversing the tree structure that was built by the
parser (parse.js).

The main advantage of having put the parse result into the tree
structure is that we can separate the formatting logic from the
parsing logic. This makes the parsing easier, and it's also practical
if we want to customize the formatting later or present more than
one format.

The result is presented with indentations and line breaks.

Copyright (c) Troels Jakobsen, bmkl@gmx.net
---------------------------------------------------------*/



function getFormattedText() {
  var s = doGetFormattedText(rootBlock);
  s = s.replace(/\t/g, indent(1));
  return s;
}

function doGetFormattedText(block) {
  // Get formatted text with indentations and line breaks
  var s = "";
  if (block.strStart != "")
    if (trimLeadingSpacesAndTabs(block.strStart) != "")
      s = indent(block.level) + trimLeadingSpacesAndTabs(block.strStart) + "\r\n";
//if (block.indented) s = "XXXXX" + s;
//        s = indent(block.level) + getFormattedBlockStatement(block.strStart) + "\n";
  for (var i=0; i<=block.children.length-1; i++) {
    s += doGetFormattedText(block.children[i]);
  }
  if (block.strEnd != "")
//    if (trimLeadingSpacesAndTabs(block.strEnd) != "")
      s += indent(block.level) + block.strEnd + "\r\n";
  return s;
}

function getCompressedText() {
  var s = doGetCompressedText(rootBlock);
  s = s.replace(/\t/g, "");
  s = replaceOutsideStrings(s, " ", "")
  s = s.replace(/else \{/g, "else{");
  s = s.replace(/void \(/g, "void(");
  return s;
}

function doGetCompressedText(block) {
  // Essentially the same as doGetFormattedText but without indentations and line breaks
  var s = "";

  if (block.type == BLOCK_ELSE_SPACE) {
    // "else" statements that should have a trailing space have been truncated. We compensate for this.
    block.strStart += " ";
  }

  if (block.strStart != "")
    if (trimLeadingSpacesAndTabs(block.strStart) != "")
      s = trimLeadingSpacesAndTabs(block.strStart) + "\r\n";
  for (var i=0; i<=block.children.length-1; i++) {
    s += doGetCompressedText(block.children[i]);
  }
  if (block.strEnd != "")
//    if (trimLeadingSpacesAndTabs(block.strEnd) != "")
      s += block.strEnd + "\r\n";
  return s;
}

/*
function getFormattedBlockStatement(str) {

  function formattedStatement(str, stmtstart) {
    var s = str.replace(stmtstart, stmtstart.replace("(", " ("));
    return s;
  }

  s = "for(";
  if (str.indexOf(s) == 0)
    return formattedStatement(str, s);

  s = "if(";
  if (str.indexOf(s) == 0)
    return formattedStatement(str, s);

  s = "while(";
  if (str.indexOf(s) == 0)
    return formattedStatement(str, s);

  s = "with(";
  if (str.indexOf(s) == 0)
    return formattedStatement(str, s);

  return str;
}
*/

function indent(lvl) {
  var INDENTLEVEL = 2;
  var s = "";
  for (var i=0; i<lvl*INDENTLEVEL; i++)
    s += " ";
  return s;
}

function trimLeadingSpaces(str) {
  // Remove leading spaces from str
  var s = str;
  while (s.match(/^ /))
    s = s.replace(/^ /, '');
  return s;
}

function trimLeadingSpacesAndTabs(str) {
  // Remove leading spaces and tabs from str
  var s = trimLeadingSpaces(str);
  while (s.match(/^\t/))  {
    s = s.replace(/^\t/, '');
    s = trimLeadingSpaces(s);
  }
  return s;
}

function getErrorText(str) {
  var s = "";
  if (parseErrors.length > 0) {
//    s += "Parse error:\n";
    var pe = parseErrors[0];
    s += "Pos. " + pe.pos + ": " + pe.str;

    s += "\n \n" + str.substring(0, pe.pos+1);
    s += "  <---";
  }
  return s;
}

function replaceOutsideStrings(str, searchStr, replaceStr) {
  // Replace searchStr with replaceStr globally, except inside strings
  // and after reserved words (eg. var x=3).
  var c;
  var strpos = -1;
  var lastpos = 0;
  var outstr = "";

  function reservedWordFound() {
    var reserved = new Array( "var ", "new ", "function ", "return ", "throw ", "typeof ", "do ", "else ", "void ", " in " );
    for (var i=0; i<reserved.length; i++) {
      if (str.substring(strpos).indexOf(reserved[i]) == 0) {
        // Reserved word found; skip to end of that word
        strpos += reserved[i].length-1;
        outstr += reserved[i];
        return true;
      }
    }
    return false;
  }

  while (strpos < str.length) {
    strpos++;
    c = str.charAt(strpos);
    switch (c) {

      default:
        if (reservedWordFound()) {
          // The reservedWordFound method skips the reserved word
        }
        else if (c == searchStr.charAt(0)) {
          if (str.substring(strpos).indexOf(searchStr) == 0) {
            // Search string found; replace and skip to end of search string
            strpos += searchStr.length-1;
            outstr += replaceStr;
          }
          else
            outstr += c;               // No change
        }
        else
          outstr += c;                 // No change
        break;

      case '"':              // String begin, read to end of string
      case '\'':
        var pos = endOfStringIndex(str, c, strpos);
        if (pos != -1) {
          // Add unmodified string
          outstr += str.substring(strpos, pos+1);
          strpos = pos;
        }
        else {
          return "";
        }
        break;

      case '\\':
        // We need to read an extra char in case it's \' or \"
        outstr += c;
        strpos++;
        outstr += str.charAt(strpos);
        break;

      case '/':              // Check for regular string expressions and comments
        var cc = prevSignificantChar(str, strpos);
        // Check for regular string expression, eg.  /hello{2}/i
        // Reg. strings must end with / . A / inside a set, eg. [abc+-/*] doesn't count.
        if (cc == '(' || cc == '=') {                 // We have a regular string expression
          var pos = endOfStringIndex(str, c, strpos, true);
          if (pos != -1) {
            // Add unmodified string
            outstr += str.substring(strpos, pos+1);
            strpos = pos;
          }
          else {
            return "";
          }
        }
        else
          outstr += c;
        break;

      case '*':
        if (str.charAt(strpos-1) == '/') {       // We have a multi-line comment  /*---*/
          var pos = str.indexOf('*/', strpos);
          if (pos != -1) {
            outstr += str.substring(strpos, pos+2);
            strpos = pos+1;
          }
          else {
            return "";
          }
        }
        else {
          outstr += c;
        }
        break;

    }
  }

  return outstr;
}



var isIE = document.all && document.execCommand ? true : false;
var isNS = !document.all ? true : false;
var isOP = document.all && !document.execCommand ? true : false;

var objName = '';
var objs = new Array();
var lvls = new Array();
var exprHistory = new Array();
var exprHistoryIndex = -1;


function evalExpr() {
  objName = document.forms[0].elements['txtExpr'].value;
  var x = objName.split('[');
  lvls.length = 0;
  for (var i=0; i<x.length; i++)
    lvls = lvls.concat(x[i].split('.'));
  for (var i=0; i<lvls.length; i++)
    if (lvls[i].indexOf(']') == lvls[i].length-1)
      lvls[i] = lvls[i].substring(0, lvls[i].length-1);
}


function getPropsString(obj) {
  var objAttr = new Array();
/*
  var obj;
  if (eval(objName)) {
    obj = eval(objName);
  }
  else {
    alert('Could not evaluate object.');
    return;
  }
*/
  for (var elem in obj) {
    objAttr.push(elem);
  }
  objAttr = objAttr.sort();
  var s = '';
  for (var i=0; i<objAttr.length; i++) {
    try {
      if (typeof(obj[objAttr[i]]) == "function")
        s += objAttr[i] + ' = [function]\n';
      else
        s += objAttr[i] + ' = ' + obj[objAttr[i]] + '\n';
    }
    catch (e) {
      s += objs[i] + ' = [' + e.description + ']\n';
    }
  }

  var test = function () {
    this.var0 = "variable 0";
    this.var1 = 3.14159;
    this.getProp = function(x) {
      var i = 0;
      for (k in this) { if( x==i++ ) return(k); }
    }
  }
/*
  s += '\n';
  blabla = new test();
  s += blabla.getProp(2);

  var i = 0;
  for (k in obj) {
//    if (x == i++)
//      s += k + '\n';
  }
*/
  return s;
}



function getProps(keepForwardHistory) {
  if (window.opener.closed) {
    alert('The referring window has been closed.');
    return;
  }

  var obj = null;
  evalExpr();
  try {
    obj = eval('window.opener.' + objName);
  }
  catch (e) {
    alert('Could not evaluate object.');
  }
  var slct = document.forms[0].elements['evalresult'];
  slct.length = 0;
  objs.length = 0;

  if (isIE) {
    getElementsIE(slct, obj);
  }
  else if (isNS || isOP) {
    getElementsNS(slct, obj);
  }

  updateHistory(keepForwardHistory);
}

function updateHistory(keepForwardHistory) {
  // Navigation history
  if (!keepForwardHistory && exprHistory[exprHistoryIndex] != document.forms[0].elements['txtExpr'].value) {
    exprHistoryIndex++;
    exprHistory.length = exprHistoryIndex;
    exprHistory.push(document.forms[0].elements['txtExpr'].value);
  }
  var btnBack = document.forms[0].elements['btnBack'];
  var btnForward = document.forms[0].elements['btnForward'];
  if (exprHistoryIndex <= 0) {
    btnBack.disabled = true;
    btnBack.title = '';
    if (isOP)
      btnBack.style.color = 'gray';
  }
  else {
    btnBack.disabled = false;
    btnBack.title = exprHistory[exprHistoryIndex-1];
    if (isOP)
      btnBack.style.color = '';
  }
  if (exprHistoryIndex >= exprHistory.length - 1) {
    btnForward.disabled = true;
    btnForward.title = '';
    if (isOP)
      btnForward.style.color = 'gray';
  }
  else {
    btnForward.disabled = false;
    btnForward.title = exprHistory[exprHistoryIndex+1];
    if (isOP)
      btnForward.style.color = '';
  }
}

function getElementsIE(slct, obj) {
  try {
    for (var elem in obj) {
      objs.push(elem);
      var newOpt = document.createElement('OPTION');
      slct.add(newOpt, 0);      // Maintain IE4 compatibility
    }
  }
  catch (e) {
    alert('Could not evaluate object:\n' + e.description);
  }
  objs = objs.sort();
  for (var i=0; i<objs.length; i++) {
    var opt = slct[i];
    try {
      opt.name = objs[i];
      opt.innerText = objs[i] + ' = ' + obj[objs[i]];
    }
    catch (e) {
      opt.innerText = objs[i] + ' = [' + e.description + ']';
    }
  }
}

function getElementsNS(slct, obj) {
  // We make use of the __proto__ attribute, supported by Moz and Opera 7
  var props = new Array();
  var methods = new Array();
  var indeterminate = new Array();

  // Get # proto levels of obj
  var protoLevels = 0;
  for (var p = obj; p; p = p.__proto__) {
    props[protoLevels] = new Array();
    methods[protoLevels] = new Array();
    indeterminate[protoLevels] = new Array();
    ++protoLevels;
  }

  for (var elem in obj) {
    // Get proto level of elem
    var protoLevel = -1;
    try {
      for (var p = obj; p && (elem in p); p = p.__proto__)
        ++protoLevel;
    }
    catch (e) {     // "in" operator throws when param to props() is a string
      protoLevel = 0;
    }

    // Put elem into appropriate category
    try {
      if ((typeof(obj[elem])) == 'function')
        methods[protoLevel].push(elem);
      else
        props[protoLevel].push(elem);
    }
    catch (e) {
      indeterminate[protoLevel].push(elem);
    }
  }

  for (var i=0; i<protoLevels; i++) {
    var qual = '';
/*
    if (i == 0)
      qual = 'User-defined ';
    else if (i == 1)
      qual = 'Native ';
*/
/*
    if (i == 1)
      qual = 'Native ';
    else
      qual = 'User-defined ';
*/
    addArrayNS(props[i], qual + 'Properties', slct, obj);
    addArrayNS(methods[i], qual + 'Methods', slct, obj);
    addArrayNS(indeterminate[i], qual + 'Indeterminate', slct, obj);
  }
}

function addArrayNS(arr, header, slct, obj) {
  if (arr.length > 0) {
    var newOpt = document.createElement('OPTION');
    newOpt.name = '(category)';
    newOpt.innerHTML = '-------------------- ' + header + ' --------------------';
    slct.appendChild(newOpt);
    arr = arr.sort();
    for (var i=0; i<arr.length; ++i) {
      newOpt = document.createElement('OPTION');
      try {
        newOpt.name = arr[i];
        if (arr[i] == 'innerHTML')
          newOpt.innerHTML = 'innerHTML = [Not shown]';
        else {
          var tn;
          if (obj[arr[i]].toString().indexOf('function ') == 1) {
            var fv = obj[arr[i]].toString();
            fv = fv.substring(0, fv.indexOf('{') + 1) + ' [...] }';
            tn = document.createTextNode(arr[i] + ' = ' + fv);
          }
          else
            tn = document.createTextNode(arr[i] + ' = ' + obj[arr[i]]);
          newOpt.appendChild(tn);
        }
      }
      catch (e) {
        newOpt.innerHTML = arr[i] + ' = [' + e + ']';
      }
      slct.appendChild(newOpt);
    }
  }
}

function selectProp(slct) {
  if (slct.selectedIndex == -1)
    return;
  if (slct[slct.selectedIndex].name == '(category)')
    return;
  lvls.push(slct[slct.selectedIndex].name);
  showProps();
}

function goUp() {
  if (lvls.length > 1) {
    lvls.length--;
    showProps();
  }
}

function goBack() {
  if (exprHistoryIndex > 0) {
    exprHistoryIndex--;
    document.forms[0].elements['txtExpr'].value = exprHistory[exprHistoryIndex];
    getProps(true);
  }
}

function goForward() {
  if (exprHistory.length > exprHistoryIndex - 1) {
    exprHistoryIndex++;
    document.forms[0].elements['txtExpr'].value = exprHistory[exprHistoryIndex];
    getProps(true);
  }
}

function showProps() {
  var s = '';
  for (var i=0; i<lvls.length; i++) {
    if (!isNaN(lvls[i]))
      s += '['+lvls[i]+']';
    else {
      if (s != '')
        s += '.';
      s += lvls[i];
    }
  }
  document.forms[0].elements['txtExpr'].value = s;
  getProps();
}

function browseTo(expr) {
  document.forms[0].elements['txtExpr'].value = expr;
  document.forms[0].elements['btnGet'].click();
}

var NS4 = (document.layers) ? true : false;
var NS6 = (document.getElementById && !document.all) ? true : false;
var IE4 = (document.all && document.execCommand) ? true : false;

var INLINE_EDIT = true;           // Format/compress directly in the textarea?

var isBmkLinkActive = false;


function displayHTML(id, str, prot) {
  document.getElementById(id).innerHTML = str;
}

function displayText(id, str) {
  document.getElementById(id).innerHTML = str;     // NS6 supports innerHTML but not innerText
}

function updateLinks(form, compressedText) {
  var bmkname = form.elements['bmkname'].value;
  var linkcode = "<a href='' name='bmklink'>" + bmkname + "</a>";
  displayHTML("bookmark", linkcode);
  if (IE4) {
    document.all.bmklink.href = compressedText;
//    document.getElementById('bmklink').onblur = handleBmkLinkBlur;
//    document.getElementById('bmklink').onfocus = handleBmkLinkFocus;
  }
  else {
    document.links[1].href = compressedText;
//    document.links[1].onblur = handleBmkLinkBlur;
//    document.links[1].onfocus = handleBmkLinkFocus;
  }
}

function addToFavorites(form) {
  if (!IE4) {
    alert('Only supported in Internet Explorer');
    return;
  }
  var jscode = form.elements['jscode'].value;
  if (scan(jscode)) {
    var ct = getCompressedText();
    updateLinks(form, ct);
    var bmkname = form.elements['bmkname'].value;

    try {
      self.external.addFavorite(document.all.bmklink.href, bmkname);
    }
    catch(e) {
      self.alert('Could not add script to Favorites.');
    }

  }
  else
    displayError(getErrorText(jscode));
}

function presentCompressedSource(form) {
  var jscode = form.elements['jscode'].value;
  if (scan(jscode)) {
    var ct = getCompressedText();
    var ct2 = ct.replace(/\r/g, "");
    ct2 = ct2.replace(/\n/g, "");
    if (INLINE_EDIT) {
      form.elements['WrapChk'].checked = true;
      wrapText(form);
      form.elements['jscode'].value = ct2;
      displayText("formatsrc", ct2.length + " characters");
    }
    else {
      displayText("formatsrc", ct2 + "\n \n" + ct2.length + " characters");
    }
    updateLinks(form, ct);
  }
  else
    displayError(getErrorText(jscode));
}

function presentFormattedSource(form) {
  var jscode = form.elements['jscode'].value;
  if (scan(jscode)) {
    var ft = getFormattedText();
    var ct = getCompressedText();
    var ct2 = ct.replace(/\r/g, "");
    ct2 = ct2.replace(/\n/g, "");
    if (INLINE_EDIT) {
      form.elements['WrapChk'].checked = false;
      wrapText(form);
      form.elements['jscode'].value = ft;
      displayText("formatsrc", ct2.length + " characters");
    }
    else {
      displayText("formatsrc", ft + "\n \n" + ct2.length + " characters");
    }
    updateLinks(form, ct);
  }
  else
    displayError(getErrorText(jscode));
}

function displayError(str) {
  displayText("formatsrc", str);
  displayHTML("bookmark", "<font color='red'>ERROR</font>");

  // Move cursor to pos. where error occurs
  if (!IE4) {
    return;
  }
  var errorpos = parseErrors[0].pos;
  var pos = 0;
  var lines = -1;
  while (pos > -1 && pos < errorpos) {
    pos = document.all('jscode').value.indexOf('\n', pos+1);
    lines++;
  }
  errorpos -= lines;
  gotoCursorPos(errorpos);
}

function replaceEscape20(form) {
  form.elements['jscode'].value = replaceOutsideStrings(form.elements['jscode'].value, "%20", " ");
}

function replaceAll(form) {
  var srch = prompt('Replace...', '');
  if (srch) {
    var rplc = prompt('...with:', '');
    if (rplc) {
      var re = new RegExp(srch, 'gi');
      form.elements['jscode'].value = form.elements['jscode'].value.replace(re, rplc);
    }
  }
}

function wrapText(form) {

  if (form.elements['WrapChk'].checked)
    form.elements['jscode'].wrap = 'soft';
  else
    form.elements['jscode'].wrap = 'off';

//form.elements['jscode'].wrap = 'off';
}

function setEditorHeight(form) {
  if (isNaN(form.elements['jscodeheight'].value) || parseInt(form.elements['jscodeheight'].value) < 5)
    form.elements['jscodeheight'].value = form.elements['jscode'].rows;
  else
    form.elements['jscode'].rows = parseInt(form.elements['jscodeheight'].value);
}

function gotoCursorPos(pos) {
  try {
    var tr = document.forms[0].elements['jscode'].createTextRange();
    tr.move('character', pos);
    tr.select();
  }
  catch (e) {
    // Do nothing
  }
}

function promptCursorPos() {
  var pos = prompt('Cursor position:', '');
  if (pos != null && !isNaN(pos)) {
    gotoCursorPos(pos);
  }
}

function addBraces(form) {
  var jscode = form.elements['jscode'];
  var pos = jscode.value.indexOf('javascript:');
  if (pos >= 0) {
    var s = 'javascript:';
    s += '(function(){' + jscode.value.substring(pos + 'javascript:'.length) + '})()';
    jscode.value = s;
  }
}
