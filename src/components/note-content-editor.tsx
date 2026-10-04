'use client';

import { useRef } from 'react';
import { Bold, Italic, IndentIncrease, List, Quote } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface NoteContentEditorProps {
    defaultValue?: string;
    disabled?: boolean;
}

export function NoteContentEditor({ defaultValue = '', disabled }: NoteContentEditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const wrapSelection = (before: string, after: string, placeholder: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selection = textarea.value.slice(start, end) || placeholder;
        textarea.setRangeText(`${before}${selection}${after}`, start, end, 'select');
        textarea.focus();
    };

    const prefixLines = (prefix: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const selectionStart = textarea.selectionStart;
        const selectionEnd = textarea.selectionEnd;
        const lineStart = textarea.value.lastIndexOf('\n', selectionStart - 1) + 1;
        const nextLineBreak = textarea.value.indexOf('\n', selectionEnd);
        const lineEnd = nextLineBreak === -1 ? textarea.value.length : nextLineBreak;
        const lines = textarea.value.slice(lineStart, lineEnd);
        const prefixedLines = lines
            .split('\n')
            .map(line => `${prefix}${line}`)
            .join('\n');

        textarea.setRangeText(prefixedLines, lineStart, lineEnd, 'select');
        textarea.focus();
    };

    return (
        <div className="grid gap-2">
            <div className="flex flex-wrap items-center gap-1 rounded-md border bg-muted/30 p-1">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    aria-label="Bold"
                    title="Bold"
                    disabled={disabled}
                    onMouseDown={event => event.preventDefault()}
                    onClick={() => wrapSelection('**', '**', 'bold text')}
                >
                    <Bold />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    aria-label="Italic"
                    title="Italic"
                    disabled={disabled}
                    onMouseDown={event => event.preventDefault()}
                    onClick={() => wrapSelection('*', '*', 'italic text')}
                >
                    <Italic />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    aria-label="Bulleted list"
                    title="Bulleted list"
                    disabled={disabled}
                    onMouseDown={event => event.preventDefault()}
                    onClick={() => prefixLines('- ')}
                >
                    <List />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    aria-label="Indent list"
                    title="Indent list"
                    disabled={disabled}
                    onMouseDown={event => event.preventDefault()}
                    onClick={() => prefixLines('  - ')}
                >
                    <IndentIncrease />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    aria-label="Quote"
                    title="Quote"
                    disabled={disabled}
                    onMouseDown={event => event.preventDefault()}
                    onClick={() => prefixLines('> ')}
                >
                    <Quote />
                </Button>
            </div>
            <Textarea
                ref={textareaRef}
                id="content"
                name="content"
                placeholder="Write a note..."
                defaultValue={defaultValue}
                disabled={disabled}
                rows={7}
            />
            <p className="text-xs text-muted-foreground">
                Supports Markdown formatting. Select text or place the cursor, then choose a style.
            </p>
        </div>
    );
}
