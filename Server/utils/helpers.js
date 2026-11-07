const mongoose = require('mongoose');

/** True when both ids refer to the same document (works for strings and ObjectIds). */
function sameId(a, b) {
  if (a == null || b == null) return false;
  return String(a) === String(b);
}

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

/** Escapes a user supplied string so it can be used inside a RegExp safely. */
function escapeRegExp(str = '') {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Parses a positive integer page number, defaulting to 1. */
function parsePage(value) {
  const page = parseInt(value, 10);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

module.exports = { sameId, isValidObjectId, escapeRegExp, parsePage };
