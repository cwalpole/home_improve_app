"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import styles from "../admin.module.css";

type HtmlEditorProps = {
  name: string;
  label: string;
  id?: string;
  defaultValue?: string | null;
  placeholder?: string;
  helpText?: string;
  onDirty?: () => void;
};

export default function HtmlEditor({
  name,
  label,
  id,
  defaultValue,
  placeholder,
  helpText,
  onDirty,
}: HtmlEditorProps) {
  const [value, setValue] = useState(defaultValue ?? "");
  const componentId = useId();
  const editorId = useMemo(
    () => id ?? `${name}-${componentId}`,
    [componentId, id, name]
  );
  const placeholderText = placeholder ?? "Type or paste content";

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          heading: { levels: [1, 2, 3] },
        }),
        Link.configure({
          openOnClick: false,
          linkOnPaste: true,
          HTMLAttributes: { rel: "noopener noreferrer" },
        }),
        Placeholder.configure({
          placeholder: placeholderText,
        }),
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        Underline,
      ],
      content: defaultValue ?? "",
      onUpdate: ({ editor: instance }) => {
        const html = instance.getHTML();
        setValue(html === "<p></p>" ? "" : html);
        if (instance.isFocused) {
          onDirty?.();
        }
      },
      editorProps: {
        attributes: {
          id: editorId,
          class: styles.editorContent,
        },
      },
    },
    [editorId, placeholderText]
  );

  useEffect(() => {
    const nextValue = defaultValue ?? "";
    setValue((prev) => (prev === nextValue ? prev : nextValue));
  }, [defaultValue]);

  useEffect(() => {
    if (!editor) return;
    const nextValue = defaultValue ?? "";
    const currentValue = editor.getHTML();
    const normalizedCurrent =
      currentValue === "<p></p>" || currentValue === "<p></p>\n"
        ? ""
        : currentValue;
    if (nextValue === normalizedCurrent) return;

    if (nextValue) {
      editor.commands.setContent(nextValue, false);
    } else {
      editor.commands.clearContent(true);
    }
  }, [editor, defaultValue]);

  const headingButton = (level: 1 | 2 | 3) => (
    <button
      type="button"
      onClick={() =>
        editor?.chain().focus().toggleHeading({ level }).run()
      }
      className={`${styles.editorButton} ${
        editor?.isActive("heading", { level }) ? styles.editorButtonActive : ""
      }`}
      aria-pressed={editor?.isActive("heading", { level }) ? "true" : "false"}
    >
      H{level}
    </button>
  );

  return (
    <div className={styles.editorWrapper}>
      <label className={styles.editorLabel} htmlFor={editorId}>
        {label}
      </label>
      <div className={styles.editor}>
        {editor ? (
          <>
            <div
              className={styles.editorToolbar}
              role="toolbar"
              aria-label={`Formatting options for ${label}`}
            >
              {headingButton(1)}
              {headingButton(2)}
              {headingButton(3)}
              <div className={styles.editorToolbarDivider} aria-hidden="true" />
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`${styles.editorButton} ${
                  editor.isActive("bold") ? styles.editorButtonActive : ""
                }`}
                aria-label="Bold"
                aria-pressed={editor.isActive("bold") ? "true" : "false"}
              >
                B
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`${styles.editorButton} ${
                  editor.isActive("italic") ? styles.editorButtonActive : ""
                }`}
                aria-label="Italic"
                aria-pressed={editor.isActive("italic") ? "true" : "false"}
              >
                I
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`${styles.editorButton} ${
                  editor.isActive("underline") ? styles.editorButtonActive : ""
                }`}
                aria-label="Underline"
                aria-pressed={editor.isActive("underline") ? "true" : "false"}
              >
                U
              </button>
              <div className={styles.editorToolbarDivider} aria-hidden="true" />
              <button
                type="button"
                onClick={() =>
                  editor.chain().focus().toggleOrderedList().run()
                }
                className={`${styles.editorButton} ${
                  editor.isActive("orderedList") ? styles.editorButtonActive : ""
                }`}
                aria-label="Ordered list"
                aria-pressed={
                  editor.isActive("orderedList") ? "true" : "false"
                }
              >
                1.
              </button>
              <button
                type="button"
                onClick={() =>
                  editor.chain().focus().toggleBulletList().run()
                }
                className={`${styles.editorButton} ${
                  editor.isActive("bulletList") ? styles.editorButtonActive : ""
                }`}
                aria-label="Bullet list"
                aria-pressed={
                  editor.isActive("bulletList") ? "true" : "false"
                }
              >
                •
              </button>
              <div className={styles.editorToolbarDivider} aria-hidden="true" />
              <button
                type="button"
                onClick={() => {
                  const previous = editor.getAttributes("link").href as
                    | string
                    | undefined;
                  const url = window.prompt("Enter URL", previous ?? "");
                  if (url === null) return false;
                  if (url === "") {
                    editor.chain().focus().unsetLink().run();
                    return;
                  }
                  editor
                    .chain()
                    .focus()
                    .extendMarkRange("link")
                    .setLink({ href: url })
                    .run();
                }}
                className={`${styles.editorButton} ${
                  editor.isActive("link") ? styles.editorButtonActive : ""
                }`}
                aria-label="Insert link"
                aria-pressed={editor.isActive("link") ? "true" : "false"}
              >
                Link
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().unsetLink().run()}
                className={styles.editorButton}
                aria-label="Remove link"
              >
                Unlink
              </button>
              <div className={styles.editorToolbarDivider} aria-hidden="true" />
              <button
                type="button"
                onClick={() =>
                  editor.chain().focus().setTextAlign("left").run()
                }
                className={`${styles.editorButton} ${
                  editor.isActive({ textAlign: "left" })
                    ? styles.editorButtonActive
                    : ""
                }`}
                aria-label="Align left"
                aria-pressed={
                  editor.isActive({ textAlign: "left" }) ? "true" : "false"
                }
              >
                ⬅
              </button>
              <button
                type="button"
                onClick={() =>
                  editor.chain().focus().setTextAlign("center").run()
                }
                className={`${styles.editorButton} ${
                  editor.isActive({ textAlign: "center" })
                    ? styles.editorButtonActive
                    : ""
                }`}
                aria-label="Align center"
                aria-pressed={
                  editor.isActive({ textAlign: "center" }) ? "true" : "false"
                }
              >
                ⬌
              </button>
              <button
                type="button"
                onClick={() =>
                  editor.chain().focus().setTextAlign("right").run()
                }
                className={`${styles.editorButton} ${
                  editor.isActive({ textAlign: "right" })
                    ? styles.editorButtonActive
                    : ""
                }`}
                aria-label="Align right"
                aria-pressed={
                  editor.isActive({ textAlign: "right" }) ? "true" : "false"
                }
              >
                ➡
              </button>
              <div className={styles.editorToolbarDivider} aria-hidden="true" />
              <button
                type="button"
                onClick={() =>
                  editor.chain().focus().unsetAllMarks().clearNodes().run()
                }
                className={styles.editorButton}
                aria-label="Clear formatting"
              >
                Clear
              </button>
            </div>
            <EditorContent editor={editor} />
          </>
        ) : (
          <div className={styles.editorLoading}>Loading editor…</div>
        )}
      </div>
      <input type="hidden" name={name} value={value} />
      {helpText ? <p className={styles.editorHelp}>{helpText}</p> : null}
    </div>
  );
}
