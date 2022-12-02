import chai, { expect } from "chai";
import chaiBN from "chai-bn";
import BN from "bn.js";
chai.use(chaiBN(BN));

import { Cell } from "ton";
import { SmartContract } from "ton-contract-executor";
import * as main from "../contracts/main";
import { internalMessage, randomAddress } from "./helpers";

import { hex } from "../build/main.compiled.json";

describe("Counter tests", () => {
  let contract: SmartContract;

  beforeEach(async () => {
    contract = await SmartContract.fromCell(
      Cell.fromBoc(hex)[0] as any, // code cell from build output
      main.data({
        ownerAddress: randomAddress("owner"),
        counter1: 17,
        counter2: 17,
      }) as any,
    );
  });

  it("should get counters value and increment it", async () => {
    const call = await contract.invokeGetMethod("counters", []);

    expect(call.result[0]).to.be.bignumber.equal(new BN(17));

    const send = await contract.sendInternalMessage(
      internalMessage({
        from: randomAddress("notowner"),
        body: main.increment(),
      }) as any
    );
    expect(send.type).to.equal("success");

    const call2 = await contract.invokeGetMethod("counters", []);

    expect(call2.result[0]).to.be.bignumber.equal(new BN(18));
    expect(call2.result[1]).to.be.bignumber.equal(new BN(18));
  });
});
