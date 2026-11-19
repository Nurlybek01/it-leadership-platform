import type { ModuleContent, ModuleStatus } from './types'

const moduleFiles = import.meta.glob<ModuleContent>('../data/modules/*.json', {
  eager: true,
  import: 'default',
})

export const modules = Object.values(moduleFiles).sort((first, second) => first.order - second.order)

export function getModuleStatus(
  module: ModuleContent,
  completedModuleIds: ReadonlySet<string>,
): ModuleStatus {
  if (completedModuleIds.has(module.id)) return 'passed'
  return module.prerequisites.every((id) => completedModuleIds.has(id)) ? 'available' : 'locked'
}
