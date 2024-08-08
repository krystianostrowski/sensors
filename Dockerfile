FROM node:18-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY . /sensors
WORKDIR /sensors

FROM base as build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM base
COPY --from=build /sensors/node_modules /sensors/node_modules
COPY --from=build /sensors/dist /sensors/dist
EXPOSE 3000

CMD ["pnpm", "start"]