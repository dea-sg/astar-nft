/* eslint-disable new-cap */

import { ethers } from 'hardhat'

async function main() {
	const tokenFactory = await ethers.getContractFactory('KamuiVerseNFT')
	const nft = tokenFactory.attach('0xAb3E5dECb1B696CFd56f661478DC032b9D232c6E')
	const mintRole = await nft.MINT_ROLE()
	// ネットワークによって、切り替える
	// https://hackmd.io/@maario/BJLiFsd6a#Contract-addresses
	// testnet
	await nft.grantRole(mintRole, '0x7D106176F9105E7a0f0778F044B49a78b98dE5d1')
	// mainnet
	//await nft.grantRole(mintRole, '0xCB1095416b6A8e0C3ea39F8fe6Df84f4179C93C2')
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})
