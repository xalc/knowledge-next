import Heading, { Level } from "@tiptap/extension-heading";
import { mergeAttributes } from "@tiptap/react";

const classes = {
  h1: { class: 'mb-8 text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100' },
  h2: { class: 'mb-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100' },
  h3: { class: 'mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100' },
  h4: { class: 'mb-4 text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100' },
  h5: { class: 'mb-3 text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100' },
  h6: { class: 'mb-2 text-base font-bold tracking-tight text-gray-900 dark:text-gray-100' },
}
const CustomHeading = Heading.extend({
  parseHTML() {
    return this.options.levels
      .map((level: Level) => ({
        tag: `h${level}`,
        attrs: { level },
      }))
  },

  renderHTML({ node, HTMLAttributes }) {
    const hasLevel = this.options.levels.includes(node.attrs.level)
    const level = hasLevel
      ? node.attrs.level
      : this.options.levels[0]

    return [`h${level}`, mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, classes[`h${level}`]), 0]
  }
})
export default CustomHeading;