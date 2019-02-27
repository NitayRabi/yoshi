## App flow

App flow is a dedicated developer experience for apps. The purpose of this document is to explain how to opt-into this new feature.

See https://github.com/wix/yoshi/pull/586 for more information on the changes it introduces.

### Migration

Since we're no longer transpiling files separately with Babel or TypeScript, direct your `index.js` to the bundle of the server:

```diff
const bootstrap = require('@wix/wix-bootstrap-ng');

const app = bootstrap()
  .use(require('@wix/wix-bootstrap-greynode'))
  .use(require('@wix/wix-bootstrap-hadron'))
  .use(require('@wix/wix-bootstrap-renderer'));

-if (process.env.NODE_ENV === 'test') {
-  app.express('./src/server');
-} else {
-  app.express('./dist/src/server');
-}
+app.express('./dist/server');

app.start({
  disableCluster: process.env.NODE_ENV !== 'production',
});
```

Then, change your `server.js` file to use ES modules all the way:

```diff
import wixExpressCsrf from '@wix/wix-express-csrf';
import wixExpressRequireHttps from '@wix/wix-express-require-https';

-module.exports = (app, context) => {
+export default (app, context) => {
  const config = context.config.load('{%projectName%}');

  app.use(wixExpressCsrf());
  app.use(wixExpressRequireHttps);
  app.use(context.renderer.middleware());

  app.get('/', (req, res) => {
    const renderModel = getRenderModel(req);

    res.renderView('./index.ejs', renderModel);
  });

  function getRenderModel(req) {
    const { language, basename, debug } = req.aspects['web-context'];

    return {
      language,
      basename,
      debug: debug || process.env.NODE_ENV === 'development',
      title: 'Wix Full Stack Project Boilerplate',
      staticsDomain: config.clientTopology.staticsDomain,
    };
  }

  return app;
};
```

Finally, opt-into app flow by changing your `package.json` to include:

```diff
{
  "yoshi": {
+    "projectType": "app"
  }
}
```

If you're interested, opt-into hot module replacement for your server by installing:

```sh
npm i --save bootstrap-hot-loader
```

Then edit `server.js` with:

```diff
import wixExpressCsrf from '@wix/wix-express-csrf';
import wixExpressRequireHttps from '@wix/wix-express-require-https';

-export default (app, context) => {
+export default hot(module, (app, context) => {
  const config = context.config.load('{%projectName%}');

  app.use(wixExpressCsrf());
  app.use(wixExpressRequireHttps);
  app.use(context.renderer.middleware());

  app.get('/', (req, res) => {
    const renderModel = getRenderModel(req);

    res.renderView('./index.ejs', renderModel);
  });

  function getRenderModel(req) {
    const { language, basename, debug } = req.aspects['web-context'];

    return {
      language,
      basename,
      debug: debug || process.env.NODE_ENV === 'development',
      title: 'Wix Full Stack Project Boilerplate',
      staticsDomain: config.clientTopology.staticsDomain,
    };
  }

  return app;
-};
+});
```
