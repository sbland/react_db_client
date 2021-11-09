import { switchF, switchFLam } from './switchf';
import { ifF, tryF } from './tryf';

describe('functional functions', () => {
  describe('SwitchF', () => {
    it('Calls the right function', () => {
      const m = jest.fn();
      switchF('a', {
        a: m,
        b: () => 'b',
      });
      expect(m).toBeCalled();
    });

    it('Returns the right case', () => {
      const out = switchF('a', {
        a: () => 'a',
        b: () => 'b',
      });
      expect(out).toEqual('a');
    });

    it('Uses default', () => {
      const m = jest.fn();
      switchF(
        'z',
        {
          a: () => 'a',
          b: () => 'b',
        },
        m
      );
      expect(m).toBeCalled();
    });
    it('Allows passing through cases', () => {
      const m = jest.fn();
      switchF('a', {
        a: 'b',
        b: m,
      });
      expect(m).toBeCalled();
    });
  });
  describe('SwitchFLam', () => {
    const switcher = (c) =>
      switchFLam(
        c,
        [
          ['foo', () => 'Foo'],
          ['bar', 'foo'],
          [(v) => v > 3, () => 99],
        ],
        () => 'DEFAULT'
      );

    expect(switcher('foo')).toEqual('Foo');
    expect(switcher('bar')).toEqual('Foo');
    expect(switcher(4)).toEqual(99);
    expect(switcher(2)).toEqual('DEFAULT');
    expect(switcher('zzz')).toEqual('DEFAULT');
  });

  describe('ifF', () => {
    it('Simple example', () => {
      const isThereMilkInTheFridge = 'False' === 'True';
      const drinkMilk = jest.fn();
      const drinkWater = jest.fn();
      ifF(isThereMilkInTheFridge, drinkMilk, drinkWater);
      expect(drinkMilk).not.toBeCalled();
      expect(drinkWater).toBeCalled();
    });

    it('Nested Example', () => {
      const isThereMilkInTheFridge = 'False' === 'True';
      const drinkMilk = jest.fn();
      const theShopIsOpen = 'true' !== 'false';
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
      const isThereMilkInTheFridge = 'False' === 'True';
      const drinkMilk = jest.fn();
      const drinkWater = jest.fn().mockImplementation(() => 'water');
      const beverage = ifF(isThereMilkInTheFridge, drinkMilk, drinkWater);
      expect(drinkMilk).not.toBeCalled();
      expect(drinkWater).toBeCalled();
      expect(beverage).toEqual('water');
    });
  });
});
