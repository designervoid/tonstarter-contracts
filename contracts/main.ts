import BN from "bn.js";
import { Cell, beginCell, Address } from "ton";

// encode contract storage according to save_data() contract method
export function data(params: { ownerAddress: Address; counter1: number; counter2: number; }): Cell {
  return beginCell().storeAddress(params.ownerAddress).storeUint(params.counter1, 64).storeUint(params.counter2, 64).endCell();
}

// message encoders for all ops (see contracts/imports/constants.fc for consts)

export function increment(): Cell {
  return beginCell().storeUint(0x37491f2f, 32).storeUint(0, 64).endCell();
}