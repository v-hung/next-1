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