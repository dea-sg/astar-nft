// SPDX-License-Identifier: MPL-2.0
pragma solidity =0.8.19;

import {StringsUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {ERC721URIStorageUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import {IKamuiVerseNFT} from "./IKamuiVerseNFT.sol";
import {IAstarCampaignNFT} from "./IAstarCampaignNFT.sol";

contract KamuiVerseNFT is
	AccessControlUpgradeable,
	UUPSUpgradeable,
	ERC721URIStorageUpgradeable,
	IKamuiVerseNFT,
	IAstarCampaignNFT
{
	using StringsUpgradeable for uint256;
	uint256 public mintPrice;
	uint256 public tokenId;
	string public baseURI;

	bytes32 public constant MINT_ROLE = keccak256("MINT_ROLE");

	function initialize() public initializer {
		__UUPSUpgradeable_init();
		__ERC721_init("Kamui", "KAMUI");
		_grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
		_grantRole(MINT_ROLE, _msgSender());
		mintPrice = 0.001 ether;
	}

	function supportsInterface(
		bytes4 interfaceId
	)
		public
		view
		override(ERC721URIStorageUpgradeable, AccessControlUpgradeable)
		returns (bool)
	{
		return
			interfaceId == type(IKamuiVerseNFT).interfaceId ||
			interfaceId == type(IAstarCampaignNFT).interfaceId ||
			super.supportsInterface(interfaceId);
	}

	function mint(
		address _to,
		uint256 amount
	) external payable onlyRole(MINT_ROLE) {
		if (amount == 0) {
			revert AmountMustBeGreaterThanZero();
		}
		if (msg.value != mintPrice * amount) {
			revert InsufficientPayment();
		}
		for (uint256 i = 0; i < amount; i++) {
			uint256 assetId = getAssetId(i);
			_mint(_to, tokenId);
			_setTokenURI(
				tokenId,
				string(abi.encodePacked(assetId.toString(), ".json"))
			);
			tokenId++;
		}
	}

	function getAssetId(uint256 _index) private view returns (uint256) {
		uint256 random = uint256(
			keccak256(
				abi.encodePacked(
					block.number,
					blockhash(block.number - 1),
					block.timestamp,
					tokenId,
					_index
				)
			)
		);
		return random % 10;
	}

	function withdraw(address _target) external onlyRole(DEFAULT_ADMIN_ROLE) {
		payable(_target).transfer(address(this).balance);
	}

	function setBaseURI(
		string memory __baseURI
	) external onlyRole(DEFAULT_ADMIN_ROLE) {
		baseURI = __baseURI;
	}
	function setMintPrice(uint256 price) external onlyRole(DEFAULT_ADMIN_ROLE) {
		mintPrice = price;
	}
	function _baseURI() internal view override returns (string memory) {
		return baseURI;
	}
	function _authorizeUpgrade(
		address
	) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}
}
