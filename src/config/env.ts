import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);
const pathsDotenv = resolveApp('.env');

// load. env files in descending order of priority
dotenv.config({ path: `${pathsDotenv}.local` });
dotenv.config({ path: `${pathsDotenv}.development` });
dotenv.config({ path: `${pathsDotenv}` });
