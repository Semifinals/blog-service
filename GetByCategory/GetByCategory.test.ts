import { Context } from "@azure/functions"
import { randomCategory, randomId, randomSlug } from "../lib/random"
import CreateBlog from "../CreateBlog"
import GetByCategory from "."

describe("GetByCategory", () => {
  let context: Context = {
    bindings: {},
    req: {
      url: "http://localhost:7071/"
    }
  } as unknown as Context

  it("should get multiple existing blogs", async () => {
    // Arrange
    const category = randomCategory()

    const create1Req = {
      body: {
        id: randomId(),
        slug: randomSlug(),
        category
      }
    }

    await CreateBlog(context, create1Req)

    const create2Req = {
      body: {
        id: randomId(),
        slug: randomSlug(),
        category
      }
    }

    await CreateBlog(context, create2Req)

    const req = { query: { category } }

    // Act
    await GetByCategory(context, req)

    // Assert
    expect(context.res?.status).toBe(200)
    expect(Array.isArray(context.res?.body)).toBeTruthy()
    expect(context.res?.body?.length).toBe(2)
    expect(
      [create1Req.body.id, create2Req.body.id].includes(
        context.res?.body?.[0]?.id
      )
    ).toBeTruthy()
    expect(
      [create1Req.body.id, create2Req.body.id].includes(
        context.res?.body?.[1]?.id
      )
    ).toBeTruthy()
  })

  it("should correctly limit results", async () => {
    // Arrange
    const category = randomCategory()

    const create1Req = {
      body: {
        id: randomId(),
        slug: randomSlug(),
        category
      }
    }

    await CreateBlog(context, create1Req)

    const create2Req = {
      body: {
        id: randomId(),
        slug: randomSlug(),
        category
      }
    }

    await CreateBlog(context, create2Req)

    const req = { query: { category, limit: 1 } }

    // Act
    await GetByCategory(context, req)

    // Assert
    expect(context.res?.status).toBe(200)
    expect(Array.isArray(context.res?.body)).toBeTruthy()
    expect(context.res?.body?.length).toBe(1)
    expect(context.res?.body?.[0]?.id).toBe(create2Req.body.id)
  })

  it("should correctly offset results", async () => {
    // Arrange
    const category = randomCategory()

    const create1Req = {
      body: {
        id: randomId(),
        slug: randomSlug(),
        category
      }
    }

    await CreateBlog(context, create1Req)

    const create2Req = {
      body: {
        id: randomId(),
        slug: randomSlug(),
        category
      }
    }

    await CreateBlog(context, create2Req)

    const req = { query: { category, offset: 1 } }

    // Act
    await GetByCategory(context, req)

    // Assert
    expect(context.res?.status).toBe(200)
    expect(Array.isArray(context.res?.body)).toBeTruthy()
    expect(context.res?.body?.length).toBe(1)
    expect(context.res?.body?.[0]?.id).toBe(create1Req.body.id)
  })

  it("should return empty when no blogs", async () => {
    // Arrange
    const req = { query: { category: randomCategory() } }

    // Act
    await GetByCategory(context, req)

    // Assert
    expect(context.res?.status).toBe(200)
    expect(Array.isArray(context.res?.body)).toBeTruthy()
    expect(context.res?.body?.length).toBe(0)
  })
})
