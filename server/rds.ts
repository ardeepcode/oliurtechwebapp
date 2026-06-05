import { Signer } from '@aws-sdk/rds-signer';
import { awsCredentialsProvider } from '@vercel/oidc-aws-credentials-provider';
import { attachDatabasePool } from '@vercel/functions';
import { Pool } from 'pg';

const host = process.env.PGHOST;
const port = process.env.PGPORT ? Number(process.env.PGPORT) : undefined;
const user = process.env.PGUSER;
const database = process.env.PGDATABASE || 'postgres';
const region = process.env.AWS_REGION;
const roleArn = process.env.AWS_ROLE_ARN;

const rdsEnabled = Boolean(host && port && user && region && roleArn);

const signer = rdsEnabled
  ? new Signer({
      hostname: host!,
      port: port!,
      username: user!,
      region: region!,
      credentials: awsCredentialsProvider({
        roleArn: roleArn!,
        clientConfig: { region: region! },
      }),
    })
  : null;

export const pool = new Pool({
  host,
  port,
  user,
  database,
  password: async () => {
    if (!signer) return '';
    return await signer.getAuthToken();
  },
  ssl: { rejectUnauthorized: false },
});

attachDatabasePool(pool);

export function isRdsEnabled() {
  return rdsEnabled;
}

export function getPool() {
  if (!rdsEnabled) {
    throw new Error('AWS RDS is not configured. Provide PGHOST, PGPORT, PGUSER, AWS_REGION, and AWS_ROLE_ARN.');
  }
  return pool;
}

export async function queryRds(query: string, params: any[] = []) {
  const poolRef = getPool();
  return poolRef.query(query, params);
}
