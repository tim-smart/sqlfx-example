import * as Effect from "@effect/io/Effect"
import * as Pg from "@sqlfx/pg"

export default Effect.flatMap(
  Pg.tag,
  sql => sql`
    CREATE TABLE people (
      id serial PRIMARY KEY,
      name text NOT NULL,
      age int,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `,
)
