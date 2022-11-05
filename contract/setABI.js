const fs = require("fs")
const path = require("path")

const PATH_OUTPUT_DIR = "../app/constants/contracts/abi/"
const PATH_DREAMS = "./artifacts/contracts/Dreams.sol/Dreams.json"
if (!fs.existsSync(PATH_DREAMS)) {
  console.log("Please compile the contracts.")
  process.exit(1)
}
if (!fs.existsSync(PATH_OUTPUT_DIR)) {
  fs.mkdirSync(PATH_OUTPUT_DIR)
}

const DREAMS = JSON.parse(fs.readFileSync(PATH_DREAMS))
fs.writeFileSync(
  path.join(PATH_OUTPUT_DIR, "Dreams.json"),
  JSON.stringify(DREAMS.abi)
)
