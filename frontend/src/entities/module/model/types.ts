export type ModuleResource = { title: string; url?: string }

export type ModuleQuestion = {
  id: string
  question: string
  options: string[]
  correctOption: number
  explanation: string
}

export type GitHubCheck =
  | { id: string; kind: 'template_repository'; description: string }
  | { id: string; kind: 'readme_sections'; description: string; sections: string[] }
  | { id: string; kind: 'issue'; description: string; title: string; labels: string[] }
  | { id: string; kind: 'pull_request_review_comments'; description: string; minimum: number }
  | { id: string; kind: 'student_commits'; description: string; minimum: number }
  | { id: string; kind: 'file_sections'; description: string; path: string; sections: string[] }
  | { id: string; kind: 'project_tasks'; description: string; minimum: number }

export type ModuleContent = {
  id: string
  title: string
  description: string
  order: number
  prerequisites: string[]
  theory: {
    markdown: string
    videos: ModuleResource[]
    references: ModuleResource[]
  }
  quiz: ModuleQuestion[]
  practice: {
    title: string
    description: string
    templateRepositoryUrl: string | null
    criteria: string[]
    checks: GitHubCheck[]
  }
  achievements: string[]
}

export type ModuleStatus = 'locked' | 'available' | 'in_progress' | 'passed'
