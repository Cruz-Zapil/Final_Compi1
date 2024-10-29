(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
(function (process){(function (){
// 'path' module extracted from Node.js v8.11.1 (only the posix part)
// transplited with Babel

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

function assertPath(path) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
  }
}

// Resolves . and .. elements in a path with directory names
function normalizeStringPosix(path, allowAboveRoot) {
  var res = '';
  var lastSegmentLength = 0;
  var lastSlash = -1;
  var dots = 0;
  var code;
  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47 /*/*/)
      break;
    else
      code = 47 /*/*/;
    if (code === 47 /*/*/) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf('/');
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = '';
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
              }
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = '';
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += '/..';
          else
            res = '..';
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += '/' + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46 /*.*/ && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}

function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root;
  var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
  if (!dir) {
    return base;
  }
  if (dir === pathObject.root) {
    return dir + base;
  }
  return dir + sep + base;
}

var posix = {
  // path.resolve([from ...], to)
  resolve: function resolve() {
    var resolvedPath = '';
    var resolvedAbsolute = false;
    var cwd;

    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path;
      if (i >= 0)
        path = arguments[i];
      else {
        if (cwd === undefined)
          cwd = process.cwd();
        path = cwd;
      }

      assertPath(path);

      // Skip empty entries
      if (path.length === 0) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

    if (resolvedAbsolute) {
      if (resolvedPath.length > 0)
        return '/' + resolvedPath;
      else
        return '/';
    } else if (resolvedPath.length > 0) {
      return resolvedPath;
    } else {
      return '.';
    }
  },

  normalize: function normalize(path) {
    assertPath(path);

    if (path.length === 0) return '.';

    var isAbsolute = path.charCodeAt(0) === 47 /*/*/;
    var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/;

    // Normalize the path
    path = normalizeStringPosix(path, !isAbsolute);

    if (path.length === 0 && !isAbsolute) path = '.';
    if (path.length > 0 && trailingSeparator) path += '/';

    if (isAbsolute) return '/' + path;
    return path;
  },

  isAbsolute: function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && path.charCodeAt(0) === 47 /*/*/;
  },

  join: function join() {
    if (arguments.length === 0)
      return '.';
    var joined;
    for (var i = 0; i < arguments.length; ++i) {
      var arg = arguments[i];
      assertPath(arg);
      if (arg.length > 0) {
        if (joined === undefined)
          joined = arg;
        else
          joined += '/' + arg;
      }
    }
    if (joined === undefined)
      return '.';
    return posix.normalize(joined);
  },

  relative: function relative(from, to) {
    assertPath(from);
    assertPath(to);

    if (from === to) return '';

    from = posix.resolve(from);
    to = posix.resolve(to);

    if (from === to) return '';

    // Trim any leading backslashes
    var fromStart = 1;
    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47 /*/*/)
        break;
    }
    var fromEnd = from.length;
    var fromLen = fromEnd - fromStart;

    // Trim any leading backslashes
    var toStart = 1;
    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47 /*/*/)
        break;
    }
    var toEnd = to.length;
    var toLen = toEnd - toStart;

    // Compare paths to find the longest common path from root
    var length = fromLen < toLen ? fromLen : toLen;
    var lastCommonSep = -1;
    var i = 0;
    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47 /*/*/) {
            // We get here if `from` is the exact base path for `to`.
            // For example: from='/foo/bar'; to='/foo/bar/baz'
            return to.slice(toStart + i + 1);
          } else if (i === 0) {
            // We get here if `from` is the root
            // For example: from='/'; to='/foo'
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47 /*/*/) {
            // We get here if `to` is the exact base path for `from`.
            // For example: from='/foo/bar/baz'; to='/foo/bar'
            lastCommonSep = i;
          } else if (i === 0) {
            // We get here if `to` is the root.
            // For example: from='/foo'; to='/'
            lastCommonSep = 0;
          }
        }
        break;
      }
      var fromCode = from.charCodeAt(fromStart + i);
      var toCode = to.charCodeAt(toStart + i);
      if (fromCode !== toCode)
        break;
      else if (fromCode === 47 /*/*/)
        lastCommonSep = i;
    }

    var out = '';
    // Generate the relative path based on the path difference between `to`
    // and `from`
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
        if (out.length === 0)
          out += '..';
        else
          out += '/..';
      }
    }

    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts
    if (out.length > 0)
      return out + to.slice(toStart + lastCommonSep);
    else {
      toStart += lastCommonSep;
      if (to.charCodeAt(toStart) === 47 /*/*/)
        ++toStart;
      return to.slice(toStart);
    }
  },

  _makeLong: function _makeLong(path) {
    return path;
  },

  dirname: function dirname(path) {
    assertPath(path);
    if (path.length === 0) return '.';
    var code = path.charCodeAt(0);
    var hasRoot = code === 47 /*/*/;
    var end = -1;
    var matchedSlash = true;
    for (var i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
        // We saw the first non-path separator
        matchedSlash = false;
      }
    }

    if (end === -1) return hasRoot ? '/' : '.';
    if (hasRoot && end === 1) return '//';
    return path.slice(0, end);
  },

  basename: function basename(path, ext) {
    if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
    assertPath(path);

    var start = 0;
    var end = -1;
    var matchedSlash = true;
    var i;

    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path) return '';
      var extIdx = ext.length - 1;
      var firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= 0; --i) {
        var code = path.charCodeAt(i);
        if (code === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
          if (firstNonSlashEnd === -1) {
            // We saw the first non-path separator, remember this index in case
            // we need it if the extension ends up not matching
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            // Try to match the explicit extension
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                // We matched the extension, so mark this as the end of our path
                // component
                end = i;
              }
            } else {
              // Extension does not match, so our result is the entire path
              // component
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }

      if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
      return path.slice(start, end);
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // path component
          matchedSlash = false;
          end = i + 1;
        }
      }

      if (end === -1) return '';
      return path.slice(start, end);
    }
  },

  extname: function extname(path) {
    assertPath(path);
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    for (var i = path.length - 1; i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1)
            startDot = i;
          else if (preDotState !== 1)
            preDotState = 1;
      } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return '';
    }
    return path.slice(startDot, end);
  },

  format: function format(pathObject) {
    if (pathObject === null || typeof pathObject !== 'object') {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }
    return _format('/', pathObject);
  },

  parse: function parse(path) {
    assertPath(path);

    var ret = { root: '', dir: '', base: '', ext: '', name: '' };
    if (path.length === 0) return ret;
    var code = path.charCodeAt(0);
    var isAbsolute = code === 47 /*/*/;
    var start;
    if (isAbsolute) {
      ret.root = '/';
      start = 1;
    } else {
      start = 0;
    }
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1;

    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;

    // Get non-dir info
    for (; i >= start; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
    // We saw a non-dot character immediately before the dot
    preDotState === 0 ||
    // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);else ret.base = ret.name = path.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }
      ret.ext = path.slice(startDot, end);
    }

    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = '/';

    return ret;
  },

  sep: '/',
  delimiter: ':',
  win32: null,
  posix: null
};

