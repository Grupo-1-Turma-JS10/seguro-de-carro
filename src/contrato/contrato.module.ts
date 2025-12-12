import { Module } from "@nestjs/common";
import { ContratoController } from "./controller/contrato.controller";
import { ContratoService } from "./service/contrato.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Contrato } from "./entities/contrato.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Contrato])],
    controllers: [ContratoController],
    providers: [ContratoService],
    exports: [ContratoService],
})
export class ContratoModule {}