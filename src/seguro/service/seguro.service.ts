import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, ILike, Repository } from 'typeorm';
import { Seguro } from '../entities/seguro.entity';
import { VeiculoService } from '../../veiculo/service/veiculo.service';

@Injectable()
export class SeguroService {
  private readonly DESCONTO_PERCENTUAL = 20;
  private readonly VALOR_SEGURO = {
    'basico': 2000,
    'intermediario': 3500,
    'completo': 5000,
  }
  private readonly logger = new Logger(SeguroService.name);

  constructor(
    @InjectRepository(Seguro)
    private seguroRepository: Repository<Seguro>,
    private veiculoService: VeiculoService
  ) { }

  async createSeguro(seguro: Seguro): Promise<Seguro> {
    this.logger.log(`Creating seguro.`);
    this.validarSeguro(seguro);

    let seguroSalvo: Seguro;

    try {
      // Verificar se já existe seguro ativo para o mesmo veículo
      const seguroAtivo = await this.seguroRepository.findOne({
        where: {
          veiculo:
            { id: seguro.veiculo.id },
          status: 'Ativo'
        },
      });

      if (seguroAtivo) {
        this.logger.log(`Desativando seguro anterior ID: ${seguroAtivo.id}`);
        seguroAtivo.status = 'Inativo';
        await this.seguroRepository.save(seguroAtivo);
      }

      // Criar novo seguro ativo
      seguro.status = 'Ativo';
      seguroSalvo = await this.seguroRepository.save(
        await this.calcularValorSeguro(seguro, seguro.veiculo.id, this.DESCONTO_PERCENTUAL)
      );
      this.logger.log(`Seguro criado com ID: ${seguroSalvo.id}`);
      return seguroSalvo;
    } catch (error) {
      this.logger.error(`Erro ao criar seguro`, error.stack);
      throw new InternalServerErrorException('Erro ao criar seguro.');
    }
  }

  async findAll(): Promise<Seguro[]> {
    let contratos: Seguro[] = [];

    try {
      contratos = await this.seguroRepository.find({
        relations: { veiculo: true },
      });
    } catch (error) {
      console.error('Error fetching contracts:', error.message);
      throw new InternalServerErrorException('Error fetching contracts.');
    }

    if (contratos.length === 0) {
      console.log('No contracts found.');
    }

    return contratos;
  }

  async getSegurosById(id: number): Promise<Seguro> {
    this.logger.log(`Buscando seguro com ID: ${id}`);

    let seguro: Seguro;
    try {
      seguro = await this.seguroRepository.findOneOrFail({
        where: { id },
        relations: { veiculo: true },
      });
      return seguro;
    } catch (error) {
      this.logger.error(`Erro ao buscar seguro com ID: ${id}`, error.stack);
      throw new InternalServerErrorException(
        'Erro ao buscar seguro pelo ID.',
      );
    }
  }

  async getSegurosByStatus(status: string): Promise<Seguro[]> {
    this.logger.log(`Buscando seguros com status: ${status}`);

    let seguros: Seguro[];
    try {
      seguros = await this.seguroRepository.find({
        where: { status: ILike(`%${status}%`) },
        relations: { veiculo: true },
      });
      return seguros;
    } catch (error) {
      this.logger.error(`Erro ao buscar seguros com status: ${status}`, error.stack);
      throw new InternalServerErrorException(
        'Erro ao buscar seguros pelo status.',
      );
    }
  }

  async getSegurosByCobertura(tipo: string): Promise<Seguro[]> {
    this.logger.log(`Buscando seguros com cobertura: ${tipo}`);

    let seguros: Seguro[];
    try {
      seguros = await this.seguroRepository.find({
        where: { cobertura: ILike(`%${tipo}%`) },
        relations: { veiculo: true },
      });
      return seguros;
    } catch (error) {
      this.logger.error(`Erro ao buscar seguros com cobertura: ${tipo}`, error.stack);
      throw new InternalServerErrorException(
        'Erro ao buscar seguros pela cobertura.',
      );
    }
  }

  async getSegurosByVeiculoId(veiculoId: number): Promise<Seguro[]> {
    this.logger.log(`Buscando seguros para veiculo ID: ${veiculoId}`);

    let seguros: Seguro[];
    try {
      seguros = await this.seguroRepository.find({
        where: { veiculo: { id: veiculoId } },
        relations: { veiculo: true },
      });
      return seguros;
    } catch (error) {
      this.logger.error(`Erro ao buscar seguros para veiculo ID: ${veiculoId}`, error.stack);
      throw new InternalServerErrorException(
        'Erro ao buscar seguros pelo ID do veículo.',
      );
    }
  }

  async update(seguro: Seguro): Promise<Seguro> {
    let buscaSeguro = await this.getSegurosById(seguro.id);

    if (!buscaSeguro || !seguro.id)
      throw new HttpException('Seguro não encontrado!', HttpStatus.NOT_FOUND);

    return await this.seguroRepository.save(seguro);
  }

  async delete(id: number): Promise<DeleteResult> {
    console.log(`Seguro com ID ${id}, excluido.`);

    try {
      await this.getSegurosById(id);

      const result = await this.seguroRepository.delete(id);

      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error(`Erro ao excluir seguro com ID ${id}: ${error.message}.`);
      throw new InternalServerErrorException('Erro ao excluir seguro.');
    }
  }

  async calcularValorSeguro(seguro: Seguro, id: number, percentual: number): Promise<Seguro> {
    const veiculo = await this.veiculoService.getVeiculoById(id);

    if (!veiculo) {
      throw new NotFoundException(`Veiculo com id ${id} não encontrado`);
    }

    const anoAtual = new Date().getFullYear();
    const idadeVeiculo = anoAtual - veiculo.ano;
    let desconto: number = 0;

    // Determina o valor base do seguro
    if (!seguro.valor) {
      this.logger.log(`Calculando valor do seguro base para cobertura: ${seguro.cobertura}`);
      seguro.valor = this.VALOR_SEGURO[seguro.cobertura.toLowerCase()] || 2000;
    }

    // Aplica desconto se o veículo tiver mais de 10 anos
    if (idadeVeiculo > 10) {
      desconto = seguro.valor * (percentual / 100);
      this.logger.log(`Calculando valor do seguro com desconto: ${desconto}`);
      seguro.valor = seguro.valor - desconto;
    }

    seguro.valor = Number(seguro.valor.toFixed(2));
    seguro.desconto = Number(desconto.toFixed(2));
    return seguro;
  }

  validarSeguro(seguro: Seguro): void {
    if (!seguro.veiculo || !seguro.veiculo.id) {
      throw new HttpException('Veículo é obrigatório.', HttpStatus.BAD_REQUEST);
    }

    if (seguro.cobertura == null) {
      throw new HttpException('Cobertura é obrigatória.', HttpStatus.BAD_REQUEST);
    }

    const dataNascimento = new Date(seguro.veiculo.data_nascimento);
    const idade = new Date().getFullYear() - dataNascimento.getFullYear();

    if (idade < 18) {
      throw new HttpException('O segurado deve ser maior de 18 anos.', HttpStatus.BAD_REQUEST);
    }
  }
}
