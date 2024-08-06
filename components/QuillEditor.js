import React from 'react';
import dynamic from "next/dynamic";
import 'quill/dist/quill.snow.css';
import "quill-emoji/dist/quill-emoji.css";


const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const QuillEditor = ({ onContentChange, longDiscContent, isSlider }) => {

  console.log("isSlider", isSlider);
  if (typeof window !== 'undefined') {
    import('quill-emoji').then((quillEmoji) => {
    });
  }

  const handleChange = (content) => {
    onContentChange(content);
  };

  let toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
    ['image', 'video'],
    ['link'],
    ['emoji'],
  ];

  if (isSlider) {
    toolbarOptions = [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction
      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['link'],
    ];
  }
  const modules = {
    toolbar: toolbarOptions,
    clipboard: {
      matchVisual: false,
    },
    'emoji-toolbar': true,
    'emoji-shortname': true,
  }



  return (
    <div>
      <ReactQuill
        theme="snow"
        value={longDiscContent}
        onChange={handleChange}
        modules={modules}
      />
    </div>
  );
};

export default QuillEditor;
