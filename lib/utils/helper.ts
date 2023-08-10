export const removeAccents = (str: string) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export const formatCurrency = (x: number) => {
  return x.toLocaleString('vi-VN', {style : 'currency', currency : 'VND'})
}

export const getPercent = (price: number, promotionalPrice?: number) => {
  if (!promotionalPrice) return 0
  return Math.ceil((promotionalPrice - price) / promotionalPrice * 100)
}

const isValidUrl = (urlString: string) => {
  var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
  '(\\#[-a-z\\d_]*)?$','i');// validate fragment locator

  return !!urlPattern.test(urlString);
}

export const getImage = (image: string) => {
  let link = image

  if (isValidUrl(link)) {
    return link
  }
  else {
    return process.env.NEXTAUTH_URL + link
  }
}

export const getScrollbarWidth = () => {
  if (typeof window == "undefined")
    return 0

  // Creating invisible container
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll'; // forcing scrollbar to appear
  //  outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
  document.body.appendChild(outer);

  // Creating inner element and placing it in the container
  const inner = document.createElement('div');
  outer.appendChild(inner);

  // Calculating difference between container's full width and the child width
  const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);

  // Removing temporary elements from the DOM
  outer.parentNode?.removeChild(outer);

  return scrollbarWidth;
}

export const formatBytes = (bytes?: number, decimals = 2) => {
  if (!bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export const formatDate = (date?: Date | string | null, options?: object) => {
  if (!date) return "Trống"
  return new Date(date).toLocaleDateString("en-US", options)
}

export function exclude(data: any, ...keys: any) {
  if (data == null) return null

  for (let key of keys) {
    delete data[key]
  }
  return data
}