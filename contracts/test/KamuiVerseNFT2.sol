// SPDX-License-Identifier: MPL-2.0
pragma solidity =0.8.19;

import {KamuiVerseNFT} from "../KamuiVerseNFT.sol";

contract KamuiVerseNFT2 is KamuiVerseNFT {
	function getVal() external pure returns (uint256) {
		return 7;
	}
}
