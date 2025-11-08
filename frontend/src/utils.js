export function createPageUrl(pageName) {
  if (pageName === "Home") {
    return "/";
  }
  return `/${pageName.toLowerCase()}`;
}

export function formatAddress(address, startChars = 6, endChars = 4) {
  if (!address) return '';
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

export function formatTxHash(hash, startChars = 10, endChars = 6) {
  if (!hash) return '';
  return `${hash.slice(0, startChars)}...${hash.slice(-endChars)}`;
}