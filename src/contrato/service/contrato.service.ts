import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Contrato } from "../entities/contrato.entity";

@Injectable()
export class ContratoService {
  constructor(
    @InjectRepository(Contrato)
    private contratoRepository: Repository<Contrato>
  ) {}

  async createContrato(contrato: Contrato): Promise<Contrato> {
    return this.contratoRepository.save(contrato);
  }

  async findAll(): Promise<Contrato[]> {
    return this.contratoRepository.find();
  }
}
