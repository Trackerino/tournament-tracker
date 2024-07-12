import { Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import dotenv from 'dotenv';

dotenv.config();

const envConfigScheme = Type.Object({
  EPIC_CLIENT_ID: Type.String({ minLength: 32, maxLength: 32 }),
  EPIC_CLIENT_SECRET: Type.String({ minLength: 32, maxLength: 32 }),

  EPIC_ACCOUNT_ID: Type.String({ minLength: 32, maxLength: 32 }),
  EPIC_DEVICE_ID: Type.String({ minLength: 32, maxLength: 32 }),
  EPIC_DEVICE_SECRET: Type.String({ minLength: 32, maxLength: 32 }),

  // WEBHOOK_URL: Type.String({ minLength: 1 }),
  GIT_DO_NOT_COMMIT: Type.Optional(Type.String({ default: 'false' })),
  GIT_DO_NOT_PUSH: Type.Optional(Type.String({ default: 'false' })),
});

const error = Value.Errors(envConfigScheme, process.env).First();

if (error) {
  throw new TypeError(`Invalid Environment Config: ${error.message} at ${error.path} (${error.type}), value is '${String(error.value)}'`);
}

export default Value.Decode(envConfigScheme, process.env);
