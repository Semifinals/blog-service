import { Context } from "@azure/functions"
import { randomId, randomSlug } from "../lib/random"
import CreateBlog from "../CreateBlog"
import DeleteBlog from "."

describe("DeleteBlog", () => {
  let context: Context = {
    bindings: {},
    req: {
      url: "http://localhost:7071/"
    }
  } as unknown as Context

  it("should delete an existing blog", async () => {
    // Arrange
    const createReq = {
      body: {
        id: randomId(),
        slug: randomSlug()
      }
    }

    await CreateBlog(context, createReq)

    context.bindings.id = createReq.body.id
    const req = {}

    // Act
    await DeleteBlog(context, req)

    // Assert
    expect(context.res?.status).toBe(204)
  })

  it("should not delete non-existent blog", async () => {
    // Arrange
    context.bindings.id += randomId()
    const req = {}

    // Act
    await DeleteBlog(context, req)

    // Assert
    expect(context.res?.status).toBe(404)
  })
})
