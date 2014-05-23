CodeMirror.defineMode("hy", function(conf, parserConf) {
  var atoms = /^(?:false|true|nil|null|[+-]?inf|[+-]?nan)\b/;

  var builtins = [".", "->", "->>", "apply", "and", "assert", "assoc", "break", "cond", "continue", "dict-comp", "do", "progn",
                  "def", "setv", "defclass", "defn", "defun", "defn-alias", "defun-alias", "defmain",
                  "defmacro", "defmacro-alias", "defmacro/g!", "defreader", "del", "doto", "eval", "eval-and-compile",
                  "eval-when-compile", "first", "car", "for", "genexpr", "gensym", "get", "global", "if",
                  "if-not", "lisp-if", "lif", "import", "lambda", "fn", "let", "list-comp", "not", "or",
                  "print", "quasiquote", "quote", "require", "rest", "cdr", "set-comp", "slice", "throw",
                  "raise", "try", "unless", "unquote", "unquote-splice", "when", "while", "with",
                  "with-decorator", "with-gensyms", "yield", "yield-from"];

  var operators = ["+", "-", "*", "**", "/", "//", "%", "<<", ">>", "&", "|", "^", "~", "<", ">", "<=", ">=", "==", "!="];

  var mode = {
    startState: function() {
      return {
        startOfFile: true,
        inString: false
      };
    },

    token: function(stream, state) {
      if (state.startOfFile && stream.match("#!")) {
        stream.skipToEnd();
        state.startOfFile = false;
        return "special comment";
      }
      state.startOfFile = false;

      if (!state.inString && stream.eatSpace()) {
        return null;
      }

      if (state.inString || stream.match(/^(?:r|R|u|U)?"/)) {
        stream.match(/^(?:[^"\\]|\\.)*/);
        if (stream.eol()) {
          state.inString = true;
        }
        else {
          var nextChar = stream.next();
          if (nextChar != '"') {
            state.inString = true;
          }
        }
        return "string";
      }

      if (stream.peek() == ";") {
        stream.skipToEnd();
        return "comment";
      }

      if (stream.match(/(?:[1-9][0-9]*|0+|0[Bb][01]+|0[Oo][0-7]+|0[Xx][0-9a-fA-F]+)\b/)) {
        return "number";
      }

      if (stream.match(/(?:[0-9]+\.[0-9]*|\.[0-9]+)(?:[eE][+-]?[0-9]+)?[jJ]?\b/)) {
        return "number";
      }

      if (stream.match(/[0-9]+[eE][+-]?[0-9]+[jJ]?\b/)) {
        return "number";
      }

      if (stream.match(/^[:&][^\[\]{}()'"; \s]+/)) {
        return "string";
      }

      if (stream.match(atoms)) {
        return "atom";
      }

      if (stream.match(/^[^\[\]{}()'";\s]+/)) {
        var tok = stream.current();
        if (operators.indexOf(tok) != -1) {
          return "operator";
        }
        if (builtins.indexOf(tok) != -1) {
          return "builtin";
        }
        return null;
      }

      var nextChar = stream.next();
      if (nextChar == '(' || nextChar == '[' || nextChar == '{') {
        return "bracket";
      }

      if (nextChar == ')' || nextChar == '}' || nextChar == ']') {
        return "bracket";
      }

      return null;
    }
  };

  return mode;
});

CodeMirror.defineMIME("text/x-hy", "hy");
CodeMirror.defineMIME("hy", "hy");
