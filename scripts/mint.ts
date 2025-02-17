/* eslint-disable new-cap */

import { ethers } from 'hardhat'

async function main() {
	const tokenFactory = await ethers.getContractFactory('KamuiVerseNFT')
	const nft = tokenFactory.attach('0xAb3E5dECb1B696CFd56f661478DC032b9D232c6E')
	await nft.mint('0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC', 30, {
		value: '30000000000000000',
	})
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})
