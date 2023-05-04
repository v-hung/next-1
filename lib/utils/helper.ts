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