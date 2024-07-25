import 'dotenv/config';
import { logger } from './utils/index.js';

import referenceDownloader from './junk.drawer/reference.downloader.js';

const { CERNER_CLIENT_ID, CERNER_SECRET } = process.env;

logger.info({ test: 'test', CERNER_CLIENT_ID, CERNER_SECRET });

referenceDownloader();
