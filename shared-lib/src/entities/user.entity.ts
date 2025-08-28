import { Entity, Column, Index, OneToMany } from "typeorm";
import { Event } from "./event.entity";
import { EventAcknowledgment } from "./event-acknowledgment.entity";
import { Friendship } from "./friendship.entity";
import { Token } from "./token.entity";
import { Base } from "./base.entity";

@Entity("users")
export class User extends Base {
  @Column({ unique: true })
  @Index()
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @OneToMany(() => Event, (event) => event.creator)
  events: Event[];

  @OneToMany(() => EventAcknowledgment, (acknowledgment) => acknowledgment.user)
  acknowledgments: EventAcknowledgment[];

  @OneToMany(() => Friendship, (friendship) => friendship.user)
  friendships: Friendship[];

  @OneToMany(() => Friendship, (friendship) => friendship.friend)
  friendOf: Friendship[];

  @OneToMany(() => Token, (token) => token.user, { cascade: true })
  tokens: Token[];
}
