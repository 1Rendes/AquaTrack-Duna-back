import { TEMP_UPLOAD_DIR } from './constants/index.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';
import { createDirIfNotExists } from './utils/createDirIfNotExist.js';

const bootstrap = async () => {
  try {
    await initMongoConnection();
    await createDirIfNotExists(TEMP_UPLOAD_DIR);
    setupServer();
  } catch (error) {
    console.error(`Exception in bootstrap ${error}`);
  }
};

bootstrap();
