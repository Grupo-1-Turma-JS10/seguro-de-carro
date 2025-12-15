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
  private readonly VALOR_SEGURO_POR_COBERTURA = {
    'basica': 2000,
    'intermediaria': 3500,
    'completa': 5000,
  }
  private readonly status = {
    'ativo': 'ativo',
    'inativo': 'inativo',
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

    let seguroSalvo: Seguro = seguro;

    try {
      // Verificar se já existe seguro ativo para o mesmo veículo
      const seguroAtivo = await this.seguroRepository.findOne({
        where: {
          veiculo:
            { id: seguro.veiculo.id },
          status: this.status.ativo
        },
      });

      if (seguroAtivo) {
        this.logger.log(`Desativando seguro anterior ID: ${seguroAtivo.id}`);
        seguroAtivo.status = this.status.inativo;
        await this.seguroRepository.save(seguroAtivo);
      }

      // Criar novo seguro ativo
      seguroSalvo.status = this.status.ativo;
      seguroSalvo = await this.seguroRepository.save(
        await this.calcularValorSeguro(seguroSalvo, seguro.veiculo.id, this.DESCONTO_PERCENTUAL)
      );
      this.logger.log(`Seguro criado com ID: ${seguroSalvo.id}`);
      return seguroSalvo;
    } catch (error) {
      if (error instanceof HttpException || error instanceof NotFoundException) {
        throw error;
      }
      
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

      this.logger.log(`Contratos encontrados: ${contratos.length}`);
    } catch (error) {
      this.logger.error('Erro ao buscar contratos', error.stack);
      throw new InternalServerErrorException('Erro ao buscar contratos.');
    }

    if (contratos.length === 0) {
      console.log('No contracts found.');
    }

    return contratos;
  }

  async getSegurosById(id: number): Promise<Seguro> {
    this.logger.log(`Buscando seguro com ID: ${id}`);

    let seguro: Seguro | null = null;
    try {
      seguro = await this.seguroRepository.findOne({
        where: { id },
        relations: { veiculo: true },
      });

      if (!seguro) {
        this.logger.error(`Seguro com ID: ${id} não encontrado.`);
        throw new NotFoundException(`Seguro com ID ${id} não encontrado.`);
      }

      this.logger.log(`Seguro encontrado: ID ${seguro.id}`);
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

      this.logger.log(`Seguros encontrados com status: ${seguros.length}`);
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

      this.logger.log(`Seguros encontrados com cobertura: ${seguros.length}`);
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

      this.logger.log(`Seguros encontrados para veiculo ID ${veiculoId}: ${seguros.length}`);
      return seguros;
    } catch (error) {
      this.logger.error(`Erro ao buscar seguros para veiculo ID: ${veiculoId}`, error.stack);
      throw new InternalServerErrorException(
        'Erro ao buscar seguros pelo ID do veículo.',
      );
    }
  }

  async update(seguro: Seguro): Promise<Seguro> {
    this.logger.log(`Atualizando seguro com ID: ${seguro.id}`);

    try {
      await this.getSegurosById(seguro.id);
      this.validarSeguro(seguro);
      seguro = await this.calcularValorSeguro(seguro, seguro.veiculo.id, this.DESCONTO_PERCENTUAL);

      const seguroAtualizado = await this.seguroRepository.save(seguro);
      this.logger.log(`Seguro atualizado: ID ${seguroAtualizado.id}`);
      return seguroAtualizado;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error(`Erro ao atualizar seguro com ID: ${seguro.id}`, error.stack);
      throw new InternalServerErrorException('Erro ao atualizar seguro.');
    }
  }

  async delete(id: number): Promise<DeleteResult> {
    this.logger.log(`Excluindo seguro com ID: ${id}`);
    try {
      await this.getSegurosById(id);

      const result = await this.seguroRepository.delete(id);

      this.logger.log(`Seguro excluído: ID ${id}`);
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
    this.logger.log(`Calculando valor do seguro para veiculo com ID: ${id}`);
    const veiculo = await this.veiculoService.getVeiculoById(id);

    if (!veiculo) {
      this.logger.error(`Veiculo com id ${id} não encontrado`);
      throw new NotFoundException(`Veiculo com id ${id} não encontrado`);
    }

    // Determina o valor base do seguro
    if (!seguro.valor) {
      this.logger.log(`Calculando valor do seguro base para cobertura: ${seguro.cobertura}`);
      if (this.VALOR_SEGURO_POR_COBERTURA[seguro.cobertura.toLowerCase()]) {
        seguro.valor = this.VALOR_SEGURO_POR_COBERTURA[seguro.cobertura.toLowerCase()];
      } else {
        this.logger.error(`Cobertura inválida: ${seguro.cobertura}`);
        throw new HttpException(
          `Cobertura inválida. Opções válidas: ${Object.keys(this.VALOR_SEGURO_POR_COBERTURA).join(', ')}`, 
          HttpStatus.BAD_REQUEST
        );
      }
    }

    const anoAtual = new Date().getFullYear();
    const idadeVeiculo = anoAtual - veiculo.ano;
    let desconto: number = 0;

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
    this.logger.log(`Validando seguro.`);
    if (!seguro.veiculo || !seguro.veiculo.id) {
      this.logger.error('Veículo é obrigatório.');
      throw new HttpException('Veículo é obrigatório.', HttpStatus.BAD_REQUEST);
    }

    if (seguro.cobertura == null) {
      this.logger.error('Cobertura é obrigatória.');
      throw new HttpException('Cobertura é obrigatória.', HttpStatus.BAD_REQUEST);
    }

    const dataNascimento = new Date(seguro.veiculo.data_nascimento);
    const idade = new Date().getFullYear() - dataNascimento.getFullYear();

    if (idade < 18) {
      this.logger.error('O segurado deve ser maior de 18 anos.');
      throw new HttpException('O segurado deve ser maior de 18 anos.', HttpStatus.BAD_REQUEST);
    }
  }
}
