import { registerAs } from '@nestjs/config';

import { createTypeOrmOptions } from '@config/database';

export default registerAs('typeorm', () => createTypeOrmOptions());