posix.posix = posix;

module.exports = posix;

}).call(this)}).call(this,require('_process'))
},{"_process":3}],3:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],4:[function(require,module,exports){
class Captcha {

    constructor(idTrivia, nombre, head, body) {
        this.idTrivia = idTrivia || ""; // Identificador del captcha
        this.nombre = nombre || "Sin nombre"; // Nombre del captcha
        this.head = head || "";  // Contenido del head
        this.body = body || "";  // Contenido del body
    }

    // Representación en cadena
    toString() {
        return `Captcha: ${this.idTrivia}, Nombre: ${this.nombre}, Head: ${this.head}, Body: ${this.body}`;
    }

    // Genera la estructura HTML completa
    generarHTML() {
        return `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${this.nombre}</title>
                ${this.head || "<!-- Head vacío -->"}
            </head>
            <body>
                ${this.body || "<!-- Body vacío -->"}
            </body>
            </html>
        `;
    }
}


module.exports = Captcha;



},{}],5:[function(require,module,exports){
(function (process){(function (){
/* parser generated by jison 0.4.18 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var Parser = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,12],$V1=[12,14],$V2=[1,51],$V3=[1,54],$V4=[1,57],$V5=[9,14],$V6=[1,90],$V7=[1,87],$V8=[1,88],$V9=[1,89],$Va=[1,91],$Vb=[1,92],$Vc=[1,93],$Vd=[1,94],$Ve=[1,95],$Vf=[1,96],$Vg=[1,100],$Vh=[19,22,41,42,43,44,45,46,47,48],$Vi=[2,35],$Vj=[1,107],$Vk=[1,110],$Vl=[2,15],$Vm=[2,20],$Vn=[1,113],$Vo=[2,27];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"start":3,"json":4,"EOF":5,"CAPTCHA1":6,"CORCHETE_IZQ":7,"captcha":8,"CORCHETE_DER":9,"LLAVE_IZQ":10,"listaCapt":11,"LLAVE_DER":12,"capt":13,"COMA":14,"idCapt":15,"nombCapt":16,"headCapt":17,"bodyCapt":18,"COMILLAS":19,"ID_CAPTCHA":20,"DOS_PUNTO":21,"IDENTIFICADOR":22,"NOMBRE":23,"HEAD":24,"listaElementos":25,"elemento":26,"claveVal":27,"ETIQUETA":28,"PARAMETRO":29,"textos":30,"CONTENIDO":31,"BODY":32,"listaBody":33,"bodyElemento":34,"BACKGROUND":35,"ETIQUETAS":36,"listaEtiquetas":37,"etiBody":38,"etiquetaBody":39,"txts":40,"PARAMET":41,"IGUAL":42,"ESPACIO":43,"INTERRO":44,"INTERRO_INV":45,"DIAGONAL":46,"SIMBOLO":47,"COLOR":48,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",6:"CAPTCHA1",7:"CORCHETE_IZQ",9:"CORCHETE_DER",10:"LLAVE_IZQ",12:"LLAVE_DER",14:"COMA",19:"COMILLAS",20:"ID_CAPTCHA",21:"DOS_PUNTO",22:"IDENTIFICADOR",23:"NOMBRE",24:"HEAD",28:"ETIQUETA",29:"PARAMETRO",31:"CONTENIDO",32:"BODY",35:"BACKGROUND",36:"ETIQUETAS",41:"PARAMET",42:"IGUAL",43:"ESPACIO",44:"INTERRO",45:"INTERRO_INV",46:"DIAGONAL",47:"SIMBOLO",48:"COLOR"},
productions_: [0,[3,2],[4,4],[8,3],[11,1],[11,3],[13,7],[15,7],[16,7],[17,7],[25,3],[25,5],[26,1],[26,3],[27,7],[27,7],[27,7],[18,7],[33,1],[33,3],[34,7],[34,7],[37,3],[37,5],[38,1],[38,3],[39,7],[39,7],[39,7],[39,7],[30,1],[30,2],[40,1],[40,1],[40,1],[40,1],[40,1],[40,1],[40,1],[40,1],[40,1],[40,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
 return $$[$0-1]; 
break;
case 2:
 this.$ = captchas; 
break;
case 6:
  tmpCaptcha = new Captcha($$[$0-6], $$[$0-5].nombre, head, body);

        captchas.push(tmpCaptcha);

        
     
break;
case 7:
 /* Acción semántica para idCapt */ 
break;
case 8:
 /* Acción semántica para nombCapt */ 
break;
case 12:

        let tiquetaHTMLa = construirEtiqueta(etiqueta, parametro, contenido);
        head += tiquetaHTMLa;
        
        etiqueta = parametro = contenido = "";
    
break;
case 13:


        let tiquetaHTML = construirEtiqueta(etiqueta, parametro, contenido);
        head += tiquetaHTML;

        etiqueta = parametro = contenido = "";
    
break;
case 14: case 26:
 etiqueta = $$[$0-1]; 
break;
case 15: case 27:
 parametro = $$[$0-1]; 
break;
case 16: case 28:
 contenido = $$[$0-1]; 
break;
case 20:
 /* Acción semántica para el fondo */ 
break;
case 21:
 /* Acción semántica para etiquetas */ 
break;
case 22: case 23:

        let etiquetaHTML = construirEtiqueta(etiqueta, parametro, contenido);
        body += etiquetaHTML;
        etiqueta = parametro = contenido = "";
    
break;
case 24: case 30: case 32: case 33: case 34: case 35: case 36: case 37: case 38: case 39: case 40: case 41:
 this.$ = $$[$0]; 
break;
case 25:
  this.$ = $$[$0-2] + $$[$0]; 
break;
case 29:
 /* Acción para etiquetas anidadas */ 
break;
case 31:
 this.$ = $$[$0-1] + $$[$0]; 
break;
}
},
table: [{3:1,4:2,6:[1,3]},{1:[3]},{5:[1,4]},{7:[1,5]},{1:[2,1]},{8:6,10:[1,7]},{9:[1,8]},{11:9,13:10,15:11,19:$V0},{5:[2,2]},{12:[1,13],14:[1,14]},o($V1,[2,4]),{14:[1,15]},{20:[1,16]},{9:[2,3]},{13:17,15:11,19:$V0},{16:18,19:[1,19]},{19:[1,20]},o($V1,[2,5]),{14:[1,21]},{23:[1,22]},{21:[1,23]},{17:24,19:[1,25]},{19:[1,26]},{19:[1,27]},{14:[1,28]},{24:[1,29]},{21:[1,30]},{22:[1,31]},{18:32,19:[1,33]},{19:[1,34]},{19:[1,35]},{19:[1,36]},o($V1,[2,6]),{32:[1,37]},{21:[1,38]},{22:[1,39]},{14:[2,7]},{19:[1,40]},{7:[1,41]},{19:[1,42]},{21:[1,43]},{10:[1,45],25:44},{14:[2,8]},{10:[1,46]},{9:[1,47],14:[1,48]},{19:$V2,26:49,27:50},{19:$V3,33:52,34:53},{14:[2,9]},{10:[1,55]},{12:[1,56],14:$V4},o($V1,[2,12]),{28:[1,58],29:[1,59],31:[1,60]},{12:[1,61],14:[1,62]},o($V1,[2,18]),{35:[1,63],36:[1,64]},{19:$V2,26:65,27:50},o($V5,[2,10]),{19:$V2,27:66},{19:[1,67]},{19:[1,68]},{19:[1,69]},o($V1,[2,17]),{19:$V3,34:70},{19:[1,71]},{19:[1,72]},{12:[1,73],14:$V4},o($V1,[2,13]),{21:[1,74]},{21:[1,75]},{21:[1,76]},o($V1,[2,19]),{21:[1,77]},{21:[1,78]},o($V5,[2,11]),{19:[1,79]},{19:[1,80]},{19:[1,81]},{19:[1,82]},{7:[1,83]},{22:[1,84]},{19:$V6,22:$V7,30:85,40:86,41:$V8,42:$V9,43:$Va,44:$Vb,45:$Vc,46:$Vd,47:$Ve,48:$Vf},{22:[1,97]},{19:$V6,22:$V7,30:98,40:86,41:$V8,42:$V9,43:$Va,44:$Vb,45:$Vc,46:$Vd,47:$Ve,48:$Vf},{10:$Vg,37:99},{19:[1,101]},{19:[1,102],22:$V7,40:103,41:$V8,42:$V9,43:$Va,44:$Vb,45:$Vc,46:$Vd,47:$Ve,48:$Vf},o($Vh,[2,30]),o($Vh,[2,32]),o($Vh,[2,33]),o($Vh,[2,34]),o($Vh,$Vi),o($Vh,[2,36]),o($Vh,[2,37]),o($Vh,[2,38]),o($Vh,[2,39]),o($Vh,[2,40]),o($Vh,[2,41]),{19:[1,104]},{19:[1,105],22:$V7,40:103,41:$V8,42:$V9,43:$Va,44:$Vb,45:$Vc,46:$Vd,47:$Ve,48:$Vf},{9:[1,106],14:$Vj},{19:$Vk,38:108,39:109},o($V1,[2,14]),o($Vh,$Vi,{12:$Vl,14:$Vl}),o($Vh,[2,31]),o($V1,[2,16]),o($Vh,$Vi,{12:$Vm,14:$Vm}),o($V1,[2,21]),{10:[1,111]},{12:[1,112],14:$Vn},o($V1,[2,24]),{28:[1,114],29:[1,115],31:[1,116],36:[1,117]},{19:$Vk,38:118,39:109},o($V5,[2,22]),{19:$Vk,39:119},{19:[1,120]},{19:[1,121]},{19:[1,122]},{19:[1,123]},{12:[1,124],14:$Vn},o($V1,[2,25]),{21:[1,125]},{21:[1,126]},{21:[1,127]},{21:[1,128]},o($V5,[2,23]),{19:[1,129]},{19:[1,130]},{19:[1,131]},{7:[1,132]},{22:[1,133]},{19:$V6,22:$V7,30:134,40:86,41:$V8,42:$V9,43:$Va,44:$Vb,45:$Vc,46:$Vd,47:$Ve,48:$Vf},{22:[1,135]},{10:$Vg,37:136},{19:[1,137]},{19:[1,138],22:$V7,40:103,41:$V8,42:$V9,43:$Va,44:$Vb,45:$Vc,46:$Vd,47:$Ve,48:$Vf},{19:[1,139]},{9:[1,140],14:$Vj},o($V1,[2,26]),o($Vh,$Vi,{12:$Vo,14:$Vo}),o($V1,[2,28]),o($V1,[2,29])],
defaultActions: {4:[2,1],8:[2,2],13:[2,3],36:[2,7],42:[2,8],47:[2,9]},
parseError: function parseError (str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        var error = new Error(str);
        error.hash = hash;
        throw error;
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
        }
    }
    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);
    var ranges = lexer.options && lexer.options.ranges;
    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    _token_stack:
        var lex = function () {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        };
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};


const Captcha = require('./Captcha');

    let captchas = [];

    // Variables globales
    let head = "";
    let body = "";
    let etiqueta = "";
    let parametro = "";
    let contenido = "";
    let arrayListEtiqueta = [];

    // Función auxiliar para construir etiquetas HTML
    function construirEtiqueta(etiqueta, parametro, contenido) {
        let resultado = "";
        if (etiqueta) {
            resultado = "<" + etiqueta;
            resultado += parametro ? " " + parametro : "";
            resultado += ">";
        }
        if (contenido) {
            resultado += contenido;
        }
        if (etiqueta) {
            resultado += "</" + etiqueta + ">";
        }
        return resultado;
    }




/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function(match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex () {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin (condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState () {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules () {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState (n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState (condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:/* Ignorar espacios en blanco */
break;
case 1:return 6
break;
case 2:return 7
break;
case 3:return 9
break;
case 4:return 10
break;
case 5:return 12
break;
case 6:return 19
break;
case 7:return 14
break;
case 8:return 21
break;
case 9:return 'PUNTO_COMA'
break;
case 10:return 'PUNTO'
break;
case 11:return 42
break;
case 12:return 43
break;
case 13:return 44
break;
case 14:return 45
break;
case 15:return 46
break;
case 16:return 20
break;
case 17:return 23
break;
case 18:return 24
break;
case 19:return 32
break;
case 20:return 28
break;
case 21:return 36
break;
case 22:return 29
break;
case 23:return 31
break;
case 24:return 35
break;
case 25:return 48
break;
case 26:return 22
break;
case 27:return 41
break;
case 28:return 47
break;
case 29:return 5
break;
}
},
rules: [/^(?:\s+)/,/^(?:captcha1\.)/,/^(?:\[)/,/^(?:\])/,/^(?:\{)/,/^(?:\})/,/^(?:")/,/^(?:,)/,/^(?::)/,/^(?:;)/,/^(?:\.)/,/^(?:=)/,/^(?: )/,/^(?:\?)/,/^(?:¿)/,/^(?:\\\/\/)/,/^(?:ID_CAPTCHA\b)/,/^(?:NOMBRE\b)/,/^(?:HEAD\b)/,/^(?:BODY\b)/,/^(?:ETIQUETA\b)/,/^(?:ETIQUETAS\b)/,/^(?:PARAMETRO\b)/,/^(?:CONTENIDO\b)/,/^(?:BACKGROUND\b)/,/^(?:#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8}))/,/^(?:[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ0-9\?\¿\+\-\*\(\)\.,;: \t_]+)/,/^(?:([a-zA-ZáéíóúÁÉÍÓÚüÜñÑ0-9\?\¿\+\-\*\(\)\.,;:\= \t_]+[^]+)+)/,/^(?:[^])/,/^(?:$)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = Parser;
exports.Parser = Parser.Parser;
exports.parse = function () { return Parser.parse.apply(Parser, arguments); };
exports.main = function commonjsMain (args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}
}).call(this)}).call(this,require('_process'))
},{"./Captcha":4,"_process":3,"fs":1,"path":2}],6:[function(require,module,exports){


// Importa el parser y la clase Captcha (asegúrate de tenerlos exportados si están en otros archivos)
const  parser = require('./Parser'); // Importa el parser generado
const Captcha = require('./Captcha'); // Importa la clase Captcha
const fs = require('fs'); // Módulo para guardar en archivo

class TestCaptcha {

    constructor(entrada) {


        this.captchas = [];        
        this.entrada = entrada;
        this.parser = parser; // Asigna el parser directamente sin `new`
    }

    ejecutar() {


        try {
            // Ejecuta el parser y obtiene la lista de captchas
            let captchaGenerado = this.parser.parse(this.entrada);

            // Verifica si captchaGenerado es un array
            if (Array.isArray(captchaGenerado)) {
                console.log("Lista de captchas generada correctamente:");

                // Itera sobre cada captcha en la lista y procesa los datos
                captchaGenerado.forEach((captcha, index) => {
                    console.log(captcha.generarHTML()); // Muestra el HTML de cada captcha

                    // Aquí puedes acceder a los atributos de cada captcha y realizar cualquier acción
                    // Ejemplo: console.log(captcha.someAttribute);
                });
            } else {
                console.log("Error: El resultado del parser no es una lista de captchas.");
            }
        } catch (error) {
            console.error("Error al parsear la entrada:", error);
        }

    }

    crearCaptcha(idTrivia, nombre, head, body) {

        const nuevoCaptcha = new Captcha(idTrivia, nombre, head, body); // Crear instancia de Captcha


        this.captchas.push(nuevoCaptcha); // Guardarlo en la lista
        return nuevoCaptcha; // Retornar el objeto creado si deseas usarlo inmediatamente
    }

    mostrarTodosLosCaptchasHTML() {
        this.captchas.forEach(captcha => {
            console.log(captcha.generarHTML()); // Llama a generarHTML de cada Captcha
        });
    }


    guardarEnArchivo(contenido, nombreArchivo) {
        fs.writeFile(nombreArchivo, contenido, (err) => {
            if (err) {
                console.error("Error al guardar el archivo:", err);
            } else {
                console.log(`El archivo ${nombreArchivo} ha sido guardado con éxito.`);
            }
        });
    }
}

// Ejemplo de uso
const entrada = `

captcha1.[ 
 {
    "ID_CAPTCHA": "captcha_matematico_1",
    "NOMBRE": "Captcha Matemático 1",
    "HEAD": [
      {
        "ETIQUETA": "link",
        "PARAMETRO": " href = \"https://www.mclibre.org/consultar/htmlcss/html/html-etiquetas.html\""
      },
      {
        "ETIQUETA": "title",
        "CONTENIDO": " Mi primer Captcha Matemático"
      }
    ],
    "BODY": {
      "BACKGROUND": " background-color:  #e5e6ea   ;",
      "ETIQUETAS": [
        {
          "ETIQUETA": "h1",
          "PARAMETRO": " style= \"  text-align:  center;   color: #7eff33  ;  \"",
          "CONTENIDO": " Mi primer Captcha Matemático"
        },
        {
          "ETIQUETA": "br"
        },
        {
          "ETIQUETA": "spam",
          "PARAMETRO": "id = \"hola_12\"  style= \"  color:  fuchsia  ;   font-family: ARIAL, ;   \"",
          "CONTENIDO": " HOLA MUNDO"
        },
        {
          "ETIQUETA": "button",
          "PARAMETRO": "style= \"  background-color: green  ;  \"",
          "CONTENIDO": " Procesar..."
        },
        {
          "ETIQUETA": "div",
          "CONTENIDO": " Procesar... ",
          "ETIQUETAS": [
            {
              "ETIQUETA": "spam",
              "PARAMETRO": "id = \"primer_div\"  class  = \"row \" id = \"hola_12\"  style= \"  color:  purple  ;  color:  fuchsia  ;   font-family: ARIAL, ;   \"",
              "CONTENIDO": " HOLA MUNDO"
            }
          ]
        }
      ]
    }
  }

]
`;

// Crear una instancia de TestCaptcha y ejecutar la prueba
const test = new TestCaptcha(entrada);
test.ejecutar();



},{"./Captcha":4,"./Parser":5,"fs":1}],7:[function(require,module,exports){
// index.js
const Parser = require('./Parser');
const TestCaptcha = require('./TestCaptcha');
const Captcha = require('./Captcha');

module.exports = {
  Parser,
  TestCaptcha,
  Captcha,
};

},{"./Captcha":4,"./Parser":5,"./TestCaptcha":6}]},{},[7]);