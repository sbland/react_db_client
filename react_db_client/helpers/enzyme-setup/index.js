import { configure } from 'enzyme';
import { toMatchDiffSnapshot } from 'snapshot-diff';
import Adapter from 'enzyme-adapter-react-16';


expect.extend({ toMatchDiffSnapshot });
configure({ adapter: new Adapter() });