import { Container, CosmosClient, Database } from "@azure/cosmos"

export async function useCosmos(
  databaseId: string,
  containerId: string,
  partitionKeyPath: string
): Promise<{
  database: Database | null
  container: Container | null
}> {
  if (!process.env.DbConnectionString)
    return { database: null, container: null }

  const client = new CosmosClient(process.env.DbConnectionString)
  const { database } = await client.databases.createIfNotExists({
    id: databaseId
  })
  const { container } = await database.containers.createIfNotExists({
    id: containerId,
    partitionKey: partitionKeyPath
  })

  return { database, container }
}
