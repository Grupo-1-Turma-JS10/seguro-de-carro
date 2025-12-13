import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Veiculo } from '../entities/veiculo.entity';

@Injectable()
export class VeiculoService {
  private readonly logger = new Logger(VeiculoService.name);
  constructor(
    @InjectRepository(Veiculo)
    private veiculoRepository: Repository<Veiculo>
  ) {}

  async findAll(): Promise<Veiculo[]> {
    let veiculos: Veiculo[] = [];

    try {
      veiculos = await this.veiculoRepository.find({
        relations: { seguros: true }
      });
    } catch (error) {
      this.logger.error('Erro buscando veículos:', error.message);
      throw new InternalServerErrorException('Erro ao buscar veículos.');
    }

    if (veiculos.length === 0) {
      this.logger.log('Nenhum veículo encontrado.');
    }

    return veiculos;
  }

  async getVeiculoById(id: number): Promise<Veiculo> {
    this.logger.log(`Buscando veículo com ID: ${id}`);
    let veiculo: Veiculo;

    try {
      veiculo = await this.veiculoRepository.findOneOrFail({ 
        where: { id }, 
        relations: { seguros: true } 
      });

      this.logger.log(`Veículo com ID: ${id} encontrado.`);
      return veiculo;
    } catch (error) {
      this.logger.error(`Erro ao buscar veículo com ID ${id}:`, error.message);
      throw new InternalServerErrorException(
        'Erro ao buscar veículo por ID.',
      );
    }
  }

  async getVeiculoByDocumento(documento: string): Promise<Veiculo[]> {
    this.logger.log(`Buscando veículo com documento: ${documento}`);
    let veiculo: Veiculo[];

    try {
      veiculo = await this.veiculoRepository.find({
        where: { cpf_cnpj: documento }, 
        relations: { seguros: true } 
      });

      this.logger.log(`Veículo com documento: ${documento} encontrado.`);
      return veiculo;
    } catch (error) {
      this.logger.error(`Erro ao buscar veículo com documento ${documento}:`, error.message);
      throw new InternalServerErrorException(
        'Erro ao buscar veículo por documento.',
      );
    }
  }

  async createVeiculo(veiculoData: Veiculo): Promise<Veiculo> {
    this.logger.log('Criando um novo veículo.');

    let veiculo: Veiculo;
    try {
      veiculo = this.veiculoRepository.create(veiculoData);

      const veiculoSalvo = await this.veiculoRepository.save(veiculo);

      this.logger.log(`Veículo criado com ID: ${veiculoSalvo.id}`);
      return veiculoSalvo;
    } catch (error) {
      this.logger.error('Erro ao criar veículo:', error.message);
      throw new InternalServerErrorException('Erro ao criar veículo.');
    }
  }

  async update(veiculo: Veiculo): Promise<Veiculo> {
    this.logger.log(`Atualizando veículo com ID: ${veiculo.id}`);
    let buscaVeiculo = await this.veiculoRepository.findOne({ where: { id: veiculo.id } });

    if (!buscaVeiculo || !veiculo.id) {
      this.logger.error(`Veículo com ID: ${veiculo.id} não encontrado para atualização.`);
      throw new HttpException('Veículo não encontrado!', HttpStatus.NOT_FOUND);
    }

    const veiculoAtualizado = await this.veiculoRepository.save(veiculo);

    this.logger.log(`Veículo com ID: ${veiculo.id} atualizado com sucesso.`);
    return veiculoAtualizado;
  }

  async delete(id: number): Promise<DeleteResult> {
    this.logger.log(`Excluindo veículo com ID: ${id}`);

    try {
      await this.getVeiculoById(id);
      const result = await this.veiculoRepository.delete(id);

      this.logger.log(`Veículo com ID: ${id} excluído com sucesso.`);
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      this.logger.error(`Erro ao excluir veículo com ID ${id}: ${error.message}.`);
      throw new InternalServerErrorException('Erro ao excluir veiculo.');
    }
  }
}
