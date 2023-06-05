import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { useCosmos } from "../lib/useCosmos"
import { Blog } from "../lib/blog"

const DeleteBlog: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const id = String(req.params.id)

  // Connect to the database
  const { container } = await useCosmos("blogs-db", "blogs", "/id")

  if (container === null) {
    context.res = {
      status: 500
    }
    return
  }

  // Check if the blog exists
  const { resource: item } = await container.item(id, id).read<Blog>()

  if (!item) {
    context.res = {
      status: 404
    }
    return
  }

  // Delete the blog
  await container.item(id, id).delete()

  // Respond to the function call
  context.res = {
    status: 204
  }
}

export default DeleteBlog
