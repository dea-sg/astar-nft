import '@nomicfoundation/hardhat-toolbox'
import '@openzeppelin/hardhat-upgrades'
import '@nomicfoundation/hardhat-chai-matchers'
import * as dotenv from 'dotenv'

dotenv.config()

const privateKey =
	typeof process.env.PRIVATE_KEY === 'undefined'
		? '0000000000000000000000000000000000000000000000000000000000000000'
		: process.env.PRIVATE_KEY

const config = {
	solidity: {
		version: '0.8.19',
		settings: {
			optimizer: {
				enabled: true,
				runs: 200,
			},
		},
	},
	networks: {
		zKatana: {
			url: 'https://rpc.startale.com/zkatana',
			accounts: [privateKey],
		},
		astarZkEVM: {
			url: 'https://rpc.startale.com/astar-zkevm',
			accounts: [privateKey],
		},
	},
}

export default config
