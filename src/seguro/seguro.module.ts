import { Module } from "@nestjs/common";
import { SeguroController } from "./controller/seguro.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Seguro } from "./entities/seguro.entity";
import { SeguroService } from "./service/seguro.service";
import { VeiculoModule } from "../veiculo/veiculo.module";

@Module({
    imports: [TypeOrmModule.forFeature([Seguro]), VeiculoModule],
    controllers: [SeguroController],
    providers: [SeguroService],
    exports: [SeguroService],
})
export class SeguroModule {}
