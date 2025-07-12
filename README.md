# Prisma Zod 

> That generator is a fork from ["prisma-zod-generator"](https://github.com/omar-dulaimi/prisma-zod-generator) but with the added value of working in Prisma ORM versions 5 and 6. The related forked generator only works fine until Prisma ORM version 4.

Thanks to [Omar Dulaimi](https://github.com/omar-dulaimi/) for sharing.

[![npm](https://img.shields.io/npm/l/prisma-zod-generator.svg)](LICENSE)

Automatically generate [Zod](https://github.com/colinhacks/zod) schemas from your [Prisma](https://github.com/prisma/prisma) Schema, and use them to validate your API endpoints or any other use you have. Updates every time `npx prisma generate` runs.

## Table of Contents

- [Supported Prisma Versions](#supported-prisma-versions)
- [Installation](#installation)
- [Usage](#usage)
- [Customizations](#customizations)
- [Additional Options](#additional-options)

# Supported Prisma Versions

### Prisma 6

### Prisma 5

### Prisma 4

- 0.3.0 and higher

### Prisma 2/3

- 0.2.0 and lower

# Installation

Using npm:

```bash
 npm install @ladislaogarcia/prisma-zod-generator
```

# Usage

1- Star this repo 😉

2- Add the generator to your Prisma schema

```prisma
generator zod {
  provider = "prisma-zod-generator"
}
```

3- Enable strict mode in `tsconfig` as it is required by Zod, and considered a Typescript best practice

```ts
{
  "compilerOptions": {
    "strict": true
  }
}

```

4- Running `npx prisma generate` for the following schema.prisma

```prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}

model Post {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  title     String
  content   String?
  published Boolean  @default(false)
  viewCount Int      @default(0)
  author    User?    @relation(fields: [authorId], references: [id])
  authorId  Int?
  likes     BigInt
}
```

will generate the following files

![Zod Schemas](https://raw.githubusercontent.com/ladislaogarcia/prisma-zod-generator/master/zodSchemas.png)

5- Use generated schemas somewhere in your API logic, like middleware or decorator

```ts
import { PostCreateOneSchema } from './prisma/generated/schemas/createOnePost.schema';

app.post('/blog', async (req, res, next) => {
  const { body } = req;
  await PostCreateOneSchema.parse(body);
});
```

# Customizations

## Skipping entire models

```prisma
/// @@Gen.model(hide: true)
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}
```

# Additional Options

| Option              | Description                                                                | Type      | Default       |
| ------------------- | -------------------------------------------------------------------------- | --------- | ------------- |
| `output`            | Output directory for the generated zod schemas                             | `string`  | `./generated` |
| `isGenerateSelect`  | Enables the generation of Select related schemas and the select property   | `boolean` | `false`       |
| `isGenerateInclude` | Enables the generation of Include related schemas and the include property | `boolean` | `false`       |

Use additional options in the `schema.prisma`

```prisma
generator zod {
  provider          = "prisma-zod-generator"
  output            = "./generated-zod-schemas"
  isGenerateSelect  = true
  isGenerateInclude = true
}
```
