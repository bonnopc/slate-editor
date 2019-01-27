import React from 'react'

export const BlockCounter = options => {
  const { limit, onChangeCounter, blockCount } = options;

  return {
    renderEditor(props, editor, next) {
      const children = next()

    onChangeCounter(
        props.value.document
        .getBlocks()
        .reduce((memo, b) => memo + b.text.trim().split(/\s+/).length, 0))
      
        return (
            <div>
                <div>{children}</div>
                <div className="editor-block-counter">
                    Block Count: 
                    <span className={`ml-1 ${limit && blockCount > limit ? "limit" : ""}`}>
                        {blockCount}
                    </span>
                    {limit ? `/${limit}` : ""}
                </div> 
            </div>
        )
    },
  }
}

export const MarkHotkey = ({ type, key }) => {
    // Return our "plugin" object, containing the `onKeyDown` handler.
    return {
        onKeyDown(event, editor, next) {
            // If it doesn't match our `key`, let other plugins handle it.
            if (!event.ctrlKey || event.key !== key) return next()

            // Prevent the default characters from being inserted.
            event.preventDefault()

            // Toggle the mark `type`.
            editor.toggleMark(type)
        },
    }
}