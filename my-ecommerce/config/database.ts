import path from "path";

type EnvFn = {
  (key: string, defaultValue?: any): any;
  int: (key: string, defaultValue?: any) => number;
  bool: (key: string, defaultValue?: any) => boolean;
};

export default ({ env }: { env: EnvFn }) => {
  const client = (env("DATABASE_CLIENT", "sqlite") as string) || "sqlite";

  const useSsl = env.bool("DATABASE_SSL", false);

  const sslOption = useSsl
    ? {
        rejectUnauthorized: env.bool("DATABASE_SSL_REJECT_UNAUTHORIZED", false),
      }
    : false;

  const mysql = {
    connection: {
      host: env("DATABASE_HOST", "localhost"),
      port: env.int("DATABASE_PORT", 3306),
      database: env("DATABASE_NAME", "strapi"),
      user: env("DATABASE_USERNAME", "strapi"),
      password: env("DATABASE_PASSWORD", "strapi"),
      ssl: env.bool("DATABASE_SSL", false) && {
        key: env("DATABASE_SSL_KEY", undefined),
        cert: env("DATABASE_SSL_CERT", undefined),
        ca: env("DATABASE_SSL_CA", undefined),
        capath: env("DATABASE_SSL_CAPATH", undefined),
        cipher: env("DATABASE_SSL_CIPHER", undefined),
        rejectUnauthorized: env.bool("DATABASE_SSL_REJECT_UNAUTHORIZED", true),
      },
    },
    pool: {
      min: env.int("DATABASE_POOL_MIN", 2),
      max: env.int("DATABASE_POOL_MAX", 10),
    },
  };

  const postgres = {
    connection: {
      connectionString: env("DATABASE_URL"),
      host: env("DATABASE_HOST", "localhost"),
      port: env.int("DATABASE_PORT", 5432),
      database: env("DATABASE_NAME", "strapi"),
      user: env("DATABASE_USERNAME", "strapi"),
      password: env("DATABASE_PASSWORD", "strapi"),
      ssl: sslOption,
      schema: env("DATABASE_SCHEMA", "public"),
    },
    pool: {
      min: env.int("DATABASE_POOL_MIN", 2),
      max: env.int("DATABASE_POOL_MAX", 10),
    },
  };

  const sqlite = {
    connection: {
      filename: path.join(
        __dirname,
        "..",
        "..",
        env("DATABASE_FILENAME", ".tmp/data.db"),
      ),
    },
    useNullAsDefault: true,
  };

  const connections: Record<string, any> = {
    mysql,
    postgres,
    sqlite,
  };

  return {
    connection: {
      client,
      ...connections[client],
      acquireConnectionTimeout: env.int("DATABASE_CONNECTION_TIMEOUT", 60000),
    },
  };
};
