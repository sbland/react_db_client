import { renderHook, act } from '@testing-library/react-hooks';
import { useAutoHidePanel } from '.';

const defaultProps = {
    menuRef: null,
    floating: true,
    showPanelOverride: false,
}
describe('Auto Hide Panel Hook', () => {
  test('should hide panel after timeout', () => {
    const { result } = renderHook(() =>
      useAutoHidePanel(defaultProps)
    );
    // expect(result.current[0]).toEqual(false);
    // TODO: Call document event mouseover
  });
});
