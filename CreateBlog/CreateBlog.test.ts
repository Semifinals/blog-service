import { Context } from "@azure/functions"
import { randomId, randomSlug } from "../lib/random"
import CreateBlog from "."

describe("CreateBlog", () => {
  let context: Context = {
    bindings: {},
    req: {
      url: "http://localhost:7071/"
    }
  } as unknown as Context

  it("should create a new blog", async () => {
    // Arrange
    const req = {
      body: {
        id: randomId(),
        slug: randomSlug()
      }
    }

    // Act
    await CreateBlog(context, req)

    // Assert
    expect(context.res?.status).toBe(201)
    expect(context.res?.headers?.Location).toBe(
      context.req!.url + req.body.slug
    )
    expect(context.res?.body?.id).toBe(req.body.id)
    expect(context.res?.body.slug).toBe(req.body.slug)
  })

  it("should not create a blog with existing discussion id", async () => {
    // Arrange
    const req = {
      body: {
        id: randomId(),
        slug: randomSlug()
      }
    }

    await CreateBlog(context, req)

    req.body.slug = randomSlug()

    // Act
    await CreateBlog(context, req)

    // Assert
    expect(context.res?.status).toBe(409)
  })

  it("should not create a blog with existing slug", async () => {
    // Arrange
    const req = {
      body: {
        id: randomId(),
        slug: randomSlug()
      }
    }

    await CreateBlog(context, req)

    req.body.id = randomId()

    // Act
    await CreateBlog(context, req)

    // Assert
    expect(context.res?.status).toBe(409)
  })

  it("should not create a blog with existing id and slug", async () => {
    // Arrange
    const req = {
      body: {
        id: randomId(),
        slug: randomSlug()
      }
    }

    await CreateBlog(context, req)

    // Act
    await CreateBlog(context, req)

    // Assert
    expect(context.res?.status).toBe(409)
  })
})
