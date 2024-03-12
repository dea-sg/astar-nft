import { expect } from 'chai'
import { ethers } from 'hardhat'
import { type Contract } from 'ethers'
import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers'

describe('Example', () => {
	async function setup(): Promise<Contract> {
		const example = await ethers.deployContract('ExampleToken')
		await example.initialize()
		return example
	}

	describe('name', () => {
		it('check name', async () => {
			const example = await loadFixture(setup)
			const value = await example.name()
			expect(value.toString()).to.equal('token')
		})
	})
	describe('symbol', () => {
		it('check symbol', async () => {
			const example = await loadFixture(setup)
			const symbol = await example.symbol()
			expect(symbol.toString()).to.equal('TOKEN')
		})
	})
})
