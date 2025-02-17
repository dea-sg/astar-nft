/* eslint-disable new-cap */

import { ethers } from 'hardhat'

async function main() {
	const tokenFactory = await ethers.getContractFactory('KamuiVerseNFT')
	const nft = tokenFactory.attach('0xcCb3F56AA3e998ee6A662EA822DCd3238C002933')
	await nft.setBaseURI(
		'https://arweave.net/8lIwCR0f_ks7V94xIpe_dJqHmYTsNFuHbNSfy-JCAlk/'
	)
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})
