import {
    Context,
    createConnector,
    readConfig,
    Response,
    logger,
    StdAccountListOutput,
    StdTestConnectionOutput,
} from '@sailpoint/connector-sdk'
import {ElevateClient} from './elevate-client'
import {Util} from "./util"

// Connector must be exported as module property named connector
export const connector = async () => {

    // Get connector source config
    const config = await readConfig()

    // Use the vendor SDK, or implement own client as necessary, to initialize a client
    const elevateClient = new ElevateClient(config);

    const util = new Util();

    return createConnector()
        .stdTestConnection(async (context: Context, input: undefined, res: Response<StdTestConnectionOutput>) => {
            logger.info("Running test connection");
            res.send(await elevateClient.testConnection())
        })

        .stdAccountList(async (context: Context, input: undefined, res: Response<StdAccountListOutput>) => {
            console.log('retrieving accounts');
            const users = await elevateClient.getAllUsers();
            users.forEach((user) => {
                res.send(util.userToAccount(user))
            })
        })
}
