a decentralized blockchain system with multiple nodes using JavaScript.
 Project Overview
- Each node maintains its own blockchain (array of blocks)
- Genesis Block is included in every node
- Nodes can synchronize their blockchains with other nodes
- Functions implemented per node:
  - `setBlock(data)`  Adds a new block
  - `getBlock(index)`  Retrieves a block by index
  - `blocksExplorer()` Displays all blocks in the blockchain
  - `mineBlock(index)`  Mines a specific block
  - `syncChain(otherNode)` Synchronizes blockchain with another node
