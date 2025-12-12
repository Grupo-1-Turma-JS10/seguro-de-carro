import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Veiculo } from "./entities/veiculo.entity";
import { VeiculoService } from "./service/veiculo.service";
import { VeiculoController } from "./controller/veiculo.controller";
import { Contrato } from "../contrato/entities/contrato.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Veiculo, Contrato])],
  controllers: [VeiculoController],
  providers: [VeiculoService],
})
export class VeiculoModule {}
