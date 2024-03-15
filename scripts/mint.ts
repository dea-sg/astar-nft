/* eslint-disable new-cap */

import { ethers } from 'hardhat'

async function main() {
	const tokenFactory = await ethers.getContractFactory('KamuiVerseNFT')
	const nft = tokenFactory.attach('0xcCb3F56AA3e998ee6A662EA822DCd3238C002933')
	await nft.mint('0x93E9a6A6070D03bADfab140132Dc41Fe5109601F', 20, {
		value: '20000000000000000',
	})
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})
