/* eslint-disable new-cap */

import { ethers } from 'hardhat'

async function main() {
	const tokenFactory = await ethers.getContractFactory('KamuiVerseNFT')
	const nft = tokenFactory.attach('0xcCb3F56AA3e998ee6A662EA822DCd3238C002933')
	await nft.withdraw('0xd492492344943eC7348881C4272304508Bc3D202')
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})
