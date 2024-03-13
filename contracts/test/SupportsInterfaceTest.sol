// SPDX-License-Identifier: MPL-2.0
pragma solidity =0.8.19;

import {IERC721Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import {IAccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import {IKamuiVerseNFT} from "../IKamuiVerseNFT.sol";
import {IAstarCampaignNFT} from "../IAstarCampaignNFT.sol";

contract SupportsInterfaceTest {
	function getIKamuiVerseNFTId() external pure returns (bytes4) {
		return type(IKamuiVerseNFT).interfaceId;
	}

	function getIAstarCampaignNFTId() external pure returns (bytes4) {
		return type(IAstarCampaignNFT).interfaceId;
	}

	function getIAccessControlUpgradeableId() external pure returns (bytes4) {
		return type(IAccessControlUpgradeable).interfaceId;
	}

	function getIERC721UpgradeableId() external pure returns (bytes4) {
		return type(IERC721Upgradeable).interfaceId;
	}
}
