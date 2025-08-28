import { Entity, Column, Index, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user.entity";
import { Base } from "./base.entity";

export enum TokenType {
  ACCESS = "access",
  REFRESH = "refresh",
}

@Entity("tokens")
export class Token extends Base {
  @Column()
  @Index()
  token: string;

  @Column({
    type: "enum",
    enum: TokenType,
    default: TokenType.ACCESS,
  })
  type: TokenType;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.tokens, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  expiresAt: Date;

  @Column({ default: true })
  isActive: boolean;
}
