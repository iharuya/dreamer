export const sleep = async (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

// 360, 100, 50 -> #ff0000
export const hslToHex = (h: number, s: number, l: number): string => {
  l /= 100
  const a = (s * Math.min(l, 1 - l)) / 100
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0")
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

// " 100 50% 50%" -> hex
export const cssHslToHex = (s: string): string => {
  let arr = s.trim().split(" ")
  const first = parseInt(arr[0])
  const second = parseInt(arr[1].replace("%", ""))
  const third = parseInt(arr[2].replace("%", ""))
  return hslToHex(first, second, third)
}
