

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bufferToHex = exports.hexToBuffer = exports.decode = exports.encode = exports.withCrc = exports.encodedParts = exports.parts = exports.isValidCRCShareLink = exports.parseDocumentLink = exports.createDocumentLink = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _bs = require('bs58');

var _bs2 = _interopRequireDefault(_bs);

var _jsCrc = require('js-crc');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** share link helper functions
 * lifted and adapted from pixelpusher
 */

var createDocumentLink = exports.createDocumentLink = function createDocumentLink(type, id) {
  if (!type) {
    throw new Error('no type when creating URL');
  }
  if (id.match('pushpin')) {
    throw new Error('so-called ID contains "pushpin". you appear to have passed a URL as an ID');
  }
  if (!id || id.length !== 64) {
    throw new Error('expected a 64 character base16 key as input');
  }
  return withCrc('pushpin://' + type + '/' + encode(id));
};

var parseDocumentLink = exports.parseDocumentLink = function parseDocumentLink(link) {
  if (!link) {
    throw new Error('Cannot parse an empty value as a link.');
  }

  var _parts = parts(link),
      nonCrc = _parts.nonCrc,
      crc = _parts.crc,
      scheme = _parts.scheme,
      type = _parts.type,
      docId = _parts.docId;

  if (!isValidCRCShareLink(nonCrc, crc)) {
    throw new Error('Failed CRC check: ' + (0, _jsCrc.crc16)(nonCrc) + ' should have been ' + crc);
  }

  if (scheme !== 'pushpin') {
    throw new Error('Invalid url scheme: ' + scheme + ' (expected pushpin)');
  }

  if (docId.length !== 64) {
    throw new Error('Invalid docId: ' + docId + ' (should be length 64)');
  }

  if (!type) {
    throw new Error('Missing type in ' + undefined.props.url);
  }

  return { scheme: scheme, type: type, docId: docId };
};

var isValidCRCShareLink = exports.isValidCRCShareLink = function isValidCRCShareLink(nonCrc, crc) {
  return Boolean(nonCrc) && Boolean(crc) && (0, _jsCrc.crc16)(nonCrc) === crc;
};

var parts = exports.parts = function parts(str) {
  var p = encodedParts(str);

  return {
    scheme: p.scheme,
    type: p.type,
    docId: p.docId && decode(p.docId),
    nonCrc: p.nonCrc,
    crc: p.crc && decode(p.crc)
  };
};

var encodedParts = exports.encodedParts = function encodedParts(str) {
  var _ref = str.match(/^((\w+):\/\/(.+)\/(\w+))\/(\w{1,4})$/) || [],
      _ref2 = _slicedToArray(_ref, 6),
      /* whole match */nonCrc = _ref2[1],
      scheme = _ref2[2],
      type = _ref2[3],
      docId = _ref2[4],
      crc = _ref2[5];

  return { nonCrc: nonCrc, scheme: scheme, type: type, docId: docId, crc: crc };
};

var withCrc = exports.withCrc = function withCrc(str) {
  return str + '/' + encode((0, _jsCrc.crc16)(str));
};

var encode = exports.encode = function encode(str) {
  return _bs2.default.encode(hexToBuffer(str));
};

var decode = exports.decode = function decode(str) {
  return bufferToHex(_bs2.default.decode(str));
};

var hexToBuffer = exports.hexToBuffer = function hexToBuffer(key) {
  return Buffer.isBuffer(key) ? key : Buffer.from(key, 'hex');
};

var bufferToHex = exports.bufferToHex = function bufferToHex(key) {
  return Buffer.isBuffer(key) ? key.toString('hex') : key;
};
