/* eslint-disable react/jsx-no-bind */
// @ts-nocheck
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import './style.scss';

interface TextEditorInterface {
  setValue?: any;
  value?: any;
  hideToolbar?: boolean;
  heightEditor?: number;
}

const TextEditor = forwardRef(
  ({
    setValue, value, hideToolbar = false, heightEditor = 500,
  }: TextEditorInterface, ref) => {
    const editorRef = useRef(null);

    const handleEditorChange = (nextValue: any) => {
      setValue(nextValue);
    };

    // TODO: enable this when we have a backend service to upload images
    // const example_image_upload_handler = async (data: any, success: any) => {
    //   const url = API_URI.BASE_URI + API_URI.PRODUCT + API_URI.IMAGE;
    //   const form: any = new FormData();
    //   form.append("file", data.blob());
    //   const response = await Req.POST(url, form);
    //   success(response.data);
    // };

    // TODO: remove this when we have a backend service to upload images
    const handleUploadFile = (cb: any) => {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');

      input.onchange = function () {
        const file = this.files[0];

        const reader = new FileReader();
        reader.onload = function () {
          const id = `blobid${new Date().getTime()}`;
          const blobCache = tinymce.activeEditor?.editorUpload?.blobCache;
          const base64 = reader.result?.toString().split(',')[1] || '';
          if (!blobCache) return;
          const blobInfo = blobCache.create(id, file, base64);
          blobCache?.add(blobInfo);

          /* call the callback and populate the Title field with the file name */
          cb(blobInfo.blobUri(), { title: file.name });
        };
        reader.readAsDataURL(file);
      };

      input.click();
    };

    useImperativeHandle(ref, () => ({
      appendText: (text) => {
        editorRef.current.editor.insertContent(text);
      },
      focus: () => {
        return editorRef.current.editor.focus();
      },
      getCurrentContent: () => {
        return editorRef?.current?.currentContent;
      },
      getRef: () => editorRef.current,
    }));

    return (
      <>
        <div className="App">
          <Editor
            ref={editorRef}
            value={value}
            onEditorChange={handleEditorChange}
            apiKey="g0ekml79y6xdxwm5brordeef8aeycu4fj8gdzufks0ajkjcv"
            init={{
              selector: '#my-editor',
              content_css: '/content.css',
              setup: (editor) => {
                editor.ui.registry.getAll().icons['angle-left'] = '';
              },
              plugins: [
                'fullscreen',
                'advlist',
                'autolink',
                'lists',
                'link',
                'image',
                'charmap',
                'preview',
                'anchor',
                'visualblocks',
                'code',
                'insertdatetime',
                'media',
                'table',
                'help',
                'wordcount',
                'searchreplace',
                'pagebreak',
                'table',
                'link',
                'quickbars',
                'emoticons',
                // 'export',
                // 'mentions',
                'noneditable',
                'anchor',
              ],
              toolbar: hideToolbar
                ? false
                : ` 
                styles bullist numlist outdent indent bold italic underline alignleft aligncenter alignright  fullscreen|
                alignjustify lineheight strikethrough subscript superscript code blockquote link unlink image table charmap emoticons pagebreak hr remove removeformat  undo redo spellcheckdialog searchreplace
            `,
              link_context_toolbar: true,
              line_height_formats: '1 1.1 1.2 1.3 1.4 1.5 1.6 1.8 2',
              imagetools_cors_hosts: ['picsum.photos'],
              menubar: false,
              // file_picker_types: 'file image media',
              allow_html_in_named_anchor: true,
              browser_spellcheck: true,
              statusbar: false,
              table_border_styles: [
                {
                  title: 'Solid',
                  value: 'solid',
                },
                {
                  title: 'Dotted',
                  value: 'dotted',
                },
                {
                  title: 'Dashed',
                  value: 'dashed',
                },
              ],
              table_border_color_map: [
                {
                  title: 'Black',
                  value: '000000',
                },
                {
                  title: 'Red',
                  value: 'FF0000',
                },
                {
                  title: 'White',
                  value: 'FFFFFF',
                },
                {
                  title: 'Yellow',
                  value: 'F1C40F',
                },
              ],
              content_style: `
                 body { 
                  font-family:Helvetica,Arial,sans-serif; font-size:16px 
                 } 
                 table { 
                   border-collapse: collapse; border: 1px solid #333333
                 } 
                 td, th { 
                  border: 1px solid #333333 padding: 6px; 
                 }
                 ul { list-style: disc inside; } 
                 ol { list-style: decimal inside; }
              `,
              autosave_ask_before_unload: true,
              autosave_interval: '30s',
              autosave_prefix: '{path}{query}-{id}-',
              autosave_restore_when_empty: false,
              autosave_retention: '2m',
              image_advtab: true,
              // content_css: [
              //   '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
              //   '//www.tiny.cloud/css/codepen.min.css',
              // ],
              image_class_list: [
                {
                  title: 'None',
                  value: '',
                },
                {
                  title: 'Some class',
                  value: 'class-name',
                },
              ],
              image_title: true,
              file_picker_types: 'image',
              importcss_append: true,
              // TODO: enable when has a server to upload images
              // images_upload_handler: example_image_upload_handler,
              automatic_uploads: true,
              // TODO: disable when has a server to upload images
              file_picker_callback: handleUploadFile,
              templates: [
                {
                  title: 'New Table',
                  description: 'creates a new table',
                  content:
                    '<div class="mceTmpl">' +
                    '<table width="98%%"  border="0" cellspacing="0" cellpadding="0">' +
                    '<tr><th scope="col"> </th>' +
                    '<th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>',
                },
                {
                  title: 'Starting my story',
                  description: 'A cure for writers block',
                  content: 'Once upon a time...',
                },
                {
                  title: 'New list with dates',
                  description: 'New List with dates',
                  content:
                    '<div class="mceTmpl">' +
                    '<span class="cdate">cdate</span>' +
                    '<br /><span class="mdate">mdate</span>' +
                    '<h2>My List</h2><ul><li></li><li></li></ul></div>',
                },
              ],
              template_cdate_format: '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
              template_mdate_format: '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
              image_caption: true,
              quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 lineheight blockquote',
              noneditable_noneditable_class: 'mceNonEditable',
              toolbar_drawer: 'sliding',
              spellchecker_dialog: true,
              spellchecker_whitelist: ['Ephox', 'Moxiecode'],
              // contextmenu: 'link image imagetools table',
              height: heightEditor,
              toolbar_sticky: true,
              menu: {
                tc: {
                  title: 'Comments',
                  items: 'addcomment showcomments deleteallconversations',
                },
              },
            }}
          />
        </div>
      </>
    );
  },
);

export default TextEditor;
