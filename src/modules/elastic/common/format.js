const taxons = require("../../../taxons");

function inverseSort(sort) {
  return sort.map((sortRule) =>
    Object
      .entries(sortRule)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value === 'desc' ? 'asc' : value === 'asc' ? 'desc' : value }), {}),
  );
}

function formatPourvoiNumber(str) {
  str = `${str}`.trim();
  if (/^\d{2}\D\d{2}\D\d{3}$/.test(str) === false) {
    str = str.replace(/\D/gim, '').trim();
    str = `${str.substring(0, 2)}-${str.substring(2, 4)}.${str.substring(4)}`;
  }
  return str;
}

function formatNumber({ numberFull, jurisdiction }) {
    if (jurisdiction === "cc") return formatPourvoiNumber(numberFull)
    return Array.isArray(numberFull)
        ? numberFull[0]
        : numberFull
}

function formatNumbers({ numberFull, jurisdiction }) {
    if (jurisdiction === "cc") return numberFull ? numberFull.map(formatPourvoiNumber) : numberFull
    return Array.isArray(numberFull)
        ? numberFull
        : [numberFull]
}

function formatType(resolveReference, { type, jurisdiction: sourceName }) {
    return resolveReference && taxons[sourceName].type.taxonomy[type]
        ? taxons[sourceName].type.taxonomy[type]
        : type
}

function formatQueryIntoUrlParams(query) {
    const pageParams = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
        if (Array.isArray(value)) value.forEach(_ => pageParams.append(key, _))
        else pageParams.append(key, value)
    })
    return pageParams.toString();
}

module.exports = {
  inverseSort,
  formatQueryIntoUrlParams,
  formatNumber,
  formatNumbers,
  formatType
};
