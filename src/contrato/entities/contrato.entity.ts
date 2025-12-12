import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Veiculo } from "../../veiculo/entities/veiculo.entity";
import { IsNotEmpty } from "class-validator";

@Entity({ name: "tb_contratos" })
export class Contrato {
    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty()
    @Column()
    nome: string;

    @IsNotEmpty()
    @Column()
    cpf_cnpj: string;

    @IsNotEmpty()
    @Column({ type: "date" })
    data_nascimento: Date;

    @IsNotEmpty()
    @Column()
    endereco: string;

    @IsNotEmpty()
    @Column()
    email: string;

    @IsNotEmpty()
    @Column()
    telefone: string;

    @IsNotEmpty()
    @Column({ type: "date" })
    data_inicio: Date;

    @IsNotEmpty()
    @Column({ type: "date" })
    data_fim: Date;

    @IsNotEmpty()
    @Column("decimal", { precision: 10, scale: 2 })
    valor: number;

    @IsNotEmpty()
    @Column()
    status: string;

    @IsNotEmpty()
    @Column()
    cobertura: string;

    @OneToMany(() => Veiculo, veiculo => veiculo.contrato)
    veiculos: Veiculo[];

    @CreateDateColumn()
    data_criacao: Date;

    @UpdateDateColumn()
    data_atualizacao: Date;
}

