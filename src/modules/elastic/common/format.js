function formatPourvoiNumber(str) {
  str = `${str}`.trim();
  if (/^\d{2}\D\d{2}\D\d{3}$/.test(str) === false) {
    str = str.replace(/\D/gim, '').trim();
    str = `${str.substring(0, 2)}-${str.substring(2, 4)}.${str.substring(4)}`;
  }
  return str;
}

function sortByAscendingNumber(a, b) {
  if (a.start < b.start) {
    return -1;
  }
  if (a.start > b.start) {
    return 1;
  }
  return 0;
}

module.exports = { formatPourvoiNumber, sortByAscendingNumber };
