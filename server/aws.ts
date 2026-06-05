import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const region = process.env.AWS_REGION;
const tableName = process.env.AWS_TABLE_NAME;
const awsEnabled = Boolean(region && tableName && (process.env.AWS_ACCESS_KEY_ID || process.env.AWS_SECRET_ACCESS_KEY || process.env.AWS_PROFILE || process.env.AWS_SESSION_TOKEN));
let client: DynamoDBDocumentClient | null = null;

function createClient() {
  if (client) return client;
  if (!awsEnabled) return null;

  const dynamo = new DynamoDBClient({
    region,
    credentials:
      process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
        ? {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            sessionToken: process.env.AWS_SESSION_TOKEN,
          }
        : undefined,
  });

  client = DynamoDBDocumentClient.from(dynamo);
  return client;
}

function normalizeAwsItem(item: any) {
  const data = unmarshall(item) as Record<string, any>;
  delete data.pk;
  delete data.sk;
  return data;
}

export function isAwsEnabled() {
  return awsEnabled;
}

export function getAwsClient() {
  const awsClient = createClient();
  if (!awsClient) {
    throw new Error('AWS is not configured. Set AWS_REGION, AWS_TABLE_NAME, and AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY or AWS_PROFILE.');
  }
  return awsClient;
}

export async function loadCollection<T = any>(collection: string): Promise<T[]> {
  const awsClient = getAwsClient();
  const result = await awsClient.send(
    new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: '#pk = :pk',
      ExpressionAttributeNames: { '#pk': 'pk' },
      ExpressionAttributeValues: { ':pk': collection },
    })
  );

  return (result.Items || []).map(normalizeAwsItem) as T[];
}

export async function getItem(collection: string, id: string): Promise<any | null> {
  const awsClient = getAwsClient();
  const result = await awsClient.send(
    new GetCommand({
      TableName: tableName,
      Key: { pk: collection, sk: id },
    })
  );

  return result.Item ? normalizeAwsItem(result.Item) : null;
}

export async function queryCollection(collection: string, field: string, value: any): Promise<any[]> {
  const awsClient = getAwsClient();
  const result = await awsClient.send(
    new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: '#pk = :pk',
      FilterExpression: '#field = :value',
      ExpressionAttributeNames: { '#pk': 'pk', '#field': field },
      ExpressionAttributeValues: { ':pk': collection, ':value': value },
    })
  );

  return (result.Items || []).map(normalizeAwsItem);
}

export async function saveItem(collection: string, id: string, payload: any): Promise<any> {
  const awsClient = getAwsClient();
  const item = { pk: collection, sk: id, id, ...payload };
  await awsClient.send(new PutCommand({ TableName: tableName, Item: item }));
  return normalizeAwsItem(item);
}

export async function deleteItem(collection: string, id: string): Promise<boolean> {
  const awsClient = getAwsClient();
  await awsClient.send(new DeleteCommand({ TableName: tableName, Key: { pk: collection, sk: id } }));
  return true;
}
