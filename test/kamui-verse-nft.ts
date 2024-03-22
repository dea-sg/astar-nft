import { expect } from 'chai'
import { ethers, upgrades } from 'hardhat'
import { type Contract } from 'ethers'
import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers'
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers'

describe('KamuiVerseNFT', () => {
	const setup = async (): Promise<Contract> => {
		const kamui = await getUupsContract()
		await kamui.setBaseURI('https://kamui-verse-nft.com/')
		return kamui
	}
	const getUupsContract = async (): Promise<Contract> => {
		const testFactory = await ethers.getContractFactory('KamuiVerseNFT')

		const contract = await upgrades.deployProxy(testFactory, [], {
			kind: 'uups',
		})
		return contract
	}
	type Signers = {
		deployer: HardhatEthersSigner
		user: HardhatEthersSigner
	}
	const getSigners = async (): Promise<Signers> => {
		const signers = await ethers.getSigners()
		return {
			deployer: signers[0],
			user: signers[1],
		}
	}
	const MINT_PRICE = 1000000000000000
	describe('initialize', () => {
		describe('success', () => {
			it('set data', async () => {
				const kamui = await loadFixture(setup)
				expect(await kamui.name()).to.equal('Kamui')
				expect(await kamui.symbol()).to.equal('KAMUI')
				const signers = await getSigners()
				const adminRole = await kamui.DEFAULT_ADMIN_ROLE()
				const hasAdminRole = await kamui.hasRole(
					adminRole,
					signers.deployer.address
				)
				expect(hasAdminRole).to.equal(true)
				const mintRole = await kamui.MINTER_ROLE()
				const hasMintRole = await kamui.hasRole(
					mintRole,
					signers.deployer.address
				)
				expect(hasMintRole).to.equal(true)
				const mintPrice = await kamui.mintPrice()
				expect(mintPrice).to.equal(MINT_PRICE)
				const owner = await kamui.owner()
				expect(owner).to.equal(signers.deployer.address)
			})
		})
		describe('fail', () => {
			it('reinitialize', async () => {
				const kamui = await loadFixture(setup)
				await expect(kamui.initialize()).to.be.revertedWith(
					'Initializable: contract is already initialized'
				)
			})
		})
	})

	describe('supportsInterface', () => {
		it('check id(IKamuiVerseNFT)', async () => {
			const kamui = await loadFixture(setup)
			const supportsTest = await ethers.deployContract('SupportsInterfaceTest')
			const tmp = supportsTest.getIKamuiVerseNFTId()
			const id = await kamui.supportsInterface(tmp)
			expect(id).to.equal(true)
		})
		it('check id(IAstarCampaignNFT)', async () => {
			const kamui = await loadFixture(setup)
			const supportsTest = await ethers.deployContract('SupportsInterfaceTest')
			const tmp = supportsTest.getIAstarCampaignNFTId()
			const id = await kamui.supportsInterface(tmp)
			expect(id).to.equal(true)
		})

		it('check id(IAccessControlUpgradeable)', async () => {
			const kamui = await loadFixture(setup)
			const supportsTest = await ethers.deployContract('SupportsInterfaceTest')
			const tmp = supportsTest.getIAccessControlUpgradeableId()
			const id = await kamui.supportsInterface(tmp)
			expect(id).to.equal(true)
		})

		it('check id(IERC721Upgradeable)', async () => {
			const kamui = await loadFixture(setup)
			const supportsTest = await ethers.deployContract('SupportsInterfaceTest')
			const tmp = supportsTest.getIERC721UpgradeableId()
			const id = await kamui.supportsInterface(tmp)
			expect(id).to.equal(true)
		})

		it('check id(0x12345678)', async () => {
			const kamui = await loadFixture(setup)
			const id = await kamui.supportsInterface('0x12345678')
			expect(id).to.equal(false)
		})
	})
	describe('mint, totalSupply', () => {
		describe('success', () => {
			it('mint', async () => {
				const kamui = await loadFixture(setup)
				const signers = await getSigners()
				const userAddress = signers.user.address
				const balanceBefore = await kamui.balanceOf(userAddress)
				const totalSupplyBefore = await kamui.totalSupply()
				expect(totalSupplyBefore).to.equal(0)
				await kamui.mint(userAddress, 1, { value: MINT_PRICE })
				const balanceAfter = await kamui.balanceOf(userAddress)
				expect(balanceAfter - balanceBefore).to.equal(1)
				const totalSupplyAfter = await kamui.totalSupply()
				expect(totalSupplyAfter - totalSupplyBefore).to.equal(1)
			})
			it('get tokenURI', async () => {
				const kamui = await loadFixture(setup)
				const signers = await getSigners()
				const userAddress = signers.user.address
				await kamui.mint(userAddress, 1, { value: MINT_PRICE })
				const tokenURI = await kamui.tokenURI(0)
				const re = new RegExp(`https://kamui-verse-nft.com/[0-9].json`)
				expect(re.test(tokenURI)).to.equal(true)
			})
			it('mint 2', async () => {
				const kamui = await loadFixture(setup)
				const signers = await getSigners()
				const userAddress = signers.user.address
				const balanceBefore = await kamui.balanceOf(userAddress)
				const totalSupplyBefore = await kamui.totalSupply()
				expect(totalSupplyBefore).to.equal(0)
				await kamui.mint(userAddress, 2, { value: MINT_PRICE * 2 })
				const balanceAfter = await kamui.balanceOf(userAddress)
				expect(balanceAfter - balanceBefore).to.equal(2)
				const totalSupplyAfter = await kamui.totalSupply()
				expect(totalSupplyAfter - totalSupplyBefore).to.equal(2)
			})
			it('mint 3', async () => {
				const kamui = await loadFixture(setup)
				const signers = await getSigners()
				const userAddress = signers.user.address
				const balanceBefore = await kamui.balanceOf(userAddress)
				const totalSupplyBefore = await kamui.totalSupply()
				expect(totalSupplyBefore).to.equal(0)
				await kamui.mint(userAddress, 3, { value: MINT_PRICE * 3 })
				const balanceAfter = await kamui.balanceOf(userAddress)
				expect(balanceAfter - balanceBefore).to.equal(3)
				const totalSupplyAfter = await kamui.totalSupply()
				expect(totalSupplyAfter - totalSupplyBefore).to.equal(3)
			})
			it('mint 3 and mint 2', async () => {
				const kamui = await loadFixture(setup)
				const signers = await getSigners()
				const userAddress = signers.user.address
				const balanceBefore = await kamui.balanceOf(userAddress)
				const totalSupplyBefore = await kamui.totalSupply()
				expect(totalSupplyBefore).to.equal(0)
				await kamui.mint(userAddress, 3, { value: MINT_PRICE * 3 })
				await kamui.mint(userAddress, 2, { value: MINT_PRICE * 2 })
				const balanceAfter = await kamui.balanceOf(userAddress)
				expect(balanceAfter - balanceBefore).to.equal(5)
				const totalSupplyAfter = await kamui.totalSupply()
				expect(totalSupplyAfter - totalSupplyBefore).to.equal(5)
			})
			it('mint 1000', async () => {
				const kamui = await loadFixture(setup)
				const signers = await getSigners()
				const userAddress = signers.user.address
				const balanceBefore = await kamui.balanceOf(userAddress)
				const totalSupplyBefore = await kamui.totalSupply()
				expect(totalSupplyBefore).to.equal(0)
				await kamui.mint(userAddress, 500, { value: "500000000000000000" })
				await kamui.mint(userAddress, 500, { value: "500000000000000000" })
				const balanceAfter = await kamui.balanceOf(userAddress)
				expect(balanceAfter - balanceBefore).to.equal(1000)
				const totalSupplyAfter = await kamui.totalSupply()
				expect(totalSupplyAfter - totalSupplyBefore).to.equal(1000)
			})
			it.skip('check random1', async () => {
				const kamui = await loadFixture(setup)
				const signers = await getSigners()
				const userAddress = signers.user.address

				for (let i = 0; i < 10; i++) {
					await kamui.mint(userAddress, 1, { value: MINT_PRICE })
				}
				for (let i = 0; i < 10; i++) {
					const tmp = await kamui.tokenURI(i)
					console.log(tmp)
				}
			})
			it.skip('check random2', async () => {
				const kamui = await loadFixture(setup)
				const signers = await getSigners()
				const userAddress = signers.user.address

				for (let i = 0; i < 3; i++) {
					await kamui.mint(userAddress, 5, { value: MINT_PRICE * 5 })
				}
				for (let i = 0; i < 15; i++) {
					const tmp = await kamui.tokenURI(i)
					console.log(tmp)
				}
			})
		})
		describe('fail', () => {
			it('amount is 0', async () => {
				const kamui = await loadFixture(setup)
				const signers = await getSigners()
				const userAddress = signers.user.address
				await expect(
					kamui.mint(userAddress, 0, { value: MINT_PRICE })
				).to.be.revertedWithCustomError(kamui, 'AmountMustBeGreaterThanZero')
			})
			it('no ether', async () => {
				const kamui = await loadFixture(setup)
				const signers = await getSigners()
				const userAddress = signers.user.address
				await expect(kamui.mint(userAddress, 1)).to.be.revertedWithCustomError(
					kamui,
					'InsufficientPayment'
				)
			})
			it('1 ether', async () => {
				const kamui = await loadFixture(setup)
				const signers = await getSigners()
				const userAddress = signers.user.address
				await expect(
					kamui.mint(userAddress, 1, { value: `1000000000000000000` })
				).to.be.revertedWithCustomError(kamui, 'InsufficientPayment')
			})
			it('only mintRole', async () => {
				const kamui = await loadFixture(setup)
				const signers = await getSigners()
				const userAddress = signers.user.address
				const mintRole = await kamui.MINTER_ROLE()
				const errorMessage = `AccessControl: account ${userAddress.toLowerCase()} is missing role ${mintRole}`
				await expect(
					kamui
						.connect(signers.user)
						.mint(userAddress, 1, { value: MINT_PRICE })
				).to.be.revertedWith(errorMessage)
			})
			it('can not mint to contract address', async () => {
				const kamui = await loadFixture(setup)
				const supportsTest = await ethers.deployContract('SupportsInterfaceTest')
				await expect(
					kamui
						.mint(await supportsTest.getAddress(), 1, { value: MINT_PRICE })
				).to.be.revertedWith("ERC721: transfer to non ERC721Receiver implementer")
			})
			it('mint 1001', async () => {
				const kamui = await loadFixture(setup)
				const signers = await getSigners()
				const userAddress = signers.user.address
				const balanceBefore = await kamui.balanceOf(userAddress)
				const totalSupplyBefore = await kamui.totalSupply()
				expect(totalSupplyBefore).to.equal(0)
				await kamui.mint(userAddress, 500, { value: "500000000000000000" })
				await kamui.mint(userAddress, 500, { value: "500000000000000000" })
				const balanceAfter = await kamui.balanceOf(userAddress)
				expect(balanceAfter - balanceBefore).to.equal(1000)
				const totalSupplyAfter = await kamui.totalSupply()
				expect(totalSupplyAfter - totalSupplyBefore).to.equal(1000)
				await expect(
					kamui
						.mint(userAddress, 1, { value: MINT_PRICE })
				).to.be.revertedWithCustomError(kamui, 'NotMintable')
			})
		})
	})
	describe('setMintPrice', () => {
		describe('success', () => {
			it('set mint price', async () => {
				const kamui = await loadFixture(setup)
				await kamui.setMintPrice(2000000000000000)
				const mintPrice = await kamui.mintPrice()
				expect(mintPrice).to.equal(2000000000000000)
			})
		})
		describe('fail', () => {
			it('only owner', async () => {
				const kamui = await loadFixture(setup)
				const signers = await getSigners()
				const userAddress = signers.user.address
				const adminRole = await kamui.DEFAULT_ADMIN_ROLE()
				const errorMessage = `AccessControl: account ${userAddress.toLowerCase()} is missing role ${adminRole}`

				await expect(
					kamui.connect(signers.user).setMintPrice(2000000000000000)
				).to.be.revertedWith(errorMessage)
			})
		})
	})
	describe('withdraw', () => {
		describe('success', () => {
			it('withdraw ether', async () => {
				const kamui = await loadFixture(setup)
				const signers = await getSigners()
				const userAddress = signers.user.address
				const withdrawAddress = ethers.Wallet.createRandom().address
				await kamui.mint(userAddress, 1, { value: MINT_PRICE })
				const balanceBefore = await ethers.provider.getBalance(withdrawAddress)
				await kamui.withdraw(withdrawAddress)
				const balanceAfter = await ethers.provider.getBalance(withdrawAddress)
				expect(balanceAfter - balanceBefore).to.equal(MINT_PRICE)
			})
		})
		describe('fail', () => {
			it('only owner', async () => {
				const kamui = await loadFixture(setup)
				const signers = await getSigners()
				const userAddress = signers.user.address
				const adminRole = await kamui.DEFAULT_ADMIN_ROLE()
				const errorMessage = `AccessControl: account ${userAddress.toLowerCase()} is missing role ${adminRole}`
				await expect(
					kamui.connect(signers.user).withdraw(userAddress)
				).to.be.revertedWith(errorMessage)
			})
		})
	})
	describe('setBaseURI', () => {
		describe('success', () => {
			it('set baseURI', async () => {
				const kamui = await loadFixture(setup)
				await kamui.setBaseURI('https://example.com/')
				const baseURI = await kamui.baseURI()
				expect(baseURI).to.equal('https://example.com/')
			})
		})
		describe('fail', () => {
			it('only owner', async () => {
				const kamui = await loadFixture(setup)
				const signers = await getSigners()
				const userAddress = signers.user.address
				const adminRole = await kamui.DEFAULT_ADMIN_ROLE()
				const errorMessage = `AccessControl: account ${userAddress.toLowerCase()} is missing role ${adminRole}`
				await expect(
					kamui.connect(signers.user).setBaseURI('https://example.com/')
				).to.be.revertedWith(errorMessage)
			})
		})
	})
	describe('upgrade', () => {
		it('contract is upgradable', async () => {
			const kamui = await loadFixture(setup)
			const signers = await getSigners()
			const role = await kamui.DEFAULT_ADMIN_ROLE()
			const result = await kamui.hasRole(role, signers.deployer.address)
			expect(result).to.equal(true)

			const factory = await ethers.getContractFactory(
				'KamuiVerseNFT2',
				signers.deployer
			)
			const next = await upgrades.upgradeProxy(
				await kamui.getAddress(),
				factory
			)
			const result2 = await next.hasRole(role, signers.deployer.address)
			expect(result).to.equal(result2)
			const val: number = (await next.getVal()) as number
			expect(val).to.equal(7)
		})
		it('Cannot upgrade except for a deployer.', async () => {
			const kumai = await loadFixture(setup)
			const signers = await getSigners()
			const factory = await ethers.getContractFactory(
				'KamuiVerseNFT2',
				signers.user
			)
			const role = await kumai.DEFAULT_ADMIN_ROLE()
			const errorMessage = `AccessControl: account ${signers.user.address.toLowerCase()} is missing role ${role}`
			await expect(
				upgrades.upgradeProxy(await kumai.getAddress(), factory)
			).to.be.revertedWith(errorMessage)
		})
	})
})
