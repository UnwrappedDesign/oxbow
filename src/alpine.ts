import type { Alpine } from 'alpinejs'
import ui from '@alpinejs/ui'
import focus from '@alpinejs/focus'
import Clipboard from "@ryangjchandler/alpine-clipboard"
import intersect from '@alpinejs/intersect'

export default (Alpine: Alpine) => {
    Alpine.plugin(ui)
    Alpine.plugin(focus)
    Alpine.plugin(Clipboard)
    Alpine.plugin(intersect)
}