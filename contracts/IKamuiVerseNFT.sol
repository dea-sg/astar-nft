// SPDX-License-Identifier: MPL-2.0
pragma solidity =0.8.19;

interface IKamuiVerseNFT {
	error InsufficientPayment();

	error AmountMustBeGreaterThanZero();

	function setMintPrice(uint256 _price) external;
	function setBaseURI(string memory __baseURI) external;
	function withdraw(address _target) external;
}
