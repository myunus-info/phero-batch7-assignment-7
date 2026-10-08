import { Badge } from "./badge";

export function DifficultyBadge({ difficulty }: { difficulty: string }) {
  switch (difficulty) {
    case "EASY":
      return <Badge variant="success">Easy</Badge>;
    case "MEDIUM":
      return <Badge variant="warning">Medium</Badge>;
    case "HARD":
      return <Badge variant="destructive">Hard</Badge>;
    default:
      return <Badge variant="outline">{difficulty}</Badge>;
  }
}

export function ProblemTypeBadge({ type }: { type: string }) {
  switch (type) {
    case "CODING":
      return <Badge variant="cyan">Coding</Badge>;
    case "MCQ":
      return <Badge variant="purple">Multiple Choice</Badge>;
    case "SINGLE_CHOICE":
      return <Badge variant="purple">Single Choice</Badge>;
    default:
      return <Badge variant="outline">{type}</Badge>;
  }
}

export function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "ACTIVE":
    case "COMPLETED":
    case "PUBLISHED":
    case "PASSED":
      return <Badge variant="success">{status}</Badge>;
    case "IN_PROGRESS":
    case "INVITED":
    case "PENDING":
    case "DRAFT":
      return <Badge variant="warning">{status}</Badge>;
    case "BLOCKED":
    case "FAILED":
    case "ARCHIVED":
      return <Badge variant="destructive">{status}</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export function CandidateStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "COMPLETED":
      return <Badge variant="success">Completed</Badge>;
    case "IN_PROGRESS":
      return <Badge variant="cyan">In Progress</Badge>;
    case "INVITED":
      return <Badge variant="warning">Invited</Badge>;
    case "EXPIRED":
      return <Badge variant="destructive">Expired</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export function RoleBadge({ role }: { role: string }) {
  switch (role) {
    case "ADMIN":
      return <Badge variant="destructive">Admin</Badge>;
    case "RECRUITER":
      return <Badge variant="cyan">Recruiter</Badge>;
    case "CANDIDATE":
      return <Badge variant="success">Candidate</Badge>;
    default:
      return <Badge variant="outline">{role}</Badge>;
  }
}
