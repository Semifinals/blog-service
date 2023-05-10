import { Context } from "@azure/functions"
import { randomId, randomSlug } from "../lib/random"
import CreateBlog from "../CreateBlog"
import GetBlog from "."

describe("GetBlog", () => {
  let context: Context = {
    bindings: {},
    req: {
      url: "http://localhost:7071/"
    }
  } as unknown as Context

  it("should get an existing blog", async () => {
    // Arrange
    const createReq = {
      body: {
        id: randomId(),
        slug: randomSlug(),
        category: "test"
      }
    }

    await CreateBlog(context, createReq)

    context.bindings.slug = createReq.body.slug
    const req = {}

    // Act
    await GetBlog(context, req)

    // Assert
    expect(context.res?.status).toBe(200)
    expect(context.res?.body?.id).toBe(createReq.body.id)
    expect(context.res?.body.slug).toBe(createReq.body.slug)
  })

  it("should not get non-existent blog", async () => {
    // Arrange
    context.bindings.slug = randomSlug()
    const req = {}

    // Act
    await GetBlog(context, req)

    // Assert
    expect(context.res?.status).toBe(404)
  })
})
