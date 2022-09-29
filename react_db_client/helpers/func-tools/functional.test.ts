import { switchF, switchFLam } from './switchf';
import { ifF } from './tryf';

describe('functional functions', () => {
  describe('SwitchF', () => {
    it('Returns the right case', () => {
      const switchMap: Record<'a' | 'b', () => string> = {
        a: () => 'a',
        b: () => 'b',
      };
      const out = switchF('a', switchMap);
      expect(out).toEqual('a');
    });

    it('Uses default', () => {
      const switchMap: Record<'a' | 'b', () => string> = {
        a: () => 'a',
        b: () => 'b',
      };
      const def = () => 'c';
      const out = switchF('a', switchMap, def);
      expect(out).toEqual('a');
    });
    it('Allows passing through cases', () => {
      const switchMap: Record<'a' | 'b', string | (() => string)> = {
        a: 'b',
        b: () => 'b',
      };
      const out = switchF('a', switchMap);
      expect(out).toEqual('b');
    });
  });
  describe('SwitchFLam', () => {
    type KeyType = string | number | symbol | Function;
    const switchMap: [KeyType, KeyType | (() => string | number)][] = [
      ['foo', () => 'Foo'],
      ['bar', 'foo'],
      [(v) => v > 3, () => 99],
    ];
    const switcher = (c) => switchFLam(c, switchMap, () => 'DEFAULT');

    expect(switcher('foo')).toEqual('Foo');
    expect(switcher('bar')).toEqual('Foo');
    expect(switcher(4)).toEqual(99);
    expect(switcher(2)).toEqual('DEFAULT');
    expect(switcher('zzz')).toEqual('DEFAULT');
  });

  describe('ifF', () => {
    it('Simple example', () => {
      const isThereMilkInTheFridge = false;
      const drinkMilk = jest.fn();
      const drinkWater = jest.fn();
      ifF(isThereMilkInTheFridge, drinkMilk, drinkWater);
      expect(drinkMilk).not.toBeCalled();
      expect(drinkWater).toBeCalled();
    });

    it('Nested Example', () => {
      const isThereMilkInTheFridge = false;
      const drinkMilk = jest.fn();
      const theShopIsOpen = false;
      const closeFridgeDoor = jest.fn();
      const goToShop = jest.fn();
      const drinkWater = jest.fn();

      ifF(isThereMilkInTheFridge, drinkMilk, () => {
        closeFridgeDoor();
        ifF(theShopIsOpen, goToShop, drinkWater);
      });

      expect(drinkMilk).not.toBeCalled();
      expect(closeFridgeDoor).toBeCalled();
      expect(goToShop).toBeCalled();
      expect(drinkWater).not.toBeCalled();
    });
    it('Returns value', () => {
      const isThereMilkInTheFridge = false;
      const drinkMilk = jest.fn();
      const drinkWater = jest.fn().mockImplementation(() => 'water');
      const beverage = ifF(isThereMilkInTheFridge, drinkMilk, drinkWater);
      expect(drinkMilk).not.toBeCalled();
      expect(drinkWater).toBeCalled();
      expect(beverage).toEqual('water');
    });
  });
});
