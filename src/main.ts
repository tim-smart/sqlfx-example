import * as Pg from "@sqlfx/pg"
import * as Config from "@effect/io/Config"
import * as Effect from "@effect/io/Effect"
import { pipe } from "@effect/data/Function"
import * as Migrator from "@sqlfx/pg/Migrator"
import * as Dotenv from "dotenv"
import * as Layer from "@effect/io/Layer"

Dotenv.config()

const program = Effect.gen(function* (_) {
  const sql = yield* _(Pg.tag)

  yield* _(sql`INSERT INTO people ${sql({ name: "John", age: 20 })}`)

  console.log(yield* _(sql`SELECT * FROM people`))
})

const PgLive = Pg.makeLayer({
  database: Config.succeed("effect_dev"),
  transformQueryNames: Config.succeed(Pg.transform.fromCamel),
  transformResultNames: Config.succeed(Pg.transform.toCamel),
})

const MigratorLive = Migrator.makeLayer({
  loader: Migrator.fromDisk(`${__dirname}/migrations`),
})

const EnvLive = Layer.provideMerge(PgLive, MigratorLive)

pipe(
  program,
  Effect.provideLayer(EnvLive),
  Effect.tapErrorCause(Effect.logErrorCause),
  Effect.runFork,
)
