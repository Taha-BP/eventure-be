import { Entity, Column, ManyToOne, JoinColumn, Index } from "typeorm";
import { Event } from "./event.entity";
import { User } from "./user.entity";
import { Base } from "./base.entity";

@Entity("event_acknowledgments")
@Index(["eventId", "userId"], { unique: true })
export class EventAcknowledgment extends Base {
  @Column()
  eventId: string;

  @Column()
  userId: string;

  @Column("int")
  pointsEarned: number;

  @Column("int")
  order: number;

  @ManyToOne(() => Event, { onDelete: "CASCADE" })
  @JoinColumn({ name: "eventId" })
  event: Event;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;
}
