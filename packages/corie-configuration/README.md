# corie-configuration

[![npm package](https://nodei.co/npm/corie-configuration.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/corie-configuration)

> Note: united manages your configurations

```bash
npm install --save corie-configuration
```

```javascript
const Configuration = require('corie-configuration');

const config = new Configuration({
  conf: './conf'
});

const obj = config.get(文件名);

```

[Examples](https://github.com/fengxinming/corie/tree/master/examples/corie-configuration)
