import { ethers } from "ethers"
import { v4 as uuidV4, parse as uuidParse } from "uuid"

export const sleep = async (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const isBigNumberish = (input: any) => {
  try {
    ethers.BigNumber.from(input)
    return true
  } catch {
    return false
  }
}

export const getUuidDecimalString = () => {
  const id = uuidV4()
  const id_parsed = Array.from(uuidParse(id), (n) => n.toString())
  // Length: 46~48
  return id_parsed.reduce((prev, curr) => prev + curr.padStart(3, "0"))
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

export const decimalToHexWithPrefix = (d: number) => {
  const hex = d.toString(16)
  return `0x${hex}`
}
