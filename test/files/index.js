import nonAliased from './nonAliased';
import fancyNumber from 'fancyNumber';
import anotherFancyNumber from './anotherFancyNumber';
import anotherNumber from './numberFolder/anotherNumber';
import moreNumbers from 'numberFolder/anotherNumber';
import nodeModule from 'someModule';

let count = 0;
count += fancyNumber + anotherFancyNumber + nonAliased + anotherNumber + moreNumbers;
count += nodeModule;

export default count;
