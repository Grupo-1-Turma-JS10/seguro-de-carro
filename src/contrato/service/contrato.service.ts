import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Contrato } from "../entities/contrato.entity";
import { Repository } from "typeorm";

@Injectable()
export class ContratoService {
    private readonly logger = new Logger(ContratoService.name);

    constructor(
        @InjectRepository(Contrato)
        private contratoRepository: Repository<Contrato>
    ) { }

    async getContratosById(id: number): Promise<Contrato> {
        this.logger.log(`Buscando contrato com ID: ${id}`);

        let contrato: Contrato;
        try {
            contrato = await this.contratoRepository.findOneOrFail({
                where: { id },
                relations: { veiculos: true }
            });
            return contrato;
        } catch (error) {
            this.logger.error(`Erro ao buscar contrato com ID: ${id}`, error.stack);
            throw new InternalServerErrorException('Erro ao buscar contrato pelo ID.');
        }
    }

    async getContratosByDocumento(documento: string): Promise<Contrato> {
        this.logger.log(`Buscando contrato com documento: ${documento}`);
        let contrato: Contrato;

        try {
            contrato = await this.contratoRepository.findOneOrFail({
                where: { cpf_cnpj: documento },
                relations: { veiculos: true }
            });
            return contrato;
        } catch (error) {
            this.logger.error(`Erro ao buscar contrato com documento: ${documento}`, error.stack);
            throw new InternalServerErrorException('Erro ao buscar contrato pelo documento.');
        }
    }

    async findAll(): Promise<Contrato[]> {
        let contratos: Contrato[] = [];

        try {
            contratos = await this.contratoRepository.find();
        } catch (error) {
            console.error('Error fetching contracts:', error.message);
            throw new InternalServerErrorException('Error fetching contracts.');
        }

        if (contratos.length === 0) {
            console.log('No contracts found.');
        }

        return contratos;
    }
}