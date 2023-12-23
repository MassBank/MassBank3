// this code was adopted from NMRium project (https://github.com/cheminfo/nmrium) on 31th October 2021

const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const LENGTH = 8;

export default function generateID(): string {
  let id = '';
  for (let i = 0; i < LENGTH; i++) {
    id += BASE62.charAt(Math.floor(Math.random() * 62));
  }
  return id;
}
