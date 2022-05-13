class BlockHeader {
    version: string;
    index: number;
    previousHash: string;
    timestamp: number;
    merkleRoot: string;
    difficulty: number;
    nonce: number;

    constructor(
        version: string,
        index: number,
        previousHash: string,
        timestamp: number,
        merkleRoot: string,
        difficulty: number,
        nonce: number
    ) {
        this.version = version;
        this.index = index;
        this.previousHash = previousHash;
        this.timestamp = timestamp; //블럭만들어진 시간
        this.merkleRoot = merkleRoot;
        //  this.bit = bit
        this.difficulty = difficulty; //채굴난이도. 아직안씀
        this.nonce = nonce; //넌스(문제풀기위해 대입한 횟수) 아직 안씀
    }
}

function A() {}
export { A };
