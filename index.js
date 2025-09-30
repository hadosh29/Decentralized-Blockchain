const crypto = require('crypto');
class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }
  calculateHash() {
    return crypto.createHash('sha256')
      .update(this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash + this.nonce)
      .digest('hex');
  }
  mineBlock(difficulty) {
    const target = '0'.repeat(difficulty);
    while (!this.hash.startsWith(target)) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
  }
}
class Node {
  constructor(name, difficulty = 3) {
    this.name = name;
    this.chain = [this.createGenesisBlock()];
    this.difficulty = difficulty;
  }
  createGenesisBlock() {
    return new Block(0, new Date().toISOString(), 'Genesis Block', '0');
  }
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  setBlock(data) {
    const index = this.chain.length;
    const previousHash = this.getLatestBlock().hash;
    const block = new Block(index, new Date().toISOString(), data, previousHash);
    block.mineBlock(this.difficulty);
    this.chain.push(block);
    console.log(`Node ${this.name}: Block mined -> ${block.hash}`);
    return block;
  }
  getBlock(index) {
    return this.chain[index] || null;
  }
  blocksExplorer() {
    return this.chain.map(b => ({
      index: b.index,
      timestamp: b.timestamp,
      data: b.data,
      previousHash: b.previousHash,
      hash: b.hash,
      nonce: b.nonce
    }));
  }

  mineBlock(index) {
    const block = this.getBlock(index);
    if (!block) return null;
    block.nonce = 0;
    block.hash = block.calculateHash();
    block.mineBlock(this.difficulty);
    console.log(`Node ${this.name}: Block ${index} re-mined -> ${block.hash}`);
    return block;
  }
  syncChain(otherNode) {
    if (otherNode.chain.length > this.chain.length) {
      this.chain = JSON.parse(JSON.stringify(otherNode.chain));
      console.log(`Node ${this.name} synchronized with Node ${otherNode.name}`);
    }
  }
}
const node1 = new Node('Node1');
const node2 = new Node('Node2');
const node3 = new Node('Node3');

const nodes = [node1, node2, node3];

node1.setBlock({ amount: 100 });
nodes.forEach(node => {
  if (node !== node1) node.syncChain(node1);
});

node2.setBlock({ amount: 50 });
nodes.forEach(node => {
  if (node !== node2) node.syncChain(node2);
});

console.log('Node3 Blockchain:', node3.blocksExplorer());
