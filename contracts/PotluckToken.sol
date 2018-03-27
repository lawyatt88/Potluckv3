pragma solidity ^0.4.18;

import "../node_modules/zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";

contract PotluckToken is ERC721Token {
    function name() public pure returns (string) {
        return "Potluck Token";
    }

    function symbol() public pure returns (string) {
        return "PLT";
    }

    // Mapping from token ID to index of token
    mapping(uint256 => uint256) private tokensIndex;

    // Mapping from networkId to list of approved owners in network
    mapping (uint256 => address[]) private approvedOwners;

    // Mapping from network ID to index of the approved owners
    mapping(uint256 => uint256) private approvedOwnersIndex;

    //put metadata into a struct; and store structs in mapping by tokenId
    struct Metadata {
        string itemName;
        string description;
        string iconUrl;
        uint256 id;
    }

    // Array list of all tokens
    Metadata[] private tokens;

    function createToken(string itemName, string description, string iconUrl) internal {
        Metadata memory newToken;
        newToken.itemName = itemName;
        newToken.description = description;
        newToken.iconUrl = iconUrl;

        // Add to tokens array
        tokens.push(newToken);

        // Get index and store as tokenId
        uint tokenId = tokens.length.sub(1);
        
        _mint(msg.sender, tokenId);
    }

    function getMetadata(uint256 _tokenId) internal view returns (uint256 tokenId, string itemName, string description, string iconUrl) {
        tokenId = _tokenId;
        itemName = tokens[_tokenId].itemName;
        description = tokens[_tokenId].description;
        iconUrl = tokens[_tokenId].iconUrl;
    }

    // Mapping from tokenId to link containing metadata
    // mapping(uint256 => string) infoLinks;

    // function setMetadata(uint256 _tokenId, string infoLink) internal {
    //     require(msg.sender == ownerOf(_tokenId));
    //     infoLinks[_tokenId] = infoLink;
    // }

    // function metadata(uint256 _tokenId) internal view returns (string) {
    //     return infoLinks[_tokenId];
    // }

    function addToNetwork(uint256 _networkId) internal {
        approvedOwners[_networkId].push(msg.sender);
    }

    // Gets all token Metadata by owner
    // returns multidimensional array [[array of owners], [contains arrays of tokens by owner[tokens array by owners], [tokens array by owners], etc.]]
    function getAllTokens() internal view returns (address[], Metadata[][]) {
        uint len = tokens.length;
        address[] memory tokenOwnersArr = new address[](len);
        Metadata[][] memory tokensByOwnerArr = new Metadata[][](len);
        for (uint i = 0; i < tokens.length; i++) {
            address tokenOwner = ownerOf(i);
            tokenOwnersArr[i] = tokenOwner;
            tokensByOwnerArr[i] = getOwnersMetadata(tokenOwner);
        }
        return (tokenOwnersArr, tokensByOwnerArr);
    }

    // get metadata by owner by looping though tokens of Owner and creating array of metadata
    function getOwnersMetadata(address _owner) internal view returns (Metadata[]) {
        uint256[] memory tokensFromOwner = tokensOf(_owner);
        uint len = tokensFromOwner.length;
        Metadata[] memory ownersMetadata = new Metadata[](len);
        for (uint i = 0; i < tokensFromOwner.length; i++) {
            uint256 tokenId = tokensFromOwner[i];
            Metadata memory currentToken = tokens[tokenId];
            currentToken.id = tokenId;
            ownersMetadata[i] = (currentToken);
        }
        return ownersMetadata;
    }

    // function getNetworkOwners(uint256 _networkId) internal view returns (address[], uint256[]) {

    // }

    // function getAllNetworkTokens(uint256 _networkId) internal view returns (address[], uint256[]) {
    //     address[] tokensOwnerArr;
    //     for (uint i = 0; i < approvedOwners[_networkId].length; i++) {
    //         address owner = approvedOwners[_networkId][i];
    //         uint256[] tokenIdsByOwner = tokensOf(owner);
    //     }
    // }

}