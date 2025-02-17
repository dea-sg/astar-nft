// SPDX-License-Identifier: MPL-2.0
pragma solidity =0.8.19;

import {StringsUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {ERC721URIStorageUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import {IKamuiVerseNFT} from "./IKamuiVerseNFT.sol";
import {IAstarCampaignNFT} from "./IAstarCampaignNFT.sol";

// マーケットプレイスで、NFTの情報を設定するために必要らしいので、
// OwnableとAccessControlの同時継承を行う。
// https://hackmd.io/@maario/BJLiFsd6a

contract KamuiVerseNFT is
	OwnableUpgradeable,
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
	uint256 public totalSupply;

	bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
	uint256 public constant MAX_MINT_COUNT = 1000;

	function initialize() public initializer {
		__Ownable_init();
		__UUPSUpgradeable_init();
		__ERC721_init("Kamui", "KAMUI");
		_grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
		_grantRole(MINTER_ROLE, _msgSender());
		mintPrice = 0.001 ether;
		totalSupply = 0;
	}

	function supportsInterface(
		bytes4 _interfaceId
	)
		public
		view
		override(ERC721URIStorageUpgradeable, AccessControlUpgradeable)
		returns (bool)
	{
		return
			_interfaceId == type(IKamuiVerseNFT).interfaceId ||
			_interfaceId == type(IAstarCampaignNFT).interfaceId ||
			super.supportsInterface(_interfaceId);
	}

	function mint(
		address _to,
		uint256 _amount
	) external payable onlyRole(MINTER_ROLE) {
		if (_amount == 0) {
			revert AmountMustBeGreaterThanZero();
		}
		if (msg.value != mintPrice * _amount) {
			revert InsufficientPayment();
		}
		if (totalSupply + _amount > MAX_MINT_COUNT) {
			revert NotMintable();
		}
		for (uint256 i = 0; i < _amount; i++) {
			uint256 assetId = getAssetId(i);
			_safeMint(_to, tokenId);
			_setTokenURI(
				tokenId,
				string(abi.encodePacked(assetId.toString(), ".json"))
			);
			tokenId++;
			totalSupply++;
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
	function setMintPrice(
		uint256 _price
	) external onlyRole(DEFAULT_ADMIN_ROLE) {
		mintPrice = _price;
	}
	function _baseURI() internal view override returns (string memory) {
		return baseURI;
	}
	function _authorizeUpgrade(
		address
	) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}
}
