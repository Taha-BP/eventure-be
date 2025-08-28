import { Entity, Column, ManyToOne, JoinColumn, Index } from "typeorm";
import { User } from "./user.entity";
import { Base } from "./base.entity";

@Entity("friendships")
@Index(["userId", "friendId"], { unique: true })
export class Friendship extends Base {
  @Column()
  userId: string;

  @Column()
  friendId: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "friendId" })
  friend: User;
}
