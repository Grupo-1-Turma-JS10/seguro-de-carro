import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Veiculo } from "./entities/veiculo.entity";
import { VeiculoController } from "./controller/veiculo.controller";
import { VeiculoService } from "./service/veiculo.service";

@Module({
    imports: [TypeOrmModule.forFeature([Veiculo])],
    controllers: [VeiculoController],
    providers: [VeiculoService],
    exports: [VeiculoService],
})
export class VeiculoModule {}