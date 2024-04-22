import BraftEditor, { BraftEditorProps } from 'braft-editor';
import { getLocale, request } from '@@/exports';
import React from 'react';

const RichTextEditor: React.FC<BraftEditorProps> = (props) => {
  props.language = getLocale().replace(/-.*$/, '');
  props.media = {
    uploadFn: async (param) => {
      console.log(param);
      const formData = new FormData();
      formData.append('file', param.file);
      const response = await request('/admin/api/storage/upload', {
        method: 'POST',
        data: formData,
      });
      param.success({
        url: response,
        // @ts-ignore
        meta: null,
      });
    },
  };

  return <BraftEditor {...props} />;
};

export default RichTextEditor;
