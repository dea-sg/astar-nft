/* eslint-disable new-cap */

import { ethers } from 'hardhat'

async function main() {
	const tokenFactory = await ethers.getContractFactory('KamuiVerseNFT')
	const nft = tokenFactory.attach('0xAb3E5dECb1B696CFd56f661478DC032b9D232c6E')
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
