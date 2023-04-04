import { EncryptionTransformer } from 'typeorm-encrypted';
import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot({ envFilePath: process.env.NODE_ENV === 'test' ? ['.env.test'] : ['.env'] });

const PasswordTransformer = new EncryptionTransformer({
  key: process.env.TYPEORM_TRANSFORMER_KEY,
  algorithm: 'aes-256-cbc',
  ivLength: 16,
  iv: process.env.TYPEORM_TRANSFORMER_IV
});
export default PasswordTransformer;
