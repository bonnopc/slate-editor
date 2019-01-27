import { Value } from 'slate';

export const InitialData = Value.fromJSON(
    {
        document: {
            nodes: [
                {
                    object: 'block',
                    type: 'paragraph',
                    nodes: [
                        {
                            object: 'text',
                            leaves: [
                                {
                                    text: '',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    }
)