/* eslint-disable new-cap */

import { ethers, upgrades } from 'hardhat'
// import { type EventLog } from 'ethers'

async function main() {
	const tokenFactory = await ethers.getContractFactory('KamuiVerseNFT')
	const token = await upgrades.deployProxy(tokenFactory, [], { kind: 'uups' })
	console.log(token)
	// Astarの品質の問題？deployedが存在しないと言われて転けてしまう
	// await token.deployed()
	// console.log('proxy was deployed to:', token.address)
	// const filter = token.filters.Upgraded()
	// const events = (await token.queryFilter(filter)) as EventLog[]
	// console.log('logic was deployed to:', events[0].args.implementation)
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})

// npx hardhat run dist/scripts/deploy.js --network zKatana
// 0xF688573D7B154DEc538234CBd2D8e3f0fdadeAd6 impl
// 0xcCb3F56AA3e998ee6A662EA822DCd3238C002933 proxy
// npx hardhat flatten contracts/KamuiVerseNFT.sol > tmp.sol
