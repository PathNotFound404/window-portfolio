// Registry of window apps. The key is the `app` id used in src/config/desktop.js.
// To add a new kind of window: create a component in src/components/apps/,
// register it here, add defaults in src/config/windows.js, and add a desktop icon.
import AboutMe from '@/components/apps/AboutMe.vue'
import ContactCard from '@/components/apps/ContactCard.vue'
import ProjectsExplorer from '@/components/apps/ProjectsExplorer.vue'
import SettingsPanel from '@/components/apps/SettingsPanel.vue'

export const apps = {
  projects: ProjectsExplorer,
  about: AboutMe,
  contact: ContactCard,
  settings: SettingsPanel,
}
