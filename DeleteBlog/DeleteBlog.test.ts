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
        slug: randomSlug(),
        category: "test"
      }
    }

    await CreateBlog(context, createReq)

    const req = { params: { id: createReq.body.id } }

    // Act
    await DeleteBlog(context, req)

    // Assert
    expect(context.res?.status).toBe(204)
  })

  it("should not delete non-existent blog", async () => {
    // Arrange
    const req = { params: { id: randomId() } }

    // Act
    await DeleteBlog(context, req)

    // Assert
    expect(context.res?.status).toBe(404)
  })
})
