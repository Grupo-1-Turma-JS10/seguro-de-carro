import { Body, Controller, Post } from "@nestjs/common";
import { ContratoService } from "../service/contrato.service";
import { Contrato } from "../entities/contrato.entity";
import { plainToInstance } from "class-transformer";

@Controller("/contrato")
export class ContratoController {
  constructor(private readonly contratoService: ContratoService) {}

  @Post()
  async create(@Body() contrato: Contrato) {
    const saved = await this.contratoService.createContrato(contrato);
    return plainToInstance(Contrato, saved);
  }
}
