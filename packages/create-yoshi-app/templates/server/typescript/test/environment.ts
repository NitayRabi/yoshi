// https://github.com/wix-platform/wix-node-platform/tree/master/bootstrap/wix-bootstrap-testkit
import testkit from '@wix/wix-bootstrap-testkit';
import { builder as testEnvBuilder } from '@wix/wix-test-env';

export const env = testEnvBuilder()
  .withMainApp(bootstrapServer())
  .withMainAppConfigEmitter((builder) =>
    builder.val('base_domain', 'test.wix.com'),
  )
  .build();

function bootstrapServer() {
  return testkit.server('./dist/index', {
    env: {
      NEW_RELIC_LOG_LEVEL: 'warn',
      DEBUG: '',
    },
  });
}
