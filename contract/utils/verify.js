const { run } = require("hardhat")
async function verify(contractAddress, args) {
  console.log("Verifying contract...")
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    })
    console.log("Verified")
  } catch (error) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("Already verified")
    } else {
      console.error(error)
    }
  }
}

module.exports = { verify }
