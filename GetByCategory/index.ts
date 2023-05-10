import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { useCosmos } from "../lib/useCosmos"
import { SqlQuerySpec } from "@azure/cosmos"

const GetByCategory: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  // Validate request params
  const errors: string[] = []

  if (!req.params?.category) errors.push("Missing 'category' in request params")
  else if (!/^[A-Za-z0-9-_]+$/.test(req.params?.category))
    errors.push(
      "The 'category' contains invalid characters, it can only contain alpha-numeric, dashes, and underscores"
    )
  else if (String(req.params?.category).length >= 32)
    errors.push(
      "The 'category' is too long, it must be less than 32 characters long"
    )

  if (req.params?.offset) {
    if (!/^[\d]+$/.test(req.params?.offset))
      errors.push("The 'offset' must be an integer")
  }

  if (req.params?.limit) {
    if (!/^[\d]+$/.test(req.params?.limit))
      errors.push("The 'limit' must be an integer")
    else if (Number(req.params?.limit) > 25)
      errors.push("The 'limit' cannot be greater than 25")
  }

  if (errors.length > 0) {
    context.res = {
      status: 400,
      body: errors
    }
    return
  }

  const category = req.params.category
  const offset = Number(req.params.offset ?? 0)
  const limit = Number(req.params.limit ?? 25)

  // Connect to the database
  const { container } = await useCosmos("blogs-db", "blogs", "/id")

  if (container === null) {
    context.res = {
      status: 500
    }
    return
  }

  // Fetch the blogs from the database by category
  const querySpec: SqlQuerySpec = {
    query: `
      SELECT * FROM blogs b
      WHERE b.category = @category
      ORDER BY b._ts DESC
      OFFSET @offset
      LIMIT @limit
    `,
    parameters: [
      { name: "@category", value: category },
      { name: "@offset", value: offset },
      { name: "@limit", value: limit }
    ]
  }

  const { resources: items } = await container.items.query(querySpec).fetchAll()

  // Respond to the function call
  context.res = {
    status: 200,
    body: items
  }
}

export default GetByCategory
