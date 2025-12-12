import { Module } from '@nestjs/common';
import { Contrato } from './contrato/entities/contrato.entity';
import { Veiculo } from './veiculo/entities/veiculo.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContratoModule } from './contrato/contrato.module';
import { VeiculoModule } from './veiculo/veiculo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<string>('DB_TYPE') as 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        synchronize: configService.get<string>('NODE_ENV') === 'development',
        entities: [Contrato, Veiculo],
      }),
    }),
    ContratoModule,
    VeiculoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
