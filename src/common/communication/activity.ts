/**
 * Defines a list of the possible activity types that can be recorded by the Monitor class
 */
enum ActivityType {
  SelfLoop = "Self-Loop",
  StateChange = "State Change",
  Interaction = "Interaction",
  Traversal = "Traversal",
  Both = "Both",
}

export { ActivityType }
