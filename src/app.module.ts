import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { PingPongResolvers } from './ping-pong.resolvers';
// redissub digunakan untuk instan semua, supaya subscrip walaupun beda server
import { RedisPubSub } from 'graphql-redis-subscriptions';
import * as Redis from 'ioredis';

@Module({
  imports: [
    GraphQLModule.forRoot({
      playground: true,
      typePaths: ['./**/*.graphql'],
      installSubscriptionHandlers: true,
    }),
  ],
  providers: [
    PingPongResolvers,
    {
      provide: 'PUB_SUB',
      useFactory: () => {
        const options = {
          host: 'localhost',
          port: 6379,
        };

        return new RedisPubSub({
          publisher: new Redis(options),
          subscriber: new Redis(options),
        });
      },
    },
  ],
})
export class AppModule {}
