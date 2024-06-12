import type { Alpine } from 'alpinejs'
import ui from '@alpinejs/ui'
import focus from '@alpinejs/focus'

export default (Alpine: Alpine) => {
    Alpine.plugin(ui)
    Alpine.plugin(focus)
}