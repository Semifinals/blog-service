import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { useCosmos } from "../lib/useCosmos"
import { Blog } from "../lib/blog"
import { SqlQuerySpec } from "@azure/cosmos"

const DeleteBlog: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const slug = String(context.bindings.slug)

  // Connect to the database
  const { container } = await useCosmos("blogs-db", "blogs", "/id")

  if (container === null) {
    context.res = {
      status: 500
    }
    return
  }

  // Fetch the blog from the database
  const querySpec: SqlQuerySpec = {
    query: "SELECT * FROM blogs b WHERE b.slug = @slug",
    parameters: [{ name: "@slug", value: slug }]
  }

  const { resources: items } = await container.items.query(querySpec).fetchAll()

  if (items.length === 0) {
    context.res = {
      status: 404
    }
    return
  }

  // Respond to the function call
  context.res = {
    body: items[0]
  }
}

export default DeleteBlog
