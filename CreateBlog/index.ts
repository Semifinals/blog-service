import { SqlQuerySpec } from "@azure/cosmos"
import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { useCosmos } from "../lib/useCosmos"
import { Blog } from "../lib/blog"

const CreateBlog: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  // Validate request body
  const errors: string[] = []

  if (!req.body?.id) errors.push("Missing 'id' in request body")
  else if (!/^\d+$/.test(req.body!.id)) errors.push("The 'id' must be a number")

  if (!req.body?.slug) errors.push("Missing 'slug' in request body")
  else if (!/^[A-Za-z0-9-_]+$/.test(req.body!.slug))
    errors.push(
      "The 'slug' contains invalid characters, it can only contain alpha-numeric, dashes, and underscores"
    )
  else if (String(req.body!.slug).length >= 64)
    errors.push(
      "The 'slug' is too long, it must be less than 64 characters long"
    )

  if (!req.body?.category) errors.push("Missing 'category' in request body")
  else if (!/^[A-Za-z0-9-_]+$/.test(req.body!.category))
    errors.push(
      "The 'category' contains invalid characters, it can only contain alpha-numeric, dashes, and underscores"
    )
  else if (String(req.body!.category).length >= 32)
    errors.push(
      "The 'category' is too long, it must be less than 32 characters long"
    )

  if (errors.length > 0) {
    context.res = {
      status: 400,
      body: errors
    }
    return
  }

  // Connect to the database
  const { container } = await useCosmos("blogs-db", "blogs", "/id")

  if (container === null) {
    context.res = {
      status: 500
    }
    return
  }

  // Check if the id or slug are already in use
  const id = String(req.body.id)
  const slug = String(req.body.slug)
  const category = String(req.body.category)

  const querySpec: SqlQuerySpec = {
    query: "SELECT * FROM blogs b WHERE b.slug = @slug OR b.id = @id",
    parameters: [
      { name: "@slug", value: slug },
      { name: "@id", value: id }
    ]
  }

  const { resources: items } = await container.items
    .query<Blog>(querySpec)
    .fetchAll()

  if (items.some(item => item.id === id))
    errors.push(`An item already exists with the 'id' of '${id}'`)

  if (items.some(item => item.slug === slug))
    errors.push(`An item already exists with the 'slug' of '${slug}'`)

  if (errors.length > 0) {
    context.res = {
      status: 409,
      body: errors
    }
    return
  }

  // Create the new blog
  const { resource: item } = await container.items.create<Blog>({
    id,
    slug,
    category
  })

  // Respond to the function call
  context.res = {
    status: 201,
    body: item,
    headers: {
      Location: context.req?.url + slug
    }
  }
}

export default CreateBlog
