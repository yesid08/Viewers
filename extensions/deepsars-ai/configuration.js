import * as utils from './utils';

const getOhifConf = async () => {
  var result = await utils.makeTransaction('systemConfig', 'read', {
    type: 'ohifConfig',
  });
  const ohifConf = result.data.value;
  return ohifConf;
};
const ohifConf = getOhifConf();
export { ohifConf };
