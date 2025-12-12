import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Contrato } from "./entities/contrato.entity";
import { ContratoService } from "./service/contrato.service";
import { ContratoController } from "./controller/contrato.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Contrato])],
  controllers: [ContratoController],
  providers: [ContratoService],
  exports: [ContratoService],
})
export class ContratoModule {}
