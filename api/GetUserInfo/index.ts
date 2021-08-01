import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { CosmosClient, Database, Container } from '@azure/cosmos';

interface IUser {
  username: string;
  groupID: string;
  numberOfPets: number,
  id: string
}

const endpoint = process.env.DB_ENDPOINT;
const key = process.env.DB_KEY;
const databaseName = process.env.DB_ID;
const collection = process.env.COLLECTION;

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('Get User Info is running.');

    const client = new CosmosClient({ endpoint, key });

    const database = client.database(databaseName);
    const container = database.container(collection);

    const query = `SELECT * FROM c WHERE c.groupID = "123456"`;
    const groupRes = await container.items.query(query).fetchAll();

    let itemRes = await container.item('121212', '123456').read<IUser>();

    context.log(`He'res Item Res:`, itemRes);


    if (groupRes.resources.length === 0) {
      context.res = {
        status: 404,
        body: {
          code: 404,
          message: 'no items found.'
        }
      }
      context.done();
      return;
    }

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: {
          items: groupRes.resources,
          item: itemRes.resource
        }
    };

};

export default httpTrigger;
