import { BigNumber } from "ethers"

export const ADDRESS = "0xd1ADe9283f3c781D4412e983759A0A3040Cde9f4"
export const MINED_BLOCK = 28888471
export const TOPIC_MINTED =
  "0x25b428dfde728ccfaddad7e29e4ac23c24ed7fd1a6e3e3f91894a9a073f5dfff"
export const PARAMS = {
  alpha: BigNumber.from("9900000000000000"),
  beta: BigNumber.from("1000000000000000"),
  delta: BigNumber.from("100000000000000"),
  signer: "0x31415a6c5b28251b46baca88859fe694f9b69e71",
  uri: "https://example.com/metadata/dreams/{id}",
}
