import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Veiculo } from "../../veiculo/entities/veiculo.entity";
import { IsEmail, IsNotEmpty, IsPhoneNumber } from "class-validator";

@Entity({ name: "tb_contratos" })
export class Contrato {
    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty({ message: "O nome não pode estar vazio." })
    @Column({ length: 100, nullable: false })
    nome: string;

    @IsNotEmpty({ message: "O CPF/CNPJ não pode estar vazio." })
    @Column({ length: 14, unique: true, nullable: false })
    cpf_cnpj: string;

    @IsNotEmpty({ message: "A data de nascimento não pode estar vazia." })
    @Column({ type: "date" })
    data_nascimento: Date;

    @IsNotEmpty({ message: "O endereço não pode estar vazio." })
    @Column({ length: 500, nullable: false })
    endereco: string;

    @IsNotEmpty({ message: "O email não pode estar vazio." })
    @IsEmail({}, { message: "O email deve ser válido." })
    @Column({ length: 100, nullable: false })
    email: string;

    @IsNotEmpty({ message: "O telefone não pode estar vazio." })
    @IsPhoneNumber("BR", { message: "O telefone deve ser válido." })
    @Column({ length: 15, nullable: false })
    telefone: string;

    @IsNotEmpty({ message: "A data de início não pode estar vazia." })
    @Column({ type: "date", nullable: false })
    data_inicio: Date;

    @Column({ type: "date", nullable: false })
    data_fim: Date;
    
    @IsNotEmpty({ message: "O valor não pode estar vazio." })
    @Column("decimal", { precision: 10, scale: 2 })
    valor: number;

    @Column({ length: 50, nullable: false })
    status: string;

    @IsNotEmpty({ message: "A cobertura não pode estar vazia." })
    @Column({ length: 100, nullable: false })
    cobertura: string;

    @CreateDateColumn()
    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    data_criacao: Date;

    @UpdateDateColumn()
    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    data_atualizacao: Date;

    @OneToMany(() => Veiculo, veiculo => veiculo.contrato)
    veiculos: Veiculo[];

}

