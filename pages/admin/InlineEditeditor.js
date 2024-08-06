import React, { useState, useEffect } from "react";
import { EditorState, convertFromRaw } from "draft-js";
import dynamic from "next/dynamic";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

export default Editor;

const content = {
  entityMap: {},
  blocks: [
    {
      key: "637gr",
      text: "",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
  ],
};

export class FromInlineEditEditor extends React.Component {
  constructor(props) {
    super(props);
    const contentState = convertFromRaw(content);
    const editorState = EditorState.createWithContent(contentState);
    this.state = {
      contentState,
      editorState,
    };
  }

  onContentStateChange = (contentState) => {
    this.setState({
      contentState,
    });
  };

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  render() {
    const { editorState } = this.state;
    return (
      <Editor
        editorClassName={"report-editor"}
        editorState={editorState}
        onEditorStateChange={(editorState) =>
          this.onEditorStateChange(editorState)
        }
        onContentStateChange={(contentState) =>
          this.onContentStateChange(contentState)
        }
        toolbar={{
          options: [
            "inline",
            "blockType",
            "fontSize",
            "fontFamily",
            "list",
            "textAlign",
            "colorPicker",
            "link",
            "embedded",
            "emoji",
            "image",
            "history",
          ],

          list: {
            inDropdown: false,
            className: undefined,
            component: undefined,
            dropdownClassName: undefined,
            options: ["unordered", "ordered"],
            unordered: { className: undefined },
            ordered: { className: undefined },
          },

          link: {
            inDropdown: false,
            className: undefined,
            component: undefined,
            popupClassName: undefined,
            dropdownClassName: undefined,
            showOpenOptionOnHover: true,
            defaultTargetOption: '_self',
            options: ['link'],
            link: { className: undefined },
            linkCallback: undefined
          },
        }}
      />
    );
  }
}
