import { registerAs } from '@nestjs/config';
import * as Joi from "joi";

interface AWSConfig {
  awsAccesskeyID: string
  awsSecretAccessKey: string
  awsRegion: string
}

export default registerAs(
  'aws',
  (): AWSConfig => ({
    awsAccesskeyID: process.env.AWS_ACCESS_KEY_ID as string,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    awsRegion: process.env.AWS_REGION as string,
  }),
);

export const AWSConfigValidation = {
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  AWS_REGION: Joi.string().required(),
};
