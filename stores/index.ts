import { useState, useEffect, useRef } from 'react';

// export const useStoreCustom = (cb: any) => {
//   const store = cb()
//   const [data, setData] = useState()

//   useEffect(() => {
//     setData(store)
//   }, [store])

//   return data;
// }


export const useStoreCustom = <T, F>(
  store: (callback: (state: T) => unknown) => unknown,
  callback: (state: T) => F
) => {
  const result = store(callback) as F
  const [data, setData] = useState<F>()

  useEffect(() => {
    setData(result)
  }, [result])

  return data;
};
