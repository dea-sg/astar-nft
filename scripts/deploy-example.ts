/* eslint-disable new-cap */

import { ethers, upgrades } from 'hardhat'
import { type EventLog } from 'ethers'

async function main() {
	const tokenFactory = await ethers.getContractFactory('ExampleToken')
	const token = await upgrades.deployProxy(tokenFactory, [], { kind: 'uups' })
	await token.deployed()
	console.log('proxy was deployed to:', token.address)
	const filter = token.filters.Upgraded()
	const events = (await token.queryFilter(filter)) as EventLog[]
	console.log('logic was deployed to:', events[0].args.implementation)
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})
