import { plainToInstance } from 'class-transformer';
import { IsString, validateSync } from 'class-validator';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

config({
  path: '.env',
});

//kiểm tra đã tồn tại file .env hay chưa
if (!fs.existsSync(path.resolve('.env'))) {
  console.error('Vui lòng tạo file .env');
  process.exit(1);
}

class ConfigSchema {
  @IsString()
  DATABASE_URL: string;

  @IsString()
  ACCESS_TOKEN_SECRET: string;

  @IsString()
  ACCESS_TOKEN_EXPIRES_IN: string;

  @IsString()
  REFRESH_TOKEN_SECRET: string;

  @IsString()
  REFRESH_TOKEN_EXPIRES_IN: string;

  @IsString()
  SECRET_API_KEY: string;
}

const configSchema = plainToInstance(ConfigSchema, process.env, {
  enableImplicitConversion: true,
});
const errArr = validateSync(configSchema);

if (errArr.length > 0) {
  console.error('Các giá trị trong file .env không hợp lệ');
  const errors = errArr.map((errItem) => {
    return {
      property: errItem.property,
      constraints: errItem.constraints,
      value: errItem.value,
    };
  });

  console.error(errors);
  throw errors;
}

const envConfig = configSchema;

export default envConfig;
