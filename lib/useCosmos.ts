import { Container, CosmosClient, Database } from "@azure/cosmos"
import { Agent } from "https"

export async function useCosmos(
  databaseId: string,
  containerId: string,
  partitionKeyPath: string
): Promise<{
  database: Database | null
  container: Container | null
}> {
  if (!process.env.DbEndpoint || !process.env.DbKey)
    return { database: null, container: null }

  const client = new CosmosClient({
    endpoint: process.env.DbEndpoint,
    key: process.env.DbKey,
    agent:
      process.env.DEV === "true"
        ? new Agent({
            rejectUnauthorized: false
          })
        : undefined
  })
  const { database } = await client.databases.createIfNotExists({
    id: databaseId
  })
  const { container } = await database.containers.createIfNotExists({
    id: containerId,
    partitionKey: partitionKeyPath
  })

  return { database, container }
}
